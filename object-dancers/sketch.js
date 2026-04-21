/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;
function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new CatDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class CatDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY + 200;
    // add properties for your dancer here:
    // properties for movement
    this.angle = 0; // spinning
    this.jumpOffset = 0; // vertical movement
    this.timer = 0; // progress tracker for the jump math
    this.noiseOffset = random(1000); // random starting point for noise

    this.eyeH = 8; 
    this.blink = 8;

    this.shake = 0;
    // For Mouse Interaction
    this.extraJump = 0;
  }
  update() {
  // 1. Natural Wandering (Noise)
    let n = noise(this.noiseOffset + frameCount * 0.02);
    let drift = map(n, 0, 1, -15, 15); 
    this.noiseOffset += 0.01;

    // 2. Smooth Combined Jump (Sine + Noise)
    this.timer += 0.08; 
    // We only calculate this ONCE so it doesn't flicker
    this.jumpOffset = (sin(this.timer) * 30) + drift; 

    // 3. Mouse Jump (Lerp for smoothness)
    if (mouseIsPressed) {
      this.extraJump = lerp(this.extraJump, -100, 0.1); 
    } else {
      this.extraJump = lerp(this.extraJump, 0, 0.1);   
    }

    // 4. Constant Smooth Spin (Moved outside the IF statement)
    this.angle += 0.04; 

    // 5. Random Twitch (The "Good" Glitch)
    this.shake = sin(frameCount * 0.05) * 0.1;
    if (random(1) > 0.98) {
      this.shake += random(-0.3, 0.3); 
    }

    // 6. Blink logic
    let blinkSpeed = abs(sin(frameCount * 0.07));
    this.blink = (blinkSpeed > 0.96) ? 1 : this.eyeH;
  
    // update properties here to achieve
    // dancer's desired moves and behaviour
    
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y + this.jumpOffset + this.extraJump);
    rotate(this.angle + this.shake); // rotate the cat

    // ⬇️ draw your dancer from here ⬇️
    noStroke();
    // Body changes color slightly when clicked!
    if (mouseIsPressed) fill(200, 255, 150); 
    else fill(150, 255, 100); // Lime Green

    // Ears
    triangle(-25, -20, -25, -40, 0, -20); // left ear
    triangle(25, -20, 25, -40, 0, -20);   // right ear

    //Antennas
   stroke(150, 255, 100);
    strokeWeight(2);
    line(-8, -25, -15, -50 + this.shake * 10);
    line(8, -25, 15, -50 - this.shake * 10);


    // Face+Body
    ellipse(0, 0, 60, 55);

    // Whiskers
    stroke(255); // white whiskers
    strokeWeight(1);
    // Left side
    line(-15, 5, -45, 0);
    line(-15, 8, -45, 10);
    line(-15, 11, -45, 20);
    // Right side
    line(15, 5, 45, 0);
    line(15, 8, 45, 10);
    line(15, 11, 45, 20);
    
    noStroke();

    // Eyes
    fill(0);
    ellipse(-12, -5, 8, this.blink); // left eye
    ellipse(12, -5, 8, this.blink);  // right eye

    // Nose
    fill(255, 150, 150);
    triangle(-4, 2, 4, 2, 0, 6);

    // Paws
    fill(150, 255, 100);
    // Paws "reach out" when jumping high
    let pawReach = mouseIsPressed ? 10 : 0;
    ellipse(-20, 25 + pawReach, 15, 10); // left
    ellipse(20, 25 + pawReach, 15, 10); // right
   


    // lets add some randomness to the dance moves 
    // add mouse pressed interactions
    // add sine and noise to make the movements more natural
    
    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes()

    pop();
  }
  // drawReferenceShapes() {
  //   noFill();
  //   stroke(255, 0, 0);
  //   line(-5, 0, 5, 0);
  //   line(0, -5, 0, 5);
  //   stroke(255);
  //   rect(-100, -100, 200, 200);
  //   fill(255);
  //   stroke(0);
}


/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/