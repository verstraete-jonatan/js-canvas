let blocks = [];
const blockSize = 50;

function init() {
  Events.keyEvents.clear();

  const red = "#e31";
  const blue = "#15f";
  const green = "#3f5";

  const _scale = 1;

  blocks = [
    [20, 20, 20, red],
    [40, 40, 40, blue],
  ];

  const randHex = () =>
    "#" +
    range(3)
      .map(() => Object.values(hexTable).slice(0, 16).random())
      .join("");

  for (let i of range(20)) {
    blocks.push([
      randint(-10, 10) * blockSize,
      randint(-10, 10) * blockSize,
      randint(-10, 10) * blockSize,
      randHex(),
    ]);
  }

  blocks = blocks.map(([x, y, z, color]) => {
    x *= _scale;
    y *= _scale;
    z *= _scale;
    return () => {
      push();
      // ambientMaterial(color);
      // specularMaterial(color);
      translate(x, y, z);
      fill(color);
      box(blockSize);
      pop();
    };
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(10);
  camera();
  noStroke();
  init();
}

function draw() {
  lights();

  background(255);
  orbitControl(5, 5);
  for (let b of blocks) b();
}
