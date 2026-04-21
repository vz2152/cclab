let sketch = [];
let cat;
let sprout;
let spiral;

let curCat = 0;
let curSprout = 0;
let sproutY = 500;
let spiralY= 0;
let sproutSpeedY = 0;
let curSpiral = 0;

function preload() {
  for (let i = 1; i <= 2; i++) {
    //scanned.push(loadImage("20260311120631-" + i + ".jpg"));
    sketch.push(loadImage("my-sketches/20260320144614-" + i + ".jpg"));
  }
}

function setup() {
  createCanvas(800, 500);

  eraseBg(sketch, 10);
  spiral = crop(sketch, 0, 0, 585, 356);
  sprout = crop(sketch, 1600, 90, 650, 420);
  cat = crop(sketch, 1514, 1300, 830, 300);
}

function draw() {
  background(255);

  examples: cat
  push();
  translate(width-200, height-100);
  rotate(radians(180));
  imageMode(CENTER);
  image(
    cat[curCat],
    200,
    200,
    cat[0].width * 0.5,
    cat[0].height * 0.5
  );
  pop();

  curCat = floor((frameCount / 30) % cat.length);

  // sprout

  push();
  translate(width / 2, spiralY);
  rotate(radians(90));
  imageMode(CENTER);
  image(
    sprout[curSprout],
    0,
    0,
    sprout[0].width * 0.5,
    sprout[0].height * 0.5
  );
  pop();

  // // Sprout animation only has 2 frames
  //curSpiral = floor((frameCount / 10) % 2);

  sproutY += sproutSpeedY;
  sproutSpeedY += -0.5;
  if (sproutY < -100) {
    sproutY = 500;
    sproutSpeedY = 10;
  }

  // doodles, using sin()

  image(
    spiral[curSpiral],
    0,
    0,
    spiral[0].width * 0.5,
    spiral[0].height * 0.5,
  );

  // //curSpiral = floor(map(sin(frameCount / 10), -1, 1, 0, spiral.length));
  curSpiral = floor((frameCount / 10) % spiral.length);

  // image(
  //   doodles2[curDoodle2],
  //   400,
  //   300,
  //   doodles2[0].width * 0.5,
  //   doodles2[0].height * 0.5
  // );

  // let d = dist(mouseX, mouseY, 485, 355);
  // if (d < 100) {
  //   curDoodle2 = floor(map(sin(frameCount / 10), -1, 1, 0, doodles2.length));
  // }
}

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}
