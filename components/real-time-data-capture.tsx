"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Lightbulb, 
  Leaf,
  Zap,
  Brain,
  Upload,
  Database,
  Wifi,
  WifiOff
} from "lucide-react"
import type { RealTimeSensorData, CultivationEnvironment, PlantHealthData } from "@/lib/real-time-data"
import { RealTimeDataService, AIAnalysisService } from "@/lib/real-time-data"

interface RealTimeDataCaptureProps {
  cultivationId: string
  cultivationName: string
  onDataCaptured?: (data: any) => void
}

const sensorTypes = [
  { value: "ph", label: "pH", icon: Gauge, unit: "", range: { min: 0, max: 14 } },
  { value: "ec", label: "Condutividade Elétrica", icon: Droplets, unit: "mS/cm", range: { min: 0, max: 5 } },
  { value: "temperature", label: "Temperatura", icon: Thermometer, unit: "°C", range: { min: 0, max: 50 } },
  { value: "humidity", label: "Umidade", icon: Droplets, unit: "%", range: { min: 0, max: 100 } },
  { value: "light", label: "Intensidade Luminosa", icon: Lightbulb, unit: "lux", range: { min: 0, max: 100000 } },
  { value: "co2", label: "CO2", icon: Activity, unit: "ppm", range: { min: 0, max: 2000 } },
  { value: "nutrients", label: "Nutrientes", icon: Leaf, unit: "ml/L", range: { min: 0, max: 10 } }
]

export function RealTimeDataCapture({ 
  cultivationId, 
  cultivationName, 
  onDataCaptured 
}: RealTimeDataCaptureProps) {
  const [selectedSensor, setSelectedSensor] = useState<string>("ph")
  const [sensorValue, setSensorValue] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const dataService = new RealTimeDataService()
  const aiService = new AIAnalysisService(
    process.env.NEXT_PUBLIC_AI_API_KEY || "",
    process.env.NEXT_PUBLIC_AI_BASE_URL || ""
  )

  // Simular conexão com sensores
  useEffect(() => {
    const checkConnection = () => {
      // Simular verificação de sensores conectados
      setIsConnected(Math.random() > 0.3) // 70% chance de estar conectado
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Verificar a cada 30s

    return () => clearInterval(interval)
  }, [])

  const handleSensorDataSubmit = async () => {
    if (!sensorValue || isNaN(Number(sensorValue))) {
      alert("Por favor, insira um valor válido")
      return
    }

    const sensorData: RealTimeSensorData = {
      id: `sensor_${Date.now()}`,
      cultivationId,
      timestamp: new Date().toISOString(),
      sensorType: selectedSensor as any,
      value: Number(sensorValue),
      unit: sensorTypes.find(s => s.value === selectedSensor)?.unit || "",
      location: location || "Manual",
      accuracy: 0.95,
      batteryLevel: 100
    }

    // Adicionar ao serviço de dados
    dataService.addSensorData(sensorData)

    // Notificar componente pai
    onDataCaptured?.(sensorData)

    // Atualizar UI
    setLastUpdate(new Date().toLocaleTimeString())
    setSensorValue("")

    // Trigger análise de IA
    await triggerAIAnalysis()
  }

  const triggerAIAnalysis = async () => {
    if (!aiService.baseUrl) return // Sem API configurada

    setIsAnalyzing(true)
    try {
      const recommendations = await aiService.getRecommendations(cultivationId, {})
      setAiAnalysis({ recommendations, timestamp: new Date().toISOString() })
    } catch (error) {
      console.error("Erro na análise de IA:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSensorIcon = (sensorType: string) => {
    const sensor = sensorTypes.find(s => s.value === sensorType)
    return sensor?.icon || Activity
  }

  const getSensorRange = (sensorType: string) => {
    const sensor = sensorTypes.find(s => s.value === sensorType)
    return sensor?.range || { min: 0, max: 100 }
  }

  return (
    <div className="space-y-6">
      {/* Status de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Captura de Dados em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Sensores Conectados</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Sensores Desconectados</span>
                </>
              )}
            </div>
            {lastUpdate && (
              <Badge variant="outline" className="text-xs">
                Última atualização: {lastUpdate}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Captura Manual de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Adicionar Dados de Sensor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sensor-type">Tipo de Sensor</Label>
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sensorTypes.map((sensor) => {
                    const Icon = sensor.icon
                    return (
                      <SelectItem key={sensor.value} value={sensor.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {sensor.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sensor-value">Valor</Label>
              <Input
                id="sensor-value"
                type="number"
                value={sensorValue}
                onChange={(e) => setSensorValue(e.target.value)}
                placeholder={`Ex: ${getSensorRange(selectedSensor).min + 1}`}
                min={getSensorRange(selectedSensor).min}
                max={getSensorRange(selectedSensor).max}
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Range: {getSensorRange(selectedSensor).min} - {getSensorRange(selectedSensor).max} {sensorTypes.find(s => s.value === selectedSensor)?.unit}
              </p>
            </div>

            <div>
              <Label htmlFor="location">Localização (opcional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Canto superior"
              />
            </div>
          </div>

          <Button 
            onClick={handleSensorDataSubmit}
            disabled={!sensorValue || isNaN(Number(sensorValue))}
            className="w-full"
          >
            <Activity className="h-4 w-4 mr-2" />
            Adicionar Dados
          </Button>
        </CardContent>
      </Card>

      {/* Análise de IA */}
      {aiService.baseUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Análise Inteligente
              {isAnalyzing && <Badge variant="secondary">Analisando...</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiAnalysis ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Análise realizada em {new Date(aiAnalysis.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {aiAnalysis.recommendations?.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium">Recomendações:</h4>
                    {aiAnalysis.recommendations.map((rec: any, index: number) => (
                      <Alert key={index} className="border-l-4 border-blue-200">
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{rec.action}</span>
                            <Badge variant={rec.priority === "critical" ? "destructive" : "secondary"}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rec.expectedImpact}
                          </p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma recomendação disponível no momento.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Adicione dados para receber análises inteligentes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações do Cultivo */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cultivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID:</span> {cultivationId}
            </div>
            <div>
              <span className="font-medium">Nome:</span> {cultivationName}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <Badge variant="outline" className="ml-2">Ativo</Badge>
            </div>
            <div>
              <span className="font-medium">Sensores:</span> 
              <Badge variant="outline" className="ml-2">
                {isConnected ? "Conectados" : "Desconectados"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 