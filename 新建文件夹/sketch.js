
let cam;
let s = 20;
// let chars = [" ", ".", "-", "=", "+", "o", "%", "0", "$", "#", "@"];
let chars = [" ", "。", "一", "二", "三", "木", "水", "林", "森", "爱"];


function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO);
  cam.hide();
}

function draw() {
  background(0);
  push();
  scale(-1,1);
  translate(-width, 0);
  // image(cam, 0, 0);
  cam.loadPixels();

  for(let y = 0; y < height; y+=s){
    for(let x = 0; x < width; x+=s){
      let d = dist(mouseX, mouseY, x, y);
      let  size = map(d, 0, width, 0, 20);

      let index = (x + y * cam.width) * 4
      let r = cam.pixels[index];
      let b = cam.pixels[index + 1];
      let g = cam.pixels[index + 2];
      
      let avg = (r + g + b) / 3
      let charIndex = floor(map(avg, 0, 255, 0, chars.length))
      fill(255)
      textSize(16)
      text(chars[charIndex],x,y)
      // let size = map(avg, 0, 255, 0, s);

      // fill(r, g, 255);
      // circle(x,y,s);
    }
  }
  pop();
}

