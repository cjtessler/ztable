<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Standard Normal Distribution Web Tool

This is a client-side web application for teaching probability and statistics, built with vanilla JavaScript, HTML5 Canvas, and CSS.

## Project Structure
- `index.html` - Main HTML structure with responsive two-column layout
- `styles/main.css` - Complete CSS styling with responsive design
- `js/zTableData.js` - Z-table data generation and probability calculations
- `js/normalCurve.js` - Canvas-based normal curve visualization with shading
- `js/app.js` - Main application logic and DOM manipulation

## Key Features
- Interactive z-table with clickable cells and row/column highlighting
- Toggle between positive and negative z-tables
- Reverse z-score lookup functionality
- Canvas-based normal curve with left-tail area shading
- LocalStorage-based selection saving system
- Responsive design for tablet and desktop

## Technical Implementation
- Uses mathematical approximation (Abramowitz and Stegun) for standard normal CDF
- Canvas rendering with high-DPI support for curve visualization
- Event-driven architecture with clear separation of concerns
- CSS Grid and Flexbox for responsive layout

## Code Guidelines
- Follow ES6+ JavaScript standards
- Use semantic HTML5 elements
- Maintain accessibility considerations
- Keep mathematical calculations accurate to 4 decimal places
- Ensure cross-browser compatibility for modern browsers
