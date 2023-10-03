let zoff = 0;
const df = 1000;
const noiseScale = 1;

function getNoise(x, y) {
  return (1 + noise.simplex3(x / df, y / df, zoff)) / 2;
}
