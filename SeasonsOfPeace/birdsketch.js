class Bird {
    constructor(scaleFactor = 1, offsetX = 0, offsetY = 0) {
      this.scaleFactor = scaleFactor; // Scale relative to canvas size
      this.offsetX = offsetX; // Offset to center the bird
      this.offsetY = offsetY; // Offset to center the bird
      this.colors = {
        gold: '#d4af37',
        black: '#000000',
        green: '#008000',
        orange: '#ff6e00',
        cream: '#f0e68c',
        blue: '#0096c7',
        red: '#ff2c2c'
      };
    }

    // Applying translation (to shift coordinate system's origin), scaling (for proportionality in size during window resizing), and set noStroke once
  applyTransform() {
    push();
    translate(this.offsetX, this.offsetY);
    scale(this.scaleFactor);
    noStroke(); // Set once for all shapes
 }

}