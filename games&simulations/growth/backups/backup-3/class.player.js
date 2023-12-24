class PlayerClass extends PhyisicsClass {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;

    this.hue = 90;
    this.size = 30;
    this.ghosts = [];
    this.values = {};

    this.base = {
      x: Xmid,
      y: Ymid,
    };
    this.experience = {};
  }

  draw() {
    const c = hsl(this.hue, 60, 60, 1);
    circle(this.base.x, this.base.y, this.size, null, c);

    this.hue += 0.01;

    this.arrow();
    this.applyPhysics();
    this.showTexts();
  }
  showTexts() {
    font(20, "red");
    Object.entries(this.values).forEach(([k, v], index) => {
      ctx.fillText(`${k}: ${v}`, 50, 100 + index * 20);
    });
  }

  arrow() {
    let [x, y] = this.getRotation().map((i) => i * 100);
    x += this.base.x;
    y += this.base.y;

    ctx.lineWidth = 8;
    line(this.base.x, this.base.y, x, y, "white");
  }

  move(direction) {
    switch (direction) {
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
        this.angle -= 1 * this.rotationSpeed;
        break;

      case "ArrowRight":
        this.angle += 1 * this.rotationSpeed;
        break;
    }
  }
}
