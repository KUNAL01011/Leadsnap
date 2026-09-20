/**
 * LeadSnap Content Script
 * Runs on Google Maps pages and scrapes visible business info.
 * Called from popup via chrome.tabs.sendMessage.
 */

function scrapeGoogleMaps() {
  const result = {
    name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    category: '',
    rating: '',
    notes: '',
  }

  try {
    // Business name — the main heading
    const nameEl =
      document.querySelector('h1.DUwDvf') ||
      document.querySelector('[data-attrid="title"] span') ||
      document.querySelector('h1')
    if (nameEl) result.name = nameEl.innerText.trim()

    // Category (shown under name)
    const catEl = document.querySelector('button[jsaction*="category"]') ||
      document.querySelector('.DkEaL')
    if (catEl) result.category = catEl.innerText.trim()

    // Rating
    const ratingEl = document.querySelector('[aria-label*="stars"]') ||
      document.querySelector('.fontDisplayLarge')
    if (ratingEl) {
      const reviewCountEl = document.querySelector('[aria-label*="reviews"]')
      result.rating = ratingEl.innerText.trim() +
        (reviewCountEl ? ` (${reviewCountEl.getAttribute('aria-label')})` : '')
    }

    // Find all info rows (address, phone, website, hours)
    const infoRows = document.querySelectorAll('[data-item-id], .rogA2c, .CsEnBe, .rllt__details')

    infoRows.forEach(row => {
      const text = row.innerText.trim()
      const ariaLabel = row.getAttribute('aria-label') || ''

      // Phone
      if (
        row.getAttribute('data-item-id')?.startsWith('phone') ||
        ariaLabel.toLowerCase().includes('phone') ||
        /^\+?[\d\s\-\(\)]{7,}$/.test(text)
      ) {
        const phoneMatch = text.match(/\+?[\d\s\-\(\)\.]{7,20}/)
        if (phoneMatch) result.phone = phoneMatch[0].trim()
      }

      // Website
      if (
        row.getAttribute('data-item-id')?.startsWith('authority') ||
        ariaLabel.toLowerCase().includes('website') ||
        /^https?:\/\//.test(text) || text.includes('.com') || text.includes('.net')
      ) {
        const linkEl = row.querySelector('a[href]')
        if (linkEl) {
          const href = linkEl.getAttribute('href')
          // Strip google redirect
          const urlParam = new URLSearchParams(href.split('?')[1] || '').get('q')
          result.website = (urlParam || href).replace(/^https?:\/\//, '').replace(/\/$/, '')
        } else {
          result.website = text.replace(/^https?:\/\//, '').replace(/\/$/, '')
        }
      }

      // Address
      if (
        row.getAttribute('data-item-id')?.startsWith('laddress') ||
        ariaLabel.toLowerCase().includes('address') ||
        /\d+\s+\w+.*(St|Ave|Rd|Blvd|Dr|Ln|Way|Pkwy)/i.test(text)
      ) {
        result.address = text
      }
    })

    // Fallback: look for specific Google Maps selectors
    if (!result.phone) {
      const phoneLink = document.querySelector('a[data-tooltip="Copy phone number"], [data-item-id^="phone"]')
      if (phoneLink) result.phone = phoneLink.innerText.trim()
    }

    if (!result.address) {
      const addrEl = document.querySelector('[data-item-id^="laddress"]')
      if (addrEl) result.address = addrEl.innerText.trim()
    }

    if (!result.website) {
      const webEl = document.querySelector('[data-item-id^="authority"] a')
      if (webEl) {
        const href = webEl.getAttribute('href') || ''
        result.website = href.replace(/^https?:\/\//, '').replace(/\/$/, '')
      }
    }

    // Build notes from rating + hours
    const parts = []
    if (result.rating) parts.push(result.rating)
    const priceEl = document.querySelector('[aria-label*="Price"]')
    if (priceEl) parts.push(priceEl.getAttribute('aria-label'))
    const featureEls = document.querySelectorAll('[aria-label*="friendly"], [aria-label*="delivery"], [aria-label*="dine"]')
    featureEls.forEach(el => {
      const lbl = el.getAttribute('aria-label')
      if (lbl) parts.push(lbl)
    })
    if (parts.length) result.notes = parts.join(' · ')

    // Clean up
    result.name = result.name.replace(/\n.*/s, '').trim()

  } catch (e) {
    console.error('[LeadSnap] Scrape error:', e)
  }

  return result
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    const data = scrapeGoogleMaps()
    sendResponse({ success: true, data })
  }
  return true // keep channel open for async
})
