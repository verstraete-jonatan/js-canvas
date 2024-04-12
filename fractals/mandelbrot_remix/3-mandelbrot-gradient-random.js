const mandelScale = 320;
const pxScale = 0.5;

const mandelbot = () => {
  // ctx.save();
  // ctx.translate(mandelScale - 300, mandelScale - 300);

  for (let x = 0; x < Xmax; x += pxScale) {
    for (let y = 0; y < Ymax; y += pxScale) {
      let i = 0;
      let cx = -2 + x / mandelScale;
      let cy = -2 + y / mandelScale;
      let zx = 0;
      let zy = 0;

      while (i < mandelScale && zx * zx + zy * zy < PI2) {
        let xt = zx * zy;
        zx = zx * zx - zy * zy + cx;
        zy = 2 * xt + cy;

        // zy += Math.sin(i / 100) * 1000 * i * (xt / mandelScale);
        // zx += Math.cos(i / 100) * 10 * zy * (xt / mandelScale);

        i += 1;
      }

      if (!(i > 0 && i < mandelScale)) continue;

      // const r =
      //   (i + round((i / mandelScale) * mandelScale + i)).toString(16) +
      //   (i + 1).toString(16) +
      //   (i - 1).toString(16);
      // const r =
      //   (i + round((i / mandelScale) * mandelScale + i + zy * zx)).toString(
      //     16
      //   ) +
      //   i.toString(16) +
      //   i.toString(16);

      // const r =
      //   str(i + round(i + i + zy * zx)).toString(16) +
      //   (i + 1).toString(16) +
      //   (i - 1).toString(16);

      const r =
        str(i + round(i + i * sin(i))).toString(16) +
        (i - 1).toString(16) +
        (i + 1).toString(16);

      ctx.fillStyle = "#" + r;

      ctx.fillRect(x, y, pxScale, pxScale);
    }
  }
  // ctx.restore();
};

mandelbot();
