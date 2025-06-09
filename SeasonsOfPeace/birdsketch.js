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
      grey: '#36454f'
    };
}
  // Applying translation (to shift coordinate system's origin), scaling (for proportionality in size during window resizing), and set noStroke once
applyTransform() {
  push();
  translate(this.offsetX, this.offsetY);
  scale(this.scaleFactor);
  noStroke(); // Set once for all shapes
}

// Creating a function for the head and beak shape
drawHead() {
  fill(this.colors.gold);
  beginShape();
  vertex(570, 100);
  vertex(610, 98);
  vertex(750, 150);
  vertex(660, 210);
  vertex(650, 250);
  vertex(520, 300);
  endShape(CLOSE);

  // Eye
  fill(this.colors.black);
  ellipse(605, 140, 35, 35);
}

// Creating a function for the nape shape
drawNape() {
  fill(this.colors.green);
  beginShape();
  vertex(450, 200);
  vertex(520, 300);
  vertex(570, 100);
  endShape(CLOSE);
}

// Creating a function for the neck shape
drawNeck() {
  fill(this.colors.green);
  beginShape();
  vertex(650, 250);
  vertex(520, 300);
  vertex(680, 400);
  endShape(CLOSE);
}

// Creating a function for the body shapes
drawBody() {
  // Back
  fill(this.colors.blue);
  beginShape();
  vertex(450, 200);
  vertex(520, 300);
  vertex(340, 330);
  endShape(CLOSE);

  fill(this.colors.grey);
  beginShape();
  vertex(340, 330);
  vertex(220, 455);
  vertex(432, 530);
  endShape(CLOSE);

  fill(this.colors.cream);
  beginShape();
  vertex(220, 455);
  vertex(340, 330);
  vertex(100, 300);
  endShape(CLOSE);

  // Throat
  fill(this.colors.blue);
  beginShape();
  vertex(680, 400);
  vertex(650, 500);
  vertex(520, 300);
  endShape(CLOSE);

  // Belly
  fill(this.colors.orange);
  beginShape();
  vertex(340, 330);
  vertex(520, 300);
  vertex(650, 500);
  vertex(445, 560);
  endShape(CLOSE);
}

// Creating a function for the wing shapes
drawWing() {
  fill(this.colors.gold);
  beginShape();
  vertex(340, 330);
  vertex(230, 200);
  vertex(433, 220);
  endShape(CLOSE);

  fill(this.colors.cream);
  beginShape();
  vertex(230, 200);
  vertex(100, 50);
  vertex(340, 80);
  endShape(CLOSE);

  fill(this.colors.grey);
  beginShape();
  vertex(340, 80);
  vertex(450, 200);
  vertex(433, 220);
  vertex(230, 200);
  endShape(CLOSE);
}

// Creating a function for the tail shape
drawTail() {
  fill(this.colors.orange);
  beginShape();
  vertex(220, 455);
  vertex(100, 630);
  vertex(80, 550);
  vertex(0, 520);
  vertex(181, 405);
  endShape(CLOSE);
}

// Creating a function for the feather shapes
drawFeather() {
  fill(this.colors.green);
  beginShape();
  vertex(445, 560);
  vertex(500, 800);
  vertex(150, 800);
  vertex(170, 760);
  vertex(350, 700);
  endShape(CLOSE);

  fill(this.colors.gold);
  beginShape();
  vertex(170, 760);
  vertex(350, 700);
  vertex(350, 501);
  vertex(300, 483);
  endShape(CLOSE);

  fill(this.colors.blue);
  beginShape();
  vertex(350, 700);
  vertex(350, 501);
  vertex(432, 530);
  vertex(445, 560);
  endShape(CLOSE);
}

// Main draw method to render the entire bird
draw() {
  this.applyTransform();
  this.drawHead();
  this.drawNape();
  this.drawNeck();
  this.drawBody();
  this.drawWing();
  this.drawTail();
  this.drawFeather();
  pop();
 }
}

  // Global bird instance
let bird;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  background('#ffffff');
  // Instantiate bird with dynamic scale and centered position
  updateBird();
}

function draw() {
  bird.draw();
}

// To ensure that the canvas is resized and the bird updated when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateBird();
}

// Update bird's scale and position based on canvas size
function updateBird() {
  // Scale based on smaller dimension to fit the bird
  let scaleFactor = min(windowWidth, windowHeight) / 900;
  // Center the bird by offsetting to canvas center, accounting for original 900x900 coordinates
  let offsetX = windowWidth / 2 - (450 * scaleFactor); // Approximate center of bird's x-range
  let offsetY = windowHeight / 2 - (425 * scaleFactor); // Approximate center of bird's y-range
  bird = new Bird(scaleFactor, offsetX, offsetY);
}