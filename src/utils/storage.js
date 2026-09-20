const KEY = "leads";

const isChromeExtension =
  typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

/**
 * Load leads from chrome.storage (extension) or localStorage (dev mode).
 * Returns a Promise that resolves to an array.
 */
export function loadLeads() {
  if (isChromeExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.get([KEY], (result) => {
        resolve(result[KEY] || []);
      });
    });
  }
  try {
    const raw = localStorage.getItem(KEY);
    return Promise.resolve(raw ? JSON.parse(raw) : []);
  } catch {
    return Promise.resolve([]);
  }
}

/**
 * Save leads to chrome.storage (extension) or localStorage (dev mode).
 */
export function saveLeads(leads) {
  if (isChromeExtension) {
    chrome.storage.local.set({ [KEY]: leads });
    return;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Failed to save leads", e);
  }
}
