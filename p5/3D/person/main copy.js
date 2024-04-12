const SHAPES = [];

function init() {
  Events.keyEvents.clear();
  const blockSize = 50;

  let blocks = [[0, 0, 0], [3, 3, 3], [true]].map(([x, y, z]) =>
    x === true ? [x] : [x * blockSize, y * blockSize, z * blockSize]
  );

  blocks.forEach(([x, y, z], index) => {
    // is a line between the previous 2
    if (x === true) {
      const [x1, y1, z1] = blocks[index - 1];
      const [x2, y2, z2] = blocks[index - 1];

      SHAPES.push(() => {
        push();
        fill("red");
        translate(x1, y1, z1);
        line(x1, y1, x2, y2);
        // rect(x1, y1, x2, y2, 50, 50);
        translate(0, 0, z1);

        pop();
      });
    } else
      SHAPES.push(() => {
        push();
        // ambientMaterial(color);
        translate(x, y, z);
        fill("blue");
        // box(blockSize);
        sphere(blockSize);
        pop();
      });
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(10);
  camera();
  // noStroke();
  stokeWeight(50);
  init();
}

function draw() {
  lights();

  background(255);
  orbitControl(5, 5);
  for (let b of SHAPES) b();
}
