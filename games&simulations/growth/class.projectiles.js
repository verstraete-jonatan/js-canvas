class Projectile extends ProjectilePhysicsClass {
  constructor(angle, amoSpecs, projectTileArray) {
    super(angle, amoSpecs);

    this.amo = amoSpecs;
    this.x = Player.x - Xmid;
    this.y = Player.y - Ymid;

    // this.type = Store.this.s = 15;
    this.color = "green";
    this.totalLife = 0;

    this.s = 10 * this.amo.size;
    this.projectTileArray = projectTileArray;
  }

  draw() {
    if (++this.totalLife > 90 || !this.velocity) {
      this.projectTileArray.remove(this);
      return;
    }

    this.applyPhysics();
    const x = Player.x - this.x;
    const y = Player.y - this.y;

    point(x, y, this.s + 2, "white");
    point(x, y, this.s, this.amo.color);

    // check blocks
    Blocks.forEach((block) => {
      if (
        distanceToArr(x, y, block.x + Player.x, block.y + Player.y) <= block.s
      ) {
        block.attack(this.amo.damage);
        // apply effects
        if (this.amo.effects?.bounce) {
          this.angle += degRad(45);
          this.velocity -= 0.3;
          this.totalLife += 20;
        } else {
          this.totalLife = Infinity;
        }
      }
    });
  }
}
