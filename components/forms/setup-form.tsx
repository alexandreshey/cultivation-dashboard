"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { SetupParams } from "@/app/page"

interface SetupFormProps {
  params: SetupParams
  onChange: (params: SetupParams) => void
}

export function SetupForm({ params, onChange }: SetupFormProps) {
  const updateParam = (key: keyof SetupParams, value: number) => {
    onChange({ ...params, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="area">Área de Cultivo (m²)</Label>
        <div className="px-3">
          <Slider
            value={[params.area_m2]}
            onValueChange={([value]) => updateParam("area_m2", value)}
            max={10}
            min={0.36}
            step={0.1}
            className="w-full"
          />
        </div>
        <div className="text-sm text-gray-500 text-right font-medium">{params.area_m2.toFixed(1)} m²</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="iluminacao">Custo Iluminação (R$)</Label>
        <Input
          type="number"
          value={params.custo_equip_iluminacao}
          onChange={(e) => updateParam("custo_equip_iluminacao", Number(e.target.value))}
          min={500}
          max={10000}
          step={100}
          className="font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenda">Custo Tenda/Estrutura (R$)</Label>
        <Input
          type="number"
          value={params.custo_tenda_estrutura}
          onChange={(e) => updateParam("custo_tenda_estrutura", Number(e.target.value))}
          min={500}
          max={5000}
          step={100}
          className="font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ventilacao">Custo Ventilação (R$)</Label>
        <Input
          type="number"
          value={params.custo_ventilacao_exaustao}
          onChange={(e) => updateParam("custo_ventilacao_exaustao", Number(e.target.value))}
          min={200}
          max={2000}
          step={50}
          className="font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="outros">Outros Equipamentos (R$)</Label>
        <Input
          type="number"
          value={params.custo_outros_equipamentos}
          onChange={(e) => updateParam("custo_outros_equipamentos", Number(e.target.value))}
          min={100}
          max={2000}
          step={50}
          className="font-medium"
        />
      </div>
    </div>
  )
}
