import { useState } from 'react'
import { Tv, HelpCircle, MessageSquarePlus, Settings, Download, ChevronRight, Trash2, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePwaInstall } from '../hooks/usePwaInstall'
import { useTheme } from '../hooks/useTheme'

const LINKS = [
  {
    to: '/scoreboard',
    label: 'Marcador rápido',
    desc: 'Partido local sin códigos ni conexión',
    icon: Tv,
  },
  {
    to: '/help',
    label: 'Guía para padres',
    desc: 'Cómo seguir y anotar partidos',
    icon: HelpCircle,
  },
  {
    to: '/suggestions',
    label: 'Sugerencias',
    desc: 'Enviar una idea o mejora',
    icon: MessageSquarePlus,
  },
] as const

export function MoreTab() {
  const { state: installState, triggerInstall } = usePwaInstall()
  const { theme, toggle } = useTheme()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  function handleClearCache() {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/'
  }

  return (
    <div className="flex flex-col p-6 gap-3 max-w-sm mx-auto">
      <h1 className="text-xl font-bold text-hbl-text mb-2">Más</h1>

      {LINKS.map(({ to, label, desc, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hbl-surface border border-hbl-border hover:border-hbl-accent/40 transition-colors"
        >
          <Icon className="w-5 h-5 text-hbl-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-hbl-text">{label}</p>
            <p className="text-xs text-hbl-text-muted">{desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-hbl-text-muted shrink-0" />
        </Link>
      ))}

      {/* Install prompt — only shown when PWA is not installed */}
      {installState === 'android-prompt' && (
        <button
          onClick={triggerInstall}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hbl-surface border border-hbl-accent/40 hover:border-hbl-accent transition-colors text-left"
        >
          <Download className="w-5 h-5 text-hbl-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-hbl-text">Instalar app</p>
            <p className="text-xs text-hbl-text-muted">Añadir a pantalla de inicio</p>
          </div>
          <ChevronRight className="w-4 h-4 text-hbl-text-muted shrink-0" />
        </button>
      )}

      {(installState === 'ios-tip' || installState === 'android-tip' || installState === 'desktop-tip') && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hbl-surface border border-hbl-border">
          <Download className="w-5 h-5 text-hbl-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-hbl-text">Instalar app</p>
            <p className="text-xs text-hbl-text-muted">
              {installState === 'ios-tip'
                ? 'Pulsa el botón Compartir  y "Añadir a pantalla de inicio"'
                : installState === 'android-tip'
                ? 'Abre el menú del navegador y toca "Instalar aplicación"'
                : 'Abre el menú del navegador y busca "Instalar"'}
            </p>
          </div>
        </div>
      )}

      {/* Theme toggle */}
      <button
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hbl-surface border border-hbl-border hover:border-hbl-accent/40 transition-colors text-left"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-hbl-accent shrink-0" />
        ) : (
          <Moon className="w-5 h-5 text-hbl-accent shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-hbl-text">
            {theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
          </p>
          <p className="text-xs text-hbl-text-muted">
            {theme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
          </p>
        </div>
      </button>

      {/* Admin access */}
      <Link
        to="/admin/partidos"
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hbl-surface border border-hbl-border hover:border-hbl-accent/40 transition-colors"
      >
        <Settings className="w-5 h-5 text-hbl-accent shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-hbl-text">Administración</p>
          <p className="text-xs text-hbl-text-muted">Acceso al panel de gestión</p>
        </div>
        <ChevronRight className="w-4 h-4 text-hbl-text-muted shrink-0" />
      </Link>

      {/* Cache clear */}
      <button
        onClick={() => setShowClearConfirm(true)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hbl-surface border border-hbl-border hover:border-red-400/40 transition-colors text-left"
      >
        <Trash2 className="w-5 h-5 text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-hbl-text">Limpiar caché</p>
          <p className="text-xs text-hbl-text-muted">Borrar datos locales y reiniciar</p>
        </div>
      </button>

      <p className="text-center text-xs text-hbl-text-muted mt-4">
        Un proyecto de Civeira Lab
      </p>

      {/* Confirmation dialog */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-cache-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
        >
          <div className="bg-hbl-surface border border-hbl-border rounded-2xl p-6 max-w-xs w-full flex flex-col gap-4">
            <h2 id="clear-cache-title" className="text-base font-bold text-hbl-text">¿Limpiar caché?</h2>
            <p className="text-sm text-hbl-text-muted">Se cerrarán tus sesiones activas y la app se reiniciará.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-hbl-border text-sm text-hbl-text hover:border-hbl-accent/40 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearCache}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500/10 border border-red-400/40 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
