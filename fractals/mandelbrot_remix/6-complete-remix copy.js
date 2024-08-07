const width = cnv.width; // 2;
const height = cnv.height; // 2;

offsetX = 0.825;
offsetY = 1.08;
mandelScale = 200; // 1470.39;

let gg = 0;

const mandelbrot = (size = pixelSize) => {
  clear();
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      let i = 0;
      let cx = -5 + x / mandelScale + offsetX;
      let cy = -3.5 + y / mandelScale + offsetY;
      let zx = cx * Math.log(cx / cy) * gg;
      let zy = cy; // * (cx / cy) * gg;

      while (i < mandelScale && zx * zx + zy * zy < 4) {
        let xt = zx * zy; //  * ((x % gg) * (y % gg));
        zx = zx * zx - zy * zy + cx;
        zy = 2 * xt + cy;
        i += 1;
      }

      //   let xtemp
      //   while (x < 2 && y < 2 && iteration < max_iteration) {
      //     xtemp = x * x - y * y + xcord;
      //     y = 2 * x * y + ycord;
      //     x = xtemp;
      //     iteration = iteration + 1;
      //   }

      if (i >= mandelScale) continue;

      const r =
        // (i + Math.round(i * sin(i))).toString(16) +
        (i - Math.round(2 * i * Math.sin(i))).toString(16) +
        (i - 1).toString(16) +
        (i + 1).toString(16);
      // i.toString(16).repeat(3);

      ctx.fillStyle = "#" + r;
      ctx.fillRect(x, y, size, size);
    }
  }
  ctx.fillStyle = "black";
};

ctx.dark();
mandelbrot();

const animate = async () => {
  !dragging && mandelbrot(pause ? 1 : 2);
  gg += 0.01;
  await pauseHalt();
  // textCenter(offsetX.toFixed(3) + " --- " + offsetY.toFixed(3));
  requestAnimationFrame(animate);
};

animate();
