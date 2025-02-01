class PlayerClass extends PhyisicsClass {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;

    this.hue = 0;
    this.size = 30;
    this.ghosts = [];
  }

  draw() {
    circle(this.x, this.y, this.size, null, hsl(this.hue, 60, 60, 0.6));
    this.ghosts.map((i) =>
      circle(...i, this.size, null, hsl(this.hue, 60, 60, 0.6))
    );

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
  }

  arrow() {
    let [x, y] = this.getRotation().map((i) => i * 200);
    x += this.x;
    y += this.y;

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
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
        this.angle -= 1;
        this.velocity += this.angle < 0 ? -1 : 1;
        break;

      case "ArrowRight":
        this.angle += 1;
        this.velocity += this.angle < 0 ? -1 : 1;
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
