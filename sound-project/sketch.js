let beat;
let song;
let amplitude;
let mic;


function preload(){
  beat = loadSound("sounds/beat.mp3")
  song = loadSound("sounds/song.mp3")
}

function setup() {
  createCanvas(400, 400);
  amplitude = new p5.Amplitude();
  mic = new p5.AudioIn();
  micStart();
}

function draw() {
  background(220);
  let level = mic.getLevel();
  console.log(level);
  let dia = map(level, 0.0, 1.0, 40, 200)

  fill(150, 210, 50)
  circle(200, 200, dia)

//   let vol = map(mouseX, 0, width, 0.0, 1.0);
//   song.setVolume(vol);

//   let pan = map(mouseY, 0, height, 0.5, 2.0)
//   song.pan(pan);
//   let rateVal = map(mouseX, 0, width, 0.5, 2.0);
//   song.rate(rateVal);
}

// function mousePressed(){
//   if (!song.isPlaying()){
//     song.loop();
//   }
//   // beat.play();
// }
