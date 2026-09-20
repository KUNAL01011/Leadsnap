import { useState, useEffect } from "react";
import Header from "./components/Header";
import AddLeadView from "./components/AddLeadView";
import LeadsListView from "./components/LeadsListView";
import ExportView from "./components/ExportView";
import Toast from "./components/Toast";
import { loadLeads, saveLeads } from "./utils/storage";

export default function App() {
  const [view, setView] = useState("add"); // 'add' | 'list' | 'export'
  const [leads, setLeads] = useState([]);
  const [toast, setToast] = useState(null);
  const [scrapedData, setScrapedData] = useState(null);

  useEffect(() => {
    loadLeads().then(setLeads);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const addLead = (lead) => {
    const newLeads = [
      {
        ...lead,
        id: Date.now(),
        addedAt: new Date().toLocaleDateString("en-US"),
      },
      ...leads,
    ];
    setLeads(newLeads);
    saveLeads(newLeads);
    showToast("Lead added successfully!");
    setView("list");
  };

  const deleteLead = (id) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    saveLeads(updated);
    showToast("Lead removed", "info");
  };

  const clearAll = () => {
    setLeads([]);
    saveLeads([]);
    showToast("All leads cleared", "info");
  };

  // Scrape current page — uses chrome messaging when in extension, demo data otherwise
  const scrapeCurrentPage = () => {
    // Check if running as a Chrome extension
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage(
        { action: "scrape_from_popup" },
        (response) => {
          if (chrome.runtime.lastError) {
            showToast("Error connecting to page", "info");
            return;
          }
          if (!response?.success) {
            if (response?.error === "NOT_MAPS") {
              showToast("Open a Google Maps business page first!", "info");
            } else {
              showToast("Could not read page data", "info");
            }
            return;
          }
          if (!response.data?.name) {
            showToast("No business found on this page", "info");
            return;
          }
          setScrapedData(response.data);
          setView("add");
          showToast("Page data snapped! Review & save.");
        },
      );
    } else {
      // Demo mode — fill with sample data
      const mockData = {
        name: "Texas Restaurant – Breakfast & Lunch",
        phone: "+1 469-663-7703",
        website: "thetexasrestaurant.com",
        address: "2300 Midway Rd, Plano, TX 75093",
        category: "Restaurant · Breakfast & Lunch",
        rating: "4.4★ (291 reviews)",
        email: "",
        notes:
          "$10–20 per person · Dine-in · Takeaway · Delivery · LGBTQ+ friendly",
      };
      setScrapedData(mockData);
      setView("add");
      showToast("Demo: Page data snapped!");
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-snap-bg text-snap-text font-body flex flex-col"
      style={{ width: 420, minHeight: 580, maxHeight: 600, overflow: "hidden" }}
    >
      <Header
        view={view}
        setView={setView}
        leadsCount={leads.length}
        onSnap={scrapeCurrentPage}
      />

      <div className="flex-1 overflow-hidden">
        {view === "add" && (
          <AddLeadView
            onAdd={addLead}
            prefill={scrapedData}
            onClearPrefill={() => setScrapedData(null)}
          />
        )}
        {view === "list" && (
          <LeadsListView
            leads={leads}
            onDelete={deleteLead}
            onAddNew={() => setView("add")}
          />
        )}
        {view === "export" && (
          <ExportView
            leads={leads}
            onClearAll={clearAll}
            showToast={showToast}
          />
        )}
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}
