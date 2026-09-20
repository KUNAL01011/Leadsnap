/**
 * LeadSnap Background Service Worker
 * Handles communication between popup and content scripts.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[LeadSnap] Extension installed')
})

// Relay messages between popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape_from_popup') {
    // Get active tab and inject content script if needed, then scrape
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (!tab) {
        sendResponse({ success: false, error: 'No active tab' })
        return
      }

      // Check if we're on Google Maps
      const isGoogleMaps = tab.url?.includes('google.com/maps') || tab.url?.includes('maps.google.com')
      if (!isGoogleMaps) {
        sendResponse({ success: false, error: 'NOT_MAPS', url: tab.url })
        return
      }

      // Send to content script
      chrome.tabs.sendMessage(tab.id, { action: 'scrape' }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not ready, inject it first
          chrome.scripting.executeScript(
            { target: { tabId: tab.id }, files: ['content.js'] },
            () => {
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, { action: 'scrape' }, (res) => {
                  sendResponse(res || { success: false, error: 'Script injection failed' })
                })
              }, 500)
            }
          )
        } else {
          sendResponse(response)
        }
      })
    })
    return true // async
  }
})
