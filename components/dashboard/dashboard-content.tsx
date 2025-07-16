"use client"

import Image from "next/image"
import { TrendingUp, DollarSign, Clock, Zap } from "lucide-react"
import { useState } from "react"
import { Sparkline } from "@/components/charts/sparkline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { DonutChart } from "@/components/charts/donut-chart"
import { TimelineChart } from "@/components/charts/timeline-chart"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { PageContainer } from "@/components/layout/page-container"
import { AnomalyAlerts } from "@/components/anomaly-alerts"
import { AnomalyLearningStatus } from "@/components/anomaly-learning-status"
import { mockCultivations, mockAgronomicData } from "@/lib/mock-data"

interface DashboardContentProps {
  results: any
  cycleParams: any
}

function KpiCard({ icon, label, value, onClick, positive }: any) {
  return (
    <button
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl shadow bg-white hover:bg-gray-50 transition border ${positive ? 'border-green-200' : 'border-gray-200'}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex flex-col items-center gap-1 w-full">
        {icon}
        <span className="text-sm font-semibold text-gray-700 text-center w-full">{label}</span>
      </div>
      <div className="flex items-center justify-center w-full">
        <span className={`text-2xl font-bold ${positive ? 'text-green-700' : 'text-gray-900'} text-center w-full`}>{value}</span>
      </div>
    </button>
  )
}

export function DashboardContent({ results, cycleParams }: DashboardContentProps) {
  // Exemplo de dados históricos para sparklines e tendências
  const lucroHistorico = [18000, 18500, 19000, 19224]
  const roiHistorico = [800, 820, 850, 874.6]
  const paybackHistorico = [0.3, 0.25, 0.22, 0.2]
  const eficienciaHistorico = [0.98, 0.99, 1.01, 1.00]

  // Estado para modal de explicação
  const [modal, setModal] = useState<string | null>(null)

  return (
    <PageContainer
      title="Dashboard"
      description="Visão geral da análise de viabilidade do cultivo indoor"
      maxWidth="full"
      padding="none"
    >

      {/* Hero Image Section */}
      <div className="relative w-full h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg">
        <Image
          src="/images/indoor-cultivation-overview.png"
          alt="Indoor cannabis cultivation facility with rows of mature plants under grow lights"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              Seu Cultivo, Seus Dados, Seu Sucesso.
            </h2>
            <p className="text-white/80 text-sm sm:text-base mt-2 max-w-md">
              Monitore e otimize seu cultivo com dados precisos e insights inteligentes
            </p>
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <KpiCard
          icon={<DollarSign className="w-8 h-8 text-green-500" />}
          label="Lucro por Ciclo"
          value={results.lucro_liquido_ciclo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          positive
          onClick={() => setModal('lucro')}
        />
        <KpiCard
          icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
          label="ROI (1º Ano)"
          value={results.roi_investimento_1_ano.toFixed(1) + '%'}
          onClick={() => setModal('roi')}
        />
        <KpiCard
          icon={<Clock className="w-8 h-8 text-orange-500" />}
          label="Payback"
          value={results.periodo_payback_ciclos.toFixed(1) + ' ciclos'}
          onClick={() => setModal('payback')}
        />
        <KpiCard
          icon={<Zap className="w-8 h-8 text-purple-500" />}
          label="Eficiência"
          value={results.gramas_por_watt.toFixed(2) + ' g/W'}
          onClick={() => setModal('eficiencia')}
        />
      </div>

      {/* Cards de Fluxo Financeiro e Métricas de Eficiência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card className="border-l-4 border-green-200">
          <CardHeader>
            <CardTitle>Fluxo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Exemplo de badges de status */}
            <div className="flex items-center justify-between bg-red-50 rounded-lg p-2">
              <span className="flex items-center gap-1">↓ Investimento Inicial</span>
              <span className="font-bold text-red-600">{results.custo_total_investimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex items-center justify-between bg-red-50 rounded-lg p-2">
              <span className="flex items-center gap-1">↓ Custo Operacional/Ciclo</span>
              <span className="font-bold text-red-600">{results.custo_operacional_total_ciclo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 rounded-lg p-2">
              <span className="flex items-center gap-1">↑ Receita Bruta/Ciclo</span>
              <span className="font-bold text-green-600">{results.receita_bruta_ciclo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 rounded-lg p-2">
              <span className="flex items-center gap-1">↑ Lucro Líquido/Ciclo</span>
              <span className="font-bold text-green-600">{results.lucro_liquido_ciclo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-blue-200">
          <CardHeader>
            <CardTitle>Métricas de Eficiência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
              <span>Custo por Grama</span>
              <span className="font-bold text-blue-600">{results.custo_por_grama.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
              <span>Gramas por m²</span>
              <span className="font-bold text-blue-600">{results.gramas_por_m2?.toLocaleString('pt-BR') || '-'}</span>
            </div>
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
              <span>Período de Payback</span>
              <span className="font-bold text-blue-600">{results.periodo_payback_ciclos.toFixed(1)} ciclos</span>
            </div>
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
              <span>ROI Anual</span>
              <span className="font-bold text-blue-600">{results.roi_investimento_1_ano.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Distribuição de Custos Operacionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={results.detalhe_custos_operacionais} />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Timeline do Ciclo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineChart cycleParams={cycleParams} />
          </CardContent>
        </Card>
      </div>

      {/* Sistema de Alertas Inteligentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AnomalyAlerts 
            cultivations={mockCultivations}
            agronomicData={mockAgronomicData}
            onAnomalyAction={(anomaly) => {
              console.log("Ação tomada para anomalia:", anomaly)
              // Aqui você pode implementar ações específicas como:
              // - Abrir formulário de correção
              // - Registrar ação no log
              // - Enviar notificação
            }}
          />
        </div>
        <div>
          <AnomalyLearningStatus 
            cultivations={mockCultivations}
          />
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummary results={results} />

      {/* Modal de explicação das métricas (detalhado) */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Explicação: {modal === 'lucro' ? 'Lucro por Ciclo' : modal === 'roi' ? 'ROI (1º Ano)' : modal === 'payback' ? 'Payback' : modal === 'eficiencia' ? 'Eficiência' : ''}</DialogTitle>
          </DialogHeader>
          {modal === 'lucro' && (
            <div className="space-y-2">
              <p><b>O que é:</b> Lucro líquido obtido ao final de cada ciclo de cultivo, já descontando todos os custos operacionais e de investimento.</p>
              <p><b>Como interpretar:</b> Um valor alto indica boa rentabilidade do seu cultivo. Compare com ciclos anteriores para avaliar evolução.</p>
              <p><b>Dica:</b> Para aumentar o lucro, otimize custos e busque maior produtividade por planta.</p>
              <p><b>Benchmark:</b> Lucros acima de R$ 10.000/ciclo são considerados excelentes para cultivos indoor de médio porte.</p>
            </div>
          )}
          {modal === 'roi' && (
            <div className="space-y-2">
              <p><b>O que é:</b> Retorno percentual sobre o investimento inicial ao longo de um ano de operação.</p>
              <p><b>Como interpretar:</b> ROI acima de 100% significa que você recupera o investimento e ainda tem lucro no primeiro ano.</p>
              <p><b>Dica:</b> Aumente o ROI reduzindo custos fixos ou aumentando a produção.</p>
              <p><b>Benchmark:</b> ROI anual acima de 50% é considerado muito bom no setor.</p>
            </div>
          )}
          {modal === 'payback' && (
            <div className="space-y-2">
              <p><b>O que é:</b> Quantidade de ciclos necessários para recuperar todo o investimento inicial.</p>
              <p><b>Como interpretar:</b> Quanto menor, melhor. Payback abaixo de 2 ciclos indica retorno rápido.</p>
              <p><b>Dica:</b> Reduza custos iniciais ou aumente a eficiência para diminuir o payback.</p>
              <p><b>Benchmark:</b> Payback de 1 a 2 ciclos é excelente.</p>
            </div>
          )}
          {modal === 'eficiencia' && (
            <div className="space-y-2">
              <p><b>O que é:</b> Quantidade de gramas produzidas por watt de energia consumida.</p>
              <p><b>Como interpretar:</b> Mede a eficiência energética do cultivo. Valores acima de 1g/W são ótimos.</p>
              <p><b>Dica:</b> Invista em iluminação LED e otimize o ambiente para aumentar a eficiência.</p>
              <p><b>Benchmark:</b> 1g/W é referência internacional para cultivos eficientes.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
