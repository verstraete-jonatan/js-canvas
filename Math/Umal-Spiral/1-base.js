/**
    What if all whole numbers where wrong? What if only numbers like PI are truthfull, and all the rest is just a misinterpretation?
    Imagine a leaf, it may look like it has 5 pointy parts, but in reality this is a formula which does not use the number 5.
    It's like saying a mountain has 1 peak.. what is a mountain? what is a peak? A peak is only a thing we define, not a mathematical truth.
    
    Using base 10, might be the biggest misconception in math history. Might be more truthfull to use multiplications of PI than this?
 */

const scale = 0.5;

/** amt of block away from the middle point */
let nrBlock = 1;
/** current pos relative to middle point */
let posX = 0;
let posY = 0;

const dd = (x, y, idx) => rect(x, y, x + scale, y + scale, null, getColor(idx));

const getColor = (n) => {
  return "black";
  return hsl(rootSum(n) * 36);
};

const rootSum = (n) => {
  if (String(n).length > 1) {
    return rootSum(String(n).split("").map(Number).sum());
  }
  return n;
};

const baseNums = [2, 3, 5];

function isPrime(num) {
  // return num % 20 === 0;
  if (baseNums.some((n) => num % n === 0)) return false;
  const sqrtnum = Math.floor(Math.sqrt(num));
  for (let i = 2; i < sqrtnum + 1; i++) {
    if (num % i == 0) {
      return false;
    }
  }
  return num != 1;
}
const primes = new Set();
function drawNeighbours(dim = 1) {
  let idx = dim * dim;
  for (let row = -dim; row <= dim; row++) {
    for (let col = -dim; col <= dim; col++) {
      if (abs(col) === dim || abs(row) === dim) {
        if (!primes.has(idx) && isPrime(idx)) {
          primes.add(idx);
          dd(Xmid + col * scale, Ymid + row * scale, idx);
        }
      }
      idx += 1;
    }
  }
}

let current = 0;
let prev = performance.now();
const animate = async () => {
  for (let i of range(1000)) {
    await pauseHalt();
    requestAnimationFrame(() => drawNeighbours(i));
  }
  return;
  const n = performance.now();

  clear();
  textCenter(n - prev);
  prev = n;
  if (++current > 1000) return;
  drawNeighbours(current);
  // await pauseHalt();
  requestAnimationFrame(animate);
};

ctx.invert();

animate();
