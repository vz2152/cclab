let myBall;


function setup() {
  createCanvas(400, 400);
  myBall = new Ball(100, 200);
  myBall2 = new Ball(300, 300);

}

function draw() {
  background(220);
  myBall.move();
  myBall.display();

  myBall2.move();
  myBall2.display();
}

class Ball {
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.dia = 50;
  }
  move(){ // all the animations
    // this.y = cos(frameCount * 0.1) * 100 + 200
    this.y = sin(frameCount * 0.1) * 100 + 200
  
  }
  display(){ // all the drawings
    circle(this.x, this.y, this.dia);
    fill(20, 140, 40)

  }
}

