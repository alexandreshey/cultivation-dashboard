"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Filter, 
  X, 
  Save, 
  Star, 
  Calendar,
  DollarSign,
  Leaf,
  Clock,
  Tag,
  Search
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { CultivationSummary } from "@/lib/mock-data"

interface FilterCriteria {
  dateRange: {
    start: string
    end: string
  }
  profitRange: {
    min: number
    max: number
  }
  yieldRange: {
    min: number
    max: number
  }
  durationRange: {
    min: number
    max: number
  }
  status: string[]
  strains: string[]
  tags: string[]
  searchTerm: string
  hasSevereProblems: boolean | null
}

interface SavedFilter {
  id: string
  name: string
  criteria: FilterCriteria
  isFavorite: boolean
}

interface AdvancedFiltersProps {
  cultivations: CultivationSummary[]
  onFilterChange: (filtered: CultivationSummary[]) => void
  isOpen: boolean
  onToggle: () => void
}

export function AdvancedFilters({ cultivations, onFilterChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterCriteria>({
    dateRange: { start: "", end: "" },
    profitRange: { min: 0, max: 10000 },
    yieldRange: { min: 0, max: 500 },
    durationRange: { min: 0, max: 200 },
    status: [],
    strains: [],
    tags: [],
    searchTerm: "",
    hasSevereProblems: null
  })

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "profitable",
      name: "Apenas Lucrativos",
      criteria: {
        ...filters,
        profitRange: { min: 1, max: 10000 }
      },
      isFavorite: true
    },
    {
      id: "recent",
      name: "Últimos 3 Meses",
      criteria: {
        ...filters,
        dateRange: {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      },
      isFavorite: false
    }
  ])

  const [isCreatingFilter, setIsCreatingFilter] = useState(false)
  const [newFilterName, setNewFilterName] = useState("")

  // Calcular ranges baseados nos dados
  const ranges = {
    profit: {
      min: Math.min(...cultivations.map(c => c.profit_brl)),
      max: Math.max(...cultivations.map(c => c.profit_brl))
    },
    yield: {
      min: Math.min(...cultivations.map(c => c.yield_g)),
      max: Math.max(...cultivations.map(c => c.yield_g))
    },
    duration: {
      min: Math.min(...cultivations.map(c => c.durationDays)),
      max: Math.max(...cultivations.map(c => c.durationDays))
    }
  }

  // Extrair strains únicos
  const uniqueStrains = [...new Set(cultivations.map(c => c.seedStrain))].sort()

  // Aplicar filtros
  const applyFilters = useCallback((criteria: FilterCriteria) => {
    let filtered = [...cultivations]

    // Filtro de data
    if (criteria.dateRange.start) {
      filtered = filtered.filter(c => new Date(c.startDate) >= new Date(criteria.dateRange.start))
    }
    if (criteria.dateRange.end) {
      filtered = filtered.filter(c => new Date(c.startDate) <= new Date(criteria.dateRange.end))
    }

    // Filtro de lucro
    filtered = filtered.filter(c => 
      c.profit_brl >= criteria.profitRange.min && 
      c.profit_brl <= criteria.profitRange.max
    )

    // Filtro de rendimento
    filtered = filtered.filter(c => 
      c.yield_g >= criteria.yieldRange.min && 
      c.yield_g <= criteria.yieldRange.max
    )

    // Filtro de duração
    filtered = filtered.filter(c => 
      c.durationDays >= criteria.durationRange.min && 
      c.durationDays <= criteria.durationRange.max
    )

    // Filtro de status
    if (criteria.status.length > 0) {
      filtered = filtered.filter(c => criteria.status.includes(c.status))
    }

    // Filtro de strains
    if (criteria.strains.length > 0) {
      filtered = filtered.filter(c => criteria.strains.includes(c.seedStrain))
    }

    // Filtro de busca
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase()
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.seedStrain.toLowerCase().includes(term)
      )
    }

    // Filtro de problemas
    if (criteria.hasSevereProblems !== null) {
      filtered = filtered.filter(c => c.hasSevereProblems === criteria.hasSevereProblems)
    }

    onFilterChange(filtered)
  }, [cultivations, onFilterChange])

  const handleFilterChange = useCallback((newFilters: Partial<FilterCriteria>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    applyFilters(updated)
  }, [filters, applyFilters])

  const clearFilters = useCallback(() => {
    const cleared: FilterCriteria = {
      dateRange: { start: "", end: "" },
      profitRange: { min: ranges.profit.min, max: ranges.profit.max },
      yieldRange: { min: ranges.yield.min, max: ranges.yield.max },
      durationRange: { min: ranges.duration.min, max: ranges.duration.max },
      status: [],
      strains: [],
      tags: [],
      searchTerm: "",
      hasSevereProblems: null
    }
    setFilters(cleared)
    onFilterChange(cultivations)
  }, [ranges, cultivations, onFilterChange])

  const saveCurrentFilter = useCallback(() => {
    if (!newFilterName.trim()) return

    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name: newFilterName,
      criteria: { ...filters },
      isFavorite: false
    }

    setSavedFilters(prev => [...prev, newFilter])
    setNewFilterName("")
    setIsCreatingFilter(false)
  }, [newFilterName, filters])

  const loadSavedFilter = useCallback((savedFilter: SavedFilter) => {
    setFilters(savedFilter.criteria)
    applyFilters(savedFilter.criteria)
  }, [applyFilters])

  const toggleFavorite = useCallback((filterId: string) => {
    setSavedFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, isFavorite: !f.isFavorite } : f
    ))
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filtros Avançados
      </Button>
    )
  }

  return (
    <Card className="shadow-lg border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros Salvos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Filtros Salvos</Label>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreatingFilter(true)}
            >
              <Save className="h-3 w-3 mr-1" />
              Salvar Atual
            </Button>
          </div>
          
          {isCreatingFilter && (
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Nome do filtro..."
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={saveCurrentFilter}>
                Salvar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCreatingFilter(false)}
              >
                Cancelar
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {savedFilters.map(filter => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
                onClick={() => loadSavedFilter(filter)}
              >
                {filter.isFavorite && <Star className="h-3 w-3 fill-current" />}
                {filter.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(filter.id)
                  }}
                >
                  <Star className={`h-3 w-3 ${filter.isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Busca */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Busca</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou strain..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Período */}
        <div>
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Período
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">De</Label>
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange({ 
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Até</Label>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange({ 
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        {/* Faixa de Lucro */}
        <div>
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Faixa de Lucro
          </Label>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(filters.profitRange.min)}</span>
              <span>{formatCurrency(filters.profitRange.max)}</span>
            </div>
            <Slider
              value={[filters.profitRange.min, filters.profitRange.max]}
              onValueChange={([min, max]) => handleFilterChange({ 
                profitRange: { min, max }
              })}
              min={ranges.profit.min}
              max={ranges.profit.max}
              step={100}
              className="w-full"
            />
          </div>
        </div>

        {/* Faixa de Rendimento */}
        <div>
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Faixa de Rendimento (g)
          </Label>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{filters.yieldRange.min}g</span>
              <span>{filters.yieldRange.max}g</span>
            </div>
            <Slider
              value={[filters.yieldRange.min, filters.yieldRange.max]}
              onValueChange={([min, max]) => handleFilterChange({ 
                yieldRange: { min, max }
              })}
              min={ranges.yield.min}
              max={ranges.yield.max}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Status</Label>
          <div className="space-y-2">
            {[
              { value: "active", label: "Ativo" },
              { value: "completed", label: "Concluído" },
              { value: "archived", label: "Arquivado" }
            ].map(status => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={status.value}
                  checked={filters.status.includes(status.value)}
                  onCheckedChange={(checked) => {
                    const newStatus = checked
                      ? [...filters.status, status.value]
                      : filters.status.filter(s => s !== status.value)
                    handleFilterChange({ status: newStatus })
                  }}
                />
                <Label htmlFor={status.value} className="text-sm">
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Strains */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Variedades</Label>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {uniqueStrains.map(strain => (
              <div key={strain} className="flex items-center space-x-2">
                <Checkbox
                  id={strain}
                  checked={filters.strains.includes(strain)}
                  onCheckedChange={(checked) => {
                    const newStrains = checked
                      ? [...filters.strains, strain]
                      : filters.strains.filter(s => s !== strain)
                    handleFilterChange({ strains: newStrains })
                  }}
                />
                <Label htmlFor={strain} className="text-sm">
                  {strain}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Problemas */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Problemas Graves</Label>
          <Select 
            value={filters.hasSevereProblems === null ? "all" : filters.hasSevereProblems.toString()}
            onValueChange={(value) => {
              const hasSevereProblems = value === "all" ? null : value === "true"
              handleFilterChange({ hasSevereProblems })
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Apenas com problemas</SelectItem>
              <SelectItem value="false">Sem problemas graves</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={clearFilters} variant="outline" className="flex-1">
            Limpar Filtros
          </Button>
          <Button onClick={onToggle} className="flex-1">
            Aplicar e Fechar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}