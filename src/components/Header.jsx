import { Crosshair, List, Download, Zap } from 'lucide-react'

export default function Header({ view, setView, leadsCount, onSnap }) {
  const tabs = [
    { id: 'add', label: 'Add Lead', icon: Zap },
    { id: 'list', label: `Leads${leadsCount > 0 ? ` (${leadsCount})` : ''}`, icon: List },
    { id: 'export', label: 'Export', icon: Download },
  ]

  return (
    <div className="bg-snap-surface border-b border-snap-border">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-snap-lime rounded-sm flex items-center justify-center">
            <Crosshair size={14} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl text-snap-text tracking-wider leading-none">
            LEAD<span className="text-snap-lime">SNAP</span>
          </span>
        </div>

        {/* Snap button */}
        <button
          onClick={onSnap}
          className="flex items-center gap-1.5 bg-snap-lime text-black font-mono text-xs font-bold px-3 py-1.5 rounded-sm hover:bg-yellow-300 active:scale-95 transition-all duration-150"
        >
          <Crosshair size={12} strokeWidth={2.5} />
          SNAP PAGE
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex border-t border-snap-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono text-xs font-medium transition-all duration-150
              ${view === id
                ? 'text-snap-lime border-b-2 border-snap-lime bg-snap-card'
                : 'text-snap-muted border-b-2 border-transparent hover:text-snap-text hover:bg-snap-card/50'
              }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
