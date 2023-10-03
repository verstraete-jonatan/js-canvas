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
  noiseScale: 1.5,
  df: 1500,
  preferdShape: ["default", "triangle", "circle"][0],
});

ctx.invert();

/** Helpers */
function perlinize(x, y, s) {
  let a =
    ((1 + noise.simplex3(x / setup.df, y / setup.df, zoff)) * 1.1 * 128) /
    (PI * 2);
  return rotateVector(x * s, y * s, a);
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
    this.theta = randfloat(0, PI2, 5);
    this.phi = randfloat(0, PI, 5);
    this.projScale = 0;
    this.projX = 0;
    this.projY = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.size = 1;
  }

  project() {
    this.x = setup.radius * sin(this.phi) * cos(this.theta); // * tanh(this.y)
    this.y = setup.radius * cos(this.phi);
    this.z = setup.radius * sin(this.phi) * sin(this.theta) + setup.radius;

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
  constructor(args = {}) {
    const setupOriginal = Object.copy(setup);

    // points class
    class Points {
      constructor(count) {
        this.points = [...new Array(count)].map((i, idx) => new Point(idx));
        this.colorScale = 360;
      }
      showMovement() {
        this.points = this.points.sortAc("projScale");

        this.points.forEach((i, idx, arr) => {
          i.move();
          const thisColor =
            i.alpha > 0
              ? hsl(0, 0, 100 - 100 * posInt(i.alpha), 0.8)
              : "#11111100";

          let value = noise.simplex3(i.x / setup.df, i.y / setup.df, zoff);
          value = (1 + value) * 1.1 * 128;
          const angle = value / (PI * 2);
          const v = perlinize(i.x, i.y, i.projX * setup.noiseScale);

          //const v = rotateVector(i.projX * setup.noiseScale, i.projY, angle)

          ctx.lineWidth = i.size / 10;

          switch (setup.preferdShape) {
            case "triangle":
              triangle(i.projX, i.projY, (v.x - v.y) / 4, {
                rotate: 360 - angle * (360 / 50),
                filled: true,
                sharpness: 2,
              });
              break;
            case "circle":
              circle(i.projX, i.projY, (v.x - v.y) * 0.3); //, "white"
              break;
            default:
              line(i.projX, i.projY, i.projX + v.x, i.projY + v.y, thisColor);
              return;
          }
        });
      }
    }
    function ControlRotating() {
      window.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k === "r") {
          log(setup, setupOriginal);
          pause.toggle();
          setup.inherit(setupOriginal);
          exitting();
        } else if (k === "ArrowLeft") {
          setup.rotHorizontal -= 0.2;
        } else if (k === "ArrowRight") {
          setup.rotHorizontal += 0.2;
        } else if (k === "ArrowUp") {
          setup.radius += 1;
        } else if (k === "ArrowDown") {
          setup.radius -= 1;
        } else if (k === "+") {
          zoffAmount = -0.005;
        } else if (k === "-") {
          zoffAmount = 0.005;
        }
      });
    }
    for (let key in args) {
      if (key != this.inherit.name) setup[key] = args[key];
    }

    ControlRotating();
    const Pointz = new Points(setup.amount);

    this.animate = () => {
      Pointz.showMovement();
    };
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
