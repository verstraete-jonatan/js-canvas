// player
let Game = null;
let Player = null;

/** environmental config */
const Engin = Object.freeze({
  gravity: 0.8,
  friction: 0.93,
});

/** genral config */
const Conf = Object.freeze({
  shading: false,
});

/** game content config */
class GameClass {
  constructor() {
    this.foreground = new Map();
    this.background = new Map();
    this.ground = Ymax - 50;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.zoff = 0.1;
    this.df = 5000;

    this.lightSource = {
      x: Xmid,
      y: Ymax - 250,
      z: 0,
      radius: Xmax,
      varLight: 1,
    };

    this.lightSource.gradient = newGradient({
      ...this.lightSource,
      color: 10,
      // colorArr: ["#fff", "#408", "#008", "#000"],
      maxBrightness: 90,
      saturation: 60,
      linearColor: 5,
      linearBrightness: 9,
      linearSaturation: 6,
      steps: 7,
    });
  }
  createBlock(x, y, w, h) {
    this.foreground.set(
      "block_" + this.foreground.size,
      new Platform(x, y, w, h)
    );
  }
  renderBackground() {
    //setLightingShade(this);
    this.background.forEach((i) => {
      setLightingShade(i);
      i.show();
    });
  }
  renderForeground() {
    // this.foreground.forEach((i) => i.show());
    // shade("green", 0, 0, 0);
    // this.foreground.forEach((i) => i.show());

    this.foreground.forEach((i) => {
      setLightingShade(i);

      i.show();
    });
  }
}

/**  stickmna/player class */
class PlayerClass {
  constructor() {
    this.y = Game.ground;
    this.x = 100;
    this.z = 1;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.elasticity = 0.45; //0.45;
    this.mass = 9; //9.3;
    this.jumpingPower = 9;
    this.speedX = 1;
    this.speedY = 1.7;
    this.jumpXspeed = 3;

    this.color = "#000";
    this.currentPlatform = { x: 0, y: Game.ground, w: 0, h: 0 };

    this.updatePhysics = applyPhysics.bind(this);

    this.jumpCount = 0;
    this.maxJumpCount = 2;
  }
  move(direction = undefined) {
    switch (direction) {
      case "up":
        if (
          this.y <= this.currentPlatform.y &&
          this.jumpCount < this.maxJumpCount
        ) {
          this.yAcceleration =
            (this.jumpingPower * this.speedY) / (this.jumpCount ? 1.2 : 1);
          this.jumpCount++;
        }
        break;
      case "left":
        this.xVelocity -= this.speedX;
        this.direction = direction;
        break;
      case "right":
        this.xVelocity += this.speedX;
        this.direction = direction;
        break;
    }
    this.updatePhysics();
  }

  show() {
    this.move();
    const dir = this.direction === "left" ? 1 : -1;
    const w = 20 + Math.abs(this.xVelocity) * 2;
    const h = 20 + Math.abs(this.yVelocity) * 0.8;

    const sinx = Math.abs(Math.sin(this.x / 50) * this.xVelocity) * 1;

    const cx = this.x - w;
    const x1 = cx - sinx * 10 * dir;
    const y1 = this.y - h * 2;
    const x2 = cx + w * 2 + sinx * 10 * dir * -1;
    const y2 = this.y;
    const xm = (x1 + x2) / 2;

    const rad = {
      tl: 15,
      tr: 18 + w / 5,
      br: 3,
      bl: 3,
    };

    const move_r = Math.abs(this.xVelocity) * 5 * dir;

    setLightingShade({ x: x1, y: y1, z: this.z });

    ctx.fillStyle = "#32f";

    ctx.beginPath();
    ctx.moveTo(x1 + rad.tr + move_r, y1);
    ctx.lineTo(x2 - rad.tr + move_r, y1);
    // top-right
    ctx.quadraticCurveTo(x2 + move_r, y1, x2 + move_r, y1 + rad.tr);
    // bottom-right
    ctx.lineTo(x2, y2 - rad.br);
    ctx.quadraticCurveTo(x2, y2, x2 - rad.br, y2);
    // bottom-left
    ctx.lineTo(x1 + rad.bl, y2);
    ctx.quadraticCurveTo(x1, y2, x1, y2 - rad.bl);
    // top-left
    ctx.lineTo(x1 + move_r, y1 + rad.tl);
    ctx.quadraticCurveTo(x1 + move_r, y1, x1 + rad.tl + move_r, y1);

    ctx.closePath();
    ctx.fill();
    // ctx.stroke();

    this.drawEye(xm - 5, y1 + 15);
    this.drawEye(xm + 5, y1 + 15);
  }
  drawEye(eyeX = Xmid, eyeY = Ymid, radius = 5) {
    const x =
      (smoothSquareWave(mapNum(mousePos.x - eyeX, 0, Xmax, 0, 1), 0.01) *
        radius) /
      3;
    const y =
      (smoothSquareWave(mapNum(mousePos.y - eyeY, 0, Xmax, 0, 1), 0.01) *
        radius) /
      3;
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.arc(eyeX, eyeY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.arc(eyeX + x, eyeY + y, radius / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

class PerlinLine {
  constructor() {
    this.x = 0.1;
    this.y = Game.ground - 300;
    this.zoff = randint(1000);
    this.space = 1;
  }
  show() {
    // this.y+= 1
    // this.y = overcount(this.y, Game.ground)
    let x = -Xmax * 0.1;
    let lx = x;
    let y = this.y + sin(Player.y / 100) * 10;
    let ly = y;
    ctx.beginPath();
    ctx.moveTo(0, this.y);
    ctx.strokeStyle = "#a4Fa";
    ctx.lineWidth = 30;
    let stop = 0;
    while (x < Xmax * 1.1) {
      if (stop++ > 5000) break;
      const value = Math.abs(
        noise.perlin3(
          x / Game.df,
          y / Game.df,
          (this.zoff + Player.x / 1000 + Game.zoff) / 10
        )
      );
      const angle = ((1 + value) * 1.1 * 128) / PI2;
      const p = rotateVector(x, y, angle);

      ctx.lineTo(x + p.x, y + p.y);
      lx = x;
      ly = y;
      x += Math.abs(p.x * this.space);
      y -= p.y / 20;
    }
    // this.zoff += 0.01;
    ctx.stroke();
  }
}

/** background triangles */
class FloatingShape {
  constructor(id) {
    this.id = id;
    this.x = randint(Xmax);
    this.y = randint(Ymin, Game.ground);
    this.z = randfloat();
    this.size = (randfloat() + 1) * 100;
    this.cl = hsl(randfloat() * 36, 30, 20);
    this.rotation = randint(360);
    this.rotSpeed = (2 - (1 * this.size) / 100) / 1.2;
    if (this.rotSpeed < 0.3) this.rotSpeed += 1;
    this.falling = false;
    this.mountain = false;
    this.speed = {
      x: 0, // randfloat(-1, 1),
      y: 0, // randfloat(-1, 1)
    };
  }
  show() {
    setLightingShade(this);
    if (!this.mountain) {
      if (this.falling) {
        if (this.y < Game.ground) this.y += this.speed.y;
        else this.mountain = true;
      }

      if (floor(this.rotation) >= 360 && !this.falling) {
        this.speed.y = 2;
        this.falling = true;
      } else if (!this.falling) this.rotation += this.rotSpeed;
    }
    const y = this.y - 50;
    const x = this.x + Game.x;
    const z = this.z + Game.z;

    const value = noise.perlin3(x / Game.df, y / Game.df, z);
    const angle = ((1 + value) * 1.1 * 128) / PI2;
    const v = rotateVector(x, y, angle);

    triangle(x + v.x, y + v.y, this.size, this.cl, {
      rotate: overcount(this.rotation, 360),
    });
    if (x > Xmax || x < Xmin) this.speed.x *= -1;
    if (y > Game.ground || y < Ymin) this.speed.y *= -1;
    ctx.shadowColor = "rgba(0,0,0,0)";
  }
}

/** platform */
class Platform {
  constructor(x, y, w = 200, h = 40, cl = "#222") {
    this.x = x;
    this.y = y;
    this.z = 0.2;
    this.w = w;
    this.h = h;
    this.cl = cl;
  }
  show() {
    rect(this.x, this.y, this.x + this.w, this.y + this.h, null, this.cl);
  }
}

/** sets ctx shadow from corrent angle */
function setLightingShade(targ) {
  if (!Conf.shading) return;

  const { x, y, z, radius } = Game.lightSource;

  const dx = targ.x - x;
  const dy = targ.y - y;
  const dz = targ.z - z ?? 0;
  ctx.fillStyle = "red";
  let angle = atan2(dy, dx);

  ctx.shadowColor = "#0002";
  ctx.shadowOffsetX = (dx / 4 + Math.cos(angle / radius)) * 1 * dz;
  ctx.shadowOffsetY = (dy / 4 + Math.sin(angle / radius)) * 1 * dz;
  ctx.shadowBlur = (Math.abs(dx) + Math.abs(dy)) / 100;
}
