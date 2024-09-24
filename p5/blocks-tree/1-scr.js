let blocks = [];
let noiseOff = 0;
const blockSize = 15;

const MAKeSOMeNOOOOISe = (x, y, z) => niceNoise.simplex3(x, y, z);

let NUM_X = 5;

const rInt = (a = 1, b = 0) => Math.round(rFloat(a, b));
const rFloat = (a = 1, b = 0) => {
  const r = Number(
    "." +
      String(Math.tan(++NUM_X * 1000))
        .split(".")[1]
        .slice(3)
  );
  return b ? r * (b - a + 1) + a : r * (a - b + 1) + b;
};

function init() {
  Events.keyEvents.clear();
  noiseSeed(10);

  Tree.init();
  Tree.grow();
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

  orbitControl(5, 5, 0.1);
  Tree.draw();
  noiseOff += 0.01;
}
