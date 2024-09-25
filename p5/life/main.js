const aliveGrid = new Set();
const SCALE = 20;
const MAP_SIZE = 30; // Reduced for performance in 3D

// Init preset in 3D
(() => {
  const x = 0;
  const y = 0;
  const z = 0;

  // Example of a 3D glider
  aliveGrid.add(String([x, y, z]));
  aliveGrid.add(String([x + 1, y, z]));
  aliveGrid.add(String([x + 2, y, z]));
  aliveGrid.add(String([x + 2, y + 1, z]));
  aliveGrid.add(String([x + 2, y + 2, z]));
  aliveGrid.add(String([x + 2, y, z + 1]));
  aliveGrid.add(String([x + 1, y, z + 1]));

  aliveGrid.add(String([x, y, z + 1]));
  aliveGrid.add(String([x + 1, y, z + 1]));
  aliveGrid.add(String([x + 2, y, z + 1]));
  aliveGrid.add(String([x + 2, y + 1, z + 1]));
  aliveGrid.add(String([x + 2, y + 2, z + 1]));
  aliveGrid.add(String([x + 2, y, z + 1 + 1]));
  aliveGrid.add(String([x + 1, y, z + 1 + 1]));
})();

// Check if a cell is alive or dead based on neighbors in 3D
const checkAlive = (x, y, z) => {
  let aliveNeighbors = 0;

  // Find 26 neighbors in 3D space
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx || dy || dz) {
          aliveGrid.has(String([x + dx, y + dy, z + dz])) && aliveNeighbors++;
        }
      }
    }
  }

  const key = String([x, y, z]);

  // Math.round((3 / 8) * 26)

  if (aliveGrid.has(key)) {
    if (aliveNeighbors < 6.5 || aliveNeighbors > 9.75) {
      aliveGrid.delete(key);
    }
  } else {
    if ([5, 7, 8, 10, 11, 12].includes(aliveNeighbors)) {
      aliveGrid.add(key);
    }
  }

  // if (isAlive) {
  //   if (aliveNeighbors < 6.5 || aliveNeighbors > 3) {
  //     aliveGrid.delete(key); // Dies due to under/overpopulation
  //   }
  // } else if (aliveNeighbors === 3) {
  //   aliveGrid.add(key); // A new cell is born
  // }
};

function init() {
  noiseSeed(10);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera();
  init();
  // frameRate(1);
}

function draw() {
  lights();
  background(0);

  for (let x = 0; x < MAP_SIZE; x++) {
    for (let y = 0; y < MAP_SIZE; y++) {
      for (let z = 0; z < MAP_SIZE; z++) {
        checkAlive(x, y, z);
      }
    }
  }

  const sm2 = (SCALE * MAP_SIZE) / 2;
  translate(-sm2, -sm2, -sm2);

  push();
  translate(sm2 - SCALE / 2, sm2 - SCALE / 2, sm2 - SCALE / 2);
  stroke(255);
  noFill();
  box(SCALE * MAP_SIZE);
  pop();

  // Draw the alive cells as cubes
  [...aliveGrid.values()].forEach((v, i, t) => {
    const [x, y, z] = v.split(",").map(Number);

    fill((255 / t.length) * i);
    push();
    translate(x * SCALE, y * SCALE, z * SCALE);
    box(SCALE * 0.8); // Draw a cube at the (x, y, z) location
    pop();
  });

  orbitControl(5, 5, 0.1);
}
