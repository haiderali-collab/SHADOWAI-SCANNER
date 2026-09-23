// Shadow AI Detector - Service Worker Background Script (Manifest V3)

// Configurable Backend API Endpoint
const BACKEND_URL = "https://shadowai-scanner-production.up.railway.app/api/detections";

// Known AI Tool Domains Whitelist
const KNOWN_AI_DOMAINS = {
  "chat.openai.com": "ChatGPT",
  "chatgpt.com": "ChatGPT",
  "claude.ai": "Claude AI",
  "midjourney.com": "Midjourney",
  "notion.so": "Notion AI",
  "jasper.ai": "Jasper AI",
  "grammarly.com": "Grammarly",
  "perplexity.ai": "Perplexity AI",
  "copilot.microsoft.com": "Microsoft Copilot",
  "gemini.google.com": "Google Gemini",
  "otter.ai": "Otter.ai",
  "deepl.com": "DeepL Translator",
  "canva.com": "Canva",
  "huggingface.co": "Hugging Face"
};

// 1-Hour Deduplication Window (in milliseconds)
const REPORT_COOLDOWN_MS = 60 * 60 * 1000;

// Listen for first-time installation to trigger onboarding setup
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Shadow AI Detector] Extension installed. Triggering onboarding setup.');
    chrome.tabs.create({ url: 'onboarding.html' });
  }
});

// Helper: Extract domain match from URL hostname
function findMatchingTool(urlStr) {
  if (!urlStr) return null;
  try {
    const urlObj = new URL(urlStr);
    const hostname = urlObj.hostname.toLowerCase();

    for (const [domain, toolName] of Object.entries(KNOWN_AI_DOMAINS)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return { domain, toolName, hostname };
      }
    }
  } catch (e) {
    // Ignore invalid URLs (e.g. chrome:// or about:blank)
  }
  return null;
}

// Listen for browser tab navigation updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    processTabUrl(tab.url);
  }
});

async function processTabUrl(url) {
  const match = findMatchingTool(url);
  if (!match) return;

  const { domain, toolName, hostname } = match;
  const now = Date.now();

  // Retrieve stored reported domains, recent detections & employee identity from chrome.storage.local
  chrome.storage.local.get(['reported_domains', 'recent_detections', 'employeeIdentity'], async (storageData) => {
    const employeeIdentity = storageData.employeeIdentity;

    // Check if employee identity is set. If not, reopen onboarding page and abort report.
    if (!employeeIdentity || !employeeIdentity.name || !employeeIdentity.email) {
      console.warn('[Shadow AI Detector] Employee identity missing. Aborting detection report & redirecting to onboarding page.');
      chrome.tabs.create({ url: 'onboarding.html' });
      return;
    }

    const reportedDomains = storageData.reported_domains || {};
    const recentDetections = storageData.recent_detections || [];

    const lastReportedTime = reportedDomains[domain] || 0;

    // Deduplication check: Do not re-report if detected within last 1 hour
    if (now - lastReportedTime < REPORT_COOLDOWN_MS) {
      console.log(`[Shadow AI Detector] Skipped reporting ${toolName} (${domain}). Cooldown active.`);
      return;
    }

    console.log(`[Shadow AI Detector] AI Tool Visit Detected: ${toolName} on ${hostname} by ${employeeIdentity.name} (${employeeIdentity.email})`);

    // Update cooldown timestamp in local storage
    reportedDomains[domain] = now;

    // Add to recent detections array (max 10 items)
    const newDetectionRecord = {
      domain,
      toolName,
      employeeName: employeeIdentity.name,
      employeeEmail: employeeIdentity.email,
      timestamp: new Date().toISOString(),
      status: 'Reported to IT Risk Scanner'
    };

    const updatedRecent = [
      newDetectionRecord,
      ...recentDetections.filter(item => item.domain !== domain)
    ].slice(0, 10);

    chrome.storage.local.set({
      reported_domains: reportedDomains,
      recent_detections: updatedRecent
    });

    // Send POST payload to Shadow AI Scanner Backend API
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: hostname,
          toolName: toolName,
          detectedAt: new Date().toISOString(),
          employeeName: employeeIdentity.name,
          employeeEmail: employeeIdentity.email
        })
      });

      const resData = await response.json();
      console.log(`[Shadow AI Detector] Backend Response:`, resData);
    } catch (err) {
      console.error(`[Shadow AI Detector] Failed to send report to backend (${BACKEND_URL}):`, err);
    }
  });
}

