const isOutOfBounds = ([x, y]) => Boolean(x > mX || y > mY || x < 0 || y < 0);

const isAvailable = ({ pos: n }) =>
  n && !visitedPaths.has(String(n)) && !isOutOfBounds(n);

const asKey = (x, y) => String(x + "," + y);

const drawTile = ({ pos: [x, y], nrVisited = 0 }, fillStyle = "#3f32") => {
  const s2 = scale / 2;
  square(
    x * scale + s2 / 2,
    y * scale + s2 / 2,
    scale - s2,
    scale - s2,
    "white",
    "white"
  );

  fillText(nrVisited, x * scale - s2, y * scale - s2, "red");
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
  [...gridMap.values()].forEach(({ pos: [x, y] }, idx) => {
    square(x * scale, y * scale, scale, "blue", "#F336");
    ctx.fillStyle = "black";
    ctx.fillText(String(idx), x * scale + randint(20), y * scale);
    ctx.fillStyle = "green";

    ctx.fillText(String([x, y]), x * scale, y * scale + 10 + randint(20));
  });
};

const clearAllPrevious = (targetPathIndex) => {
  for (let v of getSortedPath()) {
    if (
      // Math.abs(v.pathIndex - targetPathIndex) < 2 &&
      v.pathIndex > targetPathIndex
    ) {
      // cancel tiles
      v.pathIndex = null;
      v.neighbours = null;
    }
  }
};

const showPath = () => {
  rect(0, 0, Xmax, Ymax, null, "#fff9");
  const s2 = () => scale / 2 + Math.random() * 10;

  const sortedPath = getSortedPath();
  if (!sortedPath.length) return;

  ctx.lineWidth = 5;

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(
    sortedPath[0].pos.x * scale + s2(),
    sortedPath[0].pos.y * scale + s2()
  );
  for (let {
    pos: [x, y],
    pathIndex,
  } of sortedPath) {
    if (!pathIndex) continue;
    //   square(x * scale, y * scale, scale, "blue", "#F336");
    ctx.lineTo(x * scale + s2(), y * scale + s2());
  }
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  // ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());

  // for (let { pos, pathIndex } of sortedPath) {
  //   if (!pathIndex) continue;

  //   const [x, y] = pos;
  //   //   square(x * scale, y * scale, scale, "blue", "#F336");
  //   ctx.lineTo(x * scale + s2(), y * scale + s2());
  // }
  // ctx.stroke();
  // [...gridMap.values()].map(({ pos: [x, y] }) =>
  //   point(x * scale + s2(), y * scale + s2(), 20, "black")
  // );
};

const getSortedPath = () =>
  [...gridMap.values()]
    .filter(({ pathIndex, neighbours }) => pathIndex !== null && neighbours)
    .sort((a, b) => b.pathIndex - a.pathIndex);

const getNeighborCells = (x, y) => [
  gridMap.get(asKey(x + 1, y)), // right
  gridMap.get(asKey(x, y + 1)), // bottom
  gridMap.get(asKey(x - 1, y)), // left
  gridMap.get(asKey(x, y - 1)), // top
];
