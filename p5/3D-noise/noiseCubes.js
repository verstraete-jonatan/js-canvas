const grid = new Map();
const SCALE = 5;
const DETAIL = 50;

const sm = SCALE * DETAIL;
const sm2 = sm / 2;
const sm3 = sm2 - SCALE / 2;
const smCol = 255 / DETAIL;

const cubeIds = [];

for (let x = 0; x < DETAIL; x++) {
  for (let y = 0; y < DETAIL; y++) {
    for (let z = 0; z < DETAIL; z++) {
      cubeIds.push([x, y, z]);
    }
  }
}

let noiseOff = 0;

const noissse = ([x, y, z]) =>
  niceNoise.simplex3(
    (x + noiseOff) / 50,
    (y + noiseOff) / 50,
    (z + noiseOff) / 50
  );

const getActiveCubes = () => {
  const aliveCubes = [];

  for (const n of cubeIds) {
    const nn = noissse(n);
    if (nn > 0.5 && nn < 0.6) {
      aliveCubes.push(n);
    }
  }
  return aliveCubes;
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // camera();
  noStroke();
  noiseSeed(10);

  // frameRate(1);
}

function draw() {
  // lights();
  background(0);
  orbitControl(5, 5, 0.1);

  // global translate to center of orientation
  translate(-sm2, -sm2, -sm2);

  push();
  translate(sm3, sm3, sm3);
  stroke(255);
  noFill();
  box(SCALE * DETAIL);
  box(SCALE * DETAIL * 2);
  box(SCALE * DETAIL * 4);
  pop();

  for (const [x, y, z] of getActiveCubes()) {
    push();
    fill(x * smCol, y * smCol, z * smCol, 150);
    translate(x * SCALE, y * SCALE, z * SCALE);
    box(SCALE);
    pop();
  }
  noiseOff += 0.2;
}
