let blocks = [];
let noiseOff = 0;
const blockSize = 15;

const ndf = 5000;

const MAKeSOMeNOOOOISe = (x, y, z) =>
  (niceNoise.simplex3(x / ndf, y / ndf, z / ndf) + 0.9265007812499998) /
  1.8530015624999996;

const constructTree = () => {
  const setup = {
    center: { x: 500, y: 500 },
    rotHorizontal: 1,
    radius: 600,
    amount: 1400,
  };

  const threeConf = {
    wideness: 18,
    detlaAngle: 90,
    attenuation: 0.8,
    minLength: 70,
    startLength: 700,
    depth: 20,
  };

  const points = [];
  const scale = 1;

  const angleVal = 10 + Math.sin(threeConf.wideness / 100) * 100;

  function make(x1, y1, len, _angle, _depth) {
    if (_depth < 0) return;
    if (len < threeConf.minLength) return;

    const _x = x1 - len * Math.cos((_angle * PI) / 180);
    const _y = y1 - len * Math.sin((_angle * PI) / 180);
    const z = (threeConf.startLength * PI) / scale;

    points.push([_x / scale, _y / scale, z], [x1 / scale, y1 / scale, z]);

    make(
      _x,
      _y,
      len * threeConf.attenuation,
      _angle + angleVal,
      _depth - 1,
      true
    );
    make(
      _x,
      _y,
      len * threeConf.attenuation,
      _angle - angleVal,
      _depth - 1,
      false
    );
  }
  make(
    0,
    setup.radius / 2 - threeConf.startLength,
    threeConf.startLength,
    threeConf.detlaAngle,
    threeConf.depth
  );

  return points;
};

function init() {
  Events.keyEvents.clear();
  const _scale = 2;

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

  blocks = constructTree().map(([x, y, z]) => new Dot(x, y, z));

  // for (let _ of range(nrBlocks)) {
  //   blocks.push(
  //     new Dot(
  //       randint(-blockPos, blockPos) * blockSize * _scale,
  //       randint(-blockPos, blockPos) * blockSize * _scale,
  //       randint(-blockPos, blockPos) * blockSize * _scale
  //     )
  //   );
  // }

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
