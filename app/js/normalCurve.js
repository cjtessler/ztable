// Normal Curve Visualization using Canvas
class NormalCurve {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Prefer logical (CSS) pixels as the base size
    const cw = this.canvas.clientWidth || this.canvas.width;
    const ch = this.canvas.clientHeight || this.canvas.height;

    this.width = cw;
    this.height = ch;

    this.selectedZ = null;
    this.isNegativeTable = false;

    this.setupCanvas();
    this.draw();
  }
  
  setupCanvas() {
    const ratio = window.devicePixelRatio || 1;
    // Backing store = logical * ratio
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);
  }

  // Draw the complete normal curve with optional shading
  draw(zScore = null, isNegative = false) {
    this.selectedZ = zScore;
    this.isNegativeTable = isNegative;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Set up coordinate system
    const margin = 40;
    const plotWidth = this.width - 2 * margin;
    const plotHeight = this.height - 2 * margin;

    // Z-score range: -4 to 4
    const zMin = -4;
    const zMax = 4;
    const zRange = zMax - zMin;

    // Convert z-score to x coordinate
    const zToX = (z) => margin + ((z - zMin) / zRange) * plotWidth;

    // Convert normal curve value to y coordinate
    const valueToY = (value) => this.height - margin - value * plotHeight * 2.5;

    // Draw axes
    this.drawAxes(margin, plotWidth, plotHeight, zMin, zMax, zToX, valueToY);

    // Draw the normal curve
    this.drawCurve(zMin, zMax, zToX, valueToY);

    // Draw shading if z-score is selected
    if (zScore !== null) {
      this.drawShading(zScore, zMin, zMax, zToX, valueToY);
    }

    // Draw z-score marker if selected
    if (zScore !== null) {
      this.drawZMarker(zScore, zToX, valueToY);
    }
  }

  drawAxes(margin, plotWidth, plotHeight, zMin, zMax, zToX, valueToY) {
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 1;

    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(margin, this.height - margin);
    this.ctx.lineTo(margin + plotWidth, this.height - margin);
    this.ctx.stroke();

    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(margin, margin);
    this.ctx.lineTo(margin, this.height - margin);
    this.ctx.stroke();

    // X-axis labels
    this.ctx.fillStyle = "#333";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";

    for (let z = -3; z <= 3; z++) {
      const x = zToX(z);
      const y = this.height - margin + 15;

      // Tick mark
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.height - margin);
      this.ctx.lineTo(x, this.height - margin + 5);
      this.ctx.stroke();

      // Label
      this.ctx.fillText(z.toString(), x, y);
    }

    // Axis labels
    this.ctx.fillStyle = "#666";
    this.ctx.font = "14px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Z-Score", margin + plotWidth / 2, this.height - 5);

    this.ctx.save();
    this.ctx.translate(15, margin + plotHeight / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText("Probability Density", 0, 0);
    this.ctx.restore();
  }

  drawCurve(zMin, zMax, zToX, valueToY) {
    this.ctx.strokeStyle = "#2c3e50";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    const steps = 200;
    const stepSize = (zMax - zMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const z = zMin + i * stepSize;
      const y = this.standardNormalPDF(z);
      const x = zToX(z);
      const plotY = valueToY(y);

      if (i === 0) {
        this.ctx.moveTo(x, plotY);
      } else {
        this.ctx.lineTo(x, plotY);
      }
    }

    this.ctx.stroke();
  }

  drawShading(zScore, zMin, zMax, zToX, valueToY) {
    // Always shade left-tail area (from -infinity to z-score)
    this.ctx.fillStyle = "rgba(52, 152, 219, 0.3)";
    this.ctx.beginPath();

    const steps = 100;
    const endZ = Math.min(zScore, zMax);
    const stepSize = (endZ - zMin) / steps;

    // Start at bottom left
    this.ctx.moveTo(zToX(zMin), this.height - 40);

    // Draw curve from zMin to zScore
    for (let i = 0; i <= steps; i++) {
      const z = zMin + i * stepSize;
      const y = this.standardNormalPDF(z);
      const x = zToX(z);
      const plotY = valueToY(y);
      this.ctx.lineTo(x, plotY);
    }

    // Close the shape
    this.ctx.lineTo(zToX(endZ), this.height - 40);
    this.ctx.closePath();
    this.ctx.fill();

    // Add border to shaded area
    this.ctx.strokeStyle = "rgba(52, 152, 219, 0.8)";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawZMarker(zScore, zToX, valueToY) {
    const x = zToX(zScore);
    const y = valueToY(this.standardNormalPDF(zScore));

    // Vertical line
    this.ctx.strokeStyle = "#e74c3c";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(x, this.height - 40);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Marker point
    this.ctx.fillStyle = "#e74c3c";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
    this.ctx.fill();

    // Z-score label
    this.ctx.fillStyle = "#e74c3c";
    this.ctx.font = "bold 12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`z = ${zScore.toFixed(2)}`, x, y - 10);
  }

  // Standard normal probability density function
  standardNormalPDF(z) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  }

  // Update the curve with new z-score
  updateCurve(zScore, isNegative = false) {
    this.draw(zScore, isNegative);
  }

  // Clear the selection
  clearSelection() {
    this.draw();
  }

  // Resize canvas (for responsive design)
  resize() {
    this.setupCanvas();
    this.draw(this.selectedZ, this.isNegativeTable);
  }
}

// Initialize curve when DOM is loaded
let normalCurve;
