const isOutOfBounds = ([x, y]) => Boolean(x > mX || y > mY || x < 0 || y < 0);

const isAvailable = ({ pos: n }) =>
  n && !visitedPaths.has(String(n)) && !isOutOfBounds(n);

const asKey = (x, y) => String(x + "," + y);

const drawTile = ([x, y], fillStyle = "#3f32") => {
  square(x * scale, y * scale, scale, "blue", fillStyle);
};

const isEndPoint = (sP) => sP === sEND || sP === sSTART;
const isNotEndpoint = (sP) => !isEndPoint(sP);

function rangeN(n = 1) {
  const res = [];
  if (n > 0)
    for (let i = 0; i <= n; i++) {
      res.push(i);
    }
  else
    for (let i = 0; i >= n; i--) {
      res.push(i);
    }

  return res;
}

const isEnd = ({ key }) => key === sEND;

const showGrid = (drawAsync = false) => {
  if (drawAsync) {
    (async () => {
      for (let { pos } of [...gridMap.values()]) {
        const [x, y] = pos;
        square(x * scale, y * scale, scale, "blue", "#F336");
        ctx.fillStyle = "black";
        // ctx.fillText(String(idx), x * scale + randint(20), y * scale);
        ctx.fillStyle = "green";

        ctx.fillText(String([x, y]), x * scale, y * scale + 10 + randint(20));
        await sleep(0.5);
      }
    })();
  } else {
    [...gridMap.values()].forEach(({ pos }, idx) => {
      const [x, y] = pos;

      square(x * scale, y * scale, scale, "blue", "#F336");
      ctx.fillStyle = "black";
      ctx.fillText(String(idx), x * scale + randint(20), y * scale);
      ctx.fillStyle = "green";

      ctx.fillText(String([x, y]), x * scale, y * scale + 10 + randint(20));
    });
  }
};

const showPath = () => {
  rect(0, 0, Xmax, Ymax, null, "#fff9");
  const s2 = () => scale / 2 + Math.random() * 10;

  ctx.lineWidth = 5;

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());
  for (let {
    pos: [x, y],
    pathIndex,
  } of gridMap.values()) {
    if (!pathIndex) continue;
    //   square(x * scale, y * scale, scale, "blue", "#F336");
    ctx.lineTo(x * scale + s2(), y * scale + s2());
  }
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());

  for (let { pos } of [...gridMap.values()]) {
    const [x, y] = pos;
    //   square(x * scale, y * scale, scale, "blue", "#F336");
    ctx.lineTo(x * scale + s2(), y * scale + s2());
  }
  ctx.stroke();
  [...gridMap.values()].map(({ pos }) => point(...pos, 20, "black"));
};
