class Projectile extends ProjectilePhysicsClass {
  constructor({ x, y, angle, amo, projectiles, type }) {
    super(angle, amo);
    this.amo = amo;
    this.x = x;
    this.y = y;

    // this.type = Store.this.size = 15;
    this.color = "green";
    this.totalLife = 0;

    this.size = 10 * this.amo.size;
    this.projectTileArray = projectiles;
    this.nativeType = type;
  }

  die() {
    this.projectTileArray.remove(this);
  }

  draw() {
    if (++this.totalLife > 90 || !this.velocity) {
      this.die();
      return;
    }

    this.applyPhysics();

    const x = Player.x + this.x;
    const y = Player.y + this.y;

    point(x, y, this.size + 2, "white");
    point(x, y, this.size, this.amo.color);

    if (!isInBounds(x, y)) return;

    // todo, add radius check instead of loop (require rewrite of logic - V3)
    switch (this.nativeType) {
      case "PLAYER":
        for (let block of Blocks)
          if (
            distanceToArr(x, y, block.x + Player.x, block.y + Player.y) <=
            block.s
          ) {
            block.attack(this.amo.damage);
            // apply effects
            if (this.amo.effects?.bounce) {
              this.angle += degRad(45);
              this.velocity -= 0.3;
              this.totalLife += 20;
            } else {
              this.die();
            }
            return;
          }
        return;
      case "ENEMY":
        if (distanceToArr(x, y, ...Player.getPos()) <= this.size * 2) {
          Player.onBeingDamaged(this.amo.damage * 5);
          this.die();

          Effects.push(
            new Effect(this.x, this.y, {
              color: 0,
            })
          );
        }
        return;
    }
  }
}
