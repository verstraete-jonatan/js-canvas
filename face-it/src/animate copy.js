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

  // fill("#f003");
  // const w = windowWidth / 2;
  // const h = windowHeight / 2;
  // rect(-w / 2, -h, w * 2, h * 2);

  orbitControl(5, 5);
  background("#fff");

  const mesh = window.MESH?.sort((a, b) => {
    return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    // if(!x) {
    //   const y = a[1] - b[1]
    //   if(!y) {

    //   }

    // }
  });
  if (mesh) {
    translate(-900, -700, 0);
    // noStroke();
    fill("#5f7");
    stroke("#5f7");

    // if (prevMesh) {
    mesh.forEach((a, index) => {
      const [x, y, z] = a; // smoothenVector(a, prevMesh[index]);
      const n = 0; //niceNoiserazerFaserTaser(x, y, z) * 100;

      push();
      // translate(x, y, z * -3);
      translate(x + n, y + n, z * -3 + n);

      box(10);
      pop();
    });
  }
  // if (!prevMesh || frameCount % 50 === 0) {
  //   prevMesh = mesh;
  // }

  //   mesh.forEach((a, index) => {
  //     const next = mesh[index + 1];
  //     if (!next) return;
  //     const [x, y, z] = a;
  //     beginShape();
  //     vertex(next[0], next[1], next[2] * -3);
  //     vertex(x, y, z * -3);
  //     endShape(CLOSE);
  //   });
  // }
  noiseOff += 0.001;

  // rotateY(90);

  // for (const [x, y, z] of window.MESH) {
  //   push();
  //   translate(x, y, z * -3);
  //   sphere(5);
  //   pop();
  // }

  // stroke("white");
  // window.MESH.forEach(([x, y, z], index) => {
  //   const next = window.MESH[index + 1];
  //   if (next) {
  //     push();
  //     beginShape();
  //     vertex(x, y, z * -3);
  //     vertex(next[0], next[1], next[2] * -3);

  //     endShape();
  //     pop();
  //   }
  // });
}
