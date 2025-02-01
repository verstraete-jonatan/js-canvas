const isAinB = (a, b) =>
  a.y >= b.y && a.y <= b.y + b.h && a.x >= b.x && a.x <= b.x + b.w;

/**  (BETA) applying physics to element */
function applyPhysics() {
  let currentPlatform = Game.ground;

  if (this.y != Game.ground) {
    textCenter("------------");
    // if (!isAinB(this, this.currentPlatform)) {
    // if is above platform
    for (const v of Game.foreground.values()) {
      ctx.lineWidth = 5;
      rect(v.x, v.y - 30, v.x + v.w, v.y + v.h, "blue");

      if (
        this.y >= v.y - 30 &&
        this.y <= v.y + v.h &&
        this.x >= v.x &&
        this.x <= v.x + v.w
      ) {
        this.currentPlatform = v;
        currentPlatform = v.y;
        rect(v.x, v.y, v.x + v.w, v.y + v.h, "green");
        break;
      }
    }
    // } else {
    //   currentPlatform = this.currentPlatform.y;
    // }
  }

  textCenter(
    `${this.currentPlatform.y}-${currentPlatform}--${this.y}-${Game.ground}`
  );
  rect(0, currentPlatform, Xmax, currentPlatform, "green");
  // textCenter(
  //   JSON.stringify({ acc: this.yAcceleration, vel: this.yVelocity })
  // );

  // smooth de/acceleration of y velocity
  if (this.yAcceleration > 0) {
    if (this.yAcceleration < 2) this.yAcceleration = 0;
    this.yAcceleration *= Engin.friction; //* Engin.gravity;
    if (this.yAcceleration < 0.1) this.yAcceleration = 0;
    else this.yVelocity -= this.yAcceleration;
  }

  // Y  under the ground, bounce
  if (this.y > currentPlatform) {
    textCenter("----");
    this.jumpCount = 0;
    this.y = currentPlatform;
    this.yAcceleration = 0;
    this.yVelocity *= this.elasticity;
    // alert("-");
    // bounce
    if (Math.abs(this.yVelocity) > 0.01) {
      this.yAcceleration = this.yVelocity * Engin.friction * this.elasticity;
      this.yVelocity = 0;
      // this.yVelocity = this.yVelocity * Engin.friction * this.elasticity;
    }
  }
  // Y in air, apply gravity
  else if (this.y < currentPlatform) {
    this.yVelocity += this.mass * Engin.gravity;
  }

  // safe shizzle
  if (Math.abs(this.xVelocity) < 0.05) {
    this.xVelocity = 0;
  }
  if (Math.abs(this.yVelocity) < 0.05 && this.y <= currentPlatform) {
    this.yVelocity = 0;
  }

  // friction
  this.xVelocity *= Engin.friction;
  this.yVelocity *= Engin.friction;

  this.y += this.yVelocity;
  this.x += this.xVelocity * this.jumpXspeed; //(this.y < currentPlatform ? this.jumpXspeed : 1);
  if (this.x > Xmax) this.x = Xmin;
  else if (this.x < Xmin) this.x = Xmax;
}
