const colored = 0;
const gradientLength = 4;
const points = new Set();

const attenuation = 0.8;
const tree_amount = 1;
const tree_size = 150;
const tree_mlength = 10;

const force_wind = 2;

// iterators
let deltaAngle = 20; // strucure of tree
let evolution = 0.1; // with how much other iterators change
let rotation = 90; // rotation of figure
let centerRadius = 350; // size of what satructure is formed around or in
let hueRotation = 0; // change of color
let sizeChange = 0; // change of size
let branch_evolution = 0; // noise to move branch

// noise
let zoff = 0;
const df = 2000;
const noiseState = true;

function getNoise(x, y, scale = 1) {
  return noise.simplex3(x / df, y / df, zoff);
}

function perlinize(x, y, scale = 1) {
  if (!noiseState) return { x: 0, y: 0 };
  let value = noise.simplex3(x / df, y / df, zoff);
  value = (1 + value) * 1.1 * 128;
  let angle = value / (PI * 2);
  return rotateVector(x * scale, y * scale, angle);
}

function constructTree({
  x = Xmid,
  y = Ymax,
  length = 150,
  angle = 90,
  depth = 10,
} = {}) {
  function draw(x1, y1, len, _angle, _depth) {
    if (_depth < 0) return;
    if (len < tree_mlength) return;
    const t =
      len < tree_mlength * gradientLength
        ? mapNum(len, 0, tree_mlength * gradientLength, 0, 0.8)
        : 1;
    let c = "#000";
    /* color gradient */
    //c = hsl(mapNum(len+hueRotation, tree_mlength, length+hueRotation, 0, 360), 50, mapNum(len, tree_mlength, length, 0, 90), t)
    /* gray gradient */
    c = hsl(0, 0, mapNum(_depth, 0, depth, 0, 90), t);

    const _x = x1 - len * cos((_angle * PI) / 180);
    const _y = y1 - len * sin((_angle * PI) / 180);

    points.add([x1, y1, _x, _y, c, len]);
    const f =
      1 -
      getNoise(_x + branch_evolution, _y + branch_evolution) *
        mapNum(deltaAngle, 0, 90, 0, force_wind);
    draw(_x, _y, len * attenuation, _angle + deltaAngle * f, _depth - 1);
    draw(_x, _y, len * attenuation, _angle - deltaAngle / f, _depth - 1);
  }
  draw(x, y, length, angle, depth);
}

function dispalyWind(detail = 20) {
  const pts = [];
  for (let i of range(Xmax)) {
    for (let j of range(Ymax)) {
      if (i % detail == 0 && j % detail == 0) {
        const { x, y } = perlinize(i, j);
        pts.push([i, j, i + x, j + y]);
      }
    }
  }

  for (let i of pts) {
    line(...i);
  }
}

async function animate() {
  if (deltaAngle > 30 || deltaAngle < 20) {
    //await sleep(.2)
    evolution *= -1;
  }
  if (centerRadius > 1000) return textCenter("this is the end..");

  rect(0, 0, Xmax, Ymax, null, "#fff");
  dispalyWind();

  for (let i = 0; i < 360; i++) {
    if (floor(i % (360 / tree_amount)) != 0) continue;
    const a = degRad(i + rotation);
    const x = Xmid + Math.cos(a) * centerRadius;
    const y = Ymid + Math.sin(a) * centerRadius;

    constructTree({
      x: x,
      y: y,
      length: tree_size + sizeChange,
      angle: radDeg(a),
      depth: 10,
    });
  }

  for (let i of [...points.values()]) {
    ctx.lineWidth = i.last() / 10;
    line(...i);
    //point(i[0], i[1], 10, 'red')
  }

  //return
  points.clear();
  //sizeChange+=evolution
  //rotation+=.1
  hueRotation += 1;
  //force_wind=1+getNoise(hueRotation, hueRotation)/10
  branch_evolution++;
  //centerRadius+=1
  //deltaAngle+=evolution
  if (noiseState) zoff += 0.005;
  await pauseHalt();
  requestAnimationFrame(animate);
}

ctx.invert();
animate();
