"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart } from "@/components/charts/donut-chart"
import { Progress } from "@/components/ui/progress"

interface CostsContentProps {
  results: any
  setupParams?: any
}

export function CostsContent({ results, setupParams }: CostsContentProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Análise de Custos</h1>
        <p className="text-gray-600 mt-2">Detalhamento completo dos custos operacionais e de investimento</p>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(results.custo_total_investimento)}</div>
            <div className="text-sm text-red-700 mt-1">Investimento Inicial</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(results.custo_operacional_total_ciclo)}
            </div>
            <div className="text-sm text-orange-700 mt-1">Custo por Ciclo</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.custo_por_grama)}</div>
            <div className="text-sm text-blue-700 mt-1">Custo por Grama</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Distribution Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição de Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={results.detalhe_custos_operacionais} />
          </CardContent>
        </Card>

        {/* Equipment Cost Distribution Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição de Custos com Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {setupParams ? (
              <DonutChart
                data={{
                  'Iluminação': setupParams.custo_equip_iluminacao,
                  'Tenda/Estrutura': setupParams.custo_tenda_estrutura,
                  'Ventilação/Exaustão': setupParams.custo_ventilacao_exaustao,
                  'Outros Equipamentos': setupParams.custo_outros_equipamentos,
                }}
              />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Dados de equipamentos não disponíveis.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cost and Equipment Breakdown Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Cost Breakdown */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Detalhamento de Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.detalhe_custos_operacionais).map(([key, value]: [string, any]) => {
              const percentage = (value / results.custo_operacional_total_ciclo) * 100
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{key}</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(value)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Equipment Cost Breakdown */}
        {setupParams && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Detalhamento de Custos com Equipamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const totalInvest =
                  (setupParams.custo_equip_iluminacao || 0) +
                  (setupParams.custo_tenda_estrutura || 0) +
                  (setupParams.custo_ventilacao_exaustao || 0) +
                  (setupParams.custo_outros_equipamentos || 0)
                const items = [
                  { label: 'Iluminação', value: setupParams.custo_equip_iluminacao || 0 },
                  { label: 'Tenda/Estrutura', value: setupParams.custo_tenda_estrutura || 0 },
                  { label: 'Ventilação/Exaustão', value: setupParams.custo_ventilacao_exaustao || 0 },
                  { label: 'Outros Equipamentos', value: setupParams.custo_outros_equipamentos || 0 },
                ]
                return items.map(({ label, value }) => {
                  const percentage = totalInvest > 0 ? (value / totalInvest) * 100 : 0
                  return (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{label}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(value)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
