"use client"

import { useState, useEffect } from "react"
import { AnomalyAlerts } from "@/components/anomaly-alerts"
import { AnomalyLearningStatus } from "@/components/anomaly-learning-status"
import { AnomalyPatternDetails } from "@/components/anomaly-pattern-details"
import { mockCultivations, mockAgronomicData } from "@/lib/mock-data"
import { AnomalyDetector } from "@/lib/anomaly-detector"
import type { CultivationPattern } from "@/lib/anomaly-detector"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  Lightbulb,
  BarChart3
} from "lucide-react"

export function AnomalyContent() {
  const [detector, setDetector] = useState<AnomalyDetector | null>(null)
  const [patterns, setPatterns] = useState<CultivationPattern[]>([])
  const [isLearning, setIsLearning] = useState(false)

  // Inicializar detector
  useEffect(() => {
    const anomalyDetector = new AnomalyDetector()
    setDetector(anomalyDetector)
  }, [])

  // Aprender padrões
  useEffect(() => {
    if (!detector) return

    setIsLearning(true)
    
    // Filtrar cultivos bem-sucedidos
    const successfulCultivations = mockCultivations.filter(
      c => c.status === "completed" && c.yield_g > 0 && c.profit_brl > 0
    )

    // Preparar dados agronômicos
    const successfulData = successfulCultivations.map(cultivation => 
      mockAgronomicData[cultivation.id] || []
    )

    // Aprender padrões
    detector.learnPatterns(successfulCultivations, successfulData)
    
    // Obter padrões aprendidos
    const learnedPatterns = detector.getPatterns()
    setPatterns(learnedPatterns)
    
    setIsLearning(false)
  }, [detector])

  const handleAnomalyAction = (anomaly: any) => {
    console.log("Ação tomada para anomalia:", anomaly)
    // Implementar ações específicas aqui
  }

  const getSystemStats = () => {
    const activeCultivations = mockCultivations.filter(c => c.status === "active")
    const completedCultivations = mockCultivations.filter(c => c.status === "completed")
    const successfulCultivations = completedCultivations.filter(c => c.yield_g > 0 && c.profit_brl > 0)
    
    return {
      total: mockCultivations.length,
      active: activeCultivations.length,
      completed: completedCultivations.length,
      successful: successfulCultivations.length,
      patterns: patterns.length,
    }
  }

  const stats = getSystemStats()

  return (
    <PageContainer
      title="Sistema de Alertas Inteligentes"
      description="Monitore e detecte anomalias em seus cultivos usando aprendizado de máquina"
      maxWidth="full"
      padding="none"
    >
      {/* Header com estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Cultivos</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Bem-sucedidos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.successful}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Padrões</p>
                <p className="text-2xl font-bold text-orange-600">{stats.patterns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Anomalias</p>
                <p className="text-2xl font-bold text-red-600">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema de Alertas Inteligentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AnomalyAlerts 
            cultivations={mockCultivations}
            agronomicData={mockAgronomicData}
            onAnomalyAction={handleAnomalyAction}
          />
        </div>
        <div>
          <AnomalyLearningStatus 
            cultivations={mockCultivations}
            patterns={patterns}
          />
        </div>
      </div>

      {/* Padrões Aprendidos */}
      <div className="mb-6">
        <AnomalyPatternDetails patterns={patterns} />
      </div>

      {/* Informações sobre o Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">1. Aprendizado</h4>
              <p className="text-sm text-muted-foreground">
                O sistema analisa seus cultivos bem-sucedidos para identificar padrões normais 
                de pH, EC, temperatura e umidade.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">2. Monitoramento</h4>
              <p className="text-sm text-muted-foreground">
                Durante cultivos ativos, o sistema compara os parâmetros atuais com os padrões 
                aprendidos para detectar desvios.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">3. Alertas</h4>
              <p className="text-sm text-muted-foreground">
                Quando detecta anomalias, o sistema gera alertas com sugestões de ações 
                corretivas baseadas nos seus dados históricos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Parâmetros Monitorados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">pH</span>
                <Badge variant="outline">5.5 - 6.5</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Monitora a acidez da solução nutritiva
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Condutividade Elétrica (EC)</span>
                <Badge variant="outline">0.5 - 2.5 mS/cm</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Controla a concentração de nutrientes
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Temperatura</span>
                <Badge variant="outline">20°C - 28°C</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Mantém o ambiente ideal para crescimento
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Umidade</span>
                <Badge variant="outline">40% - 70%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Controla a transpiração das plantas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 