let blocks = [];
let noiseOff = 0;
let theShader;
let shaderTexture;

const noiseSize = 2000;
const noiseEffect = 0.5;

const niceNoiserazerFaserTaser = (x, y, z) =>
  ((niceNoise.simplex3(x / noiseSize, y / noiseSize, z / noiseSize) +
    0.9265007812499998) /
    1.8530015624999996) *
  noiseEffect;

function init() {
  class Dust {
    constructor() {
      this.uniqueness = 1; // Math.random() * 10;
      this.size = 10; // 2 + Math.random() * 10;
      this.noiseImpact = 1; //Math.random();
    }
    draw(next) {
      const r =
        niceNoiserazerFaserTaser(
          this.x + noiseOff * this.noiseImpact,
          this.y + noiseOff * this.noiseImpact,
          this.z + noiseOff * this.noiseImpact
        ) * this.uniqueness;

      this.rx = this.x * r;
      this.ry = this.y * r;
      this.rz = this.z * r;

      // const color = "#" + String(Math.round((1.9 + r) * 255)).slice(0, 3);

      const color = "#" + String(Math.round((1.9 + r) * 255)).slice(0, 3);

      // ambientMaterial(color);
      // stroke(color);
      strokeWeight(0.5);
      // note: to remove line going out of the shapes you should put the push and translate only on the box
      // translate(this.rx, this.ry, this.rz);

      beginShape();
      vertex(this.rx, this.ry, this.rz);
      // vertex(0, 0, 0);

      vertex(next.rx, next.ry, next.rz);
      endShape();

      // noStroke();
      push();
      translate(this.rx, this.ry, this.rz);
      box(this.size);

      pop();
    }
  }
  class Spec extends Dust {
    constructor(x, y, z) {
      super();
      this.x = x;
      this.y = y;
      this.z = z;

      this.rx = x;
      this.ry = y;
      this.rz = z;
    }
  }

  const createStructure = () => {
    const s = 100;
    const depth = 5;
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

  const disTo = (src, targ) =>
    ((targ.x - src.x) ** 2 + (targ.y - src.y) ** 2 + (targ.z - src.z) ** 2) **
    (1 / 2);

  const zero = new Spec(0, 0, 0);
  blocks = blocks.sort((a, b) => {
    return disTo(a, zero) - disTo(b, zero);

    return Math.round(Math.random()) - 1;
    const x = a.x - b.x;
    const y = a.y - b.y;
    const z = a.z - b.z;

    return x;

    return x + y + z;
  });
}

function preload() {
  theShader = loadShader("./shader.vert", "./shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  enableCustomEvents = false;

  shaderTexture = createGraphics(710, 400, WEBGL);
  shaderTexture.noStroke();

  camera();
  init();

  pixelDensity(1);
  console.clear();
}

let i = 0;
function draw() {
  // orbitControl(5, 5, 0.1);
  // pointLight(255, 255, 255, 0, 0, 0);
  // pointLight(255, 255, 255, 0, 0, 0);
  // pointLight(255, 255, 255, 0, 0, 0);

  // ambientLight(25);
  // ambientLight(225);

  noStroke();
  fill(0);
  rect(-width, -height, width * 2, height * 2);
  // push();

  shader(theShader);
  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iFrame", frameCount);
  if (!pause) {
    i += 1;
  }

  // pop();

  // ambientMaterial("fff");

  // box(200);

  // return;

  // if (!pause) {
  //   background(0);

  //   push();
  //   noStroke();
  //   rotate(noiseOff / 2000);
  //   translate(3000, 0, 0);
  //   ambientMaterial("#aaf");
  //   sphere(900);

  //   rotate(noiseOff / 200, createVector(3000, 0, 0));
  //   translate(0, 1200, 0);
  //   ambientMaterial("#300");
  //   sphere(100);

  //   pop();

  //   blocks.forEach((i, idx, arr) => {
  //     const next = arr[idx + 1];

  //     const v = Math.floor((idx / arr.length) * 255);
  //     const h = [(v + 50) % 256, (v + 100) % 256, (v + 150) % 256]
  //       .map((i) => i.toString(16).padStart(2, "0"))
  //       .join("");

  //     // const h = Math.floor((idx / arr.length) * 255)
  //     //   .toString(16)
  //     //   .padStart(2, "0")
  //     //   .repeat(3);
  //     // fill(h);
  //     ambientMaterial(h);
  //     next && i.draw(next);
  //   });

  //   noiseOff += 5.1;
  // }
}
