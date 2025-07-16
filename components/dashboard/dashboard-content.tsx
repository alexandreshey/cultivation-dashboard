"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { DonutChart } from "@/components/charts/donut-chart"
import { TimelineChart } from "@/components/charts/timeline-chart"
import { FinancialSummary } from "@/components/dashboard/financial-summary"

interface DashboardContentProps {
  results: any
  cycleParams: any
}

export function DashboardContent({ results, cycleParams }: DashboardContentProps) {
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

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Timeline do Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineChart cycleParams={cycleParams} />
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="mt-8">
        <FinancialSummary results={results} />
      </div>
    </div>
  )
}
