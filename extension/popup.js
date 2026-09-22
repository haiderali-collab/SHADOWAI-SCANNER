document.addEventListener('DOMContentLoaded', () => {
  const detectionsList = document.getElementById('detections-list');
  const countBadge = document.getElementById('detection-count');
  const clearBtn = document.getElementById('clear-btn');
  const identityName = document.getElementById('identity-name');
  const identityEmail = document.getElementById('identity-email');
  const editInfoBtn = document.getElementById('edit-info-btn');

  function renderIdentity() {
    chrome.storage.local.get(['employeeIdentity'], (data) => {
      const identity = data.employeeIdentity;
      if (identity && identity.name && identity.email) {
        identityName.textContent = identity.name;
        identityEmail.textContent = identity.email;
      } else {
        identityName.textContent = 'Not Configured';
        identityEmail.textContent = 'Click edit to set name & email';
      }
    });
  }

  function renderList() {
    chrome.storage.local.get(['recent_detections'], (data) => {
      const items = data.recent_detections || [];
      countBadge.textContent = `${items.length} Tools`;

      if (items.length === 0) {
        detectionsList.innerHTML = `
          <div class="empty-state">
            <p class="empty-title">No AI tools visited yet</p>
            <p class="empty-sub">Visiting known AI sites like ChatGPT or Claude will auto-register them with SecOps.</p>
          </div>
        `;
        return;
      }

      detectionsList.innerHTML = items.map(item => `
        <div class="detection-item">
          <div class="item-left">
            <span class="item-name">${escapeHtml(item.toolName)}</span>
            <span class="item-domain">${escapeHtml(item.domain)}</span>
          </div>
          <span class="item-badge">SHADOW</span>
        </div>
      `).join('');
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (editInfoBtn) {
    editInfoBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'onboarding.html' });
    });
  }

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.set({ recent_detections: [], reported_domains: {} }, () => {
      renderList();
    });
  });

  renderIdentity();
  renderList();
});

