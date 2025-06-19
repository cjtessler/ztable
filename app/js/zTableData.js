// Standard Normal Distribution Z-Table Data
// Covers z-scores from -3.5 to 3.5 with 0.01 increments

class ZTableData {
    constructor() {
        // Generate z-table data programmatically using the standard normal distribution
        this.positiveTable = this.generateZTable(false);
        this.negativeTable = this.generateZTable(true);
    }

    // Generate z-table using the standard normal CDF approximation
    generateZTable(isNegative = false) {
        const table = {};
        const startZ = isNegative ? -3.5 : 0.0;
        const endZ = isNegative ? 0.0 : 3.5;
        
        for (let z = startZ; z <= endZ; z += 0.1) {
            const zKey = Math.abs(z).toFixed(1);
            table[zKey] = {};
            
            for (let hundredths = 0; hundredths <= 9; hundredths++) {
                const actualZ = z + (hundredths * 0.01);
                const prob = this.standardNormalCDF(actualZ);
                const hundredthsKey = `0${hundredths}`.slice(-2);
                table[zKey][hundredthsKey] = prob.toFixed(4);
            }
        }
        
        return table;
    }

    // Standard Normal Cumulative Distribution Function approximation
    // Using the error function approximation for better accuracy
    standardNormalCDF(z) {
        // Using Abramowitz and Stegun approximation
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        const sign = z < 0 ? -1 : 1;
        z = Math.abs(z) / Math.sqrt(2.0);
        
        const t = 1.0 / (1.0 + p * z);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
        
        return 0.5 * (1.0 + sign * y);
    }

    // Get probability for a given z-score
    getProbability(z, isNegative = false) {
        const table = isNegative ? this.negativeTable : this.positiveTable;
        const zInt = Math.abs(z).toFixed(1);
        const zDec = Math.round((Math.abs(z) % 0.1) * 100).toString().padStart(2, '0');
        
        if (table[zInt] && table[zInt][zDec]) {
            return parseFloat(table[zInt][zDec]);
        }
        
        // Fallback to direct calculation if not in table
        return this.standardNormalCDF(z);
    }    // Get z-score from probability (inverse lookup)
    getZScore(probability, isNegative = false) {
        // For negative table (z < 0), we search probabilities < 0.5
        // For positive table (z >= 0), we search probabilities >= 0.5
        
        let bestZ = 0;
        let minDiff = Infinity;
        
        if (isNegative) {
            // Search negative table for probabilities < 0.5
            for (const zInt in this.negativeTable) {
                for (const zDec in this.negativeTable[zInt]) {
                    const prob = parseFloat(this.negativeTable[zInt][zDec]);
                    const diff = Math.abs(prob - probability);
                    
                    if (diff < minDiff) {
                        minDiff = diff;
                        const z = parseFloat(zInt) + (parseInt(zDec) / 100);
                        bestZ = -z; // Negative z-score
                    }
                }
            }
        } else {
            // Search positive table for probabilities >= 0.5
            for (const zInt in this.positiveTable) {
                for (const zDec in this.positiveTable[zInt]) {
                    const prob = parseFloat(this.positiveTable[zInt][zDec]);
                    const diff = Math.abs(prob - probability);
                    
                    if (diff < minDiff) {
                        minDiff = diff;
                        const z = parseFloat(zInt) + (parseInt(zDec) / 100);
                        bestZ = z; // Positive z-score
                    }
                }
            }
        }
        
        return bestZ;
    }

    // Get table data for rendering
    getTableData(isNegative = false) {
        return isNegative ? this.negativeTable : this.positiveTable;
    }

    // Get row headers (z-values)
    getRowHeaders(isNegative = false) {
        const table = isNegative ? this.negativeTable : this.positiveTable;
        return Object.keys(table).sort((a, b) => {
            const aVal = isNegative ? -parseFloat(a) : parseFloat(a);
            const bVal = isNegative ? -parseFloat(b) : parseFloat(b);
            return aVal - bVal;
        });
    }

    // Get column headers (hundredths)
    getColumnHeaders() {
        return ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    }    // Validate z-score is within range
    isValidZScore(z) {
        return z >= -3.5 && z <= 3.5;
    }

    // Format z-score for display
    formatZScore(z) {
        return z.toFixed(2);
    }

    // Format probability for display
    formatProbability(prob) {
        return prob.toFixed(4);
    }
}

// Create global instance
const zTableData = new ZTableData();
