import type { AgronomicDataPoint, CultivationSummary } from "./mock-data"

// Interface para definir os parâmetros que podem ser monitorados
export interface MonitoringParameter {
  name: string
  key: keyof AgronomicDataPoint
  unit: string
  minValue: number
  maxValue: number
  criticalThreshold: number // Percentual de desvio considerado crítico
  warningThreshold: number // Percentual de desvio para alerta
}

// Interface para o padrão normal de um cultivo
export interface CultivationPattern {
  cultivationId: string
  strain: string
  phase: "vegetative" | "flowering" | "curing"
  parameters: Record<string, ParameterBaseline>
  successRate: number // Taxa de sucesso baseada em cultivos anteriores
  sampleSize: number // Número de amostras usadas para calcular o padrão
}

// Interface para a linha base de um parâmetro
export interface ParameterBaseline {
  mean: number
  standardDeviation: number
  min: number
  max: number
  optimalRange: {
    min: number
    max: number
  }
}

// Interface para uma anomalia detectada
export interface DetectedAnomaly {
  id: string
  cultivationId: string
  cultivationName: string
  parameter: string
  currentValue: number
  expectedValue: number
  deviationPercent: number
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: string
  phase: string
  strain: string
  actionable: boolean
  suggestedAction?: string
}

// Parâmetros que podem ser monitorados
export const MONITORING_PARAMETERS: MonitoringParameter[] = [
  {
    name: "pH",
    key: "ph",
    unit: "",
    minValue: 5.5,
    maxValue: 6.5,
    criticalThreshold: 15, // 15% de desvio
    warningThreshold: 10, // 10% de desvio
  },
  {
    name: "Condutividade Elétrica (EC)",
    key: "ec",
    unit: "mS/cm",
    minValue: 0.5,
    maxValue: 2.5,
    criticalThreshold: 20,
    warningThreshold: 15,
  },
  {
    name: "Temperatura",
    key: "temperature_c",
    unit: "°C",
    minValue: 20,
    maxValue: 28,
    criticalThreshold: 15,
    warningThreshold: 10,
  },
  {
    name: "Umidade",
    key: "humidity_percent",
    unit: "%",
    minValue: 40,
    maxValue: 70,
    criticalThreshold: 25,
    warningThreshold: 15,
  },
]

// Classe principal para detecção de anomalias
export class AnomalyDetector {
  private patterns: Map<string, CultivationPattern> = new Map()

  // Aprende padrões de cultivos bem-sucedidos
  learnPatterns(successfulCultivations: CultivationSummary[], agronomicData: AgronomicDataPoint[][]) {
    successfulCultivations.forEach((cultivation, index) => {
      if (cultivation.yield_g > 0 && cultivation.profit_brl > 0) {
        const data = agronomicData[index] || []
        this.analyzeCultivationPattern(cultivation, data)
      }
    })
  }

  // Analisa o padrão de um cultivo específico
  private analyzeCultivationPattern(cultivation: CultivationSummary, data: AgronomicDataPoint[]) {
    const patternKey = `${cultivation.seedStrain}_${this.determinePhase(cultivation)}`
    
    const parameterBaselines: Record<string, ParameterBaseline> = {}
    
    MONITORING_PARAMETERS.forEach(param => {
      const values = data.map(d => d[param.key] as number).filter(v => !isNaN(v))
      
      if (values.length > 0) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
        const standardDeviation = Math.sqrt(variance)
        
        parameterBaselines[param.name] = {
          mean,
          standardDeviation,
          min: Math.min(...values),
          max: Math.max(...values),
          optimalRange: {
            min: mean - standardDeviation,
            max: mean + standardDeviation,
          }
        }
      }
    })

    const pattern: CultivationPattern = {
      cultivationId: cultivation.id,
      strain: cultivation.seedStrain,
      phase: this.determinePhase(cultivation),
      parameters: parameterBaselines,
      successRate: this.calculateSuccessRate(cultivation),
      sampleSize: data.length,
    }

    this.patterns.set(patternKey, pattern)
  }

  // Determina a fase do cultivo
  private determinePhase(cultivation: CultivationSummary): "vegetative" | "flowering" | "curing" {
    const daysSinceStart = Math.floor(
      (new Date().getTime() - new Date(cultivation.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    // Assumindo 60 dias vegetativo, 70 dias floração
    if (daysSinceStart <= 60) return "vegetative"
    if (daysSinceStart <= 130) return "flowering"
    return "curing"
  }

  // Calcula taxa de sucesso baseada no rendimento e lucro
  private calculateSuccessRate(cultivation: CultivationSummary): number {
    const yieldScore = Math.min(cultivation.yield_g / 500, 1) // Normalizado para 500g
    const profitScore = Math.min(cultivation.profit_brl / 15000, 1) // Normalizado para R$ 15k
    return (yieldScore + profitScore) / 2
  }

  // Detecta anomalias em um cultivo atual
  detectAnomalies(
    currentCultivation: CultivationSummary,
    currentData: AgronomicDataPoint[]
  ): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = []
    const currentPhase = this.determinePhase(currentCultivation)
    const patternKey = `${currentCultivation.seedStrain}_${currentPhase}`
    const pattern = this.patterns.get(patternKey)

    if (!pattern) {
      // Se não há padrão específico, usar padrões gerais
      return this.detectGeneralAnomalies(currentCultivation, currentData)
    }

    // Verificar cada parâmetro monitorado
    MONITORING_PARAMETERS.forEach(param => {
      const latestData = currentData[currentData.length - 1]
      if (!latestData) return

      const currentValue = latestData[param.key] as number
      if (isNaN(currentValue)) return

      const baseline = pattern.parameters[param.name]
      if (!baseline) return

      const deviation = Math.abs(currentValue - baseline.mean)
      const deviationPercent = (deviation / baseline.mean) * 100

      if (deviationPercent >= param.warningThreshold) {
        const severity = this.determineSeverity(deviationPercent, param)
        const message = this.generateAnomalyMessage(
          param.name,
          currentValue,
          baseline.mean,
          deviationPercent,
          currentCultivation.name,
          currentPhase
        )

        anomalies.push({
          id: `anomaly_${currentCultivation.id}_${param.key}_${Date.now()}`,
          cultivationId: currentCultivation.id,
          cultivationName: currentCultivation.name,
          parameter: param.name,
          currentValue,
          expectedValue: baseline.mean,
          deviationPercent,
          severity,
          message,
          timestamp: new Date().toISOString(),
          phase: currentPhase,
          strain: currentCultivation.seedStrain,
          actionable: true,
          suggestedAction: this.suggestCorrectiveAction(param.name, currentValue, baseline.mean, currentPhase),
        })
      }
    })

    return anomalies
  }

  // Detecta anomalias usando padrões gerais quando não há dados específicos
  private detectGeneralAnomalies(
    cultivation: CultivationSummary,
    data: AgronomicDataPoint[]
  ): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = []
    const latestData = data[data.length - 1]
    
    if (!latestData) return anomalies

    MONITORING_PARAMETERS.forEach(param => {
      const currentValue = latestData[param.key] as number
      if (isNaN(currentValue)) return

      const expectedValue = (param.minValue + param.maxValue) / 2
      const deviation = Math.abs(currentValue - expectedValue)
      const deviationPercent = (deviation / expectedValue) * 100

      if (deviationPercent >= param.warningThreshold) {
        const severity = this.determineSeverity(deviationPercent, param)
        const message = this.generateAnomalyMessage(
          param.name,
          currentValue,
          expectedValue,
          deviationPercent,
          cultivation.name,
          "geral"
        )

        anomalies.push({
          id: `anomaly_${cultivation.id}_${param.key}_${Date.now()}`,
          cultivationId: cultivation.id,
          cultivationName: cultivation.name,
          parameter: param.name,
          currentValue,
          expectedValue,
          deviationPercent,
          severity,
          message,
          timestamp: new Date().toISOString(),
          phase: "geral",
          strain: cultivation.seedStrain,
          actionable: true,
          suggestedAction: this.suggestCorrectiveAction(param.name, currentValue, expectedValue, "geral"),
        })
      }
    })

    return anomalies
  }

  // Determina a severidade da anomalia
  private determineSeverity(deviationPercent: number, param: MonitoringParameter): "low" | "medium" | "high" | "critical" {
    if (deviationPercent >= param.criticalThreshold) return "critical"
    if (deviationPercent >= param.warningThreshold * 1.5) return "high"
    if (deviationPercent >= param.warningThreshold) return "medium"
    return "low"
  }

  // Gera mensagem de anomalia personalizada
  private generateAnomalyMessage(
    parameter: string,
    currentValue: number,
    expectedValue: number,
    deviationPercent: number,
    cultivationName: string,
    phase: string
  ): string {
    const direction = currentValue > expectedValue ? "acima" : "abaixo"
    const phaseText = phase === "vegetative" ? "vegetativo" : 
                     phase === "flowering" ? "floração" : 
                     phase === "curing" ? "cura" : "geral"

    return `Atenção: seu ${parameter} está ${deviationPercent.toFixed(1)}% ${direction} do ideal para esta fase (${phaseText}), comparado a seus ciclos de sucesso.`
  }

  // Sugere ação corretiva
  private suggestCorrectiveAction(
    parameter: string,
    currentValue: number,
    expectedValue: number,
    phase: string
  ): string {
    const direction = currentValue > expectedValue ? "diminuir" : "aumentar"
    
    switch (parameter) {
      case "pH":
        return direction === "diminuir" 
          ? "Adicione pH down ou use água com pH mais baixo"
          : "Adicione pH up ou use água com pH mais alto"
      
      case "Condutividade Elétrica (EC)":
        return direction === "diminuir"
          ? "Reduza a concentração de nutrientes na solução"
          : "Aumente a concentração de nutrientes na solução"
      
      case "Temperatura":
        return direction === "diminuir"
          ? "Aumente a ventilação ou reduza a potência das lâmpadas"
          : "Reduza a ventilação ou aumente a potência das lâmpadas"
      
      case "Umidade":
        return direction === "diminuir"
          ? "Aumente a ventilação ou use um desumidificador"
          : "Reduza a ventilação ou use um umidificador"
      
      default:
        return `Ajuste o ${parameter} para valores mais próximos do ideal`
    }
  }

  // Obtém padrões aprendidos
  getPatterns(): CultivationPattern[] {
    return Array.from(this.patterns.values())
  }

  // Verifica se há dados suficientes para análise
  hasEnoughData(cultivation: CultivationSummary): boolean {
    const phase = this.determinePhase(cultivation)
    const patternKey = `${cultivation.seedStrain}_${phase}`
    const pattern = this.patterns.get(patternKey)
    
    return pattern ? pattern.sampleSize >= 5 : false
  }
} 