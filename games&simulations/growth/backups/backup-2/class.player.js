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
    // circle(this.x, this.y, this.size, null, c);
    circle(this.base.x, this.base.y, this.size, null, c);

    // this.ghosts.map((i, idx) =>
    //   circle(...i, this.size, null, hsl(this.hue, 60, 60, 0.1 + idx / 10))
    // );
    this.hue += 0.01;

    // const [x, y] = this.getRotation().map((i) => i * 200);
    // rect(
    //   this.x,
    //   this.y,
    //   this.x + x,
    //   this.y + y,
    //   null,
    //   hsl(this.hue, 60, 60, 0.6)
    // );

    this.arrow();
    this.applyPhysics();
    this.showTexts();
  }
  showTexts() {
    font(20, "red");
    // ctx.strokeStyle = "red";

    Object.entries(this.values).forEach(([k, v], index) => {
      // if (Store.activeMaterials.includes(k)) {
      // ctx.fillText(`${k}=${v}`, Xmid, Ymid - 100 + index * 20);
      ctx.fillText(`${k}: ${v}`, 50, 100 + index * 20);
      // }
    });
  }

  arrow() {
    let [x, y] = this.getRotation().map((i) => i * 100);
    // x += this.x;
    // y += this.y;

    x += this.base.x;
    y += this.base.y;

    ctx.lineWidth = 8;
    ctx.stokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.base.x, this.base.y);
    ctx.lineTo(x, y);
    ctx.stroke();
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
        // this.velocity += 1;
        this.angle -= 1 * this.rotationSpeed;
        // this.velocity += this.angle < 0 ? -1 : 1;
        break;

      case "ArrowRight":
        // this.velocity += 1;

        this.angle += 1 * this.rotationSpeed;
        // this.velocity += this.angle < 0 ? -1 : 1;
        break;
    }

    // switch (direction) {
    //   case "ArrowUp":
    //     // if (this.angle < 0) {
    //     //   this.angle *= -1;
    //     // }
    //     this.velocity -= 1;
    //     break;

    //   case "ArrowDown":
    //     // if (this.angle > 0) {
    //     //   this.angle *= -1;
    //     // }
    //     this.velocity += 1;

    //     break;

    //   case "ArrowLeft":
    //     this.angle -= 1;
    //     this.velocity += this.angle < 0 ? -1 : 1;
    //     // this.velocity += 1;
    //     break;

    //   case "ArrowRight":
    //     this.angle += 1;
    //     this.velocity += this.angle < 0 ? -1 : 1;
    //     // this.velocity += 1;

    //     break;
    // }
    this.ghosts.push([this.x, this.y]);
    if (this.ghosts.length > 5) this.ghosts.splice(0, 1);
    // this.velocity += this.angle < 0 ? -1 : 1;
  }
}
