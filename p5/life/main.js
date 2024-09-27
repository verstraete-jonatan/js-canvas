const grid = new Map();
const SCALE = 12;
const DETAIL = 30; // Reduced for performance in 3D

const cubeIds = [];

for (let x = 0; x < DETAIL; x++) {
  for (let y = 0; y < DETAIL; y++) {
    for (let z = 0; z < DETAIL; z++) {
      cubeIds.push([x, y, z]);
    }
  }
}

const dNeighbors = [];

for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dz = -1; dz <= 1; dz++) {
      if (dx || dy || dz) {
        dNeighbors.push([dx, dy, dz]);
      }
    }
  }
}

const sm = SCALE * DETAIL;
const sm2 = sm / 2;
const sm3 = sm2 - SCALE / 2;
const smCol = 255 / DETAIL;

const ffs = 0;
// Init preset in 3D
(() => {
  const _x = 0;
  const _y = 0;
  const _z = 0;

  const pts = [
    [0, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
    [2, 1, 0],
    [2, 2, 0],
    [2, 0, 1],
    [1, 0, 1],

    [0, 0, 1],
    [1, 1, 1],
    [2, 1, 1],
    [2, 1, 1],
    [2, 2, 1],
    [2, 1, 2],
    [1, 1, 2],
  ];
  for (const [x, y, z] of pts) {
    grid.set(String([_x + x, _y + y, _z + z]), true);
  }
})();

const CACHE = {
  neighbours: new Map(),
};

const checkAlive = ([x, y, z]) => {
  const key = String([x, y, z]);
  let nrNeighbours = 0;

  if (CACHE.neighbours.has(key)) {
    for (const k of CACHE.neighbours.get(key)) {
      if (grid.get(k)) {
        nrNeighbours++;
      }
    }
  } else {
    const keys = [];
    for (const [dx, dy, dz] of dNeighbors) {
      const k = String([x + dx, y + dy, z + dz]);
      keys.push(k);
      if (grid.get(k)) {
        nrNeighbours++;
      }
    }

    CACHE.neighbours.set(key, keys);
  }

  let isAlive = grid.get(key) ?? false;

  if (isAlive) {
    if (nrNeighbours < 3 || nrNeighbours > 6) {
      isAlive = false;
    }
  } else if ([, 5].includes(nrNeighbours)) {
    isAlive = true;
  }

  // if (isAlive) {
  //   isAlive = Math.random() > 0.1;
  // }

  // if (!isAlive) {
  //   isAlive = [, 5, 6, 7].includes(nrNeighbours);
  // } else if (nrNeighbours > 12 || nrNeighbours < 4) {
  //   isAlive = false;
  // }
  return isAlive;

  // by adding an include of multiple values, the amount of checks make a cell 'dead' should keep the same ratio of 2-1, so should have 6 checks for 3 includes.

  const smallerDie = 5;
  const greaterDie = 11;
  const equalLive = [6, 7];

  if (grid.get(key) === true) {
    if (nrNeighbours < smallerDie || nrNeighbours > greaterDie) {
      grid.set(key, false);
    }
  } else if (equalLive.includes(nrNeighbours)) {
    grid.set(key, true);
  }
  return;

  if (isAlive) {
    if (aliveNeighbors < 2 || aliveNeighbors > 3) {
      aliveGrid.delete(key); // Dies due to under/overpopulation
    }
  } else if (aliveNeighbors === 3) {
    aliveGrid.add(key); // A new cell is born
  }

  // if (isAlive) {
  //   if (nrNeighbours < 6.5 || nrNeighbours > 3) {
  //     grid.delete(key); // Dies due to under/overpopulation
  //   }
  // } else if (nrNeighbours === 3) {
  //   grid.set(key); // A new cell is bo, truern
  // }
};

function init() {
  noiseSeed(10);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera();
  init();
  // noStroke();
  // frameRate(1);
}

function draw() {
  lights();
  background(0);
  orbitControl(5, 5, 0.1);

  const aliveCubes = [];
  const deadCubes = [];

  for (const n of cubeIds) {
    if (checkAlive(n)) {
      aliveCubes.push(n);
    } else {
      deadCubes.push(n);
    }
  }

  // global translate to center of orientation
  translate(-sm2, -sm2, -sm2);

  push();
  translate(sm3, sm3, sm3);
  stroke(255);
  noFill();
  box(SCALE * DETAIL);
  // box(SCALE * DETAIL * 2);
  // box(SCALE * DETAIL * 4);
  pop();

  for (const n of deadCubes) {
    grid.set(String(n), false);
  }

  for (const [x, y, z] of aliveCubes) {
    grid.set(String([x, y, z]), true);

    push();
    // fill(x * smCol, y * smCol, z * smCol);
    translate(x * SCALE, y * SCALE, z * SCALE);
    box(SCALE * 0.8);
    pop();
  }
}
