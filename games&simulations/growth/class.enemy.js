class StaticEnemyClass extends PhysicsClass {
  constructor(x, y) {
    super();
    this.type = "ENEMY";

    this.x = x;
    this.y = y;

    this.hue = 90;
    this.size = 40;

    this.amo = { ...amoTypes.bazooka, max: 1 };
    this.projectiles = [];
    this.lifeIterations = 0;
    this.isInRange = false;
  }

  getPos() {
    return [Player.x + this.x, Player.y + this.y];
  }

  draw() {
    const pos = this.getPos();
    ctx.lineWidth = Styles.outerStroke;
    circle(...pos, this.size, "white", "orange");

    this.isInRange = distanceToArr(...pos, ...Player.getPos()) < 300;

    this.arrow();
    this.applyPhysics();

    if (this.isInRange && ++this.lifeIterations % 20 === 0) {
      this.shoot();
    }
    this.projectiles.forEach((i) => i.draw());
  }

  arrow() {
    this.angle = this.isInRange
      ? getAngleTowardsPlayer(this)
      : this.angle + 0.01;

    const rx = Math.cos(this.angle) * this.radius * 150;
    const ry = Math.sin(this.angle) * this.radius * 150;

    const [x, y] = this.getPos();

    ctx.lineWidth = this.amo.barrelWidth ?? 8;
    line(x, y, x + rx, y + ry, "white");
  }

  shoot() {
    if (this.projectiles.length < this.amo.max) {
      this.projectiles.push(new Projectile(this));
    }
  }
}

class TrackingEnemyClass extends PhysicsClass {
  constructor(x, y) {
    super();
    this.type = "ENEMY";

    this.x = x;
    this.y = y;

    this.hue = 90;
    this.size = 40;

    this.amo = amoTypes.bazooka;
    this.projectiles = [];
    this.lifeIterations = 0;
    this.prevPlayerAngle = 0;
  }

  getPos() {
    return [Player.x + this.x, Player.y + this.y];
  }

  draw() {
    ctx.lineWidth = Styles.outerStroke;
    circle(...this.getPos(), this.size, "white", "#f53");

    this.arrow();
    this.applyPhysics();
    this.projectiles.forEach((i) => i.draw());
  }

  arrow() {
    const playerAngle = getAngleTowardsPlayer(this);

    // shoot
    if (++this.lifeIterations % 50 === 0) {
      const change = (playerAngle - this.prevPlayerAngle) * 0.7;

      const totalChange = playerAngle + change - this.prevPlayerAngle;
      const estimatedNextAngle = playerAngle + totalChange;

      this.angle = estimatedNextAngle;
      // this.angle = playerAngle;

      this.projectiles.push(new Projectile(this));
    } else if (this.lifeIterations % 25 === 0) {
      this.prevPlayerAngle = playerAngle;
    }
    this.angle = playerAngle;

    const rx = Math.cos(this.angle) * this.radius * 150;
    const ry = Math.sin(this.angle) * this.radius * 150;
    const [x, y] = this.getPos();

    ctx.lineWidth = this.amo.barrelWidth ?? 8;
    line(x, y, x + rx, y + ry, "white");
  }
}
