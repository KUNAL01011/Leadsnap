# 🟡 LeadSnap – Chrome Extension

**Snap business info from Google Maps → Build your lead list → Export to CSV or HTML**

---

## 📁 Folder Structure

```
leadsnap-extension/
├── manifest.json          ← Extension config (MV3)
├── background/
│   └── service_worker.js  ← Background worker
├── content/
│   └── content_script.js  ← Scrapes Google Maps DOM
├── popup/
│   ├── index.html         ← Extension popup UI
│   └── app.jsx            ← React app (Tailwind + CDN)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## 🚀 How to Install in Chrome (5 Steps)

1. **Open Chrome** and go to: `chrome://extensions`

2. **Enable Developer Mode** — toggle in the top-right corner

3. Click **"Load unpacked"** button (top-left)

4. **Select this folder**: `leadsnap-extension`

5. ✅ **Done!** The LeadSnap icon appears in your toolbar

> 💡 **Pin it**: Click the puzzle piece icon in Chrome toolbar → pin LeadSnap so it's always visible

---

## 🎯 How to Use

1. Open **Google Maps** in Chrome
2. Search for and open any **business page** (restaurant, salon, etc.)
3. Click the **LeadSnap icon** in your toolbar
4. Hit **"Snap This Page"** — info auto-fills from the page
5. Review the details, add notes
6. Click **"Add Lead"** — it's saved!
7. Repeat for the next business — each one is added to your growing list
8. Go to the **Export tab** → download as **CSV** or **HTML (printable)**

---

## 📤 Export Options

| Format | Use For |
|--------|---------|
| **CSV** | Open in Excel, Google Sheets, Numbers |
| **HTML** | Open in browser → Ctrl+P → Print or Save as PDF |

---

## 🔧 Tech Stack

- **React 18** (via CDN) — popup UI
- **Tailwind CSS** (via CDN) — styling
- **Chrome Extensions Manifest V3** — modern extension API
- **chrome.storage.local** — persistent lead storage
- **Content Scripts** — DOM scraping from Google Maps

---

## 🛠 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Snap This Page" doesn't fill data | Make sure you're on a Google Maps **business detail page** (not just the map) |
| Extension not showing | Re-load it in `chrome://extensions` → click the refresh icon |
| Data not saving | Check that `chrome.storage` permission is granted |

---

## 📋 Data Captured

- Business Name
- Phone Number  
- Email Address (if visible on page)
- Website URL
- Street Address
- Category / Type
- Star Rating
- Auto-generated notes (rating, reviews, price range, services)

---

*Built with Kunamix Digital Solutions*
