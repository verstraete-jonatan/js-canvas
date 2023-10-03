const df = 500;
let zoff = 0.01;

function getNoise(x, y) {
  return rotateVector(
    x,
    y,
    ((1 + noise.perlin3(x / df, y / df, zoff)) * 1.1 * 128) / PI2
  );
}

function getNoiseVal(x, y) {
  return mapNum(getNoise(x, y), 4.37, 277.2, 0, 100);
}

const GRID = {
  detail: 13,
  map: new Map(),
  init() {
    for (let x = 0; x < Xmax; x++) {
      for (let y = 0; y < Ymax; y++) {
        if (x % this.detail === 0 && y % this.detail === 0) {
          this.map.set(sCoord(x, y), {
            x: x,
            y: y,
            nx: 0,
            ny: 0,
            height: getNoiseVal(x, y),
            next: null,
          });
        }
      }
    }
    for (let v of this.map.values()) {
      v.next = this.getClosest(v.x, v.y);
    }
  },
  updateNoise() {
    for (let v of this.map.values()) {
      const { x, y } = getNoise(v.x, v.y);
      v.nx = v.x + x;
      v.ny = v.y + y;
    }
  },
  draw() {
    this.updateNoise();
    for (let v of this.map.values()) {
      if (!v.next) continue;
      const { nx, ny, next } = v;
      line(nx, ny, next.nx, next.ny, hsl(0, 0, v.height));
    }
  },
  getClosest(x, y) {
    const p = { x: floor(x), y: floor(y) };
    let res = [Infinity];
    for (let _x of range(this.detail * 2).map((i) => p.x + i - this.detail)) {
      for (let _y of range(this.detail * 2).map((i) => p.y + i - this.detail)) {
        if (
          _x % this.detail === 0 &&
          _y % this.detail === 0 &&
          _y > 0 &&
          _x > 0
        ) {
          const d = distanceTo(p, { x: _x, y: _y });
          if (d < res[0] && d > 0) {
            const n = sCoord(_x, _y);
            if (!res[1]) res = [d, n];
            else {
              const pt = this.map.get(n);
              if (!pt.next) res = [d, n];
            }
          }
        }
      }
    }
    return this.map.get(res[1]);
  },
};
