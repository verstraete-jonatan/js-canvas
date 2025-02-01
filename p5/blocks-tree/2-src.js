/*
1.
 - mass/particles flow upwards pushed by growth/energy
    - the center of the branch is the tube/highway for the energy to travel
    - the thicker and the more straight the center is, the faster energy can travel through it.
 - once they reach a stable enough state, they can afford to branch off
    - sometimes a branch dies or just doesn't work out and sometimes leaves a mark.
    - in case of some plants this seems like an exact formula, in case of others branches
      are created somewhat random and can even split the plant/tree in two sides.
- once a branch does not receive sufficient energy it starts to shrinks. On a small scale
it creates even smaller branches, eventually blossoming in leaves.


2.
All materials in a tree/branching-like-structure are formed by the same single cell/particle. 
This cell can be mutated by its environment and can turn into 3 distinctive cells:
- outer cells: these are the first cells to grow out and come in contact with the outer world. 
Once they interact with the outer world they slow down and form a stable strong structure, and form an outer crust protecting the 
inner cells from harm.
- inner cells: these form the muscle of the structure and are strong yet remain flexible. They push growth and make up the highway for 
the fluid like cells.
- fluid cells: they form the blood of the structure, flowing in between the inner cells, transporting nutrition.

In essence very similar if not exactly the same as a human body. Everything moves just a lot slower and without the more complex separate
complexes like a liver.


3. thats way to complex to make here..
: see https://chewitt.me/Papers/CTH-Dissertation-2017.pdf


4. no wifi.. just gonna try first project with some new concepts of the waves of "drawWaves()"
*/

let NUM_X = 0;
const rInt = (a = 1, b = 0) => Math.round(rFloat(a, b));
const rFloat = (a = 1, b = 0) => {
  const r = Number(
    "." +
      String(Math.tan(++NUM_X * 1000))
        .split(".")[1]
        .slice(3)
  );
  return b ? r * (b - a + 1) + a : r * (a - b + 1) + b;
};

function posZByAngle(x, y, z, angle = 0, dis = 10) {
  const _x = dis * Math.cos(angle);
  const _y = dis * Math.sin(angle);
  const _z = dis * Math.sin(angle);

  const dx = _x - x;
  const dy = _y - y;
  const dz = _z - z;

  let rxy = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  let phi = Math.atan(dz / rxy);
  if (dx < 0) phi += Math.PI;

  return [x + _x, y + _y, dis * phi];
}

function smoothSquareWave(t, delta = 0.1, amp = 1, freq = 1 / PI2) {
  // https://dsp.stackexchange.com/questions/35211/generating-smoothed-versions-of-square-wave-triangular-etc
  return (
    (amp / Math.atan(1 / delta)) *
    Math.atan(Math.sin(2 * PI * t * freq) / delta)
  );
}

const getSquareNoise = (n = 0, scale = 5) => Math.round(noise(n / 100) * scale);

let f = 0;
const drawWaves = () => {
  let prev = null;
  for (const i of range(100)) {
    const n = noise(i / 20 + f) * 10;
    const x = i * 10;
    const y = -500 + n * 40; // smoothSquareWave(n, 1, 30) * 20;
    const z = 1; // n * sin(i) * 30;

    if (prev) {
      push();
      line(x, y, z, prev[0], prev[1], prev[2]);
      pop();
    }

    prev = [x, y, z];

    // push();
    // translate(x, y, z);
    // box(5);
    // pop();
  }

  prev = null;
  for (const i of range(100)) {
    const n = noise(i / 20 + f) * 10;
    const x = i * 10;
    const y = -200 + smoothSquareWave(i + f * 20, 1) * 20;
    const z = 1; // n * sin(i) * 30;

    if (prev) {
      push();
      line(x, y, z, prev[0], prev[1], prev[2]);
      pop();
    }

    prev = [x, y, z];

    // push();
    // translate(x, y, z);
    // box(5);
    // pop();
  }

  prev = null;
  for (const i of range(200)) {
    const x = i * 5;
    const n = Math.round(noise(x / 100 + f) * 5);
    const y = n * 40; // smoothSquareWave(n, 1, 30) * 20;
    const z = 1; // n * sin(i) * 30;

    if (prev) {
      push();
      line(x, y, z, prev[0], prev[1], prev[2]);
      pop();
    }

    prev = [x, y, z];

    // push();
    // translate(x, y, z);
    // box(5);
    // pop();
  }
  f += 0.02;
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(10);
  camera();
  noiseSeed(10);
  stroke("red");
  strokeWeight(2);
  Tree.init();
}

function draw() {
  lights();
  background(0);
  orbitControl(5, 5, 0.1);

  Tree.grow();
  drawWaves();
}
