# R3Vision Chrome Extension

R3Vision is a Chrome extension that helps users find eco-friendly products on e-commerce websites. It automatically modifies search queries to include eco-friendly terms and filters results to show only sustainable products.

## Features

- **Automatic Search Enhancement**: Automatically adds eco-friendly terms to your search queries
- **Smart Filtering**: Filters product listings to show only eco-friendly items
- **Customizable Keywords**: Users can add or modify eco-friendly keywords
- **Multi-Platform Support**: Works on major e-commerce sites including Amazon, Walmart, eBay, Etsy, and Target
- **Real-time Updates**: Automatically updates when new products are loaded (infinite scroll support)

## Implementation Details

### 1. Architecture

The extension consists of three main components:

- **Content Script** (`content.js`): Runs on e-commerce websites and handles:
  - Search query modification
  - Product filtering
  - Dynamic content monitoring
  - User interface updates

- **Background Script** (`background.js`): Handles:
  - Extension installation setup
  - Default keyword initialization
  - Tab monitoring
  - Message passing between components

- **Popup Interface** (`popup.html`, `popup.js`, `popup.css`): Provides:
  - Extension toggle switch
  - Keyword management
  - Status display

### 2. Search Enhancement Process

1. **Query Detection**:
   - Monitors search input fields on e-commerce sites
   - Identifies when a new search is performed

2. **Query Modification**:
   - Checks if the current search contains eco-friendly terms
   - If not, appends a random eco-friendly term from the predefined list
   - Automatically submits the modified search

3. **Eco-friendly Terms**:
   ```javascript
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
     // ... more terms
   ];
   ```

### 3. Product Filtering Process

1. **Product Detection**:
   - Uses site-specific selectors to identify product containers
   - Supports multiple e-commerce site layouts
   - Handles dynamic content loading

2. **Content Analysis**:
   - Extracts product titles and descriptions
   - Checks for eco-friendly keywords
   - Analyzes product attributes and specifications

3. **Filtering Logic**:
   - Hides non-eco-friendly products
   - Shows only products matching eco-friendly criteria
   - Maintains product visibility when filter is disabled

### 4. Dynamic Content Handling

- Uses MutationObserver to detect new products
- Automatically applies filtering to dynamically loaded content
- Handles infinite scroll implementations
- Updates filter when page content changes

## Usage Guide

1. **Installation**:
   - Download the extension files
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

2. **Basic Usage**:
   - Go to any supported e-commerce site
   - Search for a product (e.g., "water bottle")
   - Click the extension icon
   - Toggle the switch to ON
   - The extension will automatically modify your search and filter results

3. **Customizing Keywords**:
   - Click the extension icon
   - Modify the keywords in the text area
   - Click "Save Keywords" to apply changes
   - Click "Reset to Default" to restore original keywords

## Supported Websites

- Amazon (all domains: .com, .in, .co.uk, etc.)
- Walmart
- eBay
- Etsy
- Target

## Technical Requirements

- Chrome browser (version 88 or higher)
- Manifest V3 support
- JavaScript enabled
- Storage permissions

## Development

### File Structure
```
R3Vision/
├── manifest.json
├── content.js
├── background.js
├── popup.html
├── popup.js
├── popup.css
└── icons/
    ├── logo.png
    └── ...
```

### Building
1. Clone the repository
2. Install dependencies (if any)
3. Make modifications
4. Test in Chrome
5. Package for distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- Support for more e-commerce platforms
- Advanced filtering options
- Price comparison for eco-friendly products
- Carbon footprint estimation
- User reviews analysis for sustainability claims