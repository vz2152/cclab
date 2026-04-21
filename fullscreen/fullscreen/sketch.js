
// my newjeans concert project :)

let allLightsticks = [];  // array of objects
let allParticles = [];
let allStars = [];

let myLightstick;
let clickCount = 0;
let currentPhase = 0;
let isHolding = false;
let stickColor = 0; // hue value

// memory messages that appear at the end
let memories = [
  "the first beat dropped and everyone screamed",
  "hanni looked right at me i think",
  "we all sang every word together",
  "i cried on the ride home"
];

let memoryIndex = 0;
let showMemory = false;
let memoryTimer = 0;
let currentMemory = "";


class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 4);
    this.brightness = random(100, 255);
    this.speed = random(0.01, 0.05);
  }

  update() {
    // make the star twinkle
    this.brightness = 150 + sin(frameCount * this.speed + this.x) * 80;
  }

  draw() {
    noStroke();
    fill(255, 200, 230, this.brightness);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = random(-3, 3);
    this.speedY = random(-4, -1);
    this.alpha = 255;
    this.size = random(4, 10);
    this.r = random(200, 255);
    this.g = random(50, 150);
    this.b = random(150, 255);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.1; // gravity
    this.alpha -= 5;
  }

  draw() {
    noStroke();
    fill(this.r, this.g, this.b, this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isDone() {
    return this.alpha <= 0;
  }
}

class Lightstick {
  constructor(x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.isPlayer = isPlayer;
    this.hue = random(280, 360);
    this.glowSize = random(20, 50);
    this.waveSpeed = random(0.02, 0.08);
    this.waveAmount = random(5, 15);
    this.offset = random(100);
  }

  update() {
    if (this.isPlayer) {
      // player stick follows the mouse
      this.x = mouseX;
      this.y = mouseY;

      // hold mouse to change color
      if (isHolding) {
        this.hue = this.hue + 1;
        if (this.hue > 360) {
          this.hue = 0;
        }
      }
    } else {
      // crowd sticks wave up and down
      this.y = this.startY + sin(frameCount * this.waveSpeed + this.offset) * this.waveAmount * (currentPhase + 1);

      // in later phases crowd sticks slowly change color too
      if (currentPhase >= 2) {
        this.hue = this.hue + 0.3;
        if (this.hue > 360) {
          this.hue = 0;
        }
      }
    }
  }

  draw() {
    // convert hue to rgb (i found this formula online)
    let r = 255;
    let g = 100;
    let b = 200;

    if (this.hue < 60) {
      r = 255; g = this.hue * 4; b = 100;
    } else if (this.hue < 180) {
      r = 80; g = 200; b = 255;
    } else if (this.hue < 270) {
      r = 80; g = 100; b = 255;
    } else {
      r = 255; g = 80; b = 200;
    }

    // draw the glow around the orb
    noStroke();
    fill(r, g, b, 30);
    ellipse(this.x, this.y, this.glowSize * 3);
    fill(r, g, b, 60);
    ellipse(this.x, this.y, this.glowSize * 1.5);

    // draw the orb 
    fill(r, g, b);
    if (this.isPlayer) {
      ellipse(this.x, this.y, 20);
    } else {
      ellipse(this.x, this.y, 12);
    }

    // draw the stick handle
    stroke(r, g, b, 150);
    strokeWeight(2);
    if (this.isPlayer) {
      line(this.x, this.y + 10, this.x, this.y + 60);
    } else {
      line(this.x, this.y + 6, this.x, this.y + 30);
    }

    // interaction between objects: if player is nearby, glow brighter
    if (!this.isPlayer && myLightstick != null) {
      let d = dist(this.x, this.y, myLightstick.x, myLightstick.y);
      if (d < 100) {
        noStroke();
        fill(r, g, b, 80);
        ellipse(this.x, this.y, this.glowSize * 3);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

}
  // make the stars
  for (let i = 0; i < 100; i++) {
    allStars.push(new Star());
  }

  // make the player lightstick
  myLightstick = new Lightstick(width / 2, height / 2, true);

  // make all the crowd lightsticks
  // 5 rows of 18 sticks
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 18; col++) {
      let x = map(col, 0, 17, 40, width - 40);
      let y = map(row, 0, 4, height * 0.6, height * 0.9);
      x += random(-10, 10);
      y += random(-5, 5);
      allLightsticks.push(new Lightstick(x, y, false));
    }
  }

function draw() {
  // draw the dark purple background
  background(15, 0, 30);

  // draw some purple/pink gradient lines at the top
  for (let y = 0; y < height * 0.7; y++) {
    let r = map(y, 0, height * 0.7, 15, 40);
    let g = map(y, 0, height * 0.7, 0, 5);
    let b = map(y, 0, height * 0.7, 30, 70);
    stroke(r, g, b);
    line(0, y, width, y);
  }

  // draw stars
  for (let i = 0; i < allStars.length; i++) {
    allStars[i].update();
    allStars[i].draw();
  }

  // draw a grid in later phases (y2k vibes)
  if (currentPhase >= 1) {
    stroke(180, 100, 255, 25);
    strokeWeight(0.5);
    for (let x = 0; x < width; x += 40) {
      line(x, 0, x, height * 0.7);
    }
    for (let y = 0; y < height * 0.7; y += 40) {
      line(0, y, width, y);
    }
  }

  // pink glow at bottom (stage light)
  if (currentPhase >= 1) {
    noStroke();
    fill(255, 80, 180, 20 * currentPhase);
    ellipse(width / 2, height * 0.88, width * 1.2, 100);
  }

  // dark floor since lights are off during concert
  noStroke();
  fill(8, 0, 18);
  rect(0, height * 0.91, width, height * 0.09);

  // pink line at stage edge
  stroke(255, 100, 180, 100);
  strokeWeight(1);
  line(0, height * 0.91, width, height * 0.91);

  // draw all the crowd lightsticks
  for (let i = 0; i < allLightsticks.length; i++) {
    allLightsticks[i].update();
    allLightsticks[i].draw();
  }

  // draw all the particles
  for (let i = allParticles.length - 1; i >= 0; i--) {
    allParticles[i].update();
    allParticles[i].draw();
    if (allParticles[i].isDone()) {
      allParticles.splice(i, 1);
    }
  }

  // draw player lightstick last so it's on top
  myLightstick.update();
  myLightstick.draw();

  // draw the hud text
  drawHUD();

  // show memory text in phase 4
  if (currentPhase >= 4) {
    memoryTimer++;
    if (memoryTimer > 300) {
      // show next memory every 5 seconds
      showMemory = true;
      currentMemory = memories[memoryIndex % memories.length];
      memoryIndex++;
      memoryTimer = 0;
    }
    if (showMemory) {
      fill(255, 255, 255, 200);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      text(currentMemory, width / 2, height / 2);
    }
  }

  // draw cursor
  noFill();
  stroke(255, 100, 200, 150);
  strokeWeight(1);
  ellipse(mouseX, mouseY, 25);
}


function drawHUD() { // something i just learned
  // top bar
  noStroke();
  fill(10, 0, 20, 200);
  rect(0, 0, width, 30);

  fill(255, 100, 180);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  text("newjeans concert :)", 15, 15);

  textAlign(RIGHT, CENTER);
  fill(200, 150, 255);
  text("clicks: " + clickCount + "/20   phase: " + currentPhase, width - 15, 15);

  // instructions at bottom
  fill(10, 0, 20, 180);
  rect(0, height - 28, width, 28);
  fill(255, 100, 180, 160);
  textAlign(CENTER, CENTER);
  textSize(11);
  if (currentPhase < 4) {
    text("click to wave your lightstick  *  hold to change color", width / 2, height - 14);
  } else {
    text("you are part of the moment", width / 2, height - 14);
  }
}


// mouse activitiess
function mousePressed() {
  isHolding = true;
  clickCount++;

  // spawn some particles where you clicked
  for (let i = 0; i < 10; i++) {
    allParticles.push(new Particle(mouseX, mouseY));
  }

  // check if any crowd sticks are nearby and change their color
  // this is the interaction between objects part
  for (let i = 0; i < allLightsticks.length; i++) {
    let d = dist(mouseX, mouseY, allLightsticks[i].x, allLightsticks[i].y);
    if (d < 120) {
      allLightsticks[i].hue = allLightsticks[i].hue + 40;
    }
  }

  // change phase based on clicks
  if (clickCount == 5) {
    currentPhase = 1;
    bigBurst();
  }
  if (clickCount == 10) {
    currentPhase = 2;
    bigBurst();
  }
  if (clickCount == 15) {
    currentPhase = 3;
    bigBurst();
  }
  if (clickCount >= 20 && currentPhase == 3) {
    currentPhase = 4;
    bigBurst();
  }
}

function mouseReleased() {
  isHolding = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function bigBurst() {
  // spawn a lot of particles when phase changes
  for (let i = 0; i < 40; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.8);
    allParticles.push(new Particle(x, y));
  }
}