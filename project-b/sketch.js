// my newjeans concert project :)
let gameStarted = false;

let allLightsticks = []; // array of objects
let allParticles = [];
let allStars = [];

let w = []; // word array

let myLightstick;
let clickCount = 0;
let currentPhase = 0;
let isHolding = false;
let stickColor = 0; // hue value

let currentVolume = 0; // starts silent
let targetVolume = 0; // stays silent until the user clicks start

// memory messages that appear at the end
let memories = [
  "the first beat dropped and everyone screamed",
  "hanni looked right at me i think",
  "we all sang every word together",
  "i cried on the ride home", ];

let memoryIndex = 0;
let showMemory = false;
let memoryTimer = 0;
let currentMemory = "";

// let different images appear and loop music in each phase (4)
// asset variables
let song1, song2, song3, song4;
let img1, img2, img3, img4;

function preload(){
  //load music
  song1 = loadSound('assets/ditto.mp3');
  song2 = loadSound('assets/hypeboy.mp3');
  song3 = loadSound('assets/eta.mp3');
  song4 = loadSound('assets/newjeans.mp3');

  //load images
  img1 = loadImage('assets/njs.jpg');
  img2 = loadImage('assets/nwjnspin.jpg');
  img3 = loadImage('assets/supershy-cover.jpg');
  img4 = loadImage('assets/y2k.jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 4);
    this.brightness = random(100, 255);
    this.speed = random(0.01, 0.5);
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
    this.r = random(130, 200);
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

class Word{
  constructor(word, x, y){
    this.word = word; 
    this.opacity = 255;
    this.x = x;
    this.y = y;
    this.tw = textWidth(this.word); // fixed
  }

  moveAndDisplay() {
    fill(255, 150, 200);
    textSize(50);;
    textAlign(LEFT);
    text(this.word, this.x, this.y);
    this.x -= 3;
  }
}

class Lightstick {
  constructor(x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.isPlayer = isPlayer;
    this.hue = random(0, 100);
    this.glowSize = random(10, 30);
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
      this.y =
        this.startY +
        sin(frameCount * this.waveSpeed + this.offset) *
          this.waveAmount * (currentPhase + 1);

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
    // convert hue to rgb that i found online
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

    let orbSize = this.isPlayer ? 20 : 12;
   let earW = orbSize * 0.5;
    let earH = orbSize * 1.1;
    let earOffset = orbSize * 0.35;

      // glow
    noStroke();
    fill(r, g, b, 30);
    ellipse(this.x, this.y, this.glowSize * 3);
    fill(r, g, b, 60);
   ellipse(this.x, this.y, this.glowSize * 1.5);

    // ears (two tall ovals behind the head)
    fill(r, g, b);
    ellipse(this.x - earOffset, this.y - orbSize * 0.7, earW, earH); // left ear
    ellipse(this.x + earOffset, this.y - orbSize * 0.7, earW, earH); // right ear

    // inner ear (slightly darker/pinker)
    fill(min(r + 40, 255), g * 0.5, min(b + 40, 255), 180);
    ellipse(this.x - earOffset, this.y - orbSize * 0.7, earW * 0.5, earH * 0.6);
    ellipse(this.x + earOffset, this.y - orbSize * 0.7, earW * 0.5, earH * 0.6);

    // bunny head
   fill(r, g, b);
   ellipse(this.x, this.y, orbSize);

   // little nose dot
   fill(255, 180, 210);
   ellipse(this.x, this.y + orbSize * 0.1, orbSize * 0.2, orbSize * 0.15);

    // stick handle
   stroke(r, g, b, 150);
   strokeWeight(4);
   if (this.isPlayer) {
   line(this.x, this.y + orbSize * 0.5, this.x, this.y + 60);
    } else {
    line(this.x, this.y + orbSize * 0.5, this.x, this.y + 30);
   }

   // nearby glow interaction
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

  input = createInput("enter your memory"); // type memory
  input.position(15, 50);
  input.mousePressed(typing);

  button = createButton("submit");
  button.position(175, 50);
  button.mousePressed(greet);

  //start the first song: ditto
  song1.loop();

  let crowdSize = width / 2;

  // make the stars
  for (let i = 0; i < crowdSize; i++) {
    allStars.push(new Star());
  }

  // make the player lightstick
  myLightstick = new Lightstick(width / 2, height / 2, true);
  console.log(myLightstick);

  // make the crowd lightsticks
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 18; col++) {
      let x = map(col, 0, 17, 40, width - 40);
      let y = map(row, 0, 4, height * 0.65, height * 0.9);
      x = x + random(-10, 10);
      y = y + random(-5, 5);
      allLightsticks.push(new Lightstick(x, y, false));
    }
  }
}
function draw() {

  if (!gameStarted){
    drawIntroScreen();
    return;
  }
  
  // draw purple background
  background(15, 0, 30);

  currentVolume = lerp(currentVolume, targetVolume, 0.01);
  song1.setVolume(currentVolume);
  song2.setVolume(currentVolume);
  song3.setVolume(currentVolume);
  song4.setVolume(currentVolume);

  // draw stars
  for (let i = 0; i < allStars.length; i++) { //stars loop
    allStars[i].update();
    allStars[i].draw();
  }

  textFont("monospace");
  textSize(30);
  noStroke();
  push();
  textStyle(BOLD);
  for (let i = w.length - 1; i >= 0; i--) {
  w[i].moveAndDisplay();
  if (w[i].x <= -w[i].tw) {
    w.splice(i, 1);
    }
  }
  pop();

  //draw phase images
  push();
  tint(255, 120); // lowers the opacity so that the lightsticks are still visible
  if (currentPhase === 0 || currentPhase === 1){
    image(img1, 0, 0, width, height);
  } else if (currentPhase === 2){
    image(img2, 0, 0, width, height);
  } else if (currentPhase === 3){
    image(img3, 0, 0, width, height);
  } else if(currentPhase === 4){
    image(img4, 0, 0, width, height);
  }
  pop();

  // draw a grid in later phases
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
  if (myLightstick != null){
     myLightstick.update();
     myLightstick.draw();
  }

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
  stroke(100, 100, 200, 150);
  strokeWeight(3);
  ellipse(mouseX, mouseY, 25, 30);
  ellipse(mouseX, mouseY, 40, 40)

  drawProgressBar();
}

function drawIntroScreen() {
  background(15, 0, 30);
  textAlign(CENTER, CENTER);
  
  fill(211, 211, 245);
  textSize(60);
  textStyle(BOLD);
  text("Lightstick.exe", width / 2, height / 2 - 40);

  textSize(24);
  textStyle(NORMAL);
  let pulse = map(sin(frameCount * 0.05), -1, 1, 100, 255);
  fill(211, 211, 245, pulse); 
  text("click anywhere to enter the concert venue!", width / 2, height / 2 + 40);
}

function drawHUD() {
  // something i just learned
  // top bar
  noStroke();
  fill(10, 0, 20, 200);
  rect(0, 0, width, 30);

  fill(255, 100, 180);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  text("bunnies.concert — lightstick.exe", 15, 15);


  //  at bottom of the page
  fill(10, 0, 20, 180);
  rect(0, height - 60, width, 60);
  fill(200, 210, 180, 160);
  textAlign(CENTER, CENTER);
  textSize(30);
  if (currentPhase < 3) {
    text(
      "my ears are ringing and my heart is singing", width / 2, height - 40);
  } else {
    text("✦ you are part of the moment ✦", width / 2, height - 40);
  }
}

//switch music
function changeTrack(newSong){
  song1.stop();
  song2.stop();
  song3.stop();
  song4.stop();
  newSong.loop();
}

// mouse activitiess
function mousePressed() {
  if (gameStarted === false) {
    gameStarted = true;
    // start playing the song

    targetVolume = 1.0; // start raising the volume
    return; 
  }


  isHolding = true;
  clickCount++;

  // spawn some particles where you clicked 
  for (let i = 0; i < 30; i++) {
    allParticles.push(new Particle(mouseX, mouseY));
  }

  // this is the interaction between objects part
  for (let i = 0; i < allLightsticks.length; i++) {
    let d = dist(mouseX, mouseY, allLightsticks[i].x, allLightsticks[i].y);
    if (d < 120) {
      allLightsticks[i].hue = allLightsticks[i].hue + 200;
    }
  }

  // change phase based on # of clicks AND switch da music
  if (clickCount == 4 && currentPhase !== 1){
    currentPhase = 1;
    bigBurst();
    //phase 1 still plays song1
  }
  if (clickCount == 8 && currentPhase !== 2){
    currentPhase = 2;
    bigBurst();
    changeTrack(song2); // Swap to song 2!
  }
  if (clickCount == 12 && currentPhase !== 3) {
    currentPhase = 3;
    bigBurst();
    changeTrack(song3); // Swap to song 3!
  }
  if (clickCount >= 16 && currentPhase == 3) {
    currentPhase = 4;
    bigBurst();
    changeTrack(song4); // Swap to song 4!
  }
}

function typing() { // enter memory
  input.value("");
}

function greet() {
  const sentiment = input.value();
  if (sentiment.length > 0) {
    for (let i = 0; i < 5; i++) {
      let typedword = new Word(
        sentiment,
        width + i * 350, // stagger them so they don't all appear at once
        random(80, height - 60)
      );
      w.push(typedword);
    }
    input.value("");
  }
}


function mouseReleased() {
  isHolding = false;
}

function bigBurst() {
  // spawn a lot of particles when phase changes
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.8);
    allParticles.push(new Particle(x, y));
  }
}

function drawProgressBar() {
  // set up the size and position
  let maxBarWidth = width; // make the bar take up 80% of the screen width
  let barHeight = 10; // thickness of the bar
  let x = 0; // center it on the X axis
  let y = 30; // place it near the bottom of the screen

  // draw the background track
  noStroke();
  fill(50, 50, 50, 150); // semi-transparent gray
  rect(x, y, maxBarWidth, barHeight); 

  // calculate how full the bar should be
  let fillWidth = map(clickCount, 0, 16, 0, maxBarWidth);
  fillWidth = constrain(fillWidth, 0, maxBarWidth); 

  // draw the filled progress
  fill(161, 204, 173);
  rect(x, y, fillWidth, barHeight); 
  
  stroke(15, 0, 30);
  strokeWeight(3);
  line(width * 0.25, y, width * 0.25, y + barHeight); // 4/16 mark
  line(width * 0.50, y, width * 0.50, y + barHeight); // 8/16 mark
  line(width * 0.75, y, width * 0.75, y + barHeight); // 12/16 mark

  if (fillWidth > 0) {
    noStroke();
    fill(255);
    let circleX = constrain(fillWidth, 0, maxBarWidth - 8)
    circle(x + fillWidth, y + barHeight / 2, barHeight + 6);
  }
  
}
