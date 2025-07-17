"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SetupForm } from "@/components/forms/setup-form"
import { CycleForm } from "@/components/forms/cycle-form"
import { MarketForm } from "@/components/forms/market-form"
import { KPICards } from "@/components/dashboard/kpi-cards"

interface SimulatorContentProps {
  setupParams: any
  cycleParams: any
  marketParams: any
  results: any
  onSetupChange: (params: any) => void
  onCycleChange: (params: any) => void
  onMarketChange: (params: any) => void
}

export function SimulatorContent({
  setupParams,
  cycleParams,
  marketParams,
  results,
  onSetupChange,
  onCycleChange,
  onMarketChange,
}: SimulatorContentProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simulador</h1>
        <p className="text-gray-600 mt-2">Ajuste os parâmetros e veja os resultados em tempo real</p>
      </div>

      {/* KPI Cards */}
      <KPICards results={results} />

      {/* Parameters and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Parameters */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Parâmetros de Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="setup" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="cycle">Ciclo</TabsTrigger>
                <TabsTrigger value="market">Mercado</TabsTrigger>
              </TabsList>

              <TabsContent value="setup" className="mt-6">
                <SetupForm params={setupParams} onChange={onSetupChange} />
              </TabsContent>

              <TabsContent value="cycle" className="mt-6">
                <CycleForm params={cycleParams} onChange={onCycleChange} />
              </TabsContent>

              <TabsContent value="market" className="mt-6">
                <MarketForm params={marketParams} onChange={onMarketChange} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Preview */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resultados da Simulação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">R$ {results.lucro_liquido_ciclo.toFixed(2)}</div>
                <div className="text-sm text-green-700">Lucro por Ciclo</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.roi_investimento_1_ano.toFixed(1)}%</div>
                <div className="text-sm text-blue-700">ROI Anual</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Investimento Total</span>
                <span className="font-medium">R$ {results.custo_total_investimento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Custo por Ciclo</span>
                <span className="font-medium">R$ {results.custo_operacional_total_ciclo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Receita por Ciclo</span>
                <span className="font-medium">R$ {results.receita_bruta_ciclo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Duração do Ciclo</span>
                <span className="font-medium">{results.duracao_total_ciclo} dias</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
