// === Final Integrated Sketch: Background + Bird + Olive Branch ===
let colors;
let flagColors;
let bird;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  noLoop();

  // 多国旗颜色合集
  flagColors = [
    ['#0055A4', '#FFFFFF', '#EF4135'], // 法国 🇫🇷
    ['#000000', '#FF0000', '#FFCC00'], // 德国 🇩🇪
    ['#008C45', '#F4F5F0', '#CD212A'], // 意大利 🇮🇹
    ['#FFFFFF', '#BC002D'],            // 日本 🇯🇵
    ['#006AA7', '#FECC00']             // 瑞典 🇸🇪
  ];

  // 扁平展开用于 scatter 使用
  colors = [].concat(...flagColors);
  background(0);

  drawScatterDecorations(200);
  drawPatternCircles(20);
  updateBird();
  bird.draw();
  drawOliveBranch();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  drawScatterDecorations(200);
  drawPatternCircles(20);
  updateBird();
  bird.draw();
  drawOliveBranch();
}

function drawScatterDecorations(count) {
  let points = [];
  let attempts = 0;
  let maxAttempts = 10000;
  let minDist = 35;

  while (points.length < count && attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    let valid = true;
    for (let p of points) {
      if (dist(x, y, p.x, p.y) < minDist) {
        valid = false;
        break;
      }
    }
    if (valid) points.push({ x, y });
    attempts++;
  }

  for (let p of points) {
    fill(random(colors));
    noStroke();
    if (random() < 0.5) {
      circle(p.x, p.y, 12);
    } else {
      push();
      translate(p.x, p.y);
      rotate(random(360));
      triangle(-10, 8, 10, 8, 0, -12);
      pop();
    }
  }
}

function drawPatternCircles(n) {
  let circles = [];
  let attempts = 0;
  while (circles.length < n && attempts < 500) {
    let x = random(60, width - 60);
    let y = random(60, height - 60);
    let tooClose = false;
    for (let c of circles) {
      if (dist(x, y, c.x, c.y) < 70) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) circles.push({ x, y });
    attempts++;
  }
  for (let c of circles) {
    drawPatternCircle(c.x, c.y, 60);
  }
}

function drawPatternCircle(x, y, r) {
  push();
  translate(x, y);
  fill("black");
  stroke(0);
  ellipse(0, 0, r);
  noStroke();

  let palette = random(flagColors); // 随机一组国旗颜色
  let style = random();

  if (style < 0.5 && palette.length >= 2) {
    let c1 = random(palette);
    let c2 = random(palette);
    while (c2 === c1) c2 = random(palette);
    fill(c1);
    arc(0, 0, r, r, 90, 270, PIE);
    fill(c2);
    arc(0, 0, r, r, 270, 90, PIE);
  } else {
    fill(random(palette));
    ellipse(0, 0, r * 0.8);
  }

  pop();
}

function drawOliveBranch() {
  let scaleFactor = min(windowWidth, windowHeight) / 900;
  let offsetX = windowWidth / 2 - (450 * scaleFactor);
  let offsetY = windowHeight / 2 - (425 * scaleFactor);
  let centerX = offsetX + 750 * scaleFactor;
  let centerY = offsetY + 150 * scaleFactor;

  stroke(34, 139, 34);
  strokeWeight(10 * scaleFactor);
  noFill();
  bezier(centerX, centerY + 20 * scaleFactor,
         centerX + 10 * scaleFactor, centerY - 30 * scaleFactor,
         centerX - 10 * scaleFactor, centerY - 80 * scaleFactor,
         centerX, centerY - 120 * scaleFactor);

  fill(34, 139, 34);
  noStroke();
  push();
  translate(centerX, centerY - 125 * scaleFactor);
  rotate(radians(-59));
  drawLeaf(120 * scaleFactor);
  pop();
  push();
  translate(centerX + 5 * scaleFactor, centerY - 20 * scaleFactor);
  rotate(radians(-20));
  drawLeaf(100 * scaleFactor);
  pop();
  push();
  translate(centerX - 98 * scaleFactor, centerY - 100 * scaleFactor);
  rotate(radians(30));
  drawLeaf(100 * scaleFactor);
  pop();
}

function drawLeaf(length) {
  beginShape();
  vertex(0, 0);
  bezierVertex(length * 0.25, -length * 0.5, length * 0.75, -length * 0.5, length, 0);
  bezierVertex(length * 0.75, length * 0.5, length * 0.25, 0.5 * length, 0, 0);
  endShape(CLOSE);
}


function updateBird() {
  let scaleFactor = min(windowWidth, windowHeight) / 900;
  let offsetX = windowWidth / 2 - (450 * scaleFactor);
  let offsetY = windowHeight / 2 - (425 * scaleFactor);
  bird = new Bird(scaleFactor, offsetX, offsetY);
}

class Bird {
  constructor(scaleFactor = 1, offsetX = 0, offsetY = 0) {
    this.scaleFactor = scaleFactor;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
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

  applyTransform() {
    push();
    translate(this.offsetX, this.offsetY);
    scale(this.scaleFactor);
    noStroke();
  }

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
    fill(this.colors.black);
    ellipse(605, 140, 35, 35);
  }

  drawNape() {
    fill(this.colors.green);
    beginShape();
    vertex(450, 200);
    vertex(520, 300);
    vertex(570, 100);
    endShape(CLOSE);
  }

  drawNeck() {
    fill(this.colors.orange);
    beginShape();
    vertex(650, 250);
    vertex(520, 300);
    vertex(680, 400);
    endShape(CLOSE);
  }

  drawBody() {
    fill(this.colors.cream);
    beginShape();
    vertex(450, 200);
    vertex(520, 300);
    vertex(340, 330);
    endShape(CLOSE);
    fill(this.colors.red);
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
    fill(this.colors.blue);
    beginShape();
    vertex(680, 400);
    vertex(650, 500);
    vertex(520, 300);
    endShape(CLOSE);
    fill(this.colors.gold);
    beginShape();
    vertex(340, 330);
    vertex(520, 300);
    vertex(650, 500);
    vertex(445, 560);
    endShape(CLOSE);
  }

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
    fill(this.colors.blue);
    beginShape();
    vertex(340, 80);
    vertex(450, 200);
    vertex(433, 220);
    vertex(230, 200);
    endShape(CLOSE);
  }

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

  drawFeather() {
    fill(this.colors.red);
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
    fill(this.colors.green);
    beginShape();
    vertex(350, 700);
    vertex(350, 501);
    vertex(432, 530);
    vertex(445, 560);
    endShape(CLOSE);
  }

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
