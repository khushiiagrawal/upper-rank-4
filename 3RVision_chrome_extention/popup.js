document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('status');
  const keywordsTextarea = document.getElementById('keywords');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  const defaultKeywords = [
    "eco-friendly",
    "sustainable",
    "biodegradable",
    "recyclable",
    "compostable",
    "organic",
    "natural",
    "renewable",
    "plastic-free",
    "zero waste",
    "recycled",
    "bio-based",
    "eco-conscious",
    "environmentally friendly",
    "green product",
    "carbon neutral",
    "eco-certified",
    "low impact",
    "energy efficient",
    "ethically sourced"
  ].join('\n');
  
  // Load saved settings
  chrome.storage.local.get(['enabled', 'keywords'], function(result) {
    const enabled = result.enabled !== undefined ? result.enabled : false;
    const keywords = result.keywords || defaultKeywords;
    
    toggleSwitch.checked = enabled;
    keywordsTextarea.value = keywords;
    updateStatusDisplay(enabled);
  });
  
  // Toggle extension on/off
  toggleSwitch.addEventListener('change', function() {
    const enabled = toggleSwitch.checked;
    updateStatusDisplay(enabled);
    chrome.storage.local.set({ enabled: enabled });
    
    // Notify the active tab about the state change
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        try {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'toggleFilter', 
            enabled: enabled 
          }).catch(() => {
            // If content script is not ready, show a notification
            showNotification('Please refresh the page to apply changes', 'warning');
          });
        } catch (error) {
          showNotification('Please refresh the page to apply changes', 'warning');
        }
      }
    });
  });
  
  // Save keywords
  saveBtn.addEventListener('click', function() {
    const keywords = keywordsTextarea.value.trim();
    chrome.storage.local.set({ keywords: keywords }, function() {
      showNotification('Keywords saved!');
      
      // Update content script with new keywords
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          try {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'updateKeywords', 
              keywords: keywords.split('\n').map(k => k.trim().toLowerCase()).filter(k => k)
            }).catch(() => {
              // If content script is not ready, show a notification
              showNotification('Please refresh the page to apply changes', 'warning');
            });
          } catch (error) {
            showNotification('Please refresh the page to apply changes', 'warning');
          }
        }
      });
    });
  });
  
  // Reset to default keywords
  resetBtn.addEventListener('click', function() {
    keywordsTextarea.value = defaultKeywords;
    chrome.storage.local.set({ keywords: defaultKeywords }, function() {
      showNotification('Reset to default keywords!');
      
      // Update content script with default keywords
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          try {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'updateKeywords', 
              keywords: defaultKeywords.split('\n').map(k => k.trim().toLowerCase()).filter(k => k)
            }).catch(() => {
              // If content script is not ready, show a notification
              showNotification('Please refresh the page to apply changes', 'warning');
            });
          } catch (error) {
            showNotification('Please refresh the page to apply changes', 'warning');
          }
        }
      });
    });
  });
  
  function updateStatusDisplay(enabled) {
    if (enabled) {
      statusText.textContent = 'ON';
      statusText.className = 'status-on';
    } else {
      statusText.textContent = 'OFF';
      statusText.className = 'status-off';
    }
  }
  
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${type === 'success' ? '#2e7d32' : '#f57c00'};
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      z-index: 1000;
      text-align: center;
      min-width: 200px;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 2000);
  }
});