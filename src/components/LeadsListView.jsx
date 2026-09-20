import { useState } from 'react'
import { Search, Phone, Mail, Globe, MapPin, Trash2, Plus, Tag } from 'lucide-react'

export default function LeadsListView({ leads, onDelete, onAddNew }) {
  const [search, setSearch] = useState('')

  const filtered = leads.filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.name?.toLowerCase().includes(q) ||
      l.category?.toLowerCase().includes(q) ||
      l.address?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col" style={{ maxHeight: 480 }}>
      {/* Stats bar */}
      <div className="flex border-b border-snap-border bg-snap-surface">
        {[
          { label: 'Total', val: leads.length, color: 'text-snap-lime' },
          { label: 'Email', val: leads.filter(l => l.email).length, color: 'text-snap-cyan' },
          { label: 'Phone', val: leads.filter(l => l.phone).length, color: 'text-snap-green' },
          { label: 'Website', val: leads.filter(l => l.website).length, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="flex-1 py-2 text-center border-r border-snap-border last:border-r-0">
            <div className={`font-display text-xl leading-none ${s.color}`}>{s.val}</div>
            <div className="font-mono text-[9px] text-snap-muted uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-snap-border bg-snap-surface">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-snap-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-snap-card border border-snap-border rounded pl-7 pr-3 py-1.5 font-mono text-xs text-snap-text placeholder-snap-muted/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 p-3 space-y-2">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-snap-muted">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-mono text-xs text-center">No leads yet.</p>
            <button
              onClick={onAddNew}
              className="mt-3 flex items-center gap-1.5 font-mono text-xs text-snap-lime hover:underline"
            >
              <Plus size={11} /> Add your first lead
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-snap-muted font-mono text-xs">No matches for "{search}"</div>
        ) : (
          filtered.map((lead, i) => (
            <LeadCard key={lead.id} lead={lead} index={leads.indexOf(lead) + 1} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}

function LeadCard({ lead, index, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-snap-card border border-snap-border rounded overflow-hidden hover:border-snap-lime/30 transition-colors animate-slide-in">
      <div
        className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Index number */}
        <span className="font-mono text-[9px] text-snap-muted bg-snap-surface px-1.5 py-0.5 rounded-sm mt-0.5 flex-shrink-0">
          #{index}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body font-semibold text-sm text-snap-text truncate">{lead.name}</span>
            {lead.category && (
              <span className="flex items-center gap-1 font-mono text-[9px] text-snap-cyan bg-snap-cyan/10 px-1.5 py-0.5 rounded-sm">
                <Tag size={8} /> {lead.category}
              </span>
            )}
          </div>

          {/* Quick info row */}
          <div className="flex flex-wrap gap-2 mt-1">
            {lead.phone && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-snap-muted">
                <Phone size={9} className="text-snap-green" />{lead.phone}
              </span>
            )}
            {lead.email && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-snap-muted truncate max-w-[120px]">
                <Mail size={9} className="text-snap-cyan" />{lead.email}
              </span>
            )}
            {!lead.phone && !lead.email && lead.website && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-snap-muted">
                <Globe size={9} className="text-purple-400" />{lead.website}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onDelete(lead.id) }}
          className="text-snap-muted hover:text-snap-red transition-colors flex-shrink-0 mt-0.5"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-snap-border px-3 py-2.5 space-y-1.5 bg-snap-surface/50">
          {lead.website && (
            <div className="flex items-center gap-2">
              <Globe size={10} className="text-purple-400 flex-shrink-0" />
              <a
                href={`https://${lead.website}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] text-purple-400 hover:underline"
                onClick={e => e.stopPropagation()}
              >
                {lead.website}
              </a>
            </div>
          )}
          {lead.address && (
            <div className="flex items-start gap-2">
              <MapPin size={10} className="text-snap-red flex-shrink-0 mt-0.5" />
              <span className="font-mono text-[10px] text-snap-muted">{lead.address}</span>
            </div>
          )}
          {lead.notes && (
            <div className="border-l-2 border-snap-border pl-2 mt-1">
              <p className="font-mono text-[10px] text-snap-muted/70 leading-relaxed">{lead.notes}</p>
            </div>
          )}
          <div className="font-mono text-[9px] text-snap-muted/40 pt-1">Added {lead.addedAt}</div>
        </div>
      )}
    </div>
  )
}
