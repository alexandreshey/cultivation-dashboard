"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Clock, Zap } from "lucide-react"

interface KPICardsProps {
  results: any
}

export function KPICards({ results }: KPICardsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const kpis = [
    {
      title: "Lucro por Ciclo",
      value: formatCurrency(results.lucro_liquido_ciclo),
      icon: DollarSign,
      trend: results.lucro_liquido_ciclo > 0 ? "up" : "down",
      color: results.lucro_liquido_ciclo > 0 ? "green" : "red",
      subtitle: `Receita: ${formatCurrency(results.receita_bruta_ciclo)}`,
    },
    {
      title: "ROI (1º Ano)",
      value: `${results.roi_investimento_1_ano.toFixed(1)}%`,
      icon: TrendingUp,
      trend: results.roi_investimento_1_ano > 0 ? "up" : "down",
      color: results.roi_investimento_1_ano > 0 ? "blue" : "red",
      subtitle: "Retorno sobre investimento",
    },
    {
      title: "Payback",
      value: `${results.periodo_payback_ciclos.toFixed(1)} ciclos`,
      icon: Clock,
      trend: results.periodo_payback_ciclos < 10 ? "up" : "down", // Lower is better for payback
      color: "orange",
      subtitle: "Tempo para recuperar investimento",
    },
    {
      title: "Eficiência",
      value: `${results.gramas_por_watt.toFixed(2)} g/W`,
      icon: Zap,
      trend: results.gramas_por_watt > 1 ? "up" : "down", // Higher g/W is better
      color: "purple",
      subtitle: "Gramas por Watt",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${kpi.color}-100 dark:bg-${kpi.color}-900`}>
                  <Icon className={`h-6 w-6 text-${kpi.color}-600 dark:text-${kpi.color}-300`} />
                </div>
                <TrendIcon
                  className={`h-4 w-4 ${
                    kpi.trend === "up" ? "text-green-500" : "text-red-500"
                  } transition-transform duration-200`}
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
                <p className={`text-2xl font-bold text-${kpi.color}-600 dark:text-${kpi.color}-300`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{kpi.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
