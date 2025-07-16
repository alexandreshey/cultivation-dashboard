import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface AgronomicDataPoint {
  date: string // YYYY-MM-DD
  ph: number
  ec: number
  temperature_c: number
}

interface AgronomicLineChartProps {
  data: AgronomicDataPoint[]
}

export function AgronomicLineChart({ data }: AgronomicLineChartProps) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 32, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" label={{ value: 'pH / EC', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 12 }} domain={[0, 'auto']} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight', fontSize: 12 }} tick={{ fontSize: 12 }} domain={[0, 'auto']} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#22c55e" name="pH" dot={false} strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="ec" stroke="#3b82f6" name="EC" dot={false} strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="temperature_c" stroke="#f59e42" name="Temperatura (°C)" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 