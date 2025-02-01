let blocks = [];
let noiseOff = 0;
const blockSize = 15;

const ndf = 5000;

const MAKeSOMeNOOOOISe = (x, y, z) =>
  (niceNoise.simplex3(x / ndf, y / ndf, z / ndf) + 0.9265007812499998) /
  1.8530015624999996;

function init() {
  Events.keyEvents.clear();
  const _scale = 2;
  blocks = [];

  const nrBlocks = 5000;
  const blockPos = nrBlocks / 100;

  const unscaled = blockSize * _scale;

  class Dot {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    draw(r) {
      // this.x += r * 1000
      this.x += (r - 0.5) * 10;
      this.y += (r - 0.5) * 10;
      this.z += (r - 0.5) * 10;

      const color = "#" + String(Math.round((1.9 + r) * 255)).slice(0, 3);
      // const color =
      //   "#" +
      //   Math.round((1 + (this.x + unscaled) / unscaled / blockPos) * 3650)
      //     .toString(16)
      //     .slice(0, 3);

      push();
      ambientMaterial(color);
      // specularMaterial(color);
      translate(this.x + r, this.y + r, this.z * r);
      fill(color);
      sphere(blockSize);
      pop();
    }
  }

  for (let _ of range(nrBlocks)) {
    blocks.push(
      new Dot(
        randint(-blockPos, blockPos) * blockSize * _scale,
        randint(-blockPos, blockPos) * blockSize * _scale,
        randint(-blockPos, blockPos) * blockSize * _scale
      )
    );
  }

  fill("white");
  // stroke('white')
  blocks = blocks.map((block) => {
    return () => {
      const { x, y, z } = block;
      const r = MAKeSOMeNOOOOISe(x + noiseOff, y + noiseOff, z + noiseOff);
      block.draw(r);
    };
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // frameRate(10);
  camera();
  noStroke();
  noiseSeed(10);
  init();
}

function draw() {
  lights();

  background(0);
  // background(255);
  // background("red");

  orbitControl(5, 0.5);
  rotateY(10.1);
  for (let b of blocks) b();
  noiseOff += 20.11;
}
