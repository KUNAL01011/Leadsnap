import { FileText, Code2, Trash2, CheckCircle } from 'lucide-react'

export default function ExportView({ leads, onClearAll, showToast }) {

  const exportCSV = () => {
    if (!leads.length) { showToast('No leads to export', 'info'); return }
    const headers = ['#', 'Business Name', 'Phone', 'Email', 'Website', 'Address', 'Category', 'Notes', 'Added']
    const rows = leads.map((l, i) =>
      [i + 1, l.name, l.phone, l.email, l.website, l.address, l.category, l.notes, l.addedAt]
        .map(v => `"${(v || '').replace(/"/g, '""')}"`)
    )
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    download('leadsnap_export.csv', csv, 'text/csv')
    showToast('CSV downloaded!')
  }

  const exportHTML = () => {
    if (!leads.length) { showToast('No leads to export', 'info'); return }

    const rows = leads.map((l, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${esc(l.name)}</strong><br><small>${esc(l.category || '')}</small></td>
        <td>${l.phone ? `<a href="tel:${esc(l.phone)}">${esc(l.phone)}</a>` : '—'}</td>
        <td>${l.email ? `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : '—'}</td>
        <td>${l.website ? `<a href="https://${esc(l.website)}" target="_blank">${esc(l.website)}</a>` : '—'}</td>
        <td>${esc(l.address || '—')}</td>
        <td>${esc(l.notes || '—')}</td>
        <td>${esc(l.addedAt)}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LeadSnap Export – ${new Date().toLocaleDateString()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; padding: 40px; background: #fafafa; color: #111; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    h1 { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
    h1 span { color: #5a9e00; }
    .meta { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #888; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #111; color: #c8ff00; text-align: left; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
    td { padding: 10px 14px; border-bottom: 1px solid #e8e8e8; vertical-align: top; line-height: 1.5; }
    td:first-child { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #aaa; width: 32px; }
    tr:hover td { background: #f0f0f0; }
    a { color: #0055cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    small { color: #888; font-size: 11px; }
    .no-print { display: block; margin-bottom: 16px; }
    @media print { .no-print { display: none; } body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Lead<span>Snap</span></h1>
  </div>
  <div class="meta">
    Exported ${new Date().toLocaleString()} · ${leads.length} leads total
  </div>
  <div class="no-print">
    <button onclick="window.print()" style="background:#111;color:#c8ff00;border:none;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;cursor:pointer;border-radius:3px;">🖨 PRINT / SAVE AS PDF</button>
  </div>
  <table>
    <tr>
      <th>#</th><th>Business</th><th>Phone</th><th>Email</th><th>Website</th><th>Address</th><th>Notes</th><th>Added</th>
    </tr>
    ${rows}
  </table>
</body>
</html>`
    download('leadsnap_export.html', html, 'text/html')
    showToast('HTML ready — open & press Ctrl+P to print!')
  }

  const esc = str => str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

  const download = (filename, content, type) => {
    const blob = new Blob([content], { type })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
  }

  const stats = {
    total: leads.length,
    withEmail: leads.filter(l => l.email).length,
    withPhone: leads.filter(l => l.phone).length,
    withWebsite: leads.filter(l => l.website).length,
    withAddress: leads.filter(l => l.address).length,
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 480 }}>

      {/* Summary */}
      <div className="bg-snap-card border border-snap-border rounded p-3">
        <p className="font-mono text-[10px] text-snap-muted uppercase tracking-widest mb-2">Export Summary</p>
        <div className="space-y-1.5">
          {[
            { label: 'Total leads', val: stats.total, color: 'text-snap-lime' },
            { label: 'With email address', val: stats.withEmail, color: 'text-snap-cyan' },
            { label: 'With phone number', val: stats.withPhone, color: 'text-snap-green' },
            { label: 'With website', val: stats.withWebsite, color: 'text-purple-400' },
            { label: 'With address', val: stats.withAddress, color: 'text-snap-red' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-mono text-xs text-snap-muted">{s.label}</span>
              <span className={`font-display text-lg leading-none ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export options */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] text-snap-muted uppercase tracking-widest">Export Format</p>

        {/* CSV */}
        <button
          onClick={exportCSV}
          disabled={!leads.length}
          className="w-full flex items-center gap-3 bg-snap-card border border-snap-border rounded p-3.5 hover:border-snap-lime/50 hover:bg-snap-card/80 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="w-9 h-9 bg-snap-lime/10 rounded flex items-center justify-center group-hover:bg-snap-lime/20 transition-colors">
            <FileText size={18} className="text-snap-lime" />
          </div>
          <div className="text-left">
            <p className="font-mono text-xs font-bold text-snap-text">Download CSV</p>
            <p className="font-body text-xs text-snap-muted mt-0.5">Open in Excel, Google Sheets, Numbers</p>
          </div>
          <span className="ml-auto font-mono text-[10px] text-snap-lime bg-snap-lime/10 px-2 py-1 rounded-sm">.CSV</span>
        </button>

        {/* HTML */}
        <button
          onClick={exportHTML}
          disabled={!leads.length}
          className="w-full flex items-center gap-3 bg-snap-card border border-snap-border rounded p-3.5 hover:border-snap-cyan/50 hover:bg-snap-card/80 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="w-9 h-9 bg-snap-cyan/10 rounded flex items-center justify-center group-hover:bg-snap-cyan/20 transition-colors">
            <Code2 size={18} className="text-snap-cyan" />
          </div>
          <div className="text-left">
            <p className="font-mono text-xs font-bold text-snap-text">Download HTML Report</p>
            <p className="font-body text-xs text-snap-muted mt-0.5">Open in browser → Ctrl+P to print / PDF</p>
          </div>
          <span className="ml-auto font-mono text-[10px] text-snap-cyan bg-snap-cyan/10 px-2 py-1 rounded-sm">.HTML</span>
        </button>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 bg-snap-lime/5 border border-snap-lime/20 rounded p-3">
        <CheckCircle size={13} className="text-snap-lime flex-shrink-0 mt-0.5" />
        <p className="font-mono text-[10px] text-snap-lime/80 leading-relaxed">
          Your data is stored locally in this browser — it never leaves your device.
        </p>
      </div>

      {/* Clear all */}
      {leads.length > 0 && (
        <button
          onClick={() => {
            if (window.confirm(`Delete all ${leads.length} leads? This cannot be undone.`)) {
              onClearAll()
            }
          }}
          className="w-full flex items-center justify-center gap-2 border border-snap-red/30 text-snap-red font-mono text-xs py-2.5 rounded hover:bg-snap-red/10 transition-colors"
        >
          <Trash2 size={12} /> CLEAR ALL LEADS
        </button>
      )}
    </div>
  )
}
