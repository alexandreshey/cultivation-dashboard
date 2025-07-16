"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { SimulatorContent } from "@/components/views/simulator-content"
import { CostsContent } from "@/components/views/costs-content"
import { ReportsContent } from "@/components/views/reports-content"
import { SettingsContent } from "@/components/views/settings-content"
import { ComparisonContent } from "@/components/views/comparison-content"
import { AnalyticsContent } from "@/components/views/analytics-content"
import { calculateResults } from "@/lib/cultivation-calculator"
import { HistoryContent } from "@/components/views/history-content"
import { Footer } from "@/components/layout/footer"

export interface SetupParams {
  area_m2: number
  custo_equip_iluminacao: number
  custo_tenda_estrutura: number
  custo_ventilacao_exaustao: number
  custo_outros_equipamentos: number
}

export interface CycleParams {
  potencia_watts: number
  num_plantas: number
  producao_por_planta_g: number
  dias_vegetativo: number
  horas_luz_veg: number
  dias_floracao: number
  horas_luz_flor: number
  dias_secagem_cura: number
}

export interface MarketParams {
  preco_kwh: number
  custo_sementes_clones: number
  custo_substrato: number
  custo_nutrientes: number
  custos_operacionais_misc: number
  preco_venda_por_grama: number
}

export default function CultivationApp() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const [setupParams, setSetupParams] = useState<SetupParams>({
    area_m2: 2.25,
    custo_equip_iluminacao: 2000,
    custo_tenda_estrutura: 1500,
    custo_ventilacao_exaustao: 800,
    custo_outros_equipamentos: 500,
  })

  const [cycleParams, setCycleParams] = useState<CycleParams>({
    potencia_watts: 480,
    num_plantas: 6,
    producao_por_planta_g: 80,
    dias_vegetativo: 60,
    horas_luz_veg: 18,
    dias_floracao: 70,
    horas_luz_flor: 12,
    dias_secagem_cura: 20,
  })

  const [marketParams, setMarketParams] = useState<MarketParams>({
    preco_kwh: 0.95,
    custo_sementes_clones: 500,
    custo_substrato: 120,
    custo_nutrientes: 350,
    custos_operacionais_misc: 100,
    preco_venda_por_grama: 45,
  })

  const [results, setResults] = useState(calculateResults(setupParams, cycleParams, marketParams))

  useEffect(() => {
    setResults(calculateResults(setupParams, cycleParams, marketParams))
  }, [setupParams, cycleParams, marketParams])

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent results={results} cycleParams={cycleParams} />
      case "simulator":
        return (
          <SimulatorContent
            setupParams={setupParams}
            cycleParams={cycleParams}
            marketParams={marketParams}
            results={results}
            onSetupChange={setSetupParams}
            onCycleChange={setCycleParams}
            onMarketChange={setMarketParams}
          />
        )
      case "costs":
        return <CostsContent results={results} setupParams={setupParams} />
      case "comparison":
        return <ComparisonContent setupParams={setupParams} cycleParams={cycleParams} marketParams={marketParams} />
      case "analytics":
        return <AnalyticsContent results={results} />
      case "reports":
        return (
          <ReportsContent
            results={results}
            setupParams={setupParams}
            cycleParams={cycleParams}
            marketParams={marketParams}
          />
        )
      case "settings":
        return <SettingsContent />
      case "history":
        return <HistoryContent />
      default:
        return <DashboardContent results={results} cycleParams={cycleParams} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 transition-all duration-300 ease-in-out">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  )
}
