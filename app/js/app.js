// Main Application Logic for Standard Normal Distribution Tool
class StandardNormalApp {
    constructor() {
        this.isNegativeTable = false;
        this.selectedZ = null;
        this.selectedProb = null;
        this.selectedCell = null;
        this.savedSelections = [];
        
        this.initializeElements();
        this.loadSavedSelections();
        this.setupEventListeners();
        this.renderTable();
        this.normalCurve = new NormalCurve('normalCurve');
    }    initializeElements() {
        // Table elements
        this.zTable = document.getElementById('zTable');
        this.tableTitle = document.getElementById('tableTitle');
        this.toggleTableBtn = document.getElementById('toggleTable');
        
        // Input elements
        this.zInput = document.getElementById('zInput');
        this.lookupBtn = document.getElementById('lookupBtn');
        
        // Info display elements
        this.selectedZSpan = document.getElementById('selectedZ');
        this.selectedProbSpan = document.getElementById('selectedProb');
        this.areaValueSpan = document.getElementById('areaValue');
        
        // Saved selections elements
        this.saveSelectionBtn = document.getElementById('saveSelection');
        this.savedList = document.getElementById('savedList');
        
        // Curve expand elements
        this.expandCurveBtn = document.getElementById('expandCurve');
        this.curveSection = document.querySelector('.curve-section');
        this.isExpanded = false;
    }

    setupEventListeners() {
        // Toggle table button
        this.toggleTableBtn.addEventListener('click', () => {
            this.toggleTable();
        });

        // Reverse lookup
        this.lookupBtn.addEventListener('click', () => {
            this.performReverseLookup();
        });

        this.zInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performReverseLookup();
            }
        });        // Save selection button
        this.saveSelectionBtn.addEventListener('click', () => {
            this.saveCurrentSelection();
        });

        // Expand curve button
        this.expandCurveBtn.addEventListener('click', () => {
            this.toggleCurveExpansion();
        });

        // Close expanded view on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isExpanded) {
                this.toggleCurveExpansion();
            }
        });

        // Window resize handler for canvas
        window.addEventListener('resize', () => {
            if (this.normalCurve) {
                this.normalCurve.resize();
            }
        });
    }

    renderTable() {
        const tableData = zTableData.getTableData(this.isNegativeTable);
        const rowHeaders = zTableData.getRowHeaders(this.isNegativeTable);
        const colHeaders = zTableData.getColumnHeaders();

        // Clear existing table
        this.zTable.innerHTML = '';

        // Create header row
        const headerRow = document.createElement('tr');
        const cornerCell = document.createElement('th');
        cornerCell.textContent = 'z';
        headerRow.appendChild(cornerCell);

        colHeaders.forEach(col => {
            const th = document.createElement('th');
            th.textContent = `.${col}`;
            headerRow.appendChild(th);
        });

        this.zTable.appendChild(headerRow);

        // Create data rows
        rowHeaders.forEach(row => {
            const tr = document.createElement('tr');
            
            // Row header
            const rowHeaderCell = document.createElement('td');
            const zValue = this.isNegativeTable ? `-${row}` : row;
            rowHeaderCell.textContent = zValue;
            tr.appendChild(rowHeaderCell);

            // Data cells
            colHeaders.forEach(col => {
                const td = document.createElement('td');
                const probability = tableData[row][col];
                td.textContent = probability;
                td.className = 'probability-cell';
                td.dataset.z = this.isNegativeTable ? 
                    (-(parseFloat(row) + parseFloat(col) / 100)).toFixed(2) :
                    (parseFloat(row) + parseFloat(col) / 100).toFixed(2);
                td.dataset.prob = probability;
                
                // Add click listener
                td.addEventListener('click', (e) => {
                    this.selectCell(e.target);
                });

                tr.appendChild(td);
            });

            this.zTable.appendChild(tr);
        });

        // Update table title
        this.tableTitle.textContent = this.isNegativeTable ? 'Negative Z-Table' : 'Positive Z-Table';
        this.toggleTableBtn.textContent = this.isNegativeTable ? 
            'Switch to Positive Z-Table' : 'Switch to Negative Z-Table';
    }    selectCell(cell) {
        // Clear previous selection
        this.clearSelection();

        // Set new selection
        this.selectedCell = cell;
        this.selectedZ = parseFloat(cell.dataset.z);
        this.selectedProb = parseFloat(cell.dataset.prob);

        // Highlight cell, row, and column
        cell.classList.add('selected-cell');
        
        // Highlight row (including row header)
        const row = cell.parentElement;
        Array.from(row.children).forEach(td => {
            if (!td.classList.contains('selected-cell')) {
                td.classList.add('highlighted-row');
            }
        });

        // Highlight column (including column header)
        const cellIndex = Array.from(row.children).indexOf(cell);
        const table = cell.closest('table');
        Array.from(table.rows).forEach((tr, rowIndex) => {
            const targetCell = tr.children[cellIndex];
            if (targetCell && !targetCell.classList.contains('selected-cell')) {
                targetCell.classList.add('highlighted-col');
            }
        });

        // Update info display
        this.updateInfoDisplay();

        // Update normal curve
        this.normalCurve.updateCurve(this.selectedZ, this.isNegativeTable);

        // Enable save button
        this.saveSelectionBtn.disabled = false;
    }clearSelection() {
        // Remove all highlights from both td and th elements
        const allCells = this.zTable.querySelectorAll('td, th');
        allCells.forEach(cell => {
            cell.classList.remove('selected-cell', 'highlighted-row', 'highlighted-col');
        });

        // Clear selection data
        this.selectedCell = null;
        this.selectedZ = null;
        this.selectedProb = null;

        // Disable save button
        this.saveSelectionBtn.disabled = true;
    }

    updateInfoDisplay() {
        if (this.selectedZ !== null && this.selectedProb !== null) {
            this.selectedZSpan.textContent = zTableData.formatZScore(this.selectedZ);
            this.selectedProbSpan.textContent = zTableData.formatProbability(this.selectedProb);
            this.areaValueSpan.textContent = zTableData.formatProbability(this.selectedProb);
        } else {
            this.selectedZSpan.textContent = 'None';
            this.selectedProbSpan.textContent = 'None';
            this.areaValueSpan.textContent = 'None';
        }
    }

    toggleTable() {
        this.isNegativeTable = !this.isNegativeTable;
        this.clearSelection();
        this.renderTable();
        this.updateInfoDisplay();
        this.normalCurve.clearSelection();
    }

    performReverseLookup() {
        const zValue = parseFloat(this.zInput.value);
        
        if (isNaN(zValue) || !zTableData.isValidZScore(zValue)) {
            alert('Please enter a valid z-score between -3.4 and 3.4');
            return;
        }

        // Determine which table to use based on z-value sign
        const shouldUseNegativeTable = zValue < 0;
        
        // Switch table if necessary
        if (shouldUseNegativeTable !== this.isNegativeTable) {
            this.isNegativeTable = shouldUseNegativeTable;
            this.renderTable();
        }

        // Find and select the corresponding cell
        const targetZ = zValue.toFixed(2);
        const targetCell = this.zTable.querySelector(`[data-z="${targetZ}"]`);
        
        if (targetCell) {
            this.selectCell(targetCell);
            
            // Scroll cell into view
            targetCell.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
        } else {
            // If exact match not found, get closest probability
            const probability = zTableData.getProbability(zValue, shouldUseNegativeTable);
            
            // Update displays without cell selection
            this.selectedZ = zValue;
            this.selectedProb = probability;
            this.updateInfoDisplay();
            this.normalCurve.updateCurve(zValue, shouldUseNegativeTable);
            this.saveSelectionBtn.disabled = false;
        }
    }

    saveCurrentSelection() {
        if (this.selectedZ !== null && this.selectedProb !== null) {
            const selection = {
                zScore: this.selectedZ,
                probability: this.selectedProb,
                timestamp: new Date().toISOString()
            };

            this.savedSelections.push(selection);
            this.saveTolocalStorage();
            this.renderSavedSelections();
        }
    }

    loadSavedSelections() {
        const saved = localStorage.getItem('standard-normal-selections');
        if (saved) {
            try {
                this.savedSelections = JSON.parse(saved);
                this.renderSavedSelections();
            } catch (e) {
                console.error('Error loading saved selections:', e);
                this.savedSelections = [];
            }
        }
    }

    saveTolocalStorage() {
        try {
            localStorage.setItem('standard-normal-selections', JSON.stringify(this.savedSelections));
        } catch (e) {
            console.error('Error saving selections:', e);
        }
    }

    deleteSelection(index) {
        if (index >= 0 && index < this.savedSelections.length) {
            this.savedSelections.splice(index, 1);
            this.saveTolocalStorage();
            this.renderSavedSelections();
        }
    }

    renderSavedSelections() {
        this.savedList.innerHTML = '';

        if (this.savedSelections.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No saved selections yet.';
            emptyMsg.style.color = '#666';
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '1rem';
            this.savedList.appendChild(emptyMsg);
            return;
        }        this.savedSelections.forEach((selection, index) => {
            const item = document.createElement('div');
            item.className = 'saved-item';

            // Create content container for the clickable area
            const content = document.createElement('div');
            content.className = 'saved-item-content';

            const zValue = document.createElement('span');
            zValue.className = 'z-value';
            zValue.textContent = `z = ${zTableData.formatZScore(selection.zScore)}`;

            const probValue = document.createElement('span');
            probValue.className = 'prob-value';
            probValue.textContent = `P = ${zTableData.formatProbability(selection.probability)}`;

            content.appendChild(zValue);
            content.appendChild(probValue);

            // Add click handler to re-select this value
            content.addEventListener('click', () => {
                this.zInput.value = selection.zScore;
                this.performReverseLookup();
            });

            content.title = 'Click to select this z-score';

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.title = 'Delete this saved selection';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the item click
                if (confirm('Are you sure you want to delete this saved selection?')) {
                    this.deleteSelection(index);
                }
            });

            item.appendChild(content);
            item.appendChild(deleteBtn);
            this.savedList.appendChild(item);
        });
    }

    toggleCurveExpansion() {
        this.isExpanded = !this.isExpanded;
          if (this.isExpanded) {
            // Add expanded class
            this.curveSection.classList.add('curve-expanded');
            this.expandCurveBtn.textContent = 'Close';
            
            // Resize canvas for larger view
            const canvas = document.getElementById('normalCurve');
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;
            
            // Store original dimensions
            canvas.dataset.originalWidth = originalWidth;
            canvas.dataset.originalHeight = originalHeight;
            
            // Set much larger dimensions for expanded view
            const expandedWidth = Math.min(window.innerWidth * 0.9, 1600);
            const expandedHeight = Math.min(window.innerHeight * 0.65, 900);
            
            // Update both canvas attributes and style
            canvas.width = expandedWidth;
            canvas.height = expandedHeight;
            canvas.style.width = expandedWidth + 'px';
            canvas.style.height = expandedHeight + 'px';
              // Force a redraw by recreating the NormalCurve instance
            this.normalCurve = new NormalCurve('normalCurve');
            
            // Restore the current selection if any
            if (this.selectedZ !== null) {
                this.normalCurve.updateCurve(this.selectedZ, this.isNegativeTable);
            }
        } else {
            // Remove expanded class
            this.curveSection.classList.remove('curve-expanded');
            this.expandCurveBtn.textContent = 'Expand';
            
            // Restore original canvas dimensions
            const canvas = document.getElementById('normalCurve');
            const originalWidth = canvas.dataset.originalWidth || 400;
            const originalHeight = canvas.dataset.originalHeight || 300;
            
            // Update both canvas attributes and style
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            canvas.style.width = originalWidth + 'px';
            canvas.style.height = originalHeight + 'px';
            
            // Force a redraw by recreating the NormalCurve instance
            this.normalCurve = new NormalCurve('normalCurve');
            
            // Restore the current selection if any
            if (this.selectedZ !== null) {
                this.normalCurve.updateCurve(this.selectedZ, this.isNegativeTable);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StandardNormalApp();
});
