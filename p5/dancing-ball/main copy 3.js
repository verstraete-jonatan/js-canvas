const SCALE = 200;
const PI2 = Math.PI * 2;

const setupSphere = () => {
  const detail = 200;

  for (let i2 = 0; i2 <= detail; i2 += 4) {
    const Theta = (PI2 / detail) * i2;

    for (let i = 0; i <= detail; i += 4) {
      const u = map(i, 0, detail, -1, 1);

      const x = cos(Theta) * sqrt(1 - u * u);
      const y = sin(Theta) * sqrt(1 - u * u);
      const z = u;

      pts.push({ x, y, z });
    }
  }

  return;
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  smooth();

  setupSphere();
}

const pts = [];

function draw() {
  background(0);
  orbitControl(5, 5, 0.1);
  push();
  stroke(255);
  noFill();
  box(400);
  pop();

  fill(255);
  // noFill();
  // stroke("red");

  pts.forEach((i) => {
    push();
    translate(i.x * SCALE, i.y * SCALE, i.z * SCALE);
    box(10);
    pop();
  });

  // push();
  // beginShape();

  // pts.forEach((i) => {
  //   vertex(i.x * SCALE, i.y * SCALE, i.z * SCALE);
  // });
  // endShape(CLOSE);
  // pop();
}
