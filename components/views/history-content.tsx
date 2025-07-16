"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CultivationCard } from "@/components/cultivation-card"
import { AggregateStats } from "@/components/dashboard/aggregate-stats"
import { CultivationComparison } from "@/components/views/cultivation-comparison"
import { HistoryCharts } from "@/components/charts/history-charts"
import { mockCultivations, CultivationSummary } from "@/lib/mock-data"
import { Search, GitCompare, Plus, BarChart3, TrendingUp, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export function HistoryContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("startDate")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedCultivations, setSelectedCultivations] = useState<string[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [showCharts, setShowCharts] = useState(true)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [filteredCultivations, setFilteredCultivations] = useState<CultivationSummary[]>([])
  const [cultivations, setCultivations] = useState<CultivationSummary[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cultivations")
      if (saved) return JSON.parse(saved)
    }
    return mockCultivations
  })

  // Form state for new cultivation
  const [newCultivation, setNewCultivation] = useState({
    name: "",
    seedStrain: "",
    startDate: "",
    status: "active" as "active" | "completed" | "archived",
    yield_g: "",
  })

  const handleNewChange = (field: string, value: string) => {
    setNewCultivation((prev) => ({ ...prev, [field]: value }))
  }

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCultivation.name || !newCultivation.seedStrain || !newCultivation.startDate) return
    const newItem: CultivationSummary = {
      id: uuidv4(),
      name: newCultivation.name,
      seedStrain: newCultivation.seedStrain,
      startDate: newCultivation.startDate,
      endDate: newCultivation.status === "completed" ? new Date().toISOString().slice(0, 10) : null,
      yield_g: Number(newCultivation.yield_g) || 0,
      profit_brl: 0,
      status: newCultivation.status,
      durationDays: 0,
      hasSevereProblems: false,
    }
    const updated = [newItem, ...cultivations]
    setCultivations(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("cultivations", JSON.stringify(updated))
    }
    setIsNewModalOpen(false)
    setNewCultivation({ name: "", seedStrain: "", startDate: "", status: "active", yield_g: "" })
  }

  // Usar filtros avançados se disponíveis, senão usar filtros básicos
  const baseFilteredCultivations = filteredCultivations.length > 0 ? filteredCultivations : cultivations

  const [advancedFilters, setAdvancedFilters] = useState({
    status: "all",
    startDateFrom: "",
    startDateTo: "",
    strain: "",
    minYield: "",
    maxYield: ""
  })
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const uniqueStrains = Array.from(new Set(cultivations.map(c => c.seedStrain))).filter(Boolean)

  const handleAdvancedFilterChange = (field: string, value: string) => {
    setAdvancedFilters(prev => ({ ...prev, [field]: value }))
  }
  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({ status: "all", startDateFrom: "", startDateTo: "", strain: "", minYield: "", maxYield: "" })
  }

  const filteredAndSortedCultivations = cultivations
    .filter((cultivation: CultivationSummary) => {
      const matchesSearch =
        cultivation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cultivation.seedStrain.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = advancedFilters.status === "all" || cultivation.status === advancedFilters.status
      const matchesStrain = !advancedFilters.strain || cultivation.seedStrain === advancedFilters.strain
      const matchesYield = (!advancedFilters.minYield || cultivation.yield_g >= Number(advancedFilters.minYield)) &&
        (!advancedFilters.maxYield || cultivation.yield_g <= Number(advancedFilters.maxYield))
      const matchesStartDateFrom = !advancedFilters.startDateFrom || new Date(cultivation.startDate) >= new Date(advancedFilters.startDateFrom)
      const matchesStartDateTo = !advancedFilters.startDateTo || new Date(cultivation.startDate) <= new Date(advancedFilters.startDateTo)
      return matchesSearch && matchesStatus && matchesStrain && matchesYield && matchesStartDateFrom && matchesStartDateTo
    })
    .sort((a: CultivationSummary, b: CultivationSummary) => {
      if (sortBy === "startDate") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
      if (sortBy === "profit_brl") {
        return b.profit_brl - a.profit_brl
      }
      if (sortBy === "yield_g") {
        return b.yield_g - a.yield_g
      }
      return 0
    })

  const handleSelectCultivation = (id: string, selected: boolean) => {
    console.log('Selecionando cultivo:', id, selected)
    setSelectedCultivations((prev) => {
      if (selected) {
        return [...prev, id]
      } else {
        return prev.filter((cultId) => cultId !== id)
      }
    })
  }

  // Calcular estatísticas para os cards
  const maxProfit = Math.max(...cultivations.map(c => c.profit_brl))
  const avgProfit = cultivations.reduce((sum, c) => sum + c.profit_brl, 0) / cultivations.length

  // Modal atualizado para usar o estado e submit
  const NewCultivationModal = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${isNewModalOpen ? "" : "hidden"}`}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Novo Cultivo</h2>
        <form className="space-y-4" onSubmit={handleNewSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Cultivo</label>
            <Input placeholder="Ex: Cultivo Primavera 2024" value={newCultivation.name} onChange={e => handleNewChange("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Variedade/Strain</label>
            <Input placeholder="Ex: OG Kush" value={newCultivation.seedStrain} onChange={e => handleNewChange("seedStrain", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data de Início</label>
            <Input type="date" value={newCultivation.startDate} onChange={e => handleNewChange("startDate", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={newCultivation.status} onValueChange={v => handleNewChange("status", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!newCultivation.name || !newCultivation.seedStrain || !newCultivation.startDate}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  // Estado e lógica para edição de cultivo existente
  const [editCultivationId, setEditCultivationId] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    name: "",
    seedStrain: "",
    startDate: "",
    status: "active" as "active" | "completed" | "archived",
    yield_g: "",
  })

  const openEditModal = (cultivation: CultivationSummary) => {
    setEditCultivationId(cultivation.id)
    setEditData({
      name: cultivation.name,
      seedStrain: cultivation.seedStrain,
      startDate: cultivation.startDate,
      status: cultivation.status,
      yield_g: cultivation.yield_g?.toString() || "",
    })
  }

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCultivationId) return
    const updated = cultivations.map((c) =>
      c.id === editCultivationId
        ? {
            ...c,
            name: editData.name,
            seedStrain: editData.seedStrain,
            startDate: editData.startDate,
            status: editData.status,
            yield_g: Number(editData.yield_g) || 0,
          }
        : c
    )
    setCultivations(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("cultivations", JSON.stringify(updated))
    }
    setEditCultivationId(null)
  }

  const EditCultivationModal = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${editCultivationId ? "" : "hidden"}`}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Cultivo</h2>
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Cultivo</label>
            <Input value={editData.name} onChange={e => handleEditChange("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Variedade/Strain</label>
            <Input value={editData.seedStrain} onChange={e => handleEditChange("seedStrain", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data de Início</label>
            <Input type="date" value={editData.startDate} onChange={e => handleEditChange("startDate", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={editData.status} onValueChange={v => handleEditChange("status", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rendimento (g)</label>
            <Input type="number" min={0} value={editData.yield_g} onChange={e => handleEditChange("yield_g", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setEditCultivationId(null)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!editData.name || !editData.seedStrain || !editData.startDate}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <NewCultivationModal />
      <EditCultivationModal />
      {isComparisonOpen && (
        <CultivationComparison
          cultivations={cultivations}
          selectedIds={selectedCultivations}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Cultivos</h1>
          <p className="text-gray-600 mt-2">Explore seus ciclos de cultivo passados e ativos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={showCharts ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => setShowCharts(!showCharts)}
          >
            <BarChart3 className="h-4 w-4" />
            {showCharts ? "Ocultar" : "Mostrar"} Gráficos
          </Button>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select className="w-full border rounded p-2" value={advancedFilters.status} onChange={e => handleAdvancedFilterChange("status", e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="completed">Concluídos</option>
                    <option value="archived">Arquivados</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Início de (data)</label>
                    <input type="date" className="w-full border rounded p-2" value={advancedFilters.startDateFrom} onChange={e => handleAdvancedFilterChange("startDateFrom", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">até</label>
                    <input type="date" className="w-full border rounded p-2" value={advancedFilters.startDateTo} onChange={e => handleAdvancedFilterChange("startDateTo", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Variedade/Strain</label>
                  <select className="w-full border rounded p-2" value={advancedFilters.strain} onChange={e => handleAdvancedFilterChange("strain", e.target.value)}>
                    <option value="">Todas</option>
                    {uniqueStrains.map(strain => (
                      <option key={strain} value={strain}>{strain}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Rendimento mín. (g)</label>
                    <input type="number" className="w-full border rounded p-2" value={advancedFilters.minYield} onChange={e => handleAdvancedFilterChange("minYield", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">máx. (g)</label>
                    <input type="number" className="w-full border rounded p-2" value={advancedFilters.maxYield} onChange={e => handleAdvancedFilterChange("maxYield", e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-between gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleClearAdvancedFilters}>Limpar</Button>
                  <Button variant="default" size="sm" onClick={() => setIsPopoverOpen(false)}>Aplicar</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={() => setIsNewModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cultivo
          </Button>
        </div>
      </div>

      {/* Indicador de Modo de Seleção */}
      {isSelectionMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-800">
                Modo de Seleção Ativo
                {selectedCultivations.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    • {selectedCultivations.length} cultivo{selectedCultivations.length > 1 ? 's' : ''} selecionado{selectedCultivations.length > 1 ? 's' : ''}
                  </span>
                )}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSelectionMode(false)
                setSelectedCultivations([])
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Sair do Modo
            </Button>
          </div>
        </div>
      )}

      {/* Estatísticas Agregadas */}
      <AggregateStats cultivations={cultivations} />
      
      {/* Gráficos de Tendência */}
      {showCharts && <HistoryCharts cultivations={cultivations} />}
      
      {/* Filtros Avançados */}
      <div className="mb-6">
        {/* Remover JSX do filtro antigo */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou semente..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startDate">Data (Mais Recente)</SelectItem>
            <SelectItem value="profit_brl">Lucro (Maior)</SelectItem>
            <SelectItem value="yield_g">Rendimento (Maior)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-1">
          {!isSelectionMode ? (
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setIsSelectionMode(true)}
            >
              <GitCompare className="h-4 w-4" />
              Ativar Comparação
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex items-center gap-2"
                disabled={selectedCultivations.length < 2}
                onClick={() => setIsComparisonOpen(true)}
              >
                <GitCompare className="h-4 w-4" />
                Comparar ({selectedCultivations.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedCultivations([])
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
          {isSelectionMode && selectedCultivations.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Clique nos cards para selecionar cultivos
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedCultivations.map((cultivation: CultivationSummary) => (
          <div key={cultivation.id} className="relative group">
            <CultivationCard
              cultivation={cultivation}
              onSelect={isSelectionMode ? handleSelectCultivation : undefined}
              isSelected={selectedCultivations.includes(cultivation.id)}
              maxProfit={maxProfit}
              avgProfit={avgProfit}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={e => {
                e.preventDefault(); e.stopPropagation(); openEditModal(cultivation)
              }}
              title="Editar Cultivo"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6v-3.586a1 1 0 01.293-.707l9-9a1 1 0 011.414 0l3.586 3.586a1 1 0 010 1.414l-9 9a1 1 0 01-.707.293H3z"></path></svg>
            </Button>
          </div>
        ))}
      </div>

      {filteredAndSortedCultivations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum cultivo encontrado com os critérios de busca.</p>
        </div>
      )}
    </div>
  )
}
