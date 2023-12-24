class Block extends Shape {
  constructor() {
    super();

    this.hue = 0;
    this.life = randfloat(0.2, 1) * (this.s / 50);
  }

  destroy() {
    this.attack();
  }

  attack(force = 0.1) {
    this.life -= force;
  }

  draw() {
    if (this.isDead) return console.log(".. cant die..");
    if (this.life <= 0) {
      try {
        this.isDead = true;
        Blocks.remove(this);
        Player.values.xp += this.xp;
      } catch (e) {}
      return;
    }
    const x = Player.x + this.x;
    const y = Player.y + this.y;
    if (isInBounds(x, y)) {
      ctx.lineWidth = Styles.outerStroke;
      square(
        x - this.s / 2,
        y - this.s / 2,
        this.s,
        "red",
        hsl(0, 50, 50, this.life)
      );
    }
  }
}
