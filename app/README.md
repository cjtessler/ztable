# Standard Normal Distribution Web Tool

A client-side web application for teaching probability and statistics, featuring an interactive z-table, probability calculations, and normal curve visualization.

## Features

- **Interactive Z-Table**: Click any cell to select z-scores and probabilities with visual highlighting
- **Dual Table Support**: Toggle between positive and negative z-tables
- **Reverse Lookup**: Enter a z-score to find and highlight the corresponding probability
- **Normal Curve Visualization**: Canvas-based curve with left-tail area shading
- **Selection Saving**: Save selected z-score/probability pairs to localStorage
- **Responsive Design**: Optimized for desktop and tablet viewing

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Running the Application

1. **Local Development**:
   ```bash
   # Navigate to the project directory
   cd app
   
   # Serve the files using any local server
   # Option 1: Python
   python -m http.server 8000
   
   # Option 2: Node.js (if you have http-server installed)
   npx http-server .
   
   # Option 3: VS Code Live Server extension
   # Right-click index.html and select "Open with Live Server"
   ```

2. **Direct File Access**:
   - Simply open `index.html` in your web browser
   - Some features may be limited due to CORS restrictions

3. **GitHub Pages Deployment**:
   - Push to GitHub repository
   - Enable GitHub Pages in repository settings
   - Access via: `https://username.github.io/repository-name/`

## Usage Guide

### Z-Table Interaction
1. Click any probability cell in the z-table
2. The selected cell, row, and column will be highlighted
3. Z-score and probability information appears in the right panel
4. The normal curve updates with shaded left-tail area

### Reverse Lookup
1. Enter a z-score in the input field (-3.4 to 3.4)
2. Click "Lookup" or press Enter
3. The app will switch to the appropriate table and highlight the cell
4. The curve visualization updates accordingly

### Table Toggle
- Use the "Switch to Negative/Positive Z-Table" button
- Automatically switches between z ∈ [0, 3.4] and z ∈ [-3.4, 0]

### Saving Selections
1. Select any z-score/probability pair
2. Click "Save Current Selection"
3. View saved items in the "Saved Selections" panel
4. Click any saved item to re-select that z-score

## Technical Details

### Architecture
- **Frontend Only**: Pure client-side application
- **No Dependencies**: Built with vanilla JavaScript, HTML5, and CSS3
- **Data Generation**: Mathematical computation of z-table values
- **Storage**: Browser localStorage for persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Mathematical Implementation
- Standard Normal CDF using Abramowitz and Stegun approximation
- 4-decimal precision for probability values
- Z-score range: -3.4 to 3.4 with 0.01 increments

## Project Structure

```
app/
├── index.html              # Main HTML structure
├── styles/
│   └── main.css           # Complete styling and responsive design
├── js/
│   ├── zTableData.js      # Z-table data generation and calculations
│   ├── normalCurve.js     # Canvas-based curve visualization
│   └── app.js             # Main application logic and DOM handling
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Development

### Local Development Setup
1. Clone or download the project
2. Open the project folder in VS Code
3. Install the Live Server extension (optional)
4. Open `index.html` with Live Server or serve via local HTTP server

### Adding Features
- **New Visualizations**: Extend `normalCurve.js` class
- **Additional Statistics**: Add methods to `zTableData.js`
- **UI Enhancements**: Modify `main.css` and update `app.js` accordingly
- **Data Export**: Extend the saving functionality in `app.js`

## Future Enhancements (Roadmap)

- Right-tail and two-tail probability shading
- Export functionality for saved selections
- Mobile-responsive design
- Additional statistical distributions
- Probability range selection
- Interactive curve drawing

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across multiple browsers
5. Submit a pull request

## Support

For issues, questions, or contributions, please visit the project repository or contact the development team.
