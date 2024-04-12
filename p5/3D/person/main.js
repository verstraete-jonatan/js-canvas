// let blocks = [];
// const blockSize = 50;

// function init() {
//   blocks = [[-10, -10, 0, 100]];

//   const _scale = 1;
//   blocks = blocks.map(([x, y, z, color]) => {
//     x *= _scale;
//     y *= _scale;
//     z *= _scale;
//     return () => {
//       push();
//       // ambientMaterial(color);
//       // specularMaterial(color);
//       translate(x, y, z);
//       fill(color);
//       box(blockSize);
//       pop();
//     };
//   });
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   frameRate(10);
//   camera();
//   noStroke();
//   init();
// }

// function draw() {
//   lights();

//   background(255);
//   orbitControl(5, 5);
//   for (let b of blocks) b();
// }
let headRadius = 20;
let bodyLength = 100;
let legLength = 80;
let armLength = 60;
const nrBoxes = 80;

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(windowWidth / 1.5, 400, WEBGL);
  frameRate(10);
  // noStroke();
  // fill(150);
}

function draw() {
  background(200);
  orbitControl(5, 5);

  const w2 = windowWidth / 2;

  box(50);
  // Head
  drawBoxes(
    w2,
    height / 2 - bodyLength / 2 - headRadius * 2,
    headRadius * 2,
    headRadius * 2,
    nrBoxes
  );

  // Body
  drawBoxes(
    w2 - headRadius / 2,
    height / 2 - bodyLength / 2,
    headRadius,
    bodyLength,
    nrBoxes
  );

  // Left leg
  drawBoxes(
    w2 - headRadius / 2 - headRadius / 4,
    height / 2 + bodyLength / 2,
    headRadius / 2,
    legLength,
    nrBoxes
  );

  // Right leg
  drawBoxes(
    w2 + headRadius / 4,
    height / 2 + bodyLength / 2,
    headRadius / 2,
    legLength,
    nrBoxes
  );

  // Left arm
  drawBoxes(
    w2 - headRadius / 2 - headRadius / 4,
    height / 2 - bodyLength / 2,
    headRadius / 2,
    -armLength,
    nrBoxes
  );

  // Right arm
  drawBoxes(
    w2 + headRadius / 4,
    height / 2 - bodyLength / 2,
    headRadius / 2,
    -armLength,
    nrBoxes
  );
}

function drawBoxes(x, y, w, h, nrBoxes) {
  let boxWidth = w / nrBoxes;
  let boxHeight = h / nrBoxes;

  for (let i = 0; i < nrBoxes; i++) {
    for (let j = 0; j < nrBoxes; j++) {
      rect(x + i * boxWidth, y + j * boxHeight, boxWidth, boxHeight);
    }
  }
}
