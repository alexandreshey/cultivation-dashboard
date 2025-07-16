"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Database,
  Lightbulb
} from "lucide-react"
import type { CultivationSummary } from "@/lib/mock-data"
import type { CultivationPattern } from "@/lib/anomaly-detector"

interface AnomalyLearningStatusProps {
  cultivations: CultivationSummary[]
  patterns?: CultivationPattern[]
}

export function AnomalyLearningStatus({ 
  cultivations, 
  patterns = [] 
}: AnomalyLearningStatusProps) {
  const [learningProgress, setLearningProgress] = useState(0)
  const [isLearning, setIsLearning] = useState(false)

  // Simular progresso de aprendizado
  useEffect(() => {
    const successfulCultivations = cultivations.filter(
      c => c.status === "completed" && c.yield_g > 0 && c.profit_brl > 0
    )
    
    const totalCultivations = cultivations.length
    const progress = totalCultivations > 0 ? (successfulCultivations.length / totalCultivations) * 100 : 0
    
    setLearningProgress(progress)
    setIsLearning(progress < 50)
  }, [cultivations])

  const getLearningStatus = () => {
    if (learningProgress === 0) return "Iniciando"
    if (learningProgress < 25) return "Aprendendo"
    if (learningProgress < 50) return "Desenvolvendo"
    if (learningProgress < 75) return "Otimizando"
    return "Inteligente"
  }

  const getStatusColor = () => {
    if (learningProgress < 25) return "bg-yellow-100 text-yellow-800"
    if (learningProgress < 50) return "bg-blue-100 text-blue-800"
    if (learningProgress < 75) return "bg-green-100 text-green-800"
    return "bg-purple-100 text-purple-800"
  }

  const getStatusIcon = () => {
    if (learningProgress < 25) return Clock
    if (learningProgress < 50) return Database
    if (learningProgress < 75) return TrendingUp
    return Lightbulb
  }

  const StatusIcon = getStatusIcon()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5" />
          Status do Sistema Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <span className="font-medium">Status:</span>
            <Badge className={getStatusColor()}>
              {getLearningStatus()}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {learningProgress.toFixed(0)}% completo
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso de Aprendizado</span>
            <span>{learningProgress.toFixed(0)}%</span>
          </div>
          <Progress value={learningProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Cultivos Analisados</span>
            </div>
            <span className="text-blue-600 font-semibold">
              {cultivations.filter(c => c.status === "completed").length}
            </span>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Padrões Aprendidos</span>
            </div>
            <span className="text-green-600 font-semibold">
              {patterns.length}
            </span>
          </div>
        </div>

        {isLearning && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">
                  Sistema em Aprendizado
                </p>
                <p className="text-yellow-700">
                  O sistema está analisando seus cultivos anteriores para aprender padrões de sucesso. 
                  Quanto mais dados, mais precisos serão os alertas.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLearning && patterns.length > 0 && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800 mb-1">
                  Sistema Inteligente Ativo
                </p>
                <p className="text-green-700">
                  O sistema já aprendeu padrões dos seus cultivos de sucesso e está monitorando 
                  ativamente para detectar anomalias.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>
            O sistema aprende continuamente com seus dados para melhorar a precisão dos alertas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 