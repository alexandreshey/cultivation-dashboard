"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Calendar, DollarSign, Leaf, Clock, Award } from "lucide-react"
import type { CultivationSummary } from "@/lib/mock-data"

interface AggregateStatsProps {
  cultivations: CultivationSummary[]
}

export function AggregateStats({ cultivations }: AggregateStatsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  // Cálculos das estatísticas
  const totalCultivations = cultivations.length
  const activeCultivations = cultivations.filter(c => c.status === "active").length
  const completedCultivations = cultivations.filter(c => c.status === "completed").length
  
  const totalProfit = cultivations.reduce((sum, c) => sum + c.profit_brl, 0)
  const avgProfit = totalCultivations > 0 ? totalProfit / totalCultivations : 0
  
  const totalYield = cultivations.reduce((sum, c) => sum + c.yield_g, 0)
  const avgYield = totalCultivations > 0 ? totalYield / totalCultivations : 0
  
  const totalDuration = cultivations.reduce((sum, c) => sum + c.durationDays, 0)
  const avgDuration = totalCultivations > 0 ? totalDuration / totalCultivations : 0
  
  const profitableCultivations = cultivations.filter(c => c.profit_brl > 0).length
  const successRate = totalCultivations > 0 ? (profitableCultivations / totalCultivations) * 100 : 0
  
  const bestCultivation = cultivations.reduce((best, current) => 
    current.profit_brl > best.profit_brl ? current : best, cultivations[0] || { profit_brl: 0, name: "" }
  )

  const recentCultivations = cultivations
    .filter(c => new Date(c.startDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
    .length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total de Cultivos */}
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Total de Cultivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalCultivations}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {activeCultivations} ativos
            </Badge>
            <Badge variant="outline" className="text-xs">
              {completedCultivations} concluídos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Lucro Total */}
      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Lucro Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Média: {formatCurrency(avgProfit)}
            </span>
            {totalProfit > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Sucesso */}
      <Card className="shadow-sm border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Taxa de Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{successRate.toFixed(1)}%</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              {profitableCultivations}/{totalCultivations} lucrativos
            </span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Rendimento Médio */}
      <Card className="shadow-sm border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Rendimento Médio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{avgYield.toFixed(1)}g</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Total: {totalYield.toFixed(1)}g
            </span>
            <span className="text-sm text-muted-foreground">
              • {avgDuration.toFixed(0)} dias médios
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 