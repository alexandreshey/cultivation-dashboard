"use client"

interface TimelineChartProps {
  cycleParams: any
}

export function TimelineChart({ cycleParams }: TimelineChartProps) {
  const phases = [
    {
      name: "Vegetativo",
      duration: cycleParams.dias_vegetativo,
      color: "#10B981",
      icon: "🌱",
    },
    {
      name: "Floração",
      duration: cycleParams.dias_floracao,
      color: "#F59E0B",
      icon: "🌸",
    },
    {
      name: "Secagem/Cura",
      duration: cycleParams.dias_secagem_cura,
      color: "#8B5CF6",
      icon: "🍃",
    },
  ]

  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0)

  let cumulativeDays = 0

  return (
    <div className="space-y-6">
      {/* Timeline visualization */}
      <div className="relative">
        <div className="flex h-12 rounded-lg overflow-hidden shadow-sm">
          {phases.map((phase, index) => {
            const width = (phase.duration / totalDuration) * 100
            return (
              <div
                key={index}
                className="flex items-center justify-center text-white font-medium text-sm relative group"
                style={{
                  width: `${width}%`,
                  backgroundColor: phase.color,
                }}
              >
                <span className="flex items-center gap-1">
                  <span>{phase.icon}</span>
                  <span className="hidden sm:inline">{phase.name}</span>
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {phase.name}: {phase.duration} dias
                </div>
              </div>
            )
          })}
        </div>

        {/* Day markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Dia 0</span>
          <span>Dia {totalDuration}</span>
        </div>
      </div>

      {/* Phase details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {phases.map((phase, index) => {
          const startDay = cumulativeDays
          cumulativeDays += phase.duration
          const endDay = cumulativeDays

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }} />
                <span className="font-medium text-gray-900">{phase.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Duração: {phase.duration} dias</div>
                <div>
                  Período: Dia {startDay} - {endDay}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total duration */}
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-lg font-semibold text-green-800">Ciclo Completo: {totalDuration} dias</div>
        <div className="text-sm text-green-600">Aproximadamente {(totalDuration / 30).toFixed(1)} meses</div>
      </div>
    </div>
  )
}
