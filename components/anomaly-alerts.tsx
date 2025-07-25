"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  X,
  Brain,
  Info,
  Zap,
  Thermometer,
  Droplets,
  Gauge
} from "lucide-react"
import type { CultivationSummary, AgronomicDataPoint } from "@/lib/mock-data"
import type { DetectedAnomaly } from "@/lib/anomaly-detector"
import { AnomalyDetector } from "@/lib/anomaly-detector"

interface AnomalyAlertsProps {
  cultivations: CultivationSummary[]
  agronomicData: Record<string, AgronomicDataPoint[]>
  onAnomalyAction?: (anomaly: DetectedAnomaly) => void
}

const severityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
}

const severityIcons = {
  low: Info,
  medium: AlertTriangle,
  high: TrendingUp,
  critical: Zap,
}

const parameterIcons = {
  "pH": Gauge,
  "Condutividade Elétrica (EC)": Droplets,
  "Temperatura": Thermometer,
  "Umidade": Droplets,
}

export function AnomalyAlerts({ 
  cultivations, 
  agronomicData, 
  onAnomalyAction 
}: AnomalyAlertsProps) {
  const [anomalies, setAnomalies] = useState<DetectedAnomaly[]>([])
  const [detector, setDetector] = useState<AnomalyDetector | null>(null)
  const [isLearning, setIsLearning] = useState(false)
  const [showDismissed, setShowDismissed] = useState(false)

  // Inicializar detector de anomalias
  useEffect(() => {
    const anomalyDetector = new AnomalyDetector()
    setDetector(anomalyDetector)
  }, [])

  // Aprender padrões de cultivos bem-sucedidos
  const learnPatterns = useCallback(() => {
    if (!detector) return

    setIsLearning(true)
    
    // Filtrar cultivos bem-sucedidos (completados com rendimento > 0)
    const successfulCultivations = cultivations.filter(
      c => c.status === "completed" && c.yield_g > 0 && c.profit_brl > 0
    )

    // Preparar dados agronômicos para cultivos bem-sucedidos
    const successfulData = successfulCultivations.map(cultivation => 
      agronomicData[cultivation.id] || []
    )

    // Aprender padrões
    detector.learnPatterns(successfulCultivations, successfulData)
    
    setIsLearning(false)
  }, [detector, cultivations, agronomicData])

  // Detectar anomalias em cultivos ativos
  const detectAnomalies = useCallback(() => {
    if (!detector) return

    const activeCultivations = cultivations.filter(c => c.status === "active")
    const newAnomalies: DetectedAnomaly[] = []

    activeCultivations.forEach(cultivation => {
      const data = agronomicData[cultivation.id] || []
      if (data.length > 0) {
        const cultivationAnomalies = detector.detectAnomalies(cultivation, data)
        newAnomalies.push(...cultivationAnomalies)
      }
    })

    setAnomalies(newAnomalies)
  }, [detector, cultivations, agronomicData])

  // Executar aprendizado e detecção
  useEffect(() => {
    if (detector && cultivations.length > 0) {
      learnPatterns()
      detectAnomalies()
    }
  }, [detector, cultivations, agronomicData, learnPatterns, detectAnomalies])

  // Executar detecção periodicamente
  useEffect(() => {
    const interval = setInterval(detectAnomalies, 300000) // A cada 5 minutos
    return () => clearInterval(interval)
  }, [detectAnomalies])

  const handleAnomalyAction = (anomaly: DetectedAnomaly) => {
    onAnomalyAction?.(anomaly)
    // Marcar como resolvida (remover da lista)
    setAnomalies(prev => prev.filter(a => a.id !== anomaly.id))
  }

  const dismissAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId))
  }

  const getParameterIcon = (parameter: string) => {
    const Icon = parameterIcons[parameter as keyof typeof parameterIcons] || Info
    return <Icon className="h-4 w-4" />
  }

  const getSeverityIcon = (severity: string) => {
    const Icon = severityIcons[severity as keyof typeof severityIcons] || Info
    return <Icon className="h-4 w-4" />
  }

  const getDirectionIcon = (currentValue: number, expectedValue: number) => {
    return currentValue > expectedValue ? 
      <TrendingUp className="h-4 w-4 text-red-500" /> : 
      <TrendingDown className="h-4 w-4 text-blue-500" />
  }

  if (anomalies.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Brain className="h-5 w-5" />
            Sistema de Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-muted-foreground">
              {isLearning ? 
                "Aprendendo padrões dos seus cultivos..." : 
                "Nenhuma anomalia detectada. Todos os parâmetros estão dentro do padrão normal!"
              }
            </p>
            {!isLearning && (
              <p className="text-sm text-muted-foreground mt-2">
                O sistema monitora pH, EC, temperatura e umidade baseado nos seus cultivos de sucesso.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5" />
          Alertas de Anomalias
          <Badge variant="destructive" className="ml-2">
            {anomalies.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {anomalies.map((anomaly) => (
          <Alert 
            key={anomaly.id} 
            className={`border-l-4 ${severityColors[anomaly.severity]} p-3 sm:p-4`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 w-full">
              <div className="flex items-start gap-3 flex-1 w-full">
                <div className="flex items-center gap-2 mt-1">
                  {getParameterIcon(anomaly.parameter)}
                  {getDirectionIcon(anomaly.currentValue, anomaly.expectedValue)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{anomaly.parameter}</div>
                  <AlertDescription className="text-xs">
                    Valor atual: <span className="font-bold">{anomaly.currentValue}</span> | Esperado: <span className="font-bold">{anomaly.expectedValue}</span>
                  </AlertDescription>
                  <div className="text-xs mt-1">{anomaly.message}</div>
                </div>
              </div>
              <div className="flex justify-end sm:justify-center w-full sm:w-auto">
                <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-100" onClick={() => dismissAnomaly(anomaly.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Alert>
        ))}

        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>
            Sistema baseado em aprendizado de máquina que compara com seus cultivos de sucesso.
          </p>
          <p className="mt-1">
            Última verificação: {new Date().toLocaleTimeString("pt-BR")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 