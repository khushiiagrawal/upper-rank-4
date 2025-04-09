// Content script loaded message
console.log("R3Vision content script loaded");

// Eco-friendly search terms to append
const ecoSearchTerms = [
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
  "green",
  "carbon neutral",
  "eco-certified",
  "low impact",
  "energy efficient",
  "ethically sourced"
];

// Function to modify the search query
function modifySearchQuery() {
  // Get the current search input
  const searchInput = document.querySelector('#twotabsearchtextbox, #nav-search-bar-form input[type="text"]');
  if (!searchInput) return;

  // Get the current search query
  const currentQuery = searchInput.value.trim();
  if (!currentQuery) return;

  // Check if the query already contains eco-friendly terms
  const hasEcoTerm = ecoSearchTerms.some(term => 
    currentQuery.toLowerCase().includes(term.toLowerCase())
  );

  if (!hasEcoTerm) {
    // Add a random eco-friendly term to the search
    const randomEcoTerm = ecoSearchTerms[Math.floor(Math.random() * ecoSearchTerms.length)];
    const newQuery = `${currentQuery} ${randomEcoTerm}`;
    
    // Update the search input
    searchInput.value = newQuery;
    
    // Trigger the search form submission
    const searchForm = document.querySelector('#nav-search-bar-form, form[action*="search"]');
    if (searchForm) {
      searchForm.submit();
    }
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === 'toggleFilter') {
    if (request.enabled) {
      console.log("Filtering enabled, applying filters...");
      // Modify the search query when filter is enabled
      modifySearchQuery();
      filterProducts();
    } else {
      console.log("Filtering disabled, showing all products...");
      showAllProducts();
    }
  } else if (request.action === 'updateKeywords') {
    chrome.storage.local.get(['enabled'], function(result) {
      if (result.enabled) {
        filterProducts();
      }
    });
  }
});

// just check if the content script is loaded
// Function to get keywords from storage
async function getKeywords() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['keywords'], function(result) {
      const keywords = result.keywords ? result.keywords.split('\n') : [];
      console.log("Retrieved keywords:", keywords);
      resolve(keywords.map(k => k.trim().toLowerCase()).filter(k => k));
    });
  });
}

// Function to show all products
function showAllProducts() {
  const selectors = {
    'amazon': '[data-component-type="s-search-result"], .s-result-item, div[data-asin]:not([data-asin=""]), .sg-col-4-of-12',
    'walmart.com': '[data-item-id]',
    'ebay.com': '.s-item',
    'etsy.com': '.v2-listing-card',
    'target.com': '[data-test="product-card"]'
  };

  const currentSite = Object.keys(selectors).find(site => window.location.hostname.includes(site));
  if (!currentSite) return;

  const products = document.querySelectorAll(selectors[currentSite]);
  console.log(`Showing all ${products.length} products`);
  products.forEach(product => {
    product.style.display = '';
    product.style.opacity = '1';
  });
}

// Main filtering function
async function filterProducts() {
  console.log("Starting product filtering...");
  const keywords = await getKeywords();
  
  // Different selectors for various e-commerce sites
  const selectors = {
    'amazon': {
      container: '[data-component-type="s-search-result"], .s-result-item, div[data-asin]:not([data-asin=""]), .sg-col-4-of-12',
      title: [
        'h2 .a-link-normal',
        'h2 a span',
        '.a-size-base-plus',
        '.a-size-medium',
        '.product-title-word-break',
        '.a-text-normal'
      ].join(', '),
      description: [
        '.a-text-normal',
        '.a-size-base',
        '.a-color-base',
        '.product-title-word-break',
        '.a-text-bold',
        '.a-row .a-size-base',
        '.a-section .a-spacing-none',
        '[data-cy="title-recipe"]'
      ].join(', '),
      sponsored: '[data-component-type="sp-sponsored-result"]'
    },
    'walmart.com': {
      container: '[data-item-id]',
      title: '.sans-serif',
      description: '.sans-serif'
    },
    'ebay.com': {
      container: '.s-item',
      title: '.s-item__title',
      description: '.s-item__subtitle'
    },
    'etsy.com': {
      container: '.v2-listing-card',
      title: '.v2-listing-card__title',
      description: '.v2-listing-card__description'
    },
    'target.com': {
      container: '[data-test="product-card"]',
      title: '[data-test="product-title"]',
      description: '[data-test="product-description"]'
    }
  };

  // Determine which site we're on
  const currentSite = Object.keys(selectors).find(site => window.location.hostname.includes(site));
  if (!currentSite) {
    console.log("Not on a supported site");
    return;
  }

  console.log("Current site:", currentSite);
  const siteSelectors = selectors[currentSite];
  const products = document.querySelectorAll(siteSelectors.container);
  console.log(`Found ${products.length} products on the page`);
  let foundEcoFriendly = false;

  products.forEach((product, index) => {
    // Skip sponsored products on Amazon
    if (currentSite === 'amazon' && product.matches(siteSelectors.sponsored)) {
      product.style.display = 'none';
      return;
    }

    // Get all text content from the product
    const titleElements = product.querySelectorAll(siteSelectors.title);
    const descriptionElements = product.querySelectorAll(siteSelectors.description);
    
    let text = '';
    titleElements.forEach(el => text += ' ' + (el.textContent || ''));
    descriptionElements.forEach(el => text += ' ' + (el.textContent || ''));
    text = text.toLowerCase();

    console.log(`Product ${index + 1} text:`, text.substring(0, 100) + "...");

    const isEcoFriendly = keywords.some(keyword => text.includes(keyword));
    console.log(`Product ${index + 1} eco-friendly:`, isEcoFriendly);

    if (isEcoFriendly) {
      product.style.display = '';
      product.style.opacity = '1';
      foundEcoFriendly = true;
    } else {
      product.style.display = 'none';
      product.style.opacity = '0';
    }
  });

  // If no eco-friendly products found, show a message
  const existingMessage = document.getElementById('eco-friendly-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  if (!foundEcoFriendly) {
    console.log("No eco-friendly products found");
    const message = document.createElement('div');
    message.id = 'eco-friendly-message';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #2e7d32;
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      max-width: 80%;
    `;
    message.textContent = 'No eco-friendly products found on this page. Try adjusting your keywords or searching for different products.';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
}

// Initial check when page loads
if (document.readyState === 'complete') {
  chrome.storage.local.get(['enabled'], function(result) {
    if (result.enabled) {
      console.log("Page already loaded, checking if filtering is enabled");
      filterProducts();
    }
  });
} else {
  window.addEventListener('load', () => {
    chrome.storage.local.get(['enabled'], function(result) {
      if (result.enabled) {
        console.log("Page loaded, checking if filtering is enabled");
        filterProducts();
      }
    });
  });
}

// Monitor for dynamic content changes (like infinite scroll or lazy loading)
const observer = new MutationObserver((mutations) => {
  chrome.storage.local.get(['enabled'], function(result) {
    if (result.enabled) {
      // Check if new products were added
      const hasNewProducts = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && (
            node.matches('[data-component-type="s-search-result"]') ||
            node.matches('.s-result-item') ||
            node.matches('div[data-asin]') ||
            node.matches('.sg-col-4-of-12') ||
            node.querySelector('[data-component-type="s-search-result"]') ||
            node.querySelector('.s-result-item') ||
            node.querySelector('div[data-asin]') ||
            node.querySelector('.sg-col-4-of-12')
          )
        )
      );

      if (hasNewProducts) {
        console.log("New products detected, reapplying filter");
        filterProducts();
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});