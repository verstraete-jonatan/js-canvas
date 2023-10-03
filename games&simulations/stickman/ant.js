/** general ant class */
class Ant {
  constructor(x, y, s = 10) {
    this.x = x;
    this.y = y;
    this.color = COLORS.next();
    this.size = s * 5;
    // view
    this.orientation = 0;
    this.viewWideness = 90;
    this.lineOfSight = 50;
    // motion
    this.turnspeed = 0.05;
    this.minSpeed = randfloat(0.2, 0.4);
    this.speed = 2;
    this.target = null;
    this.accuracy = 1; //randfloat(-1, 1) || randfloat(-1, 1)

    this.boundPadding = 20;
    this.lastPosBeforeOut = { x: this.x, y: this.y };
  }
  drawRaw() {
    const { x, y } = posByAngle(
      this.x,
      this.y,
      this.orientation,
      this.size * 2
    );
    const { x: x1, y: y1 } = posByAngle(
      this.x,
      this.y,
      this.orientation - 0.7,
      -this.size
    );
    const { x: x2, y: y2 } = posByAngle(
      this.x,
      this.y,
      this.orientation + 0.7,
      -this.size
    );

    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.lineTo(this.x, this.y);

    ctx.closePath();
    ctx.stroke();
    if (this.load) point(this.x, this.y, this.size, "green");
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    ctx.lineWidth = floor(this.size / 10);
    /** LEGS */
    const legMoveA =
      smoothSquareWave((this.orientation * 10 + this.x + this.y) / 5, 0.5) / 8;
    const legMoveB =
      smoothSquareWave(
        ((this.orientation * 10 + this.x + this.y) / 5) * -1,
        0.5
      ) / 8;

    // right
    this.drawLeg(this.orientation - 1 + legMoveA, -legMoveA * 2.5, true);
    this.drawLeg(this.orientation - 1.5 + legMoveB, -legMoveB * 2.5);
    this.drawLeg(this.orientation - 2 + legMoveA, -legMoveA * 2.5, true);
    // left
    this.drawLeg(this.orientation + 1 - legMoveB, legMoveB * 2.5);
    this.drawLeg(this.orientation + 1.5 - legMoveA, legMoveA * 2.5, true);
    this.drawLeg(this.orientation + 2 - legMoveB, legMoveB * 2.5);

    /** BODY */
    // back
    let { x, y } = posByAngle(
      this.x,
      this.y,
      this.orientation,
      this.size * -1.6
    );
    ellipse(
      x,
      y,
      this.size,
      this.size * 0.7,
      this.orientation,
      0,
      PI2,
      null,
      this.color
    );
    // middle
    ellipse(
      this.x,
      this.y,
      this.size,
      this.size * 0.2,
      this.orientation,
      0,
      PI2,
      null,
      this.color
    );
    // head
    ({ x, y } = posByAngle(this.x, this.y, this.orientation, this.size * 1.4));
    ellipse(
      x,
      y,
      this.size * 0.5,
      this.size * 0.4,
      this.orientation,
      0,
      PI2,
      null,
      this.color
    );

    /** RECEPTORS */
    // 1
    let { x: rx1, y: ry1 } = posByAngle(
      x,
      y,
      this.orientation - 0.7,
      this.size * 0.8
    );
    let { x: rx2, y: ry2 } = posByAngle(
      x,
      y,
      this.orientation - 0.5,
      this.size * 1.5
    );
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.stroke();
    // 2
    ({ x: rx1, y: ry1 } = posByAngle(
      x,
      y,
      this.orientation + 0.7,
      this.size * 0.8
    ));
    ({ x: rx2, y: ry2 } = posByAngle(
      x,
      y,
      this.orientation + 0.5,
      this.size * 1.5
    ));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.stroke();

    // this.endPoint = {
    //     x:a,
    //     y:b
    // }
  }
  drawLeg(angle, endAngle = 1) {
    const { x: x1, y: y1 } = posByAngle(this.x, this.y, angle, this.size);
    const { x: cx, y: cy } = posByAngle(
      this.x,
      this.y,
      angle + endAngle,
      this.size * 2
    );
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  }
  wander() {
    this.lastOrientation = this.orientation;
    this.targetOrientation = this.orientation + degRad(randint(-90, 90));
  }

  checkOutBounds() {
    if (
      this.x + this.boundPadding < Xmax &&
      this.y + this.boundPadding < Ymax &&
      this.x - this.boundPadding > Xmin &&
      this.y - this.boundPadding > Ymin
    ) {
      this.outBounds = false;
    } else {
      this.outBounds = true;
    }
    return this.outBounds;
  }

  animate() {
    if (this.checkOutBounds()) {
      this.x = this.lastPosBeforeOut.x;
      this.y = this.lastPosBeforeOut.y;
      // if(this.x >= Xmax) this.targetOrientation -= mapNum()
      if (this.x >= Xmax) this.x -= this.speed;
      if (this.x <= Xmin) this.x += this.speed;
      if (this.y >= Ymax) this.y -= this.speed;
      if (this.y <= Ymax) this.y += this.speed;
      this.orientation += degRad(90);
      return;
    } else {
      this.lastPosBeforeOut = { x: this.x, y: this.y };
    }

    if (randint(50) === 1) this.wander();
    // reset orientation: if orientation is bigger tahn 360 = 0
    if (this.orientation > 6.283185307179586) this.orientation = 0;

    // turning: adjust orientation towards targetOrientation
    if (this.targetOrientation != null) {
      this.orientation = this.targetOrientation;
      this.targetOrientation = null;
    }

    const { x, y } = posByAngle(
      null,
      null,
      this.orientation,
      this.targetOrientation ? this.speed * 0.5 : this.speed
    );

    this.x += x;
    this.y += y;

    this.draw();
  }
}
