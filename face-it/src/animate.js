const noiseSize = 1000;
let noiseOff = 0;

const niceNoiserazerFaserTaser = (x, y, z) =>
  (niceNoise.simplex3(
    x / noiseSize + noiseOff,
    y / noiseSize + noiseOff,
    z / noiseSize + noiseOff
  ) +
    0.9265007812499998) /
  1.8530015624999996;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera();
}

const smoothenVector = (a, b, smoothness = 1) => [
  a[0] + smoothness * (b[0] - a[0]),
  a[1] + smoothness * (b[1] - a[1]),
  a[2] + smoothness * (b[2] - a[2]),
];

let prevMesh = null;

function draw() {
  lights();

  orbitControl(5, 5);
  background("#fff");
  stroke("#5f7");
  fill("#5f7");

  const mesh = window.MESH?.sort((a, b) => {
    return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  });
  if (mesh) {
    translate(-900, -700, 0);

    mesh.forEach((a, index) => {
      if (index === Math.floor(noiseOff * 100)) {
        fill("#00f");
      } else {
        fill("#5f7");
      }
      const [x, y, z] = a;
      const n = 0;

      push();

      translate(x + n, y + n, z * -3 + n);

      box(10);
      pop();
    });
  }

  noiseOff += 0.001;
}
