const colored = 0;
const gradientLength = 4;

const attenuation = 0.8;
let startLength = 200;
const minLength = 10;
let directionAngle = 90;
let deltaAngle = 10;
let reverse = 1;

let deltaY = 0;
let depth = 0;

const points = new Set();

function drawTreeUp(x, y, len, angle, ddepth) {
  if (ddepth < 0) return;
  if (len < minLength) return;
  var _x = x - len * cos((angle * PI) / 180);
  var _y = y - len * sin((angle * PI) / 180);
  const t =
    len < minLength * gradientLength
      ? mapNum(len, 0, minLength * gradientLength, 0, 0.8)
      : 1;
  points.add([
    x,
    y,
    _x,
    _y,
    hsl(mapNum(len, minLength, startLength, 0, 360), colored ? 50 : 0, 50, t),
    len,
  ]);

  drawTreeUp(_x, _y, len * attenuation, angle + deltaAngle, ddepth - 1);
  drawTreeUp(_x, _y, len * attenuation, angle - deltaAngle, ddepth - 1);
}

async function animate() {
  if (deltaAngle > 90 || deltaAngle < 0) {
    await sleep(0.5);
    reverse *= -1;
  }
  clear();
  drawTreeUp(Xmid, Ymax + deltaY, startLength, directionAngle, 10);
  const _ = [...points.values()].forEach((i) => {
    ctx.lineWidth = i.last() / 10;
    line(...i);
  });
  points.clear();
  // if(startLength%100==0) depth+=1
  deltaY += reverse;
  startLength += reverse;
  deltaAngle += reverse / 10;
  await pauseHalt();
  requestAnimationFrame(animate);
}

animate();
