class Effect {
  constructor(x, y, type = { color: 200 }) {
    this.x = x;
    this.y = y;
    this.lifeSpan = 80;

    this.s = 50;
    this.color = type.color;
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
        hsl(this.color, 50, 50, 0.8 - i / this.nr - this.age / 100)
      );
    }
  }
}

const drawProgress = (x, y, percentage = 100) => {
  const color = percentage > 50 ? "green" : percentage < 20 ? "red" : "orange";

  const w = percentage;
  const h = 15;

  rect(x, y, x + w, y + h, null, color);
};
