
let backTrack;
let x= [];
let y= [];
let img;
let sounds= [];

function preload(){
  backTrack= loadSound("assets/my-sounds/00.mp3")
  for (let i=1; i<8; i++){
    // sounds.push(loadSound("assets/my-sounds/0" +i + ".mp3"))
  }
  img = loadImage("assets/images/asterisk.png")
}

function setup() {
  createCanvas(400, 400);
  backTrack.loop();
}

function draw() {
  background(100,38,48);
  for(let i=0; i<x.length; i++){

    drawCircle(x[i], y[i]);
  }
}

function drawCircle(x, y){
  noStroke();
  fill(40,10,100);
  // circle(x, y, 30);
  image(img, x, y); //
}

function mousePressed(){
  x.push(mouseX);
  y.push(mouseY);
  // let index = (x.length - 1) % sounds.length
  // sounds[index].play();

  let index = floor(map(mouseY, 0, height, 0, sounds.length - 1))
  console.log(index)
  console.log(sounds.length)
}