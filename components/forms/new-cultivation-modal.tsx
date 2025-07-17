import type { FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewCultivationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  values: {
    name: string
    seedStrain: string
    startDate: string
    status: "active" | "completed" | "archived"
    yield_g: string
  }
  onChange: (field: string, value: string) => void
  errors?: { name?: string; seedStrain?: string; startDate?: string }
}

export function NewCultivationModal({ open, onClose, onSubmit, values, onChange, errors }: NewCultivationModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Novo Cultivo</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Cultivo
              {errors?.name && <span className="text-red-600 text-xs ml-2">{errors.name}</span>}
            </label>
            <Input placeholder="Ex: Cultivo Primavera 2024" value={values.name} onChange={e => onChange("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Variedade/Strain
              {errors?.seedStrain && <span className="text-red-600 text-xs ml-2">{errors.seedStrain}</span>}
            </label>
            <Input placeholder="Ex: OG Kush" value={values.seedStrain} onChange={e => onChange("seedStrain", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Início
              {errors?.startDate && <span className="text-red-600 text-xs ml-2">{errors.startDate}</span>}
            </label>
            <Input type="date" value={values.startDate} onChange={e => onChange("startDate", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={values.status} onValueChange={v => onChange("status", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!values.name || !values.seedStrain || !values.startDate}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 