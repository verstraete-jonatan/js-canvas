const isOutOfBounds = ([x, y]) => Boolean(x > mX || y > mY || x < 0 || y < 0);

const isAvailable = (n) =>
  n && !visitedPaths.has(String(n)) && !isOutOfBounds(n);

const addPath = (n, byIndex = null) => {
  if (isAvailable(n)) {
    if (byIndex) {
      const item = paths[byIndex];
      paths.splice(byIndex, 1, item, n);
      console.log(
        "--",
        byIndex,
        item,
        n,
        String(paths.slice(byIndex, byIndex + 3).join(" > "))
      );
    } else {
      visitedPaths.add(String(n));
      paths.push(n);
    }
  }
};

const getNeighbours = ([x, y]) => [
  [x + 1, y], // right
  [x, y + 1], // bottom
  [x - 1, y], // left
  [x, y - 1], // top
];

const draw = ([x, y] = current, fillStyle = "#3f32") => {
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
