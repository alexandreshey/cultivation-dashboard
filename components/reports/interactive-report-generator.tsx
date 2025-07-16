"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Download, 
  FileText, 
  Eye, 
  Share2, 
  BarChart3,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Leaf,
  Zap,
  Settings,
  Calculator,
  ChartBar,
  Calendar,
  Thermometer,
  Lightbulb,
  Shield,
  Activity
} from "lucide-react"
import { InteractiveReportCharts } from "@/components/charts/interactive-report-charts"

interface InteractiveReportGeneratorProps {
  results: any
  setupParams: any
  cycleParams: any
  marketParams: any
}

export function InteractiveReportGenerator({ results, setupParams, cycleParams, marketParams }: InteractiveReportGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("executive")
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const getReportStatus = () => {
    if (results.lucro_liquido_ciclo > 0) {
      return {
        status: "Viável",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: "✅",
      }
    } else {
      return {
        status: "Inviável",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: "❌",
      }
    }
  }

  const reportStatus = getReportStatus()

  const templates = [
    {
      id: "executive",
      name: "Resumo Executivo",
      description: "Para decisores e investidores",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "border-l-green-500",
      sections: ["overview", "financial", "recommendations"],
      content: {
        overview: {
          title: "Visão Geral do Projeto",
          icon: <Target className="h-5 w-5" />,
          content: "Análise de viabilidade para cultivo indoor com foco em retorno financeiro e eficiência operacional."
        },
        financial: {
          title: "Métricas Financeiras",
          icon: <DollarSign className="h-5 w-5" />,
          content: "Análise detalhada de custos, receitas e indicadores de rentabilidade."
        },
        recommendations: {
          title: "Recomendações Estratégicas",
          icon: <CheckCircle className="h-5 w-5" />,
          content: "Diretrizes para implementação e otimização do projeto."
        }
      }
    },
    {
      id: "technical",
      name: "Relatório Técnico",
      description: "Detalhes operacionais e técnicos",
      icon: <Zap className="h-5 w-5" />,
      color: "border-l-blue-500",
      sections: ["technical", "efficiency", "timeline"],
      content: {
        technical: {
          title: "Especificações Técnicas",
          icon: <Settings className="h-5 w-5" />,
          content: "Detalhamento de equipamentos, configurações e parâmetros operacionais."
        },
        efficiency: {
          title: "Análise de Eficiência",
          icon: <Activity className="h-5 w-5" />,
          content: "Métricas de performance energética e produtividade do sistema."
        },
        timeline: {
          title: "Cronograma Operacional",
          icon: <Calendar className="h-5 w-5" />,
          content: "Planejamento detalhado de fases e marcos do projeto."
        }
      }
    },
    {
      id: "financial",
      name: "Análise Financeira",
      description: "Foco em métricas financeiras",
      icon: <DollarSign className="h-5 w-5" />,
      color: "border-l-purple-500",
      sections: ["financial", "costs", "projections"],
      content: {
        financial: {
          title: "Indicadores Financeiros",
          icon: <ChartBar className="h-5 w-5" />,
          content: "ROI, payback, fluxo de caixa e análise de rentabilidade."
        },
        costs: {
          title: "Estrutura de Custos",
          icon: <Calculator className="h-5 w-5" />,
          content: "Breakdown detalhado de investimentos, custos operacionais e variáveis."
        },
        projections: {
          title: "Projeções Financeiras",
          icon: <TrendingUp className="h-5 w-5" />,
          content: "Cenários de retorno e análise de sensibilidade."
        }
      }
    },
    {
      id: "comprehensive",
      name: "Relatório Completo",
      description: "Análise abrangente do projeto",
      icon: <FileText className="h-5 w-5" />,
      color: "border-l-orange-500",
      sections: ["overview", "financial", "technical", "efficiency", "timeline", "recommendations"],
      content: {
        overview: {
          title: "Visão Geral do Projeto",
          icon: <Target className="h-5 w-5" />,
          content: "Análise completa de viabilidade e contexto do projeto."
        },
        financial: {
          title: "Análise Financeira Completa",
          icon: <DollarSign className="h-5 w-5" />,
          content: "Todas as métricas financeiras e projeções detalhadas."
        },
        technical: {
          title: "Especificações Técnicas",
          icon: <Settings className="h-5 w-5" />,
          content: "Configurações técnicas e parâmetros operacionais."
        },
        efficiency: {
          title: "Análise de Eficiência",
          icon: <Activity className="h-5 w-5" />,
          content: "Métricas de performance e otimização."
        },
        timeline: {
          title: "Cronograma Detalhado",
          icon: <Calendar className="h-5 w-5" />,
          content: "Planejamento completo de implementação."
        },
        recommendations: {
          title: "Recomendações Estratégicas",
          icon: <CheckCircle className="h-5 w-5" />,
          content: "Diretrizes para sucesso do projeto."
        }
      }
    }
  ]

  const getSelectedTemplate = () => templates.find(t => t.id === selectedTemplate)!

  const renderSectionContent = (sectionId: string) => {
    const template = getSelectedTemplate()
    const section = template.content[sectionId as keyof typeof template.content]
    
    if (!section) return null

    return (
      <Card key={sectionId} className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {section.icon}
            {section.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{section.content}</p>
            
            {/* Conteúdo específico para cada seção */}
            {sectionId === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.lucro_liquido_ciclo)}
                    </div>
                    <div className="text-sm text-muted-foreground">Lucro por Ciclo</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.roi_investimento_1_ano.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">ROI Anual</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {results.periodo_payback_ciclos.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Payback (ciclos)</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {sectionId === "financial" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Investimento Inicial</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.investimento_inicial)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Receita por Ciclo</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.receita_ciclo)}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Análise de Viabilidade</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.roi_investimento_1_ano > 20
                      ? "Projeto altamente viável com excelente retorno sobre investimento."
                      : results.roi_investimento_1_ano > 10
                        ? "Projeto viável com bom potencial de retorno."
                        : "Projeto requer ajustes para melhorar viabilidade financeira."}
                  </p>
                </div>
              </div>
            )}

            {sectionId === "technical" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Configurações do Sistema</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Potência: {setupParams.potencia_sistema}W</li>
                      <li>• Área: {setupParams.area_cultivo}m²</li>
                      <li>• Temperatura: {setupParams.temperatura}°C</li>
                      <li>• Umidade: {setupParams.umidade}%</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Parâmetros de Ciclo</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Duração: {cycleParams.duracao_ciclo} dias</li>
                      <li>• Produção: {cycleParams.producao_esperada}g</li>
                      <li>• Eficiência: {results.gramas_por_watt.toFixed(2)} g/W</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {sectionId === "efficiency" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.gramas_por_watt.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">g/W Eficiência</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((results.receita_ciclo / results.investimento_inicial) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Retorno por Ciclo</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.periodo_payback_ciclos.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Ciclos para Payback</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {sectionId === "timeline" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <div className="font-medium">Fase de Setup</div>
                      <div className="text-sm text-muted-foreground">Instalação e configuração inicial</div>
                    </div>
                    <Badge variant="outline">Semana 1-2</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <div className="font-medium">Primeiro Ciclo</div>
                      <div className="text-sm text-muted-foreground">Cultivo inicial e validação</div>
                    </div>
                    <Badge variant="outline">Semana 3-{3 + cycleParams.duracao_ciclo}</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <div className="font-medium">Otimização</div>
                      <div className="text-sm text-muted-foreground">Ajustes baseados nos resultados</div>
                    </div>
                    <Badge variant="outline">Contínuo</Badge>
                  </div>
                </div>
              </div>
            )}

            {sectionId === "costs" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Custos Fixos</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Equipamentos:</span>
                        <span className="font-medium">{formatCurrency(results.investimento_inicial * 0.7)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Instalação:</span>
                        <span className="font-medium">{formatCurrency(results.investimento_inicial * 0.2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Licenças:</span>
                        <span className="font-medium">{formatCurrency(results.investimento_inicial * 0.1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Custos Variáveis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Energia:</span>
                        <span className="font-medium">{formatCurrency(results.custo_energia_ciclo)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nutrientes:</span>
                        <span className="font-medium">{formatCurrency(results.custo_nutrientes_ciclo)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manutenção:</span>
                        <span className="font-medium">{formatCurrency(results.custo_manutencao_ciclo)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sectionId === "projections" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.lucro_liquido_ciclo * 12)}
                      </div>
                      <div className="text-sm text-muted-foreground">Lucro Anual Projetado</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.roi_investimento_1_ano.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">ROI Anual</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.periodo_payback_ciclos.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Meses para Payback</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {sectionId === "recommendations" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Pontos Fortes</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        ROI superior a 20% ao ano
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Eficiência energética otimizada
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Payback em menos de 6 ciclos
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Oportunidades</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Considerar automação para reduzir custos
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Avaliar expansão para maior escala
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Implementar monitoramento avançado
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Recomendação Final</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.roi_investimento_1_ano > 20
                      ? "INVESTIR - Excelente oportunidade com alto retorno e baixo risco. Recomenda-se implementação imediata com monitoramento contínuo."
                      : results.roi_investimento_1_ano > 10
                        ? "CONSIDERAR - Boa oportunidade, avaliar otimizações para maximizar retorno antes da implementação."
                        : "REVISAR - Ajustar parâmetros para melhorar viabilidade antes do investimento."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true)
    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui seria a lógica real de geração do relatório
      console.log(`Gerando relatório: ${templateId}`)
      
      // Mock de sucesso
      alert(`Relatório ${templateId} gerado com sucesso!`)
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      alert("Erro ao gerar relatório")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Seleção de Template */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Gerador de Relatórios Interativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                } ${template.color}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-blue-600">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Seções incluídas:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.map((section) => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controles de Ação */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Ações do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Ocultar" : "Mostrar"} Prévia
            </Button>
            <Button
              onClick={() => handleGenerateReport(selectedTemplate)}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Gerando..." : "Gerar Relatório"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prévia do Relatório */}
      {previewMode && (
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Prévia do Relatório - {getSelectedTemplate().name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Cabeçalho do Relatório */}
                <div className="text-center border-b pb-6">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    🌱 CULTIVO INDOOR ANALYTICS
                  </h1>
                  <h2 className="text-xl font-semibold text-muted-foreground mb-4">
                    {getSelectedTemplate().name}
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <Badge className={reportStatus.color}>
                      {reportStatus.icon} Projeto {reportStatus.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Gerado em {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Gráficos Interativos */}
                <InteractiveReportCharts 
                  results={results}
                  setupParams={setupParams}
                  cycleParams={cycleParams}
                  marketParams={marketParams}
                />

                {/* Seções Específicas do Template */}
                <div className="space-y-6">
                  {getSelectedTemplate().sections.map((sectionId) => 
                    renderSectionContent(sectionId)
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 