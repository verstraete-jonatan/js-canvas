let scale = 40;
const mX = floor(Xmax / scale);
const mY = floor(Ymax / scale);

const visitedPaths = new Set();
const paths = [];
const totalNrSquares = Math.floor(mX * mY);
const END = [mX - 1, mY - 1];
let START = [10, 10];
const sEND = String(END);
const sSTART = String(START);

let current = [...START];
