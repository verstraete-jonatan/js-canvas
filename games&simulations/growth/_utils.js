const arrowsKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const isArrowKey = (key) => arrowsKeys.includes(key);

const isInBounds = (x, y) => x < Xmax && y < Ymax && x > Xmin && y > Ymin;
const isInBounds2 = ({ x, y, s }) => {
  const s2 = s / 2;
  return x - s2 < Xmax && y - s2 < Ymax && x + s2 > Xmin && y + s2 > Ymin;
};

// -0.79, 0.57
const applyLimit = (n) => mapNum(n, -0.79, 0.57, 0, 2); //  Math.max(-1, Math.min(1, n));

const getNoise = (x, y, df = 500) => {
  const n = applyLimit(noise.perlin3(x / df, y / df, 0));

  let _x = degRad(x);
  let _y = degRad(y);

  const cs = cos(n) / 1;
  const sn = sin(n) / 1;

  return [_x * cs - _y * sn, _x * sn + _y * cs];

  return rotateVector(x, y, n);
};

const getAngleTowardsPlayer = ({ x, y }) =>
  atan2(Player.x - Player.base.x - x, Player.y - Player.base.y - y);

const getNoiseV2 = (x, y, df = 1000) => {
  const n = noise.perlin3(x / df, y / df, 0);
  if (Math.abs(n) < 0.3) return;
  const value = ((1 + n) * 128) / PI2;

  return rotateVector(x, y, value);
};

const distanceToArr = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

const renderSats = () => {
  Object.entries(Player.values).forEach(([k, v], index) => {
    if (Store.activeMaterials.includes(k)) {
      ctx.fillText(`${k}=${v}`, Xmid, Ymid - 100 + index * 20);
    }
  });
};

function mouseToAngle({ clientX, clientY }) {
  const { left, top } = cnv.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  Effects.push(new Effect(x + Xmid - Player.x, y + Ymid - Player.y));
  return Math.atan2(y - Ymid, x - Xmid);
}

const drawBackgroundV1 = () => {
  const s = 50;
  const m = 100;
  ctx.lineWidth = 0.5;

  for (let x = -m; x < Xmax + m; x += s) {
    for (let y = -m; y < Ymax + m; y += s) {
      const noise = getNoiseV2(x - Player.x, y - Player.y);
      if (noise) {
        const px = toFixed(noise.x + x);
        const py = toFixed(noise.y + y);
        rect(px, py, px + s, py + s, "#fff8");
      }
    }
  }
};

function formTriangle(a, b, c) {
  // ctx.strokeStyle = COLORS.next();
  ctx.fillStyle = "#fff1";
  ctx.beginPath();
  ctx.moveTo(...a);
  ctx.lineTo(...b);
  ctx.lineTo(...c);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

const drawBackgroundV2 = () => {
  const m = -100;
  const amt = 50;

  const mx = (Xmax - m) / amt;
  const my = (Ymax - m) / amt;

  const pts = [];
  for (let _x = 0; _x <= amt; _x++) {
    for (let _y = 0; _y <= amt; _y++) {
      if (_x === amt || _y === amt || _x === amt - 1 || _y === amt - 1)
        continue;
      const x = mx * _x;
      const y = my * _y;
      const noise = getNoise(x - Player.x, y - Player.y);
      pts.push([x + noise[0], y + noise[1]]);
    }
  }

  ctx.strokeStyle = "red";
  ctx.lineWidth = 0.5;
  pts.forEach(([x, y], idx) => {
    let diagonal, right, left;

    diagonal = pts[idx + amt + 1];
    if (diagonal?.[1] < y) return;
    right = pts[idx + 1];
    left = pts[idx + amt];
    if (diagonal && right && left) {
      formTriangle(right, diagonal, left);
      formTriangle([x, y], right, left);
    }
  });
};

const drawBackgroundV3 = () => {
  const _noise = (x, y, df = 1000) => {
    const n = noise.perlin3(x / df, y / df, 0) * 500;

    let _x = degRad(x);
    let _y = degRad(y);

    const cs = cos(n) / 1;
    const sn = sin(n) / 1;

    return [_x * cs - _y * sn, _x * sn + _y * cs];
  };

  const m = -100;
  const amt = 50;

  const mx = (Xmax - m) / amt;
  const my = (Ymax - m) / amt;

  const pts = [];
  for (let _x = 0; _x <= amt; _x++) {
    for (let _y = 0; _y <= amt; _y++) {
      if (_x === amt || _y === amt || _x === amt - 1 || _y === amt - 1)
        continue;
      const x = mx * _x;
      const y = my * _y;
      const noise = _noise(x - Player.x, y - Player.y);
      pts.push([x + noise[0], y + noise[1]]);
    }
  }

  ctx.strokeStyle = "red";
  ctx.lineWidth = 0.5;
  pts.forEach(([x, y], idx) => {
    let diagonal, right, left;

    diagonal = pts[idx + amt + 1];
    if (diagonal?.[1] < y) return;
    right = pts[idx + 1];
    left = pts[idx + amt];
    if (diagonal && right && left) {
      formTriangle(right, diagonal, left);
    }
  });
};
