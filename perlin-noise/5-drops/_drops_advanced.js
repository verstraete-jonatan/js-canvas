const drops = [];
let dropamt = 5000;
const gridDetail = 20;
const grid = [];
let gloablColor = 0;

const noiseSetup = {
  df: 500,
  zoff: 1,
  scale: 1,
  off() {
    this.zoff += 0.002;
  },
};
/**
 * Explenation for not curious enough people abou the argument in the All class.
 If you don't take your steps in life (All class) youre purpoe in life will be lost.
 If you curve in a system (Grid class) you will look for even more system and stability.
 If you want to life like a drop you experiance a short but colourfull life (like the Drp class object being removed from the memory when it reaches 10px under the screen)
 




 */

class All {
  constructor(yourPurposeInLife = "lost") {
    this.purposeInLife = yourPurposeInLife;
  }
  getNoise(x, y, z) {
    const { df, zoff, scale: noiseScale } = noiseSetup;
    let value = noise.perlin3(x / df, y / df, zoff);

    const angle = ((1 + value) * 1.1 * 128) / (PI * 2);
    return rotateVector(x * noiseScale, y, angle);
  }
}

class Grid extends All {
  constructor() {
    super("be in balance");
    this.points = [];
    for (let x of range(Xmax)) {
      for (let y of range(Ymax)) {
        if (x % gridDetail == 0 && y % gridDetail == 0)
          this.points.push({ x: x, y: y });
      }
    }
  }
  draw() {
    for (let p of this.points) {
      const { x, y } = p;
      const v = this.getNoise(x, y);
      line(x, y, x + v.x, y + v.y, "#666");
    }
  }
}

class Drop extends All {
  constructor() {
    super("to flower");
    this.speed = (randint(10) + 0.1) / 20;
    this.x = randint(Xmax);
    this.y = -20;

    this.width = this.speed * 10;
    this.color = 0;
  }
  draw() {
    const { x, y, width } = this;
    this.y += this.speed;

    if (y > Ymax + 10) {
      drops.remove(this);
      drops.push(new Drop());
      return;
    }
    const v = this.getNoise(x, y);

    circle(x + v.x, y + v.y, width, hsl(this.color + gloablColor));
    this.color += 0.1;
  }
}

async function main() {
  ctx.invert();
  //ctx.globalCompositeOperation = "multiply"
  ctx.globalAlpha = 1;
  const grid = new Grid();

  async function animation() {
    rect(0, 0, Xmax, Ymax, null, "#ffffff08");
    //grid.draw()

    if (drops.length < dropamt) drops.push(new Drop());
    for (let i of drops) i.draw();

    noiseSetup.off();
    gloablColor = overCount(gloablColor + 0.1, 360);

    await pauseHalt();
    if (!exit) requestAnimationFrame(animation);
  }

  animation();
}

main();
