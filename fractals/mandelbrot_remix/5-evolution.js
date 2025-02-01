const width = cnv.width; // 2;
const height = cnv.height; // 2;

let drawingId = false;
offsetX = 0.825;
offsetY = 1.08;
mandelScale = 200; // 1470.39;

let gg = 0;

const mandelbrot = (size = pixelSize) => {
  drawingId = Math.random();
  const localDrawingId = drawingId;
  clear();
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      let i = 0;
      let cx = -5 + x / mandelScale + offsetX;
      let cy = -3.5 + y / mandelScale + offsetY;
      let zx = cx;
      let zy = cy;

      while (i < mandelScale && zx * zx + zy * zy < 4) {
        if (localDrawingId !== drawingId) return;

        let xt = (zx * zy) / gg;
        zx = zx * zx - zy * zy + cx;
        zy = 2 * xt + cy; //+ cx / 100 + gg;
        i += 1;
      }

      if (i <= 0 || i > mandelScale) continue;

      const r =
        // (i + Math.round(i + i * Math.tan(i))).toString(16) +
        (i + Math.round(i * PI * sin(i))).toString(16) +
        // i.toString(16) +
        i.toString(16) +
        i.toString(16);

      // if (r === "411") continue;

      ctx.fillStyle = "#" + r;
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "#1110";
    }
  }
  ctx.fillStyle = "black";
};

const animate = async () => {
  !dragging && mandelbrot(pause ? 1 : 2);
  gg += 0.01;
  await pauseHalt();
  // textCenter(offsetX.toFixed(3) + " --- " + offsetY.toFixed(3));
  requestAnimationFrame(animate);
};

animate();
