const devideUpMap = () => {
  const s = 50;
  const format = (x, y) => `${x};${y}`;
  const noiseVals = {};
  for (let _x = 0; _x < Xmax; _x += s) {
    // let prev = [0, 0];
    for (let _y = 0; _y < Ymax; _y += s) {
      const noise = getNoiseV2(_x, _y);
      if (noise) {
        const { x, y } = noise;
        rect(_x + x, _y + y, _x + x + s, _y + y + s, "blue");
      }
      // const cx = _x + x;
      // const cy = _y + y;
      // rect(_x + x, _y + y, _x + x + s, _y + y +, "blue");
      // rect(prev[0], prev[1], cx, cy, "blue");

      // noiseVals[format(_x, _y)] = getNoise(_x, _y);
    }
  }
};

class Proto {
  constructor(args) {
    for (let [k, v] of Object.entries(args)) {
      this[k] = v;
    }
    console.log(this);
  }
}
