let x, y;
let targetX, targetY;
let state = "scurrying";
let timer = 0;
let clickCount = 0;
let householdItems = [];

function setup() {
let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  angleMode(DEGREES);
  x = width / 2;
  y = height / 2;

  // Define specific household objects
  householdItems = [
    { x: 100, y: 100, label: "sock", col: color(180, 160, 200) },
    { x: 450, y: 300, label: "mug", col: color(220, 50, 50) },
    { x: 300, y: 150, label: "coin", col: color(255, 215, 0) },
  ];

   pickNewTarget();
  }


function draw() {
  // wood floor color
  background(222, 184, 135);

  drawFloorDetails();
  drawObjects();

  // Behavior Logic
  if (state !== "running") {
    let dToTarget = dist(x, y, targetX, targetY);

    // If it reaches the target, pause to "inspect" it
    if (dToTarget < 5 && state !== "pausing") {
      state = "pausing";
      timer = millis();
    }

    // Wait 1.5 seconds at the object before picking a new one
    if (state === "pausing" && millis() - timer > 1500) {
      state = "scurrying";
      pickNewTarget();
    }
  }

  // Movement
  if (state === "scurrying") {
    x = lerp(x, targetX, 0.03);
    y = lerp(y, targetY, 0.03);
  } else if (state === "running") {
    x += 15; // Bolt off the right side
  }

drawToy(x, y);

  // add this logic at the very bottom of draw()
  if (mouseIsPressed) {
    drawPaw(mouseX, mouseY);
  } else {
    // a tiny dot so you know where you're aiming
    fill(0, 40);
    noStroke();
    circle(mouseX, mouseY, 5);
  }
}

function drawObjects() {
  householdItems.forEach((item) => {
    push();
    translate(item.x, item.y);
    fill(item.col);
    noStroke();
    if (item.label === "sock") {
      //purple
      rect(-10, 0, 25, 40, 10);
      rect(5, 0, 50, 20, 10);
    } else if (item.label === "mug") {
      //red
      rect(-15, -15, 30, 50, 3);
      noFill();
      stroke(item.col);
      strokeWeight(4);
      arc(15, 10, 20, 30, -100, 100);
    } else if (item.label === "coin") {
      //gold
      circle(0, 0, 40);
      fill(200, 160, 0);
      circle(0, 0, 30);
    }
    pop();
  });
}

function drawToy(tx, ty) {
  push();
  translate(tx, ty);

  // Interaction Visual: Pulse eyes blue when inspecting an object
  let eyeColor = color(200, 255, 0); // Normal
  if (state === "pausing") eyeColor = color(0, 200, 255); // Inspecting
  if (clickCount > 0) eyeColor = color(255, 0, 0); // Annoyed

  // Vibration
  translate(random(-1, 1), random(-1, 1));

  // Body (Dust Bunny)
  fill(80, 70, 70);
  noStroke();
  for (let i = 0; i < 80; i++) {
    rotate(45);
    ellipse(15, 10, 40, 25); // fuzzy tufts
  }

  // Eyes
  fill(eyeColor);
  circle(-11, -5, 10);
  circle(11, -5, 5);
  
 // Slight twitchy wave tail
  noFill();
  stroke(100);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < 50; i++) {
    // i is the length
    // Lowered the multiplier to 3 for a "slight" wave
    let xOffset = sin(frameCount * 8 + i * 10) * 3; 
    vertex(xOffset, 30 + i); 
  }
  endShape();
  pop();
}

function drawPaw(px, py) {
  push();
  translate(px, py);
  noStroke();
  fill(80, 50, 30, 200); // Dark brown "cat paw" color
  
  // Main palm pad
  ellipse(0, 5, 22, 18);
  
  // Four little toe pads
  circle(-10, -8, 8);
  circle(-4, -12, 8);
  circle(4, -12, 8);
  circle(10, -8, 8);
  pop();
}


function pickNewTarget() {
  // 70% chance to target a household object, 30% random floor spot
  if (random(1) < 0.7) {
    let targetObj = random(householdItems);
    targetX = targetObj.x;
    targetY = targetObj.y;
  } else {
    targetX = random(50, width - 50);
    targetY = random(50, height - 50);
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, x, y);
  if (d < 40) {
    clickCount++;
    if (clickCount >= 2) {
      state = "running";
    }
  }
}

function keyPressed() {
  if (key === " ") {
    x = -50; // Come back from the left
    y = random(height);
    state = "scurrying";
    clickCount = 0;
    pickNewTarget();
  }
}

function drawFloorDetails() {
  stroke(180, 140, 100);
  for (let i = 0; i < width; i += 60) {
    line(i, 0, i, height); // Floor planks
  }
  
}
