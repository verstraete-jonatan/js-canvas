const Engin = Object.freeze({
  friction: 0.98,
  frictionRotation: 0.85, // rotation sensitively

  frictionProjectile: 0.99,
});

class PhysicsClass {
  constructor() {
    this.velocity = 0;
    this.rotationVelocity = 0;
    this.angle = degRad(90);
    this.speed = 1;

    this.rotationSpeed = 0.08;
    this.radius = 0.5;

    this.rotationVelocityLimit = 6;
  }

  getRotation() {
    return [
      Math.cos(this.angle) * this.radius,
      Math.sin(this.angle) * this.radius,
    ];
  }

  applyPhysics() {
    if (!this.velocity && !this.rotationVelocity) return;

    this.velocity *= Engin.friction;
    this.rotationVelocity *= Engin.frictionRotation;

    this.angle += this.rotationVelocity;

    const x = Math.cos(this.angle) * this.radius;
    const y = Math.sin(this.angle) * this.radius;

    this.x += x * this.speed * this.velocity;
    this.y += y * this.speed * this.velocity;

    if (Math.abs(this.velocity) < 0.05) {
      this.velocity = 0;
    }

    if (Math.abs(this.rotationVelocity) < 0.05) {
      this.rotationVelocity = 0;
    }
  }
}

class ProjectilePhysicsClass {
  constructor(angle, amoType) {
    this.angle = angle;
    this.speed = 8 * amoType.speed;
    this.velocity = 3;

    // this.friction = Math.min(Engin.frictionProjectile, amoType.range + 0.09);
    this.friction = Engin.frictionProjectile; // 1 - amoType.range + 0.09;
  }

  applyPhysics() {
    if (!this.velocity) return;

    this.velocity *= this.friction;

    const x = Math.cos(this.angle);
    const y = Math.sin(this.angle);

    this.x += x * this.speed * this.velocity;
    this.y += y * this.speed * this.velocity;

    if (Math.abs(this.velocity) < 0.1) {
      this.velocity = 0;
    }
  }
}
