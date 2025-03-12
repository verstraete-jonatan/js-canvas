let zoff = 0;
const df = 2000;
const noiseScale = 50;

function getNoise(x, y) {
  const n = ((0.5 + noise.simplex3(x / df, y / df, zoff)) * noiseScale) / 2;

  // return n;
  return smoothSquareWave(n, 1) * Math.tan(zoff) * 100;

  return smoothSquareWave(n, 1) * smoothSquareWave(n, 0.6) * 50;

  // return ((0.5 + noise.simplex3(x / df, y / df, zoff)) * noiseScale) / 2;
}

const points = [];
const detail = 30;
for (let y of range(Ymax)) {
  for (let x of range(Xmax)) {
    if (x % detail == 0 && y % detail == 0) {
      points.push([x, y]);
    }
  }
}

const displayPlay = (i, n) => {
  const v = mapNum(n, 0, 200, 20, 9000);
  playValue(v, i[0] / 10, i[1] / 10, v * 100);
  line(i[0], i[1], i[0] + n, i[1] + n, "#ff0");

  // circle(i[0], i[1], 100, '#ff0', null)
};

const getLister = (idx = 50) => floor(mapNum(idx, 0, 100, 0, points.length));
const getLister2 = (i = 1) => floor(i * points.length);

let listeners = [
  // getLister(51.1),
  getLister2(0.01),
  getLister2(0.6),
  // getLister(52.4),
];

// listeners = range(points.length)
//   .map((i) => (i % 100 === 0 ? i : null))
//   .filter(Boolean);

listeners = range(points.length).filter((i) => i % 50 === 0);

const main = () => {
  async function animate() {
    clear();

    for (let i of points) {
      const n = getNoise(i[0], i[1]);

      // if (points.indexOf(i) % 400 == 0) {
      //   displayPlay(i, n);
      // } else
      line(i[0], i[1], i[0] + n, i[1] + n, "#000");
    }

    for (let idx of listeners) {
      const i = points[idx];
      const n = getNoise(i[0], i[1]);
      displayPlay(i, n);
    }

    zoff += 0.001;
    await pauseHalt();
    await sleep(0.01);
    requestAnimationFrame(animate);
  }

  ctx.invert();
  ctx.lineWidth = detail / 2;

  textCenter("Click to start");
  document.body.onclick = animate;
};

main();
