// Set default values on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("R3Vision Extension Installed ✅");
  
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
  
  chrome.storage.local.get(['enabled', 'keywords'], function(result) {
    if (result.keywords === undefined) {
      chrome.storage.local.set({ keywords: defaultKeywords });
    }
    
    if (result.enabled === undefined) {
      chrome.storage.local.set({ enabled: false });
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the URL is an e-commerce site
    const ecommercePatterns = [
      'amazon', 
      'ebay',
      'walmart',
      'etsy',
      'target',
      'shop', 
      'store', 
      'product'
    ];
    
    // Only send message to content script if likely an e-commerce site
    const isEcommerce = ecommercePatterns.some(pattern => tab.url.toLowerCase().includes(pattern));
    
    if (isEcommerce) {
      chrome.storage.local.get(['enabled', 'keywords'], function(result) {
        const enabled = result.enabled !== undefined ? result.enabled : false;
        
        if (enabled) {
          // Give some time for the page to fully load
          setTimeout(() => {
            try {
              chrome.tabs.sendMessage(tabId, { 
                action: 'toggleFilter', 
                enabled: enabled 
              }).catch(error => {
                console.log("Content script not ready yet:", error);
              });
            } catch (error) {
              console.log("Error sending message to tab:", error);
            }
          }, 1500);
        }
      });
    }
  }
});

// Listen for content script ready message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contentScriptReady') {
    console.log("Content script ready in tab:", sender.tab.id);
    // Check if filtering should be enabled for this tab
    chrome.storage.local.get(['enabled'], function(result) {
      if (result.enabled) {
        try {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'toggleFilter',
            enabled: true
          }).catch(error => {
            console.log("Error sending initial filter message:", error);
          });
        } catch (error) {
          console.log("Error sending message to content script:", error);
        }
      }
    });
  }
});
  