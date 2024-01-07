class PlayerClass extends PhysicsClass {
  constructor(x, y) {
    super();
    this.type = "PLAYER";
    this.x = x;
    this.y = y;

    this.hue = 90;
    this.size = 30;
    this.ghosts = [];
    this.values = {
      xp: 0,
      life: 100,
    };

    this.base = {
      x: Xmid,
      y: Ymid,
    };
    this.experience = {};

    this.projectiles = [];

    this.amo = amoTypes.default;

    this.checkHeal = 0;
  }

  heal() {
    if (this.checkHeal > 90 && this.values.life < 100) {
      this.values.life++;
    }
    this.checkHeal++;
  }

  getRelPos() {
    // const [nx, ny] = getNoise(this.x, this.y);
    // const [nx, ny] = getNoise(this.base.x + this.x, this.base.y + this.y);

    // return [this.base.x + nx, this.base.y + ny];

    return [this.base.x - this.x, this.base.y - this.y];
  }

  getPos() {
    return [this.base.x, this.base.y];
  }

  draw() {
    ctx.lineWidth = Styles.outerStroke;
    this.applyPhysics();

    this.stats();
    circle(...this.getPos(), this.size, "white", "#999");
    // draw arrow
    const [rx, ry] = this.getRotation().map((i) => i * 100);
    const [px, py] = this.getPos();

    ctx.lineWidth = 8;
    line(px, py, px + rx, py + ry, "white");

    // projectiles
    this.projectiles.forEach((i) => i.draw());

    // life status
    if (this.values.life < 100) {
      drawProgress(px - this.size, py - this.size * 2, this.values.life);
      this.heal();
    }
  }
  stats() {
    font(20, "red");
    Object.entries(this.values).forEach(([k, v], index) => {
      ctx.fillText(`${k}: ${v.toFixed(1)}`, 50, 100 + index * 20);
    });
  }

  arrow() {
    const [rx, ry] = this.getRotation().map((i) => i * 100);
    const [px, py] = this.getPos();

    ctx.lineWidth = 8;
    line(px, py, px + rx, py + ry, "white");
  }

  shoot() {
    if (this.projectiles.length < this.amo.max) {
      this.projectiles.push(
        new Projectile({
          ...this,
          x: this.base.x - this.x,
          y: this.base.y - this.y,
        })
      );
    }
  }
  onBeingDamaged(amt) {
    this.values.life -= amt;
    this.checkHeal = 0;
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
