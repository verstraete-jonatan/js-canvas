let scale = 100;
const mX = floor(Xmax / scale);
const mY = floor(Ymax / scale);

const totalNrSquares = Math.floor(mX * mY);
const gridMap = new Map();

/**
 * Init grid
 */

const getNeighbours = ([x, y]) => [
  [x + 1, y], // right
  [x, y + 1], // bottom
  [x - 1, y], // left
  [x, y - 1], // top
];

// predefine the grid with empty fields and pre calculate all neighboring fields
for (let x = 0; x <= mX; x++) {
  for (let y = 0; y <= mY; y++) {
    const key = asKey(x, y);
    const neighbours = getNeighbours([x, y]).filter((i) => !isOutOfBounds(i));
    gridMap.set(key, {
      pos: [x, y],
      pathIndex: null,
      key,
      /** aa */
      neighbours: neighbours.length ? neighbours : null,
      visited: 0,
    });
  }
}
// transform keys to references
for (let v of gridMap.values()) {
  v.neighbours = v.neighbours.map((key) => gridMap.get(asKey(...key)));
}

let current = gridMap.get(asKey(0, 0));

const END = [mX - 1, mY - 1];
const START = [...current.pos];
const sEND = asKey(...END);
const sSTART = asKey(...START);
