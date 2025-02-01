const nrSides = 9000;
const nrDots = 100 * 1000;
const s = 500;

const px = Xmax * 2;
const py = Ymax * 2;
const rotate = degRad(-90);
// const a = PI2 / nrSides;

// there are a lot of 'nrDots' so to assign a color to an individual index, we can't use an array or map
// instead, we assign a sort or range of number to a color, 0-100 -> #f00, 100-200 -> #f50...
const colorPercentage = COLORS.length / nrSides;

const points = [];
for (let _i = 0; _i < nrDots; _i++) {
  points.push([0, 0]);
}
let iter = 0;
cnv.style.filter = `blur(1px) invert(1)`;

const main = () => {
  const a = (PI2 / nrSides) * tan(++iter / 100);
  for (let i = 0; i < nrSides; i++) {
    points[i][0] = px + s * tanh(a * i + rotate);
    points[i][1] = py + s * tan(a * i + rotate);
  }

  let prev = points[0];

  for (let i = 0; i < nrDots; i++) {
    const r = randint(nrSides - 1);
    const [x, y] = points[r];
    prev = [(x - prev[0]) / PI, (y - prev[1]) / PI];

    // ctx.fillStyle = COLORS[Math.ceil((COLORS.length / nrDots) * i)];
    // ctx.fillStyle = COLORS[r];

    ctx.fillStyle = COLORS[Math.ceil(colorPercentage * r)];
    ctx.fillRect(prev[0], prev[1], 2, 2);
  }
};

let total = 0;
let count = 0;
let average = 0;
const animate = async () => {
  // const t = performance.now();
  clear();
  main();
  requestAnimationFrame(animate);

  // count++;
  // total += performance.now() - t;
  // textCenter(`${(total / count).toFixed(3)}`, 20, "red");
};

animate();
