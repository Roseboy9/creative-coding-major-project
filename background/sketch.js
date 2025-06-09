let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1.5);
  background(0);
  for (let i = 0; i < 300; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI), 
      speed: random(0.3, 1.2)
    });
  }
}

function draw() {
  background(0, 20); 

  stroke(180, 180, 180, 40); 

  for (let l of lines) {
    let len = 100; 
    let x2 = l.x + cos(l.angle) * len;
    let y2 = l.y + sin(l.angle) * len;
    line(l.x, l.y, x2, y2);

    l.x += cos(l.angle) * l.speed;
    l.y += sin(l.angle) * l.speed;

    
    if (l.x < -100 || l.x > width + 100 || l.y < -100 || l.y > height + 100) {
      l.x = random(width);
      l.y = random(height);
      l.angle = random(TWO_PI);
    }
  }
}
