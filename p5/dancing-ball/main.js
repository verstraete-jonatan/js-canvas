const SCALE = 200;
const PI2 = Math.PI * 2;
const detail = 160;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // smooth();
}

const pts = [];
let g = 0;
function draw() {
  background(0);
  orbitControl(5, 5, 0.1);

  stroke(0);
  // noFill();

  for (let i2 = 0; i2 <= detail; i2 += 4) {
    const Theta = (PI2 / detail) * i2;

    for (let i = 0; i <= detail; i += 4) {
      const u = map(i, 0, detail, -1, 1);

      // randomnessFactor
      // const rf = noise(i + i2 + g); // tan(i + g) * noise(i + g);
      const rf = tan(i + g) * noise(i + g);

      const x = cos(Theta) * sqrt(1 - u * u) * rf;
      const y = sin(Theta) * sqrt(1 - u * u) * rf;
      const z = u * rf;

      push();
      translate(x * SCALE, y * SCALE, z * SCALE);
      box(Math.min(10 * rf, 2));
      pop();
    }
  }
  console.clear();
  console.log(frameRate());
  g += 0.001;
}
