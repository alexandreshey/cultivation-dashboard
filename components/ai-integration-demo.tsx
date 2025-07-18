"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Zap, 
  Database, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Lightbulb
} from "lucide-react"
import { RealTimeDataService } from "@/lib/real-time-data"
import { AIAnalysisFactory } from "@/lib/ai-integration-examples"

interface AIIntegrationDemoProps {
  cultivationId: string
  cultivationName: string
}

export function AIIntegrationDemo({ cultivationId, cultivationName }: AIIntegrationDemoProps) {
  const [selectedAIService, setSelectedAIService] = useState<"local" | "openai" | "google" | "agriculture">("local")
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sensorData, setSensorData] = useState<any[]>([])
  const [historicalData, setHistoricalData] = useState<any[]>([])

  const dataService = new RealTimeDataService()
  const aiService = AIAnalysisFactory.createService(selectedAIService, process.env.NEXT_PUBLIC_AI_API_KEY)

  // Simular dados históricos
  useEffect(() => {
    const mockHistoricalData = [
      { sensorType: "ph", value: 6.2, timestamp: "2024-01-01T10:00:00Z" },
      { sensorType: "ph", value: 6.1, timestamp: "2024-01-02T10:00:00Z" },
      { sensorType: "ph", value: 6.3, timestamp: "2024-01-03T10:00:00Z" },
      { sensorType: "temperature", value: 24.5, timestamp: "2024-01-01T10:00:00Z" },
      { sensorType: "temperature", value: 25.2, timestamp: "2024-01-02T10:00:00Z" },
      { sensorType: "temperature", value: 23.8, timestamp: "2024-01-03T10:00:00Z" },
      { sensorType: "humidity", value: 65, timestamp: "2024-01-01T10:00:00Z" },
      { sensorType: "humidity", value: 68, timestamp: "2024-01-02T10:00:00Z" },
      { sensorType: "humidity", value: 62, timestamp: "2024-01-03T10:00:00Z" },
      { sensorType: "ec", value: 1.2, timestamp: "2024-01-01T10:00:00Z" },
      { sensorType: "ec", value: 1.3, timestamp: "2024-01-02T10:00:00Z" },
      { sensorType: "ec", value: 1.1, timestamp: "2024-01-03T10:00:00Z" }
    ]

    setHistoricalData(mockHistoricalData)
    
    // Adicionar dados históricos ao serviço local
    if (selectedAIService === "local") {
      mockHistoricalData.forEach(data => {
        aiService.addHistoricalData(data)
      })
    }
  }, [selectedAIService])

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      let analysis: any = null

      switch (selectedAIService) {
        case "local":
          // Análise local
          const anomalies = aiService.detectAnomalies(sensorData)
          const yieldPrediction = aiService.predictYield({
            numPlants: 6,
            currentData: sensorData
          })
          
          analysis = {
            anomalies,
            yieldPrediction,
            service: "Local AI",
            timestamp: new Date().toISOString()
          }
          break

        case "openai":
          // Análise com OpenAI
          analysis = await aiService.analyzeCultivationData(sensorData, {
            strain: "OG Kush",
            phase: "flowering",
            daysSinceStart: 45
          })
          analysis.service = "OpenAI GPT-4"
          analysis.timestamp = new Date().toISOString()
          break

        case "google":
          // Análise com Google AI (simulado)
          analysis = {
            analysis: "Análise visual e de dados com Google Gemini",
            confidence: 0.87,
            recommendations: [
              "Condições ambientais estão ótimas",
              "Considerar aumentar CO2 para melhor crescimento",
              "Monitorar pH mais frequentemente"
            ],
            service: "Google AI (Gemini)",
            timestamp: new Date().toISOString()
          }
          break

        case "agriculture":
          // Análise com API de agricultura (simulado)
          analysis = {
            recommendations: [
              "Otimizar temperatura para 24-26°C",
              "Manter umidade entre 60-70%",
              "Ajustar pH para 6.0-6.5"
            ],
            predictions: {
              predicted_yield: 480,
              confidence_interval: "450-520g"
            },
            risk_assessment: "Baixo risco",
            service: "Agriculture AI",
            timestamp: new Date().toISOString()
          }
          break
      }

      setAiAnalysis(analysis)
    } catch (error) {
      console.error("Erro na análise de IA:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addMockSensorData = () => {
    const mockData = [
      { sensorType: "ph", value: 6.1 + Math.random() * 0.4 },
      { sensorType: "temperature", value: 24 + Math.random() * 4 },
      { sensorType: "humidity", value: 60 + Math.random() * 20 },
      { sensorType: "ec", value: 1.2 + Math.random() * 0.6 }
    ]

    setSensorData(mockData)
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "Local AI": return <Database className="h-4 w-4" />
      case "OpenAI GPT-4": return <Brain className="h-4 w-4" />
      case "Google AI (Gemini)": return <Zap className="h-4 w-4" />
      case "Agriculture AI": return <Target className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Demonstração de Integração com IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Este componente demonstra como integrar dados reais dos cultivos com diferentes serviços de IA.
          </p>

          <Tabs value={selectedAIService} onValueChange={(value) => setSelectedAIService(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="local">Local AI</TabsTrigger>
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
              <TabsTrigger value="google">Google AI</TabsTrigger>
              <TabsTrigger value="agriculture">Agriculture AI</TabsTrigger>
            </TabsList>

            <TabsContent value="local" className="space-y-4">
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Análise local usando algoritmos estatísticos. Não requer API externa.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="openai" className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  Análise avançada usando GPT-4. Requer chave de API da OpenAI.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="google" className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Análise visual e de dados usando Google Gemini. Requer chave de API do Google.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="agriculture" className="space-y-4">
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  Análise especializada em agricultura. Requer API específica de agricultura.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-4">
            <Button onClick={addMockSensorData} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Adicionar Dados Mock
            </Button>
            <Button onClick={runAIAnalysis} disabled={isAnalyzing}>
              <Brain className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analisando..." : "Executar Análise"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados Atuais */}
      {sensorData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Dados Atuais dos Sensores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sensorData.map((data, index) => (
                <div key={index} className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{data.value.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground capitalize">{data.sensorType}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados da Análise */}
      {aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getServiceIcon(aiAnalysis.service)}
              Análise de IA - {aiAnalysis.service}
              <Badge variant="outline" className="ml-2">
                {new Date(aiAnalysis.timestamp).toLocaleTimeString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Anomalias */}
            {aiAnalysis.anomalies && aiAnalysis.anomalies.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Anomalias Detectadas
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.anomalies.map((anomaly: any, index: number) => (
                    <Alert key={index} className="border-l-4 border-orange-200">
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{anomaly.parameter}</span>
                          <Badge variant={anomaly.severity === "critical" ? "destructive" : "secondary"}>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Valor atual: {anomaly.currentValue.toFixed(1)} | 
                          Esperado: {anomaly.expectedValue.toFixed(1)} | 
                          Desvio: {anomaly.deviationPercent.toFixed(1)}%
                        </p>
                        <p className="text-sm mt-1">{anomaly.recommendation}</p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendações */}
            {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  Recomendações
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Predições */}
            {aiAnalysis.yieldPrediction && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Predição de Rendimento
                </h4>
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-700">
                    {aiAnalysis.yieldPrediction.predictedYield}g
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confiança: {(aiAnalysis.yieldPrediction.confidence * 100).toFixed(0)}%
                  </div>
                  {aiAnalysis.yieldPrediction.factors && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Fatores: {aiAnalysis.yieldPrediction.factors.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Análise Geral */}
            {aiAnalysis.analysis && (
              <div>
                <h4 className="font-medium mb-2">Análise Geral</h4>
                <p className="text-sm text-muted-foreground">{aiAnalysis.analysis}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instruções de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Como Configurar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">1. Dados Reais dos Sensores</h4>
              <p className="text-muted-foreground">
                Conecte sensores reais (pH, temperatura, umidade, EC) via API ou protocolos como MQTT.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">2. APIs de IA</h4>
              <p className="text-muted-foreground">
                Configure chaves de API para OpenAI, Google AI ou APIs específicas de agricultura.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">3. Análise em Tempo Real</h4>
              <p className="text-muted-foreground">
                Os dados são analisados automaticamente e alertas são gerados quando necessário.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">4. Recomendações Personalizadas</h4>
              <p className="text-muted-foreground">
                O sistema aprende com seus cultivos anteriores para fornecer recomendações específicas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 