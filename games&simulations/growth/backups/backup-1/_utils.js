const utils = {
  colors: {
    saved: {},
    save: () => {
      this.colors.saved = {
        stroke: ctx.stokeStyle,
        fill: ctx.fillStyle,
      };
    },
    resotre: () => {
      ctx.stokeStyle = this.colors.saved?.stokeStyle;
      ctx.stokeStyle = this.colors.saved?.fillStyle;
    },
  },
};

// const isInBounds = (x, y) => {
//   return x < Xmax && y < Ymax && x > Xmin && y > Ymin;
// };

// const xm = Xmax / 2;
// const ym = Ymax / 2;

const isInBounds = (x, y) => {
  // const _x = xm + x
  return x < Xmax && y < Ymax && x > Xmin && y > Ymin;
};

const getNoise = (x, y, df = 500) =>
  rotateVector(
    x,
    y,
    ((1 + noise.perlin3(x / df, y / df, zoff)) * 1.1 * 128) / PI2
  );

const getNoiseV2 = (x, y, df = 800) => {
  const value = noise.perlin3(x / df, y / df, zoff);
  if (Math.abs(value) < 0.4) return;
  // log(value);
  // const angle = ((1 + value) * 1.1 * 128) / PI2;
  const angle = ((1 + value) * 128) / PI2;

  return rotateVector(x, y, angle);
};
