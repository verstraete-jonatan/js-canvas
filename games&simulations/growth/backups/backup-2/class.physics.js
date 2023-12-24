/** environmental config */
const Engin = Object.freeze({
  gravity: 0.8,
  friction: 0.98, // 0.93
});

const Noise = Object.freeze({
  df: 500,
});

const isAinB = (a, b) =>
  a.y >= b.y && a.y <= b.y + b.h && a.x >= b.x && a.x <= b.x + b.w;

class PhyisicsClass {
  constructor() {
    this.speed = 1;
    this.xVelocity = 0;
    this.yVelocity = 0;

    this.angle = degRad(0);
    this.rotationSpeed = 0.2; // 0.35; // radians
    this.radius = 0.5;

    this.velocity = 0;
  }

  getRotation() {
    return [
      Math.cos(this.angle) * this.radius,
      Math.sin(this.angle) * this.radius,
    ];
  }

  applyPhysics() {
    // textCenter((degRad(this.angle) * 20).toFixed(2));
    if (!this.velocity) return;

    this.velocity *= Engin.friction;

    // const x = Math.cos(this.angle * this.rotationSpeed) * this.radius;
    // const y = Math.sin(this.angle * this.rotationSpeed) * this.radius;

    // const x = Math.cos(degRad(this.angle) * 20) * this.radius;
    // const y = Math.sin(degRad(this.angle) * 20) * this.radius;

    const x = Math.cos(this.angle) * this.radius;
    const y = Math.sin(this.angle) * this.radius;

    this.x += x * this.speed * this.velocity;
    this.y += y * this.speed * this.velocity;

    if (Math.abs(this.velocity) < 0.05) {
      this.velocity = 0;
    }
  }
}
