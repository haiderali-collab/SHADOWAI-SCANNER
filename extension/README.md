# 🧩 Shadow AI Detector — Chrome Browser Extension (Manifest V3)

> Endpoint browser extension that automatically discovers visited Generative AI tools and unsanctioned SaaS applications, reporting unapproved tools to the Shadow AI Risk Scanner dashboard.

---

## 🛠️ How to Load Unpacked in Google Chrome

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions` in the URL address bar.
3. Turn **ON** the **Developer mode** toggle switch in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Browse to and select the `extension/` directory inside this repository (`d:\apps\Project\Shadow Ai Web\extension`).
6. The **Shadow AI Detector** extension badge 🛡️ will now appear in your extension toolbar.

---

## ⚙️ Requirements & System Architecture

- **Active Backend Server**: The Shadow AI Scanner backend server runs live at `https://shadowai-scanner-production.up.railway.app` (or locally on `http://localhost:5000`).
- **Configurable Endpoint**: To change the backend URL for remote deployment, open `background.js` and modify:
  ```javascript
  const BACKEND_URL = "https://shadowai-scanner-production.up.railway.app/api/detections";
  ```

---

## 🛡️ Privacy & Security Design

- **Strict Domain Whitelist Matching**: The extension only inspects top-level tab hostnames against a known whitelist of AI tool domains (e.g. `chatgpt.com`, `claude.ai`, `perplexity.ai`, `midjourney.com`).
- **Zero Content Surveillance**: Never reads web page contents, form inputs, credentials, or unrelated browsing history.
- **Automated 1-Hour Deduplication**: Employs `chrome.storage.local` to prevent spamming network calls when users repeatedly open or refresh the same AI site within a 60-minute window.
- **Automatic "Shadow" Tagging**: Unapproved tools detected by the extension are assigned `approved_by_it: 0` and appear on the IT dashboard as **SHADOW / UNAPPROVED** items for security review.
