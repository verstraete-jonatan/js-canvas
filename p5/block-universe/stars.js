let blocks = [];
let noiseOff = 0;
const blockSize = 15;

const MAKeSOMeNOOOOISe = (x, y, z) => niceNoise.simplex3(x, y, z);

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
    minLength: 20,
    startLength: 70,
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
  noiseSeed(10);

  const _scale = 2;

  blocks = []; //  constructTree();

  const randHex = () =>
    "#" +
    range(3)
      .map(() => Object.values(hexTable).slice(0, 16).random())
      .join("");

  const nrBlocks = 1500;
  const blockPos = nrBlocks / 20;
  for (let _ of range(nrBlocks)) {
    blocks.push([
      randint(-blockPos, blockPos) * blockSize,
      randint(-blockPos, blockPos) * blockSize,
      randint(-blockPos, blockPos) * blockSize,
      randHex(),
    ]);
  }

  // blocks = blocks.map(([x, y, z, color]) => {
  //   x *= _scale;
  //   y *= _scale;
  //   z *= _scale;

  //   fill("white");
  //   // stroke('white')

  //   return () => {
  //     const n = 500 * blockSize;
  //     // const r = noise(x / n, y / n, noiseOff); //+ Math.sin((x / y) * noiseOff);
  //     const r = MAKeSOMeNOOOOISe(
  //       x / n + noiseOff,
  //       y / n + noiseOff,
  //       z / n + noiseOff
  //     );

  //     // const r = Math.sin(x + noiseOff);

  //     push();
  //     // ambientMaterial(color);
  //     // specularMaterial(color);
  //     translate(x * r, y * r, z * r);
  //     // fill("#" + String(Math.round((1.9 + r) * 10 * 125)).slice(0, 3));
  //     sphere(blockSize / 2);
  //     pop();
  //   };
  // });

  fill("white");
  // stroke('white')
  blocks = blocks.map(([x, y, z]) => {
    x *= _scale;
    y *= _scale;
    z *= _scale;

    return () => {
      const n = 500 * blockSize;
      // const r = noise(x / n, y / n, noiseOff); //+ Math.sin((x / y) * noiseOff);

      const r = MAKeSOMeNOOOOISe(
        x / n + noiseOff,
        y / n + noiseOff,
        z / n + noiseOff
      );

      // const r = Math.sin(x + noiseOff);

      push();
      // ambientMaterial(color);
      // specularMaterial(color);
      translate(x * r, y * r, z * r);
      fill("#" + String(Math.round((1.9 + r) * 10 * 125)).slice(0, 3));
      sphere(blockSize / 2);
      pop();
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
  // background(255);
  // background("red");

  orbitControl(5, 5);
  for (let b of blocks) b();
  noiseOff += 0.01;
}
