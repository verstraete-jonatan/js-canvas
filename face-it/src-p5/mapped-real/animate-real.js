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

  // orbitControl(5, 5);
  background("#fff");
  stroke("#5f7");
  fill("#5f7");

  const mesh = window.humanInstance?.result.face[0]?.mesh;

  // ?.sort((a, b) => {
  //   return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  // });
  if (mesh) {
    translate(-900, -700, 0);

    mesh.forEach(([x, y, z]) => {
      const s = 10;
      const imgData = [
        ...(window.ctx?.getImageData(x, y, x + s, y + s)?.data ?? []),
      ];

      for (let i = 0; i < imgData.length; i += 4) {
        if (i % 500 !== 0) {
          continue;
        }
        push();
        translate(x, y, z * -3);
        const [a, b, c, d] = imgData.slice(i, i + 4);
        // fill(a, b, c);
        box(10);
        pop();
      }
    });
  }

  noiseOff += 0.001;
}
