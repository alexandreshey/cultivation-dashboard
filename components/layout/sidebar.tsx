"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calculator,
  DollarSign,
  FileText,
  Settings,
  Leaf,
  GitCompare,
  TrendingUp,
  History,
  Menu,
  ChevronLeft,
  ChevronRight,
  Brain,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3 },
  { id: "simulator", name: "Simulador", icon: Calculator },
  { id: "costs", name: "Custos", icon: DollarSign },
  { id: "comparison", name: "Comparação", icon: GitCompare },
  { id: "analytics", name: "Analytics", icon: TrendingUp },
  { id: "reports", name: "Relatórios", icon: FileText },
  { id: "history", name: "Histórico", icon: History },
  { id: "anomalies", name: "Alertas IA", icon: Brain },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const handleLogoClick = () => {
    onSectionChange("dashboard")
    if (isMobile) {
      closeSidebar()
    }
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Header com toggle */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {isOpen ? (
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Ir para página inicial"
              >
                <div className="p-2 bg-green-600 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Cultivo Indoor</h1>
                  <p className="text-sm text-muted-foreground">Analytics</p>
                </div>
              </button>
            ) : (
              <button
                onClick={handleLogoClick}
                className="flex justify-center hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Ir para página inicial"
              >
                <div className="p-2 bg-green-600 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </button>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" role="navigation" aria-label="Navegação principal">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSectionChange(item.id)
                      if (isMobile) {
                        closeSidebar()
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group relative",
                      activeSection === item.id
                        ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    title={!isOpen ? item.name : undefined}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && <span>{item.name}</span>}
                    
                    {/* Tooltip para quando fechado */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Settings at bottom */}
        <div className="pt-0 pb-2 border-t border-border bg-card">
          <button
            onClick={() => {
              onSectionChange("settings")
              if (isMobile) {
                closeSidebar()
              }
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group relative",
              activeSection === "settings"
                ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            title={!isOpen ? "Configurações" : undefined}
            aria-current={activeSection === "settings" ? "page" : undefined}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span>Configurações</span>}
            
            {/* Tooltip para quando fechado */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Configurações
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Botão de toggle para mobile quando sidebar está fechada */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Abrir menu de navegação"
          aria-expanded={false}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </>
  )
}
