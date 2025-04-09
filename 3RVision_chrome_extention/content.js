// Content script loaded message
console.log("3RVision content script loaded");

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
  console.log("Extracting materials from text:", text.substring(0, 200)); // Log first 200 chars
  const materialInfo = {
    materials: [],
    percentages: []
  };

  // Normalize text: lowercase, remove extra spaces
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');

  // Common patterns for material information
  const patterns = [
    // Pattern for "100% cotton", "80% recycled polyester"
    /(\d{1,3})\s*%\s*([a-zA-Z][a-zA-Z\s-]*[a-zA-Z])/g,
    // Pattern for "material: stainless steel", "made of bamboo"
    /(?:material|made of|contains|composed of|constructed from|fabric):\s*([a-zA-Z][a-zA-Z\s-]*[a-zA-Z])/gi,
    // Pattern for "cotton blend", "polyester blend"
    /([a-zA-Z][a-zA-Z\s-]*[a-zA-Z])\s*blend/gi,
    // Pattern for "organic cotton", "recycled polyester"
    /(organic|recycled|stainless|food-grade|grade)\s+([a-zA-Z][a-zA-Z\s-]*[a-zA-Z])/gi,
    // Pattern to find standalone materials mentioned (like "steel", "wood")
    /(?:\b)(stainless steel|steel|aluminum|copper|brass|wood|bamboo|ceramic|glass|silicone|plastic|cotton|polyester|nylon|wool|silk)(?:\b)/gi
  ];

  // Keep track of found materials to avoid duplicates
  const foundMaterials = new Set();

  patterns.forEach((pattern, patternIndex) => {
    let match;
    while ((match = pattern.exec(normalizedText)) !== null) {
      let material = '';
      let percentage = 100; // Default percentage

      if (patternIndex === 0) { // Percentage pattern
        percentage = parseInt(match[1]);
        material = match[2].trim();
      } else if (patternIndex === 1 || patternIndex === 2) { // Material keyword patterns
        material = match[1].trim();
      } else if (patternIndex === 3) { // Modifier + material pattern
         material = (match[1] + ' ' + match[2]).trim(); // e.g., "organic cotton", "stainless steel"
      } else if (patternIndex === 4) { // Standalone material pattern
        material = match[1].trim();
      }

      // Standardize common variations (e.g., steel -> stainless steel if context available)
      if (material === 'steel' && normalizedText.includes('stainless')) {
          material = 'stainless steel';
      }
      
      if (material && !foundMaterials.has(material)) {
         // Check if this material is known
         const isKnownMaterial = Object.keys(materialConfig.ecoFriendlyMaterials).some(m => material.includes(m)) ||
                               Object.keys(materialConfig.nonEcoFriendlyMaterials).some(m => material.includes(m));

         if (isKnownMaterial) {
             console.log(`Found material: ${material}, Percentage: ${percentage}`);
             materialInfo.materials.push(material);
             materialInfo.percentages.push(percentage);
             foundMaterials.add(material);
         }
      }
    }
  });
  
  // If no materials found via patterns, check common single words from config
  if (materialInfo.materials.length === 0) {
      const allKnownMaterials = [...Object.keys(materialConfig.ecoFriendlyMaterials), ...Object.keys(materialConfig.nonEcoFriendlyMaterials)];
      allKnownMaterials.forEach(knownMaterial => {
          if (normalizedText.includes(knownMaterial) && !foundMaterials.has(knownMaterial)) {
              console.log(`Found fallback material: ${knownMaterial}`);
              materialInfo.materials.push(knownMaterial);
              materialInfo.percentages.push(100); // Default percentage
              foundMaterials.add(knownMaterial);
          }
      });
  }

  console.log("Extracted Material Info:", materialInfo);
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

// Function to show all products (ensure displays are removed)
function showAllProducts() {
  console.log("--- Running showAllProducts --- ");
  const selectors = {
    'amazon': '[data-component-type="s-search-result"], .s-result-item, div[data-asin]:not([data-asin=""])',
    'myntra': '.product-base',
    'jiomart': '.product-list',
    'flipkart': '._1AtVbE',
    'walmart.com': '[data-item-id]',
    'ebay.com': '.s-item',
    'etsy.com': '.v2-listing-card',
    'target.com': '[data-test="product-card"]'
  };

  const currentSite = Object.keys(selectors).find(site => window.location.hostname.includes(site));
  if (!currentSite) return;

  const products = document.querySelectorAll(selectors[currentSite]);
  console.log(`Showing all ${products.length} potential products`);
  products.forEach(product => {
    product.style.display = '';
    product.style.opacity = '1';
    // Remove our display element if it exists
    const existingDisplay = product.querySelector('.r3vision-material-display');
    if (existingDisplay) existingDisplay.remove();
  });

  // Remove the "no products found" message if it exists
  const existingMessage = document.getElementById('r3vision-no-products-message');
  if (existingMessage) existingMessage.remove();
  console.log("--- showAllProducts Finished --- ");
}

// Function to filter products
function filterProducts() {
  console.log("--- Running filterProducts --- ");
  const selectors = {
    'amazon': '[data-component-type="s-search-result"], .s-result-item, div[data-asin]:not([data-asin=""])',
    'myntra': '.product-base',
    'jiomart': '.product-list',
    'flipkart': '._1AtVbE',
    'walmart.com': '[data-item-id]',
    'ebay.com': '.s-item',
    'etsy.com': '.v2-listing-card',
    'target.com': '[data-test="product-card"]'
  };

  const currentSite = Object.keys(selectors).find(site => window.location.hostname.includes(site));
  if (!currentSite) {
    console.log("No matching site found for filtering.");
    return;
  }

  const potentialProductNodes = document.querySelectorAll(selectors[currentSite]);
  console.log(`Found ${potentialProductNodes.length} potential product nodes on ${currentSite}.`);
  let foundRecyclable = false;
  let productsProcessed = 0;

  potentialProductNodes.forEach((product, index) => {
    // Basic check if it looks like a product result
    if (!product.querySelector('h2 a span') && !product.querySelector('.a-price')) {
        console.log(`Node ${index} skipped - doesn't seem like a product.`);
        return; // Skip nodes that don't look like products
    }
    productsProcessed++;
    console.log(`Processing product ${index + 1} on ${currentSite}...`);

    // --- Enhanced Text Extraction --- 
    let combinedText = '';
    
    // Get text from common areas, checking if they exist
    const titleElement = product.querySelector('h2 a span');
    if (titleElement) combinedText += titleElement.textContent + ' ';

    const descriptionElements = product.querySelectorAll('.a-section .a-size-base, .a-section .a-text-normal');
    descriptionElements.forEach(el => combinedText += el.textContent + ' ');

    const bulletPoints = product.querySelectorAll('.a-list-item');
    bulletPoints.forEach(bullet => combinedText += bullet.textContent + ' ');

    // Fallback: Get all text within the product container if specific parts fail
    if (combinedText.trim().length < 50) { // If very little text found, try broader extraction
        console.log(`Product ${index + 1}: Using fallback text extraction.`);
        combinedText = product.textContent || ''; 
    }
    // --- End Enhanced Text Extraction ---
    
    // Extract material information
    const materialInfo = extractMaterialInfo(combinedText);
    
    // Check if product is recyclable or biodegradable
    const isRecyclable = isRecyclableOrBiodegradable(materialInfo);
    console.log(`Product ${index + 1} isRecyclableOrBiodegradable: ${isRecyclable}`);
    
    // --- Apply Filter --- 
    // First, remove any existing display from previous runs
    const existingDisplay = product.querySelector('.r3vision-material-display');
    if (existingDisplay) existingDisplay.remove();

    if (isRecyclable) {
      product.style.display = '';
      product.style.opacity = '1';
      foundRecyclable = true;

      // Calculate and display eco-score
      const ecoScore = calculateEcoScore(materialInfo);
      const display = createMaterialInfoDisplay(materialInfo, ecoScore);
      display.classList.add('r3vision-material-display'); // Add class for easy removal
      product.style.position = 'relative'; // Ensure positioning context
      product.appendChild(display);
    } else {
      product.style.display = 'none';
      product.style.opacity = '0';
    }
  });
  console.log(`Processed ${productsProcessed} products on ${currentSite}.`);

  // --- Update Message --- 
  // Remove previous message first
  const existingMessage = document.getElementById('r3vision-no-products-message');
  if (existingMessage) existingMessage.remove();

  // Show message only if products were processed but none were recyclable
  if (productsProcessed > 0 && !foundRecyclable) {
    console.log("No recyclable/biodegradable products found after processing.");
    const message = document.createElement('div');
    message.id = 'r3vision-no-products-message'; // Add ID for easy removal
    message.style.cssText = `
      text-align: center;
      padding: 20px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin: 20px auto; /* Center the message */
      color: #6c757d;
      max-width: 80%;
    `;
    message.textContent = '3RVision: No recyclable or biodegradable products found in this search. Try different search terms or check back later.';
    
    // Try to insert before the main results container
    const resultsContainer = document.querySelector('#search, [data-component-type="s-search-results"], .s-main-slot') || document.body;
    resultsContainer.insertBefore(message, resultsContainer.firstChild);
  } else if (productsProcessed === 0) {
      console.log("No product elements found to process.");
  }
  console.log("--- filterProducts Finished --- ");
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFilter') {
    if (request.enabled) {
      filterProducts();
    } else {
      showAllProducts();
    }
  }
});

// Initial check when page loads
if (document.readyState === 'complete') {
  chrome.storage.local.get(['enabled'], function(result) {
    if (chrome.runtime.lastError) {
      console.error("Error accessing storage:", chrome.runtime.lastError);
      return;
    }
    if (result.enabled) {
      filterProducts();
    }
  });
} else {
  window.addEventListener('load', () => {
    chrome.storage.local.get(['enabled'], function(result) {
      if (chrome.runtime.lastError) {
        console.error("Error accessing storage:", chrome.runtime.lastError);
        return;
      }
      if (result.enabled) {
        filterProducts();
      }
    });
  });
}

// Monitor for dynamic content changes
if (document.readyState === 'complete') {
  const observer = new MutationObserver((mutations) => {
    chrome.storage.local.get(['enabled'], function(result) {
      if (result.enabled) {
        const hasNewProducts = mutations.some(mutation => 
          Array.from(mutation.addedNodes).some(node => 
            node.nodeType === 1 && (
              node.matches('[data-component-type="s-search-result"]') ||
              node.querySelector('[data-component-type="s-search-result"]')
            )
          )
        );

        if (hasNewProducts) {
          try {
            filterProducts();
          } catch (error) {
            console.error("Error during filtering:", error);
          }
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  window.addEventListener('load', () => {
    // Re-run the observer setup after the page is fully loaded
    const observer = new MutationObserver((mutations) => {
      chrome.storage.local.get(['enabled'], function(result) {
        if (result.enabled) {
          const hasNewProducts = mutations.some(mutation => 
            Array.from(mutation.addedNodes).some(node => 
              node.nodeType === 1 && (
                node.matches('[data-component-type="s-search-result"]') ||
                node.querySelector('[data-component-type="s-search-result"]')
              )
            )
          );

          if (hasNewProducts) {
            try {
              filterProducts();
            } catch (error) {
              console.error("Error during filtering:", error);
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}