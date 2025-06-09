let dots = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);

  for (let i = 0; i < 300; i++) {
    dots.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),  
      speed: p5.Vector.random2D().mult(random(0.3, 1))
    });
  }
}

function draw() {
  background(0, 20); 

  fill(255, 60); 
  for (let d of dots) {
    circle(d.x, d.y, d.size);
    d.x += d.speed.x;
    d.y += d.speed.y;

    
    if (d.x < -50 || d.x > width + 50 || d.y < -50 || d.y > height + 50) {
      d.x = random(width);
      d.y = random(height);
      d.speed = p5.Vector.random2D().mult(random(0.3, 1));
    }
  }
}
