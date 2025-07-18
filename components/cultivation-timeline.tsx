"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Leaf,
  Flower,
  Droplet,
  CropIcon as Harvest,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
  Bug,
  Sun,
  Droplets,
  Scissors,
  SprayCan,
  Info,
} from "lucide-react"
import type { CultivationEvent, Incident } from "@/lib/mock-data"
import clsx from "clsx"
import React, { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type EventType =
  | "start_veg"
  | "start_flor"
  | "start_cure"
  | "harvest"
  | "incident"
  | "action"
  | "irrigation"
  | "fertilization"
  | "pruning"
  | "pest_control"
  | "environmental_stress"
  | "nutrient_deficiency"
  | "pest"
  | "disease"
  | "other"

const eventIcons: Record<EventType, React.ComponentType<{ className?: string }>> = {
  start_veg: Leaf,
  start_flor: Flower,
  start_cure: Droplet,
  harvest: Harvest,
  incident: AlertTriangle,
  action: CheckCircle,
  irrigation: Droplets,
  fertilization: FlaskConical,
  pruning: Scissors,
  pest_control: SprayCan,
  environmental_stress: Sun,
  nutrient_deficiency: FlaskConical,
  pest: Bug,
  disease: AlertTriangle,
  other: Info,
}

const eventNames: Record<EventType, string> = {
  start_veg: "Início Vegetativo",
  start_flor: "Início Floração",
  start_cure: "Início Cura",
  harvest: "Colheita",
  incident: "Incidente",
  action: "Ação",
  irrigation: "Irrigação",
  fertilization: "Fertilização",
  pruning: "Poda",
  pest_control: "Controle de Praga",
  environmental_stress: "Estresse Ambiental",
  nutrient_deficiency: "Deficiência Nutriente",
  pest: "Praga",
  disease: "Doença",
  other: "Outro",
}

const eventColors: Record<EventType, string> = {
  start_veg: "text-green-500",
  start_flor: "text-orange-500",
  start_cure: "text-purple-500",
  harvest: "text-yellow-500",
  incident: "text-red-500",
  action: "text-blue-500",
  irrigation: "text-blue-400",
  fertilization: "text-purple-500",
  pruning: "text-pink-500",
  pest_control: "text-red-400",
  environmental_stress: "text-yellow-600",
  nutrient_deficiency: "text-orange-600",
  pest: "text-red-500",
  disease: "text-red-700",
  other: "text-gray-500",
}

interface CultivationTimelineProps {
  events: CultivationEvent[]
  incidents: Incident[]
}

interface TimelineEventItemProps {
  event: CultivationEvent
  incident?: Incident | null
}

// Função utilitária para checar se algum valor está fora do ideal
function getEventAlert(details: any) {
  if (!details) return null;
  const ranges = {
    ph: { min: 5.5, max: 6.5 },
    ec: { min: 0.8, max: 2.0 },
    temperatura: { min: 20, max: 28 },
    umidade: { min: 40, max: 70 },
  };
  const alerts: string[] = [];
  if (details.ph !== undefined && details.ph !== "" && !isNaN(Number(details.ph))) {
    const v = Number(details.ph);
    if (v < ranges.ph.min || v > ranges.ph.max) alerts.push(`pH fora do ideal (${v})`);
  }
  if (details.ec !== undefined && details.ec !== "" && !isNaN(Number(details.ec))) {
    const v = Number(details.ec);
    if (v < ranges.ec.min || v > ranges.ec.max) alerts.push(`EC fora do ideal (${v})`);
  }
  if (details.temperatura !== undefined && details.temperatura !== "" && !isNaN(Number(details.temperatura))) {
    const v = Number(details.temperatura);
    if (v < ranges.temperatura.min || v > ranges.temperatura.max) alerts.push(`Temperatura fora do ideal (${v}°C)`);
  }
  if (details.umidade !== undefined && details.umidade !== "" && !isNaN(Number(details.umidade))) {
    const v = Number(details.umidade);
    if (v < ranges.umidade.min || v > ranges.umidade.max) alerts.push(`Umidade fora do ideal (${v}%)`);
  }
  return alerts.length > 0 ? alerts : null;
}

const TimelineEventItem = ({ event, incident }: TimelineEventItemProps) => {
  const Icon = eventIcons[event.type as EventType] || Calendar
  const colorClass = eventColors[event.type as EventType] || "text-gray-500"

  return (
    <div className="mb-6 flex items-start" role="listitem">
      <div className="absolute left-0 flex h-full items-center justify-center" aria-hidden="true">
        <div className="h-full w-px bg-border absolute left-1/2 -translate-x-1/2" />
        <div
          className={clsx(
            "relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background",
            colorClass
          )}
        >
          <Icon className="h-5 w-5" aria-label={event.type} />
        </div>
      </div>
      <div className="ml-8 flex-1">
        <div className="text-sm font-medium text-gray-900">{event.description}</div>
        <time
          className="text-xs text-gray-500"
          dateTime={new Date(event.date).toISOString()}
        >
          {new Date(event.date).toLocaleDateString("pt-BR")}
        </time>
        {event.details && Object.keys(event.details).length > 0 && (
          <div className="mt-1 text-xs text-gray-600">
            {Object.entries(event.details).map(([key, value]) => (
              <span key={key} className="mr-2">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>{" "}
                {value}
              </span>
            ))}
          </div>
        )}
        {incident && (
          <div
            className="mt-2 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-800 dark:text-red-200"
            role="alert"
          >
            <p className="font-semibold">Problema: {incident.description}</p>
            <p>Severidade: {incident.severity}</p>
            <p>Ação Corretiva: {incident.correctiveAction}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function CultivationTimeline({ events, incidents }: CultivationTimelineProps) {
  // Criar um Map para lookup eficiente dos incidentes
  const incidentMap = useMemo(() => {
    const map = new Map<string, Incident>()
    incidents.forEach((inc) => map.set(inc.id, inc))
    return map
  }, [incidents])

  // Estado local para edição dos eventos
  const [localEvents, setLocalEvents] = useState(events.length > 0 ? events : [
    {
      id: "mock1",
      date: "2024-06-01",
      type: "start_veg",
      description: "Início da fase vegetativa",
      details: { ph: 5.8, ec: 1.2, temperatura: 24, umidade: 65 },
    },
    {
      id: "mock2",
      date: "2024-06-10",
      type: "irrigation",
      description: "Irrigação",
      details: { volume: "1L", ph: 6.0, ec: 1.0 },
    },
    {
      id: "mock3",
      date: "2024-06-15",
      type: "fertilization",
      description: "Fertilização",
      details: { produto: "Grow A+B", dosagem: "2ml/L" },
    },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    type: "action",
    description: "",
    details: { ph: "", ec: "", temperatura: "", umidade: "", nivelDano: "", fotos: [] },
  })

  const handleEdit = (event: any) => {
    const eventKey = event.id || event.date
    setEditingId(eventKey)
    setEditData({ ...event })
  }
  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }))
  }
  const handleEditDetailChange = (key: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, details: { ...prev.details, [key]: value } }))
  }
  const handleSave = () => {
    setLocalEvents((prev) => prev.map(ev => {
      const evKey = ev.id || ev.date
      return evKey === editingId ? { ...editData, id: evKey } : ev
    }))
    setEditingId(null)
    setEditData({})
  }
  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }
  const handleRemove = (id: string) => {
    setLocalEvents((prev) => prev.filter(ev => (ev.id || ev.date) !== id) as any)
  }

  const handleAddEvent = () => {
    setLocalEvents(prev => [
      ...prev,
      {
        ...newEvent,
        id: `event_${Date.now()}`,
        details: { ...newEvent.details, fotos: [...(newEvent.details.fotos || [])] }
      }
    ])
    setShowAddModal(false)
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      type: "action",
      description: "",
      details: { ph: "", ec: "", temperatura: "", umidade: "", nivelDano: "", fotos: [] },
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        fotos: Array.from(e.target.files ?? []).map(file => URL.createObjectURL(file))
      }
    }))
  }

  // Ordenar eventos por data
  const sortedEvents = useMemo(() => {
    return [...localEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [localEvents])

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowAddModal(true)} variant="outline">Adicionar Evento</Button>
      </div>
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block text-sm font-medium">Tipo</label>
            <select className="w-full border rounded p-2" value={newEvent.type} onChange={e => setNewEvent((prev: any) => ({ ...prev, type: e.target.value }))}>
              <option value="action">Outro</option>
              <option value="irrigation">Irrigação</option>
              <option value="fertilization">Fertilização</option>
              <option value="pruning">Poda</option>
              <option value="pest">Praga</option>
              <option value="disease">Doença</option>
              <option value="environmental_stress">Estresse Ambiental</option>
            </select>
            <label className="block text-sm font-medium">Descrição</label>
            <Textarea value={newEvent.description} onChange={e => setNewEvent((prev: any) => ({ ...prev, description: e.target.value }))} />
            <label className="block text-sm font-medium">Nível de Dano</label>
            <select className="w-full border rounded p-2" value={newEvent.details.nivelDano} onChange={e => setNewEvent((prev: any) => ({ ...prev, details: { ...prev.details, nivelDano: e.target.value } }))}>
              <option value="">Selecione</option>
              <option value="leve">Leve</option>
              <option value="moderado">Moderado</option>
              <option value="severo">Severo</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">pH</label>
                <Input type="number" value={newEvent.details.ph} onChange={e => setNewEvent((prev: any) => ({ ...prev, details: { ...prev.details, ph: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-sm font-medium">EC</label>
                <Input type="number" value={newEvent.details.ec} onChange={e => setNewEvent((prev: any) => ({ ...prev, details: { ...prev.details, ec: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-sm font-medium">Temperatura (°C)</label>
                <Input type="number" value={newEvent.details.temperatura} onChange={e => setNewEvent((prev: any) => ({ ...prev, details: { ...prev.details, temperatura: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-sm font-medium">Umidade (%)</label>
                <Input type="number" value={newEvent.details.umidade} onChange={e => setNewEvent((prev: any) => ({ ...prev, details: { ...prev.details, umidade: e.target.value } }))} />
              </div>
            </div>
            <label className="block text-sm font-medium">Fotos</label>
            <Input type="file" multiple onChange={handleFileChange} />
            <div className="flex gap-2 flex-wrap">
              {newEvent.details.fotos && newEvent.details.fotos.map((url: string, idx: number) => (
                <img key={idx} src={url} alt="foto" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
            <label className="block text-sm font-medium">Data</label>
            <Input type="date" value={newEvent.date} onChange={e => setNewEvent((prev: any) => ({ ...prev, date: e.target.value }))} />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancelar</Button>
              <Button onClick={handleAddEvent}>Salvar Evento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Timeline do Cultivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-8 overflow-hidden" role="list" aria-label="Eventos do cultivo">
            {sortedEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum evento registrado para este cultivo.</p>
              </div>
            ) : (
              sortedEvents.map((event) => {
                const incidentDetail = (event as any).incidentId ? incidentMap.get((event as any).incidentId) ?? null : null
                return (
                  <div key={event.id ?? event.date} className="mb-6 flex items-center group" role="listitem">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8">
                      {React.createElement(eventIcons[event.type as EventType] || Calendar, { className: "h-5 w-5" })}
                    </div>
                    <div className="ml-4 flex-1">
                      {editingId === (event.id || event.date) ? (
                        <div className="bg-gray-50 p-3 rounded border mb-2">
                          <input type="date" className="mb-2 block w-full" value={editData.date} onChange={e => handleEditChange("date", e.target.value)} />
                          <input type="text" className="mb-2 block w-full" value={editData.description} onChange={e => handleEditChange("description", e.target.value)} placeholder="Descrição" />
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editData.details && Object.entries(editData.details).map(([k, v]) => (
                              <div key={k} className="flex items-center gap-1">
                                <input type="text" className="w-20" value={k} disabled />
                                <input type="text" className="w-24" value={String(v)} onChange={e => handleEditDetailChange(k, e.target.value)} />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={handleSave}>Salvar</button>
                            <button className="px-3 py-1 rounded bg-gray-300" onClick={handleCancel}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">
                                  {eventNames[event.type as EventType] || "Evento"}
                                </span>
                                {(() => {
                                  const alerts = getEventAlert(event.details);
                                  if (alerts) {
                                    return (
                                      <span className="flex items-center gap-1 text-orange-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="text-xs font-semibold">Alerta</span>
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              
                              {(() => {
                                const alerts = getEventAlert(event.details);
                                if (alerts) {
                                  return (
                                    <div className="mb-2 text-xs text-orange-600 font-medium flex flex-wrap gap-1">
                                      {alerts.map((msg, idx) => (
                                        <span key={idx} className="bg-orange-50 rounded px-2 py-0.5 border border-orange-200">{msg}</span>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                              
                              <div className="text-sm text-gray-700 mb-1">
                                {event.description}
                              </div>
                              
                              <time className="text-xs text-gray-500 block mb-1" dateTime={new Date(event.date).toISOString()}>
                                {new Date(event.date).toLocaleDateString("pt-BR")}
                              </time>
                              
                              {event.details && Object.keys(event.details).length > 0 && (
                                <div className="text-xs text-gray-600">
                                  {Object.entries(event.details).map(([key, value]) => (
                                    <span key={key} className="mr-2">
                                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span> {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                              <button className="text-xs text-blue-600 underline" onClick={() => handleEdit(event)}>Editar</button>
                              <button className="text-xs text-red-600 underline" onClick={() => handleRemove(event.id || event.date)}>Remover</button>
                            </div>
                          </div>
                          {incidentDetail && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-800 dark:text-red-200" role="alert">
                              <p className="font-semibold">Problema: {incidentDetail.description}</p>
                              <p>Severidade: {incidentDetail.severity}</p>
                              <p>Ação Corretiva: {incidentDetail.correctiveAction}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
