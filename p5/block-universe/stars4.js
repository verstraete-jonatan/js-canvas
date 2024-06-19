let blocks = [];
let noiseOff = 0;

const ndf = 5000;

const niceNoiserazerFaserTaser = (x, y, z) =>
  (niceNoise.simplex3(x / ndf, y / ndf, z / ndf) + 0.9265007812499998) /
  1.8530015624999996;

function init() {
  class Dust {
    constructor() {
      this.uniqueness = Math.random() * 10;
      this.size = 20; // 5 + Math.random() * 30;
    }
    draw() {
      const r =
        niceNoiserazerFaserTaser(
          this.x + noiseOff,
          this.y + noiseOff,
          this.z + noiseOff
        ) * this.uniqueness;

      const color = "#" + String(Math.round((1.9 + r) * 255)).slice(0, 3);

      push();
      ambientMaterial(color);
      // specularMaterial(color);
      translate(this.x * r, this.y * r, this.z * r);

      sphere(this.size);
      // box(20);
      pop();
    }
  }
  class Spec extends Dust {
    constructor(x, y, z) {
      super();
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  const createStructure = () => {
    const s = 100;
    const depth = 7;
    const ids = new Set();
    const isOut = (...n) => n.some((i) => Math.abs(i) > s * depth);
    const make = (x, y, z) => {
      const id = `${x}-${y}${z}`;
      if (isOut(x, y, z) || ids.has(id)) return;
      ids.add(id);

      blocks.push(new Spec(x, y, z));
      make(x + s, y, z);
      make(x, y + s, z);
      make(x, y, z + s);

      make(x - s, y, z);
      make(x, y - s, z);
      make(x, y, z - s);
    };

    make(0, 0, 0);
  };

  createStructure();

  blocks = blocks.map((block) => {
    return () => {
      block.draw();
    };
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // frameRate(10);
  camera();
  noStroke();
  init();
}

function draw() {
  lights();
  background(0);

  orbitControl(5, 5, 0.1);
  rotateY(10.1);

  fill("white");
  color("white");

  for (let b of blocks) b();
  noiseOff += 10.1;
}
