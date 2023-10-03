const colored = 0;
const gradientLength = 4;
const points = new Set();

const attenuation = 0.8;
const tree_amount = 3;
const tree_size = 150;
const tree_mlength = 10;

// iterators
let deltaAngle = 0; // strucure of tree
let evolution = 0.1; // with how much other iterators change
let rotation = 0; // rotation of figure
let centerRadius = -50; // size of what satructure is formed around or in
let hueRotation = 0; // change of color
let sizeChange = 0; // change of size
ctx.invert();

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
        : 0.8;
    let c = "#000";
    /* color gradient */
    //c = hsl(overCount(mapNum(len, tree_mlength, length, 0, 360)+hueRotation, 360), 50, 30, t)
    /* gray gradient */
    c = hsl(0, 0, mapNum(_depth, 0, depth, 0, 50), t);

    const _x = x1 - len * cos((_angle * PI) / 180);
    const _y = y1 - len * sin((_angle * PI) / 180);

    points.add([x1, y1, _x, _y, c, len]);

    draw(_x, _y, len * attenuation, _angle + deltaAngle, _depth - 1);
    draw(_x, _y, len * attenuation, _angle - deltaAngle, _depth - 1);
  }
  draw(x, y, length, angle, depth);
}

async function animate() {
  if (deltaAngle > 90 || deltaAngle < 0) {
    //await sleep(.2)
    evolution *= -1;
  }
  if (centerRadius > 1000) return textCenter("this is the end..");

  rect(0, 0, Xmax, Ymax, null, "#fff1");

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
      depth: 7,
    });
  }

  for (let i of [...points.values()]) {
    ctx.lineWidth = i.last() / 10;
    line(...i);
    // point(i[2], i[3], 10, "red");
  }
  points.clear();
  //sizeChange+=evolution
  rotation += 0.1;
  hueRotation += 1;
  //centerRadius+=1
  deltaAngle += evolution;
  await pauseHalt();
  requestAnimationFrame(animate);
}

animate();
