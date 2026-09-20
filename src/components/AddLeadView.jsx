import { useState, useEffect } from 'react'
import { Sparkles, Plus } from 'lucide-react'

const EMPTY = { name: '', phone: '', email: '', website: '', address: '', category: '', notes: '' }

export default function AddLeadView({ onAdd, prefill, onClearPrefill }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [isSnapped, setIsSnapped] = useState(false)

  useEffect(() => {
    if (prefill) {
      setForm({ ...EMPTY, ...prefill })
      setIsSnapped(true)
      onClearPrefill()
    }
  }, [prefill])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onAdd({ ...form })
    setForm(EMPTY)
    setErrors({})
    setIsSnapped(false)
  }

  const handleClear = () => {
    setForm(EMPTY)
    setErrors({})
    setIsSnapped(false)
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
      <div className="p-4 space-y-3">
        {/* Snapped banner */}
        {isSnapped && (
          <div className="flex items-center gap-2 bg-snap-lime/10 border border-snap-lime/30 rounded px-3 py-2 animate-fade-up">
            <Sparkles size={13} className="text-snap-lime flex-shrink-0" />
            <span className="font-mono text-xs text-snap-lime">Page data auto-filled — review & save</span>
          </div>
        )}

        {/* Business Name */}
        <div>
          <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">
            Business Name <span className="text-snap-red">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Texas Restaurant"
            className={`w-full bg-snap-card border rounded px-3 py-2 font-body text-sm text-snap-text placeholder-snap-muted/50
              ${errors.name ? 'border-snap-red' : 'border-snap-border'} transition-colors`}
          />
          {errors.name && <p className="font-mono text-[10px] text-snap-red mt-1">{errors.name}</p>}
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+1 469-663-7703"
              className="w-full bg-snap-card border border-snap-border rounded px-3 py-2 font-mono text-xs text-snap-text placeholder-snap-muted/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="hello@biz.com"
              className="w-full bg-snap-card border border-snap-border rounded px-3 py-2 font-mono text-xs text-snap-text placeholder-snap-muted/50 transition-colors"
            />
          </div>
        </div>

        {/* Website + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">Website</label>
            <input
              type="text"
              value={form.website}
              onChange={e => set('website', e.target.value)}
              placeholder="example.com"
              className="w-full bg-snap-card border border-snap-border rounded px-3 py-2 font-mono text-xs text-snap-text placeholder-snap-muted/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              placeholder="Restaurant"
              className="w-full bg-snap-card border border-snap-border rounded px-3 py-2 font-mono text-xs text-snap-text placeholder-snap-muted/50 transition-colors"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="2300 Midway Rd, Plano, TX 75093"
            className="w-full bg-snap-card border border-snap-border rounded px-3 py-2 font-body text-sm text-snap-text placeholder-snap-muted/50 transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-mono text-[10px] tracking-widest text-snap-muted uppercase mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="4.4★ · 291 reviews · LGBTQ+ friendly · Halal options..."
            rows={3}
            className="w-full bg-snap-card border border-snap-border rounded px-3 py-2 font-body text-sm text-snap-text placeholder-snap-muted/50 transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 bg-snap-lime text-black font-mono text-xs font-bold py-2.5 rounded-sm hover:bg-yellow-300 active:scale-[0.98] transition-all duration-150"
          >
            <Plus size={14} strokeWidth={2.5} />
            ADD LEAD
          </button>
          <button
            onClick={handleClear}
            className="px-4 bg-snap-card border border-snap-border text-snap-muted font-mono text-xs hover:text-snap-text hover:border-snap-text/30 transition-all duration-150 rounded-sm"
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  )
}
