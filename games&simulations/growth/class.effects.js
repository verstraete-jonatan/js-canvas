class Effect {
  constructor(x, y) {
    this.x = x - Xmid;
    this.y = y - Ymid;
    this.lifeSpan = 80;

    this.s = 50;
    this.color = COLORS.random();
    this.age = 0;

    this.nr = 3;
  }

  draw() {
    if (++this.age > this.lifeSpan) {
      Effects.remove(this);
      return;
    }
    const x = Player.x + this.x;
    const y = Player.y + this.y;

    for (let i in range(this.nr)) {
      i++;
      circle(
        x,
        y,
        cos(this.age / ((i / this.nr) * 50)) * this.s,
        null,
        hsl(200, 50, 50, 0.8 - i / this.nr - this.age / 100)
      );
    }
  }
}
