import { CheckCircle, Info } from 'lucide-react'

export default function Toast({ message, type = 'success' }) {
  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 animate-fade-up">
      <div className={`flex items-center gap-2 rounded px-3 py-2.5 shadow-lg
        ${type === 'success' ? 'bg-snap-lime text-black' : 'bg-snap-surface border border-snap-border text-snap-text'}`}>
        {type === 'success'
          ? <CheckCircle size={13} strokeWidth={2.5} />
          : <Info size={13} className="text-snap-cyan" />
        }
        <span className="font-mono text-xs font-bold">{message}</span>
      </div>
    </div>
  )
}
