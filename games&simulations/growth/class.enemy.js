class EnemyClass extends PhysicsClass {
  constructor() {
    super();
    this.x = randint(100, Xmax - 100);
    this.y = randint(100, Ymax - 100);

    this.hue = 90;
    this.size = 40;

    this.amo = amoTypes.default;
    this.projectiles = [];
  }

  getPos() {
    return [Player.x + this.x, Player.y + this.y];
  }

  draw() {
    ctx.lineWidth = Styles.outerStroke;

    circle(...this.getPos(), this.size, "white", "orange");

    this.arrow();
    this.applyPhysics();

    this.projectiles.forEach((i) => i.draw());
  }

  arrow() {
    const angle = getAngleTowardsPlayer(this);
    log(+Player.angle.toFixed(3), +angle.toFixed(3));
    const rx = Math.cos(angle) * this.radius * 150;
    const ry = Math.sin(angle) * this.radius * 150;

    const [x, y] = this.getPos();

    ctx.lineWidth = 8;
    line(x, y, x + rx, y + ry, "white");
  }

  shoot() {
    this.projectiles.length < this.amo.max &&
      this.projectiles.push(
        new Projectile(degRad(180) + this.angle, this.amo, this.projectiles)
      );
  }

  onAction(action) {
    switch (action) {
      case "ArrowUp":
        this.velocity -= 1;
        break;

      case "ArrowDown":
        if (this.angle > 0) {
          this.angle *= -1;
        }
        this.velocity += 1;
        break;

      case "ArrowLeft":
        this.rotationVelocity -= this.rotationSpeed;
        break;

      case "ArrowRight":
        this.rotationVelocity += this.rotationSpeed;
        break;
      case " ":
        this.shoot();
        break;
    }
  }
}
