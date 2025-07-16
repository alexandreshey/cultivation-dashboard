"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { DonutChart } from "@/components/charts/donut-chart"
import { TimelineChart } from "@/components/charts/timeline-chart"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { Leaf, Flower, Droplet, CheckCircle } from "lucide-react"

interface DashboardContentProps {
  results: any
  cycleParams: any
}

export function DashboardContent({ results, cycleParams }: DashboardContentProps) {
  // Dados das fases do ciclo
  const phases = [
    {
      name: "Vegetativo",
      duration: cycleParams.dias_vegetativo,
      color: "from-green-400 to-green-600",
      icon: <Leaf className="w-5 h-5 md:w-7 md:h-7" />,
      dot: "bg-green-500"
    },
    {
      name: "Floração",
      duration: cycleParams.dias_floracao,
      color: "from-yellow-400 to-orange-500",
      icon: <Flower className="w-5 h-5 md:w-7 md:h-7" />,
      dot: "bg-yellow-500"
    },
    {
      name: "Secagem/Cura",
      duration: cycleParams.dias_secagem_cura,
      color: "from-purple-400 to-purple-600",
      icon: <Droplet className="w-5 h-5 md:w-7 md:h-7" />,
      dot: "bg-purple-500"
    },
  ]
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0)
  let cumulativeDays = 0

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral da análise de viabilidade do cultivo indoor</p>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8 shadow-lg">
        <Image
          src="/images/indoor-cultivation-overview.png"
          alt="Indoor cannabis cultivation facility with rows of mature plants under grow lights"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <h2 className="text-white text-3xl font-bold">Seu Cultivo, Seus Dados, Seu Sucesso.</h2>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards results={results} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição de Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={results.detalhe_custos_operacionais} />
          </CardContent>
        </Card>

        {/* NOVO VISUAL DA TIMELINE DO CICLO */}
        <section className="p-4 md:p-6 bg-white rounded-xl shadow-lg border mb-2">
          <h2 className="text-xl font-bold mb-4">Timeline do Ciclo</h2>
          {/* Barra de fases */}
          <div className="flex w-full h-12 rounded-lg overflow-hidden mb-4 shadow-inner">
            {phases.map((phase, idx) => {
              const width = (phase.duration / totalDuration) * 100
              return (
                <div
                  key={phase.name}
                  className={`flex-1 flex items-center justify-center relative group transition-all duration-300
                    ${idx !== 0 ? "border-l-4 border-white" : ""}
                    bg-gradient-to-r ${phase.color}`}
                  style={{ minWidth: 0, width: `${width}%` }}
                >
                  <span className="text-white text-lg flex items-center gap-2 font-semibold drop-shadow">
                    {phase.icon}
                    {phase.name}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Dias extremos */}
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <span>Dia 0</span>
            <span>Dia {totalDuration}</span>
          </div>
          {/* Cartões das fases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {phases.map((phase, index) => {
              const startDay = cumulativeDays
              cumulativeDays += phase.duration
              const endDay = cumulativeDays
              return (
                <div
                  key={phase.name}
                  className="bg-muted/50 rounded-lg p-4 shadow hover:shadow-md transition-all border flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${phase.dot}`}></span>
                    <span className="font-semibold text-base">{phase.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duração: <span className="font-medium">{phase.duration} dias</span>
                    <br />
                    Período: Dia {startDay} - {endDay}
                  </div>
                </div>
              )
            })}
          </div>
          {/* Resumo do ciclo */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-green-700 font-bold text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Ciclo Completo: {totalDuration} dias
            </span>
            <span className="text-green-600 text-sm mt-1">Aproximadamente {(totalDuration / 30).toFixed(1)} meses</span>
          </div>
        </section>
      </div>

      {/* Financial Summary */}
      <div className="mt-8">
        <FinancialSummary results={results} />
      </div>
    </div>
  )
}
