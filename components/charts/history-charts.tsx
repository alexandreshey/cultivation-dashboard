"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, DollarSign, Leaf } from "lucide-react"
import type { CultivationSummary } from "@/lib/mock-data"

interface HistoryChartsProps {
  cultivations: CultivationSummary[]
}

export function HistoryCharts({ cultivations }: HistoryChartsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  // Agrupar cultivos por mês
  const monthlyData = cultivations.reduce((acc, cultivation) => {
    const date = new Date(cultivation.startDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        count: 0,
        totalProfit: 0,
        totalYield: 0,
        avgEfficiency: 0
      }
    }
    
    acc[monthKey].count++
    acc[monthKey].totalProfit += cultivation.profit_brl
    acc[monthKey].totalYield += cultivation.yield_g
    
    const efficiency = cultivation.yield_g > 0 && cultivation.durationDays > 0 
      ? cultivation.yield_g / cultivation.durationDays 
      : 0
    acc[monthKey].avgEfficiency = (acc[monthKey].avgEfficiency + efficiency) / acc[monthKey].count
    
    return acc
  }, {} as Record<string, any>)

  const sortedMonths = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  // Calcular tendências
  const recentMonths = sortedMonths.slice(-3)
  const profitTrend = recentMonths.length >= 2 
    ? recentMonths[recentMonths.length - 1].totalProfit - recentMonths[recentMonths.length - 2].totalProfit
    : 0

  const yieldTrend = recentMonths.length >= 2
    ? recentMonths[recentMonths.length - 1].totalYield - recentMonths[recentMonths.length - 2].totalYield
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Tendência de Lucro */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tendência de Lucro
            {profitTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMonths.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">
                    {new Date(month.month + '-01').toLocaleDateString('pt-BR', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(month.totalProfit)}</div>
                  <div className="text-xs text-muted-foreground">{month.count} cultivos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Rendimento */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Tendência de Rendimento
            {yieldTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMonths.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">
                    {new Date(month.month + '-01').toLocaleDateString('pt-BR', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{month.totalYield.toFixed(1)}g</div>
                  <div className="text-xs text-muted-foreground">
                    {month.avgEfficiency.toFixed(1)} g/dia
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { status: 'active', label: 'Ativos', color: 'bg-blue-500', count: cultivations.filter(c => c.status === 'active').length },
              { status: 'completed', label: 'Concluídos', color: 'bg-green-500', count: cultivations.filter(c => c.status === 'completed').length },
              { status: 'archived', label: 'Arquivados', color: 'bg-gray-500', count: cultivations.filter(c => c.status === 'archived').length }
            ].map((item) => {
              const percentage = cultivations.length > 0 ? (item.count / cultivations.length) * 100 : 0
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.count}</Badge>
                    <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cultivations
              .filter(c => c.profit_brl > 0)
              .sort((a, b) => b.profit_brl - a.profit_brl)
              .slice(0, 3)
              .map((cultivation, index) => (
                <div key={cultivation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{cultivation.name}</div>
                      <div className="text-xs text-muted-foreground">{cultivation.seedStrain}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{formatCurrency(cultivation.profit_brl)}</div>
                    <div className="text-xs text-muted-foreground">{cultivation.yield_g}g</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 