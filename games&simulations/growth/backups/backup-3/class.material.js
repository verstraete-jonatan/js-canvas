const devideUpMap = () => {
  const s = 10;
  const m = 200;

  // for (let x = Player.x - Xmid; x < Player.x + Xmid; x += s) {
  //   for (let y = Player.y - Ymid; y < Player.y + Ymid; y += s) {
  //     const noise = getNoiseV2(x, y);
  //     if (noise) {
  //       const px = noise.x + Player.x + x - Xmid;
  //       const py = noise.y + Player.y + y - Ymid;
  //       rect(px, py, px + s, py + s, "black");
  //     }
  //   }
  // }

  for (let x = -m; x < Xmax + m; x += s) {
    for (let y = -m; y < Ymax + m; y += s) {
      const noise = getNoiseV2(x - Player.x, y - Player.y);
      if (noise) {
        const px = noise.x + x;
        const py = noise.y + y;
        rect(px, py, px + s, py + s, "#fff3");
      }
    }
  }
};

class Shape {
  constructor() {
    this.x = randint(Xmax);
    this.y = randint(Ymax);
    this.s = randint(50, 100);
    this.name = "_" + randstr(5) + "_" + COLORS.random();
    this.active = false;
    this.checkInterval = 0;
    this.checkRange = this.sx;
  }
  checkPlayer() {
    if (this.checkInterval++ < 50) return;
    this.checkInterval = 0;

    const dis = distanceToArr(this.x + Player.x, this.y + Player.y, Xmid, Ymid);
    if (dis < this.s) {
      Player.values[this.name] = Player.values[this.name]
        ? ++Player.values[this.name]
        : 1;

      if (!this.active) {
        this.active = true;
        Store.activeMaterials.push(this.name);
      }
      return;
    } else if (this.active) {
      this.active = false;
      Store.activeMaterials = Store.activeMaterials.filter(
        (i) => i !== this.name
      );
    }
  }
}

class Mineral extends Shape {
  constructor(material) {
    super();

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
      ctx.lineWidth = 2;
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
