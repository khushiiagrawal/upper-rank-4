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

// Material analysis configuration
const materialConfig = {
  ecoFriendlyMaterials: {
    // Natural Fibers
    'organic cotton': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'bamboo': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'hemp': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'linen': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'jute': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'ramie': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'sisal': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'coconut fiber': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    
    // Recycled Materials
    'recycled polyester': { score: 0.9, category: 'recycled', recyclable: true, biodegradable: false },
    'recycled cotton': { score: 0.9, category: 'recycled', recyclable: true, biodegradable: true },
    'recycled nylon': { score: 0.8, category: 'recycled', recyclable: true, biodegradable: false },
    'recycled wool': { score: 0.9, category: 'recycled', recyclable: true, biodegradable: true },
    'recycled paper': { score: 0.9, category: 'recycled', recyclable: true, biodegradable: true },
    'recycled glass': { score: 1.0, category: 'recycled', recyclable: true, biodegradable: false },
    'recycled metal': { score: 1.0, category: 'recycled', recyclable: true, biodegradable: false },
    
    // Sustainable Alternatives
    'tencel': { score: 1.0, category: 'sustainable', recyclable: true, biodegradable: true },
    'modal': { score: 0.9, category: 'sustainable', recyclable: true, biodegradable: true },
    'lyocell': { score: 1.0, category: 'sustainable', recyclable: true, biodegradable: true },
    'cupro': { score: 0.9, category: 'sustainable', recyclable: true, biodegradable: true },
    'seacell': { score: 1.0, category: 'sustainable', recyclable: true, biodegradable: true },
    
    // Natural Materials
    'wool': { score: 0.8, category: 'natural', recyclable: true, biodegradable: true },
    'silk': { score: 0.7, category: 'natural', recyclable: true, biodegradable: true },
    'cork': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'wood': { score: 0.8, category: 'natural', recyclable: true, biodegradable: true },
    'rattan': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    'seagrass': { score: 1.0, category: 'natural', recyclable: true, biodegradable: true },
    
    // Metals and Minerals
    'stainless steel': { score: 0.9, category: 'metal', recyclable: true, biodegradable: false },
    'aluminum': { score: 0.8, category: 'metal', recyclable: true, biodegradable: false },
    'copper': { score: 0.8, category: 'metal', recyclable: true, biodegradable: false },
    'brass': { score: 0.8, category: 'metal', recyclable: true, biodegradable: false },
    'stone': { score: 0.9, category: 'mineral', recyclable: true, biodegradable: false },
    'ceramic': { score: 0.8, category: 'mineral', recyclable: true, biodegradable: false }
  },
  
  nonEcoFriendlyMaterials: {
    // Plastics and Synthetics
    'polyester': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'nylon': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'acrylic': { score: -0.9, category: 'synthetic', recyclable: false, biodegradable: false },
    'polyurethane': { score: -0.9, category: 'synthetic', recyclable: false, biodegradable: false },
    'pvc': { score: -1.0, category: 'synthetic', recyclable: false, biodegradable: false },
    'plastic': { score: -0.9, category: 'synthetic', recyclable: false, biodegradable: false },
    'synthetic': { score: -0.7, category: 'synthetic', recyclable: false, biodegradable: false },
    'polypropylene': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'polyethylene': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'pet': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'vinyl': { score: -0.9, category: 'synthetic', recyclable: false, biodegradable: false },
    'spandex': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'elastane': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    'polyamide': { score: -0.8, category: 'synthetic', recyclable: false, biodegradable: false },
    
    // Harmful Chemicals
    'formaldehyde': { score: -1.0, category: 'chemical', recyclable: false, biodegradable: false },
    'phthalates': { score: -1.0, category: 'chemical', recyclable: false, biodegradable: false },
    'bpa': { score: -1.0, category: 'chemical', recyclable: false, biodegradable: false },
    'pfas': { score: -1.0, category: 'chemical', recyclable: false, biodegradable: false },
    'pfoa': { score: -1.0, category: 'chemical', recyclable: false, biodegradable: false }
  },

  // Scoring weights
  scoringWeights: {
    materialScore: 0.6,
    recyclability: 0.2,
    biodegradability: 0.2
  },

  // Minimum eco-friendliness score to consider a product eco-friendly
  minEcoScore: 0.5
};

// Function to extract material information from product text
function extractMaterialInfo(text) {
  const materialInfo = {
    materials: [],
    percentages: []
  };

  // Common patterns for material information
  const patterns = [
    // Pattern for "100% cotton" or "80% recycled polyester"
    /(\d+)%\s*([a-zA-Z\s]+)/g,
    // Pattern for "made of cotton" or "contains recycled polyester"
    /(?:made of|contains|composed of|constructed from|material:)\s*([a-zA-Z\s]+)/gi,
    // Pattern for "cotton blend" or "polyester blend"
    /([a-zA-Z\s]+)\s*blend/gi,
    // Pattern for "organic cotton" or "recycled polyester"
    /(organic|recycled)\s+([a-zA-Z\s]+)/gi
  ];

  // Extract materials and percentages using patterns
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (pattern === patterns[0]) {
        // Handle percentage pattern
        const percentage = parseInt(match[1]);
        const material = match[2].trim().toLowerCase();
        if (!materialInfo.materials.includes(material)) {
          materialInfo.materials.push(material);
          materialInfo.percentages.push(percentage);
        }
      } else {
        // Handle other patterns
        const material = match[1].trim().toLowerCase();
        if (!materialInfo.materials.includes(material)) {
          materialInfo.materials.push(material);
          materialInfo.percentages.push(100); // Default to 100% if percentage not specified
        }
      }
    }
  });

  return materialInfo;
}

// Function to calculate eco-friendliness score with enhanced metrics
function calculateEcoScore(materialInfo) {
  let totalScore = 0;
  let totalWeight = 0;
  let recyclableCount = 0;
  let biodegradableCount = 0;
  let totalMaterials = 0;

  materialInfo.materials.forEach((material, index) => {
    const percentage = materialInfo.percentages[index] || 100;
    let materialData = null;
    let materialScore = 0;
    let isRecyclable = false;
    let isBiodegradable = false;

    // Check eco-friendly materials
    for (const [ecoMaterial, data] of Object.entries(materialConfig.ecoFriendlyMaterials)) {
      if (material.includes(ecoMaterial)) {
        materialData = data;
        materialScore = data.score;
        isRecyclable = data.recyclable;
        isBiodegradable = data.biodegradable;
        break;
      }
    }

    // Check non-eco-friendly materials
    if (!materialData) {
      for (const [nonEcoMaterial, data] of Object.entries(materialConfig.nonEcoFriendlyMaterials)) {
        if (material.includes(nonEcoMaterial)) {
          materialData = data;
          materialScore = data.score;
          isRecyclable = data.recyclable;
          isBiodegradable = data.biodegradable;
          break;
        }
      }
    }

    // Update counts
    if (isRecyclable) recyclableCount++;
    if (isBiodegradable) biodegradableCount++;
    totalMaterials++;

    // Calculate weighted score
    const weight = percentage / 100;
    totalScore += materialScore * weight * materialConfig.scoringWeights.materialScore;
    totalWeight += weight;
  });

  // Calculate additional scores
  const recyclabilityScore = (recyclableCount / totalMaterials) * materialConfig.scoringWeights.recyclability;
  const biodegradabilityScore = (biodegradableCount / totalMaterials) * materialConfig.scoringWeights.biodegradability;

  // Combine all scores
  const finalScore = (totalScore / totalWeight) + recyclabilityScore + biodegradabilityScore;
  return Math.max(0, Math.min(1, finalScore)); // Ensure score is between 0 and 1
}

// Function to create detailed material info display
function createMaterialInfoDisplay(materialInfo, ecoScore) {
  const display = document.createElement('div');
  display.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #2e7d32;
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-size: 12px;
    z-index: 100;
    max-width: 250px;
    text-align: left;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;

  // Calculate total percentage
  const totalPercentage = materialInfo.percentages.reduce((sum, percent) => sum + percent, 0);
  
  let content = `
    <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">
      Eco Score: ${(ecoScore * 100).toFixed(0)}%
    </div>
  `;
  
  if (materialInfo.materials.length > 0) {
    content += '<div style="margin-bottom: 8px;">Material Composition:</div>';
    
    // Sort materials by percentage (highest first)
    const sortedMaterials = materialInfo.materials.map((material, index) => ({
      material,
      percentage: materialInfo.percentages[index]
    })).sort((a, b) => b.percentage - a.percentage);
    
    sortedMaterials.forEach(({material, percentage}) => {
      let materialData = null;
      
      // Find material properties
      for (const [ecoMaterial, data] of Object.entries(materialConfig.ecoFriendlyMaterials)) {
        if (material.includes(ecoMaterial)) {
          materialData = data;
          break;
        }
      }
      
      if (!materialData) {
        for (const [nonEcoMaterial, data] of Object.entries(materialConfig.nonEcoFriendlyMaterials)) {
          if (material.includes(nonEcoMaterial)) {
            materialData = data;
            break;
          }
        }
      }
      
      const properties = [];
      if (materialData) {
        if (materialData.recyclable) properties.push('♻️');
        if (materialData.biodegradable) properties.push('🌱');
      }
      
      const percentageBar = Math.round((percentage / totalPercentage) * 100);
      content += `
        <div style="margin-bottom: 4px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>${material}</span>
            <span>${percentage}%</span>
          </div>
          <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px;">
            <div style="background: white; height: 100%; width: ${percentageBar}%; border-radius: 2px;"></div>
          </div>
          ${properties.length > 0 ? `<div style="margin-top: 2px;">${properties.join(' ')}</div>` : ''}
        </div>
      `;
    });
  }

  // Add review summary
  let reviewSummary = '';
  if (ecoScore >= 0.8) {
    reviewSummary = 'Excellent eco-friendly choice! 🌟';
  } else if (ecoScore >= 0.6) {
    reviewSummary = 'Good sustainable option! 👍';
  } else if (ecoScore >= 0.4) {
    reviewSummary = 'Moderate eco-friendliness ⚖️';
  } else {
    reviewSummary = 'Could be more sustainable 🔄';
  }

  content += `
    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
      <div style="font-weight: bold;">Review:</div>
      <div>${reviewSummary}</div>
    </div>
  `;

  display.innerHTML = content;
  return display;
}

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

// Function to check if a product is recyclable or biodegradable
function isRecyclableOrBiodegradable(materialInfo) {
  for (const material of materialInfo.materials) {
    // Check eco-friendly materials
    for (const [ecoMaterial, data] of Object.entries(materialConfig.ecoFriendlyMaterials)) {
      if (material.includes(ecoMaterial) && (data.recyclable || data.biodegradable)) {
        return true;
      }
    }
  }
  return false;
}

// Function to filter products
function filterProducts() {
  const products = document.querySelectorAll('[data-component-type="s-search-result"]');
  let foundRecyclable = false;

  products.forEach((product, index) => {
    // Extract product details from different sections
    const titleElement = product.querySelector('h2 a');
    const title = titleElement ? titleElement.textContent.toLowerCase() : '';
    
    // Get description from product details section
    const descriptionElement = product.querySelector('[data-feature-name="productDescription"]');
    const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
    
    // Get additional details
    const detailsElement = product.querySelector('[data-feature-name="productDetails"]');
    const details = detailsElement ? detailsElement.textContent.toLowerCase() : '';
    
    // Get bullet points
    const bulletPoints = product.querySelectorAll('.a-list-item');
    let bulletPointsText = '';
    bulletPoints.forEach(bullet => {
      bulletPointsText += ' ' + bullet.textContent.toLowerCase();
    });

    // Combine all text for material analysis
    const combinedText = title + ' ' + description + ' ' + details + ' ' + bulletPointsText;
    
    // Extract material information
    const materialInfo = extractMaterialInfo(combinedText);
    
    // Check if product is recyclable or biodegradable
    const isRecyclable = isRecyclableOrBiodegradable(materialInfo);
    
    if (isRecyclable) {
      product.style.display = '';
      product.style.opacity = '1';
      foundRecyclable = true;

      // Calculate and display eco-score
      const ecoScore = calculateEcoScore(materialInfo);
      const display = createMaterialInfoDisplay(materialInfo, ecoScore);
      product.style.position = 'relative';
      product.appendChild(display);
    } else {
      product.style.display = 'none';
      product.style.opacity = '0';
    }
  });

  // Show message if no recyclable products found
  if (!foundRecyclable) {
    const message = document.createElement('div');
    message.style.cssText = `
      text-align: center;
      padding: 20px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin: 20px 0;
      color: #6c757d;
    `;
    message.textContent = 'No recyclable or biodegradable products found in this search. Try different search terms or check back later.';
    
    const resultsContainer = document.querySelector('[data-component-type="s-search-results"]');
    if (resultsContainer) {
      resultsContainer.insertBefore(message, resultsContainer.firstChild);
    }
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