const colored = 0;
const gradientLength = 4;
const points = [];

// tree position
let directionAngle = 90;
let deltaAngle = 20;
let deltaY = 0;

// tree branching
const attenuation = 0.8;

// tree size
let startLength = 10;
const minLength = 10;
let tree_depth = 20;

// iterators
let reverse = 1;
let rotation = 0;
let centerRadius = 40;
// noise
let zoff = 0;
const df = 800;
const noiseState = 1;
ctx.invert();

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
  length = startLength,
  angle = directionAngle,
  depth = tree_depth,
} = {}) {
  function draw(x1, y1, len, _angle, _depth) {
    if (_depth < 0) return;
    if (len < minLength) return;
    const t =
      len < minLength * gradientLength
        ? mapNum(len, 0, minLength * gradientLength, 0, 0.8)
        : 1;

    const _x1 = x1 - len * cos((_angle * PI) / 180);
    const _y1 = y1 - len * sin((_angle * PI) / 180);
    const { x: _x2, y: _y2 } = perlinize(_x1, _y1, (1 - t) / 5);
    const _x = _x1 + _x2;
    const _y = _y1 + _y2;

    points.push([
      x1,
      y1,
      _x,
      _y,
      hsl(mapNum(len, minLength, startLength, 0, 360), colored ? 50 : 0, 30, t),
      len,
    ]);

    draw(_x, _y, len * attenuation, _angle + deltaAngle, _depth - 1);
    draw(_x, _y, len * attenuation, _angle - deltaAngle, _depth - 1);
  }
  draw(x, y, length, angle, depth);
}

async function animate() {
  if (deltaAngle > 90 || deltaAngle < 0) {
    //await sleep(.2)
    reverse *= -1;
    startLength += 2 + rotation / 100;
  }
  //if(centerRadius>1000)return textCenter('E.N.D')
  clear();

  for (let i = 0; i < 360; i++) {
    if (floor(i % (360 / 5)) != 0) continue;
    const a = degRad(i + rotation);
    const x = Xmid + Math.cos(a) * centerRadius;
    const y = Ymid + Math.sin(a) * centerRadius;

    constructTree({
      x: x,
      y: y,
      length: startLength,
      angle: radDeg(a),
      depth: 10,
    });
  }

  ctx.beginPath();
  for (let i of points) {
    // ctx.lineWidth=i.last()/10
    //line(...i)
    ctx.lineTo(i[0], i[1]);
  }
  ctx.closePath();
  ctx.stroke();
  points.length = 0;

  deltaAngle += reverse + 0.05;
  zoff += 0.02;
  rotation += 0.1;
  //centerRadius += 0.2;
  //startLength += 0.1
  //deltaAngle+=reverse
  //await pauseHalt()
  requestAnimationFrame(animate);
}

animate();
