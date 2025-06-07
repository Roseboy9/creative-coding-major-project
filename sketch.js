function setup() {
    createCanvas(400, 400);
    background(255);
  
    // Move structure lower and farther to the right
    let centerX = width / 2 + 80;   // pushed farther right
    let centerY = height / 2 + 60;  // slightly lower
  
    // Draw the curved green stalk
    stroke(34, 139, 34);
    strokeWeight(10);
    noFill();
    bezier(centerX, centerY + 120, centerX + 10, centerY + 20, centerX - 10, centerY - 80, centerX, centerY - 120);
  
    fill(34, 139, 34);
    noStroke();
  
    // Top Leaf – tip of stalk
    push();
    translate(centerX, centerY - 115);
    rotate(radians(-59));
    drawLeaf(120);
    pop();
  
    // Right Leaf – upper-mid curve
    push();
    translate(centerX + 5, centerY + 40);
    rotate(radians(-20));
    drawLeaf(100);
    pop();
  
    // Left Leaf – lower curve
    push();
    translate(centerX - 93, centerY - 100);
    rotate(radians(30));
    drawLeaf(100);
    pop();
  }
  
  // Leaf drawing function
  function drawLeaf(length) {
    beginShape();
    vertex(0, 0);
    bezierVertex(length * 0.25, -length * 0.5, length * 0.75, -length * 0.5, length, 0);  // top curve
    bezierVertex(length * 0.75, length * 0.5, length * 0.25, 0.5 * length, 0, 0);         // bottom curve
    endShape(CLOSE);
  }
  
  