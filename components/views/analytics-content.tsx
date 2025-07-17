"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb, Target } from "lucide-react"

interface AnalyticsContentProps {
  results: any
}

export function AnalyticsContent({ results }: AnalyticsContentProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  // Análise de performance
  const getPerformanceScore = () => {
    let score = 0
    if (results.lucro_liquido_ciclo > 0) score += 25
    if (results.roi_investimento_1_ano > 15) score += 25
    if (results.periodo_payback_ciclos < 8) score += 25
    if (results.gramas_por_watt > 1) score += 25
    return score
  }

  const performanceScore = getPerformanceScore()

  // Recomendações baseadas nos resultados
  const getRecommendations = () => {
    const recommendations = []

    if (results.gramas_por_watt < 1) {
      recommendations.push({
        type: "warning",
        title: "Eficiência da Iluminação Baixa",
        description: "Considere investir em LEDs mais eficientes ou ajustar o ciclo de luz",
        impact: "Alto",
      })
    }

    if (results.periodo_payback_ciclos > 10) {
      recommendations.push({
        type: "error",
        title: "Payback Muito Longo",
        description: "Reduza custos operacionais ou aumente o preço de venda",
        impact: "Crítico",
      })
    }

    if (results.roi_investimento_1_ano < 10) {
      recommendations.push({
        type: "warning",
        title: "ROI Abaixo do Esperado",
        description: "Otimize a produção por planta ou reduza o investimento inicial",
        impact: "Médio",
      })
    }

    if (results.lucro_liquido_ciclo > 5000) {
      recommendations.push({
        type: "success",
        title: "Excelente Lucratividade",
        description: "Considere expandir a operação ou investir em automação",
        impact: "Positivo",
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  // Análise de custos
  const getCostAnalysis = () => {
    const totalCosts = Object.values(results.detalhe_custos_operacionais).reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0)
    const energyCost = results.detalhe_custos_operacionais["Energia Elétrica"]
    const energyPercentage = (energyCost / totalCosts) * 100

    return {
      totalCosts,
      energyCost,
      energyPercentage,
      isEnergyHigh: energyPercentage > 40,
    }
  }

  const costAnalysis = getCostAnalysis()

  // Projeções
  const getProjections = () => {
    const cyclesPerYear = 365 / results.duracao_total_ciclo
    const annualProfit = results.lucro_liquido_ciclo * cyclesPerYear
    const fiveYearProfit = annualProfit * 5

    return {
      cyclesPerYear: Math.floor(cyclesPerYear),
      annualProfit,
      fiveYearProfit,
    }
  }

  const projections = getProjections()

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics Avançado</h1>
        <p className="text-muted-foreground mt-2">Análises preditivas e insights para otimização</p>
      </div>

      {/* Performance Score */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Score de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2 items-center justify-center">
            <div className="w-full sm:w-auto">
              <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center mb-2 gap-1 sm:gap-4">
                <span className="text-sm font-medium text-center sm:text-left">Score Geral</span>
                <span className="text-2xl font-bold text-center sm:text-left">{performanceScore}/100</span>
              </div>
              <Progress value={performanceScore} className="h-3 w-full" />
            </div>
            <div className="text-center mt-2 sm:mt-0">
              <Badge
                variant={performanceScore >= 75 ? "default" : performanceScore >= 50 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {performanceScore >= 75 ? "Excelente" : performanceScore >= 50 ? "Bom" : "Precisa Melhorar"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recomendações Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Parabéns! Seu projeto está otimizado.</p>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.type === "error"
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : rec.type === "warning"
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                        : "border-green-500 bg-green-50 dark:bg-green-950"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {rec.type === "error" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    ) : rec.type === "warning" ? (
                      <TrendingDown className="h-5 w-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Analysis */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Análise de Custos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Custo de Energia</span>
                <span className="text-lg font-bold">{costAnalysis.energyPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={costAnalysis.energyPercentage} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                {formatCurrency(costAnalysis.energyCost)} do total de {formatCurrency(costAnalysis.totalCosts)}
              </p>
            </div>

            {costAnalysis.isEnergyHigh && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Custo de energia alto ({">"} 40%)
                  </span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Considere LEDs mais eficientes ou painéis solares
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Distribuição de Custos</h4>
              {Object.entries(results.detalhe_custos_operacionais).map(([key, value]: [string, any]) => {
                const percentage = (value / costAnalysis.totalCosts) * 100
                return (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Projections */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Projeções Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{projections.cyclesPerYear}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Ciclos por Ano</div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(projections.annualProfit)}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Lucro Anual Projetado</div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(projections.fiveYearProfit)}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Lucro em 5 Anos</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Cenários de Crescimento</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conservador (+5% ao ano):</span>
                  <span className="font-medium">{formatCurrency(projections.annualProfit * 1.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Moderado (+10% ao ano):</span>
                  <span className="font-medium">{formatCurrency(projections.annualProfit * 1.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Otimista (+20% ao ano):</span>
                  <span className="font-medium">{formatCurrency(projections.annualProfit * 1.2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
