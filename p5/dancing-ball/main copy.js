const SCALE = 400;
const SCALE2 = SCALE / 2;

class Ball {
  constructor() {
    this.r = 5;
    this.x = random(-SCALE2, SCALE2);
    this.y = random(-SCALE2, SCALE2);
    this.z = random(-SCALE2, SCALE2);

    this.xspeed = 4;
    this.yspeed = 4;
    this.zspeed = 4;

    this.velocity = {
      x: 1,
      y: 1,
      z: 1,
    };

    this.velInc = 0.01;
    this.friction = 0.9998;
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.z += this.zspeed;

    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.z *= this.friction;

    this.xspeed *= this.velocity.x;
    this.yspeed *= this.velocity.y;
    this.zspeed *= this.velocity.z;

    const t = Math.abs(this.xspeed + this.yspeed + this.zspeed);
    if (t < 0.01 || t > 8) {
      this.xspeed = 4;
      this.yspeed = 4;
      this.zspeed = 4;

      this.velocity = {
        x: 1,
        y: 1,
        z: 1,
      };
    }

    if (this.x > SCALE2 || this.x < -SCALE2) {
      this.xspeed *= -1;
      this.velocity.x += this.velInc;
    }

    if (this.y > SCALE2 || this.y < -SCALE2) {
      this.yspeed *= -1;
      this.velocity.y += this.velInc;
    }

    if (this.z > SCALE2 || this.z < -SCALE2) {
      this.zspeed *= -1;
      this.velocity.z += this.velInc;
    }
  }
}

const PI2 = Math.PI * 2;
const GRAVITY = 0.99999;

const getSquareNoise = (n = 0, scale = 5) => Math.round(noise(n / 100) * scale);

const myBallz = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  smooth();

  for (const i of [...Array(1 || 500)]) {
    myBallz.push(new Ball(32));
  }
}

function draw() {
  background(0);
  orbitControl(5, 5, 0.1);
  push();
  stroke(255);
  noFill();
  box(SCALE);
  pop();
  // Move and display balls
  myBallz.forEach((i) => {
    i.move();

    push();
    noStroke();
    translate(i.x, i.y, i.z);
    fill(255);
    sphere(20);
    pop();
  });
}
