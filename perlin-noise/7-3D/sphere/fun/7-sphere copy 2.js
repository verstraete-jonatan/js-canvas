/** Constants */
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

const setup = Object({
  color: false,
  depth: 900,
  minDepth: 0,
  center: { x: Xmid, y: Ymid },
  rotHorizontal: 1,
  radius: 300,
  maxSize: 15,
  minSize: 3,
  amount: 2201,
  noiseScale: 5,
  df: 1500,
  preferdShape: ["default", "triangle", "circle"][0],
});

ctx.invert();

/** Helpers */
function perlinize(x, y) {
  let a =
    ((1 + noise.simplex3(x / setup.df, y / setup.df, zoff)) * 1.1 * 128) /
    (PI * 2);
  return rotateVector(x * setup.noiseScale, y * setup.noiseScale, a);
}

/** Tree */
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

/** Point */
class Point {
  constructor(id) {
    this.id = id;
    this.alpha = 1;
    this.theta = PI + cosh(id / 10) * 1000; //+cos(id/20)//randfloat(0, PI2, 5)
    this.phi = PI + sinh(id / 10) * 1000; //+tan(id*100)//randfloat(0, PI, 5)
    this.projScale = 0;
    this.projX = 0;
    this.projY = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.size = 1;
  }

  project() {
    this.x = setup.radius * sin(this.phi) * cos(this.theta); //* tan(this.y)
    this.y = setup.radius * cos(this.phi);
    this.z = setup.radius * sin(this.phi) * sin(this.theta) + setup.radius; //* tan(this.y)

    this.projScale = setup.depth / (setup.depth + this.z);
    this.projX = this.x * this.projScale + setup.center.x;
    this.projY = this.y * this.projScale + setup.center.y;

    this.size = mapNum(this.z, 0, setup.depth, setup.maxSize, setup.minSize);
    this.alpha = mapNum(this.z, 0, setup.depth, 1, 0);
  }

  move() {
    this.theta += 0.01 * setup.rotHorizontal;
    this.project();
  }
}

/** Sphere */
class Sphere {
  constructor() {
    this.points = [...new Array(setup.amount)].map((i, idx) => new Point(idx));
    this.colorScale = 360;
    ctx.lineWidth = 0.05;
  }
  animate() {
    this.points.forEach((i) => i.move());

    this.points.forEach((i) => point(i.projX, i.projY, 1, "blue"));
    return;

    ctx.beginPath();
    for (let i of this.points) {
      const { x, y } = perlinize(i.x, i.y);

      ctx.lineWidth = i.size / 100;
      ctx.lineTo(i.projX, i.projY);
      //ctx.lineTo(i.projX + x, i.projY + y)
    }
    ctx.closePath();
    ctx.stroke();
  }
}

async function main() {
  // textCenter("press arrows")
  // await sleep(1)
  const spheres = [new Sphere()];

  function animation() {
    clear();
    spheres.forEach((n) => n.animate());
    requestAnimationFrame(animation);
  }

  animation();
}

//defaultEvents = false
main();
