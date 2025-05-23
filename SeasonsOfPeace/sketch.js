// Seasons of Peace — Responsive Background with All Seasons Animated
let seasonManager;
let snowflakes = [];
let leaves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  seasonManager = new SeasonManager();
  frameRate(60);
}

function draw() {
  seasonManager.update();
  seasonManager.display();

  if (seasonManager.currentSeason === 'winter') {
    if (frameCount % 5 === 0) {
      snowflakes.push({ x: random(width), y: 0 });
    }
    fill(255);
    noStroke();
    for (let i = 0; i < snowflakes.length; i++) {
      ellipse(snowflakes[i].x, snowflakes[i].y, 5, 5);
      snowflakes[i].y += 2;
    }
    snowflakes = snowflakes.filter(s => s.y < height);
  } else {
    snowflakes = [];
  }

  if (seasonManager.currentSeason === 'autumn') {
    if (frameCount % 7 === 0) {
      leaves.push({ x: random(width), y: 0, offset: random(TWO_PI) });
    }
    fill(255, 150, 0);
    noStroke();
    for (let i = 0; i < leaves.length; i++) {
      let leaf = leaves[i];
      let sway = sin(frameCount * 0.05 + leaf.offset) * 10;
      rect(leaf.x + sway, leaf.y, 10, 5);
      leaf.y += 2;
    }
    leaves = leaves.filter(l => l.y < height);
  } else {
    leaves = [];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class SeasonManager {
  constructor() {
    this.seasons = ['spring', 'summer', 'autumn', 'winter'];
    this.currentIndex = 0;
    this.currentSeason = this.seasons[this.currentIndex];
    this.lastChangeFrame = 0;
    this.changeInterval = 300;
  }

  update() {
    if (frameCount - this.lastChangeFrame > this.changeInterval) {
      this.currentIndex = (this.currentIndex + 1) % this.seasons.length;
      this.currentSeason = this.seasons[this.currentIndex];
      this.lastChangeFrame = frameCount;
    }
  }

  display() {
    let bg;
    if (this.currentSeason === 'spring') {
      bg = color(200, 255, 200);
    } else if (this.currentSeason === 'summer') {
      bg = color(255, 255, 180);
    } else if (this.currentSeason === 'autumn') {
      bg = color(255, 200, 150);
    } else if (this.currentSeason === 'winter') {
      bg = color(180, 220, 255);
    }
    background(bg);

    if (this.currentSeason === 'spring') {
      noStroke();
      fill(100, 200, 100);
      rect(0, height * 0.85, width, height * 0.15);

      stroke(80, 180, 80);
      strokeWeight(2);
      for (let x = 0; x < width; x += 8) {
        let h = random(20, 40);
        let angle = random(-0.2, 0.2);
        push();
        translate(x, height * 0.85);
        rotate(angle);
        line(0, 0, 0, -h);
        pop();
      }
    }

    if (this.currentSeason === 'summer') {
      push();
      translate(width - 100, 100);
      rotate(frameCount * 0.02);
      fill(255, 204, 0);
      noStroke();
      ellipse(0, 0, 80, 80);
      stroke(255, 200, 0);
      strokeWeight(2);
      for (let i = 0; i < 12; i++) {
        line(0, 0, 60, 0);
        rotate(PI / 6);
      }
      pop();
    }
  }
}