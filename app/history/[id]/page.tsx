"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CultivationTimeline } from "@/components/cultivation-timeline"
import { mockCultivations, mockDetailedReport, type CultivationSummary, type CultivationEvent } from "@/lib/mock-data"
import { 
  ArrowLeft, 
  Calendar, 
  Leaf, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Download,
  Share2,
  Settings,
  Bell,
  BarChart3,
  Brain,
  FileText
} from "lucide-react"
import { PerformanceDashboard } from "@/components/cultivation/performance-dashboard"
import { SmartInsights } from "@/components/cultivation/smart-insights"

export default function CultivationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cultivationId = params.id as string

  const [cultivation, setCultivation] = useState<CultivationSummary | null>(null)
  const [allCultivations, setAllCultivations] = useState<CultivationSummary[]>([])
  const [events, setEvents] = useState<CultivationEvent[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [showSharing, setShowSharing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Carregar dados do localStorage ou usar mock data
    const loadData = () => {
      let cultivations = mockCultivations
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cultivations")
        if (saved) {
          cultivations = JSON.parse(saved)
        }
      }
      
      setAllCultivations(cultivations)
      const found = cultivations.find(c => c.id === cultivationId)
      setCultivation(found || null)

      // Carregar eventos específicos do cultivo
      const savedEvents = localStorage.getItem(`cultivation_events_${cultivationId}`)
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents))
      } else {
        // Usar eventos mock se não houver dados salvos
        setEvents(mockDetailedReport.events || [])
      }
    }

    loadData()
  }, [cultivationId])

  const handleEventsChange = (newEvents: CultivationEvent[]) => {
    setEvents(newEvents)
    localStorage.setItem(`cultivation_events_${cultivationId}`, JSON.stringify(newEvents))
  }

  const handleExportPDF = () => {
    if (cultivation) {
      // exportCultivationReport(cultivation, events, {
      //   includeTimeline: true,
      //   includeFinancials: true,
      //   includeAnalytics: true
      // })
    }
  }

  const handleShare = () => {
    setShowSharing(true)
  }

  const handleNotifications = () => {
    setShowNotifications(true)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo"
      case "completed": return "Concluído"
      case "archived": return "Arquivado"
      default: return status
    }
  }

  if (!cultivation) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cultivo não encontrado</h1>
          <Button onClick={() => router.push("/history")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/history")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{cultivation.name}</h1>
            <p className="text-gray-600 mt-1">
              {cultivation.seedStrain} • Iniciado em {new Date(cultivation.startDate).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(cultivation.status)}>
              {getStatusLabel(cultivation.status)}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleNotifications}>
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* KPIs Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lucro Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(cultivation.profit_brl)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rendimento</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {cultivation.yield_g}g
                  </p>
                </div>
                <Leaf className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duração</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {cultivation.durationDays} dias
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eficiência</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {cultivation.durationDays > 0 
                      ? (cultivation.yield_g / cultivation.durationDays).toFixed(2)
                      : "0"
                    } g/dia
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações do Cultivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="font-medium">{cultivation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Variedade</p>
                    <p className="font-medium">{cultivation.seedStrain}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Início</p>
                    <p className="font-medium">
                      {new Date(cultivation.startDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Fim</p>
                    <p className="font-medium">
                      {cultivation.endDate 
                        ? new Date(cultivation.endDate).toLocaleDateString("pt-BR")
                        : "Em andamento"
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(cultivation.status)}>
                      {getStatusLabel(cultivation.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Problemas Graves</p>
                    <Badge variant={cultivation.hasSevereProblems ? "destructive" : "secondary"}>
                      {cultivation.hasSevereProblems ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </div>

                {/* Progresso do Ciclo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Progresso do Ciclo</p>
                    <Badge variant="outline" className="text-xs">
                      {(() => {
                        const startDate = new Date(cultivation.startDate)
                        const endDate = cultivation.endDate ? new Date(cultivation.endDate) : new Date()
                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        const elapsedDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)
                        return `${Math.round(progress)}%`
                      })()}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${(() => {
                          const startDate = new Date(cultivation.startDate)
                          const endDate = cultivation.endDate ? new Date(cultivation.endDate) : new Date()
                          const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                          const elapsedDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                          const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)
                          return progress
                        })()}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Fase Atual e Dias Restantes */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fase Atual</p>
                    <Badge variant="secondary" className="mt-1">
                      {(() => {
                        const startDate = new Date(cultivation.startDate)
                        const elapsedDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        
                        if (elapsedDays <= 60) return "Vegetativo"
                        if (elapsedDays <= 130) return "Floração"
                        if (elapsedDays <= 150) return "Cura"
                        return "Finalizado"
                      })()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dias Restantes</p>
                    <p className="font-medium text-lg">
                      {(() => {
                        const startDate = new Date(cultivation.startDate)
                        const totalDays = 150 // Ciclo completo estimado
                        const elapsedDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        const remaining = Math.max(totalDays - elapsedDays, 0)
                        return remaining > 0 ? `${remaining} dias` : "Finalizado"
                      })()}
                    </p>
                  </div>
                </div>

                {/* Próximas Ações */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Próximas Ações</p>
                  <div className="space-y-2">
                    {(() => {
                      const startDate = new Date(cultivation.startDate)
                      const elapsedDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      const actions = []
                      
                      if (elapsedDays <= 60) {
                        actions.push("Fertilização semanal", "Controle de pH", "Ajuste de umidade")
                      } else if (elapsedDays <= 130) {
                        actions.push("Fertilização floração", "Controle de pragas", "Ajuste de temperatura")
                      } else if (elapsedDays <= 150) {
                        actions.push("Reduzir umidade", "Preparar secagem", "Colheita em breve")
                      }
                      
                      return actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>{action}</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Resumida */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Eventos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum evento registrado ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative overflow-y-auto max-h-[500px]">
                <CultivationTimeline
                  events={events}
                  incidents={[]}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Performance - KPIs e gráfico */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard
            cultivation={cultivation}
            allCultivations={allCultivations}
            events={events}
          />
        </TabsContent>

        {/* Insights Inteligentes */}
        <TabsContent value="insights" className="space-y-6">
          <SmartInsights
            cultivation={cultivation}
            events={events}
            allCultivations={allCultivations}
          />
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Relatório Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Receita Bruta:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(cultivation.profit_brl + 1000)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custos Operacionais:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(1000)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Lucro Líquido:</span>
                    <span className={cultivation.profit_brl > 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(cultivation.profit_brl)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Relatório de Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Rendimento Total:</span>
                    <span className="font-medium">{cultivation.yield_g}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eficiência:</span>
                    <span className="font-medium">
                      {cultivation.durationDays > 0 
                        ? (cultivation.yield_g / cultivation.durationDays).toFixed(2)
                        : "0"
                      } g/dia
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração do Ciclo:</span>
                    <span className="font-medium">{cultivation.durationDays} dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Ações de Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar PDF Completo
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar Relatório
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Configurar Alertas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      {/**
      {showSharing && cultivation && (
        <CultivationSharing
          cultivation={cultivation}
          events={events}
          onClose={() => setShowSharing(false)}
        />
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Notificações Inteligentes</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <SmartNotifications
              cultivations={allCultivations}
              events={events}
            />
          </div>
        </div>
      )}
      **/}
    </div>
  )
}