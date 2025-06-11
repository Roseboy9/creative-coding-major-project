class Bird {
  constructor(scaleFactor = 1, offsetX = 0, offsetY = 0) {
    this.scaleFactor = scaleFactor; // Scale relative to canvas size
    this.offsetX = offsetX; // Offset to center the bird
    this.offsetY = offsetY; // Offset to center the bird
    this.colors = {
      pale: [233, 230, 226], // #E9E6E2
      black: [0, 0, 0], // #000000
      ghost: [220, 220, 220], // #DCDCDC
      white: [240, 234, 226], // #F0EAE2
      cream: [249, 249, 249], // #F9F9F9
      greylight: [234, 234, 234], // #EAEAEA
      grey: [221, 221, 221], // #DDDDDD
    };
  }

  // Applying translation (to shift the coordinate system's origin), scaling (for proportionality in size during window resizing), and set noStroke once
  applyTransform() {
    push();
    translate(this.offsetX, this.offsetY);
    scale(this.scaleFactor);
    noStroke(); // Set once for all shapes
  }

  // Creating a function for the head and beak shape
  drawHead() {
    fill(this.colors.pale);
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
    fill(this.colors.ghost);
    beginShape();
    vertex(450, 200);
    vertex(520, 300);
    vertex(570, 100);
    endShape(CLOSE);
  }

  // Creating a function for the neck shape
  drawNeck() {
    fill(this.colors.ghost);
    beginShape();
    vertex(650, 250);
    vertex(520, 300);
    vertex(680, 400);
    endShape(CLOSE);
  }

  // Creating a function for the body shapes
  drawBody() {
    // Back
    fill(this.colors.greylight);
    beginShape();
    vertex(450, 200);
    vertex(520, 300);
    vertex(340, 330);
    endShape(CLOSE);

    // Side
    fill(this.colors.grey);
    beginShape();
    vertex(340, 330);
    vertex(220, 455);
    vertex(432, 530);
    endShape(CLOSE);

    // Chest
    fill(this.colors.cream);
    beginShape();
    vertex(220, 455);
    vertex(340, 330);
    vertex(100, 300);
    endShape(CLOSE);

    // Throat
    fill(this.colors.greylight);
    beginShape();
    vertex(680, 400);
    vertex(650, 500);
    vertex(520, 300);
    endShape(CLOSE);

    // Belly
    fill(this.colors.white);
    beginShape();
    vertex(340, 330);
    vertex(520, 300);
    vertex(650, 500);
    vertex(445, 560);
    endShape(CLOSE);
  }

  // Creating a function for the wing shapes
  drawWing() {
    fill(this.colors.pale);
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

    // Side
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
    fill(this.colors.white);
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
    fill(this.colors.ghost);
    beginShape();
    vertex(445, 560);
    vertex(500, 800);
    vertex(150, 800);
    vertex(170, 760);
    vertex(350, 700);
    endShape(CLOSE);

    fill(this.colors.white);
    beginShape();
    vertex(170, 760);
    vertex(350, 700);
    vertex(350, 501);
    vertex(300, 483);
    endShape(CLOSE);

    fill(this.colors.greylight);
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

class Background {
  constructor(numDots = 300) {
    this.numDots = numDots;
    this.dots = [];
    this.initializeDots();
  }

  //Initialise dots with random positions and velocities
  initializeDots() {
    this.dots = [];
    for (let i = 0; i < this.numDots; i++) {
      this.dots.push({
        x: random(width),
        y: random(height),
        size: random(2, 6),
        speed: p5.Vector.random2D().mult(random(0.3, 1))
      });
    }
  }

  // Update and draw dots
  draw() {
    fill(255, 255, 255, 60); // Semi-transparent white
    for (let d of this.dots) {
      circle(d.x, d.y, d.size);
      d.x += d.speed.x;
      d.y += d.speed.y;

      // Reset dot if it moves off-screen
      if (d.x < -50 || d.x > width + 50 || d.y < -50 || d.y > height + 50) {
        d.x = random(width);
        d.y = random(height);
        d.speed = p5.Vector.random2D().mult(random(0.3, 1));
      }
    }
  }

  // Reinitialize dots on canvas resize
  resize() {
    this.initializeDots();
  }
}

// Global instances
let bird;
let bg; 

// Store scaling/offset for reuse
let scaleFactor, offsetX, offsetY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  bg = new Background(300);
  updateTransforms();
}

function draw() {
  background(0, 0, 0, 20); // Semi-transparent black for fade effect
  bg.draw();
  bird.draw();
  drawOliveBranch(scaleFactor, offsetX, offsetY);
}

// To ensure that the canvas is resized and the bird updated when the window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateTransforms();
  bg.resize();
}

// Update the bird's scale and position based on canvas size
function updateTransforms() {
  scaleFactor = min(windowWidth, windowHeight) / 900;
  offsetX = windowWidth / 2 - (450 * scaleFactor);
  offsetY = windowHeight / 2 - (425 * scaleFactor);
  bird = new Bird(scaleFactor, offsetX, offsetY);
}

function drawOliveBranch(scaleFactor, offsetX, offsetY) {
  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);

  // Stem
  stroke(34, 139, 34); // Olive green
  strokeWeight(8);
  noFill();
  let centerX = 752;
  let centerY = 180;
  bezier(
    centerX, centerY + 80,
    centerX + 30, centerY - 25,
    centerX - 50, centerY - 120,
    centerX, centerY - 155
  );

  // Leaves
  noStroke();
  fill(34, 139, 34);
  push();
  translate(centerX - 3, centerY - 150);
  rotate(radians(-35));
  drawLeaf(80);
  pop();
  push();
  translate(centerX + 5, centerY - 20);
  rotate(radians(-20));
  drawLeaf(80);
  pop();
  push();
  translate(centerX - 81, centerY - 105);
  rotate(radians(30));
  drawLeaf(80);
  pop();
  pop();
}

function drawLeaf(length) {
  beginShape();
  vertex(0, 0);
  bezierVertex(length * 0.25, -length * 0.5, length * 0.50, -length * 0.5, length, 0);
  bezierVertex(length * 0.75, length * 0.5, length * 0., length * 0.5, 0, 0);
  endShape(CLOSE);
}
