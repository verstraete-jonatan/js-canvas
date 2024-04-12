const nrSides = 900;
const nrDots = 100 * 1000;
const s = 500;

const px = Xmax * 2;
const py = Ymax * 2;
const rotate = degRad(-90);
const piSides = PI2 / nrSides;
// there are a lot of 'nrDots' so to assign a color to an individual index, we can't use an array or map
// instead, we assign a sort or range of number to a color, 0-100 -> #f00, 100-200 -> #f50...
const colorPercentage = COLORS.length / nrSides;

const points = [];
let iter = 0;
let theta = 0;

function rotateX(pos) {
  const { y, z } = pos;
  pos.y = y * cos(theta) - z * sin(theta);
  pos.z = y * sin(theta) + z * cos(theta);
  return pos;
}

function rotateY(pos) {
  const { x, z } = pos;
  pos.x = x * cos(theta) + z * sin(theta);
  pos.z = z * cos(theta) + x * sin(theta);
  return pos;
}

function rotateZ(pos) {
  const { x, y } = pos;
  pos.x = x * cos(theta) - y * sin(theta);
  pos.y = x * sin(theta) + y * cos(theta);
  return pos;
}

const main = () => {
  iter++;
  // the below tan(..) give the motion effect
  const a = piSides; // * tan(++iter / 100);
  for (let i = 0; i < nrSides; i++) {
    points[i].x = px + s * sin(a * i + rotate); // * sin((iter++ + i) / 100000);
    points[i].y = py + s * cos(a * i + rotate); // * cos((iter++ + i) / 100000);
  }

  let prev = { ...points[0] };

  for (let i = 0; i < nrDots; i++) {
    const r = randint(nrSides - 1);
    const { x, y, z } = points[r];
    // prev = rotateZ(
    //   rotateY({
    //     x: (x - prev.x) / PI,
    //     y: (y - prev.y) / PI,
    //     z: (z - prev.z) / PI,
    //   })
    // );

    prev = {
      x: (x - prev.x) / PI,
      y: (y - prev.y) / PI,
      z: (z - prev.z) / PI,
    };

    // ctx.fillStyle = COLORS[Math.ceil((COLORS.length / nrDots) * i)];
    ctx.fillStyle = COLORS[Math.ceil(colorPercentage * r)];
    ctx.fillRect(prev.x, prev.y, 2, 2);
  }
  theta += 0.01;
};

const animate = async () => {
  clear();
  main();
  await pauseHalt();
  requestAnimationFrame(animate);
};

for (let _i = 0; _i < nrDots; _i++) {
  points.push({ x: 0, y: 0, z: 0 });
}

animate();
