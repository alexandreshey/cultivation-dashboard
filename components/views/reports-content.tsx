"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Calendar, Eye, Share2, BarChart3, FileText } from "lucide-react"
import { InteractiveReportGenerator } from "@/components/reports/interactive-report-generator"

import { mockDetailedReport } from "@/lib/mock-data"

interface ReportsContentProps {
  results: any
  setupParams: any
  cycleParams: any
  marketParams: any
  agronomicData?: any[] // Novo: dados de parâmetros agronômicos
}

export function ReportsContent({ results, setupParams, cycleParams, marketParams, agronomicData }: ReportsContentProps) {
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

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios Profissionais</h1>
            <p className="text-muted-foreground mt-2">Documentos executivos e análises detalhadas</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <BarChart3 className="h-3 w-3 mr-1" />
                Novo: Relatórios Interativos
              </Badge>
            </div>
          </div>
          <Badge className={reportStatus.color}>
            {reportStatus.icon} Projeto {reportStatus.status}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(results.lucro_liquido_ciclo)}</div>
            <div className="text-sm text-muted-foreground">Lucro por Ciclo</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{results.roi_investimento_1_ano.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">ROI Anual</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{results.periodo_payback_ciclos.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Payback (ciclos)</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{results.gramas_por_watt.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">g/W Eficiência</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interactive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interactive">Relatórios Interativos</TabsTrigger>
          <TabsTrigger value="automated">Automação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="space-y-6">
          {/* Relatórios Interativos */}
          <InteractiveReportGenerator 
            results={results}
            setupParams={setupParams}
            cycleParams={cycleParams}
            marketParams={marketParams}
          />
        </TabsContent>

        <TabsContent value="automated" className="space-y-6">
          {/* Automated Reports */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Relatórios Automáticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Configurar Envio Automático</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Relatório Semanal</div>
                        <div className="text-sm text-muted-foreground">Toda segunda-feira às 9:00</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Relatório Mensal</div>
                        <div className="text-sm text-muted-foreground">Todo dia 1º às 8:00</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Alertas de Viabilidade</div>
                        <div className="text-sm text-muted-foreground">Quando ROI &lt; 10%</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Ativar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Compartilhamento</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Link de Compartilhamento</div>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Gerar Link
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Crie um link seguro para compartilhar resultados com investidores
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Apresentação Online</div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Criar
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Gere uma apresentação interativa para reuniões</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Report History */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Histórico de Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Resumo Executivo", date: "15/01/2024 14:30", type: "PDF", size: "2.1 MB" },
                  { name: "Relatório Completo", date: "12/01/2024 09:15", type: "PDF", size: "5.8 MB" },
                  { name: "Análise Financeira", date: "10/01/2024 16:45", type: "CSV", size: "0.3 MB" },
                  { name: "Resumo Executivo", date: "08/01/2024 11:20", type: "PDF", size: "2.0 MB" },
                  { name: "Relatório Completo", date: "05/01/2024 13:10", type: "PDF", size: "5.9 MB" },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.date} • {report.type} • {report.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
