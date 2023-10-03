const gradientLength = 4;
const points = [];

// tree position
let deltaAngle = 20;
let deltaY = 0;

// tree branching
const attenuation = 0.8;

// tree size
let startLength = 100;
const minLength = 10;
let tree_depth = 10;

// iterators
let reverse = 1;
let rotation = 0;
let centerRadius = 20;
// noise
let zoff = 0;
const df = 200;
const noiseScale = 0.1;
ctx.invert();

class Tree {
  constructor(initDetlaAngel, initRotation) {
    this.deltaAngle = initDetlaAngel;
    this.rotation = initRotation;
    this.speed = (1 + randfloat()) / 3;
    this.points = [];
  }

  iter() {
    const a = degRad(this.rotation + rotation);
    const x = Xmid + Math.cos(a) * centerRadius;
    const y = Ymid + Math.sin(a) * centerRadius;

    this.deltaAngle += this.speed;
    this.angleVal = 10 + sin(this.deltaAngle / 100) * 100;
    this.points.length = 0;
    this.make(x, y, startLength, radDeg(a), tree_depth);
  }
  make(x1, y1, len, _angle, _depth) {
    if (_depth < 0) return;
    if (len < minLength) return;
    const t =
      len < minLength * gradientLength
        ? mapNum(len, 0, minLength * gradientLength, 0, 0.8)
        : 1;

    const _x1 = x1 - len * cos((_angle * PI) / 180);
    const _y1 = y1 - len * sin((_angle * PI) / 180);
    const { x: _x2, y: _y2 } = perlinize(_x1, _y1, (1 - t) * noiseScale);

    const _x = _x1 + _x2;
    const _y = _y1 + _y2;

    this.points.push([
      x1,
      y1,
      _x,
      _y,
      hsl(mapNum(len, minLength, startLength, 0, 360), 0, 30, t),
      len,
    ]);

    this.make(_x, _y, len * attenuation, _angle + this.angleVal, _depth - 1);
    this.make(_x, _y, len * attenuation, _angle - this.angleVal, _depth - 1);
  }
  draw() {
    for (let i of this.points) {
      ctx.lineTo(i[0], i[1]);
    }
  }
}

function perlinize(x, y, s) {
  let a = ((1 + noise.simplex3(x / df, y / df, zoff)) * 1.1 * 128) / (PI * 2);
  return rotateVector(x * s, y * s, a);
}

const rots = [0, 72, 144, 216, 288];
const trees = range(5).map((i) => new Tree((i + 1) * 20, rots[i]));

let prevr = true;
let r = !prevr;

async function animate() {
  r = floor(rotation);
  if (prevr !== r && r % 50 == 0) {
    //startLength += 1 //+ rotation/100
    previousStartLength = r;
  }

  clear();

  for (let i of trees) {
    i.iter();
  }
  ctx.beginPath();
  for (let i of trees) {
    i.draw();
  }
  ctx.closePath();
  ctx.stroke();

  zoff += 0.01;
  rotation += 0.1;
  centerRadius += 0.05;
  requestAnimationFrame(animate);
}

animate();
