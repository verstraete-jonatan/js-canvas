class Shape {
  constructor() {
    this.type = "SHAPE";

    this.x = randint(Xmax);
    this.y = randint(Ymax);
    this.s = randint(50, 100);
    this.name = "_" + randstr(5) + "_" + COLORS.random();
    this.active = false;
    this.checkInterval = 0;
    this.checkRange = this.sx;

    this.xp = this.s / 10;
    this.stopRenderingMe = false;

    this.isDead = false;
  }
}

class Mineral extends Shape {
  constructor(material) {
    super();
    this.type = "MINERAL";
    this.material = material;
    this.name = material.name;
    this.description = material.description;
    this.harvest_time = material.harvest_time;
    this.yield = material.yield;
    this.hardness = material.hardness;
    this.color = material.colors.random();
  }
  checkPlayer() {
    if (this.checkInterval++ < this.harvest_time) return;
    this.checkInterval = 0;

    const dis = distanceToArr(Player.x + this.x, Player.y + this.y, Xmid, Ymid);
    if (dis < this.s) {
      this.updatePlayerValues();

      if (!this.active) {
        this.active = true;
      }
      return;
    } else if (this.active) {
      this.active = false;
    }
  }
  updatePlayerValues() {
    const totalExp = Object.entries(Player.experience)
      .filter(([k]) => this.material.categories.includes(k))
      .reduce((t, [, v]) => t + v, 0);

    const value = toFixed(
      Math.max(
        this.yield,
        ((totalExp * 0.1 || 1) * this.yield) / this.hardness
      ),
      2
    );

    this.material.categories.forEach((c) =>
      this.incPlayerValue("experience", c, 1)
    );

    this.incPlayerValue("values", this.name, value);
  }

  incPlayerValue(type, key = this.name, value = 1) {
    Player[type][key] = (Player[type][key] || 0) + value;
  }
  draw() {
    const x = Player.x + this.x;
    const y = Player.y + this.y;
    if (isInBounds(x, y)) {
      ctx.lineWidth = Styles.outerStroke;
      circle(x, y, this.s, "white", this.color + (this.active ? "dd" : "22"));
      this.checkPlayer();

      font(10, "black");
      ctx.fillText(this.name, x, y);
      if (this.active) {
        font(12, "red");

        ctx.fillText(
          `${this.name}: ${Player.values[this.name]}`,
          x,
          y - this.s / 2
        );
      }
    }
  }
}
