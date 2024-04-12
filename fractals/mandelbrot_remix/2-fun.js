let scale = 30;
// const Xmid = cnv.width;
// const Ymax = cnv.height;

const sx = 5.76; //(Xmax/300)
const sy = 3.2133333333333334; //(Ymax/300)

function draw() {
  const xSize = (300 / scale) * Xmax;
  const ySize = (300 / scale) * Ymax;

  for (let x = 300 / scale; x < xSize; x++) {
    for (let y = 300 / scale; y < ySize; y++) {
      let i = 0;
      let cx = -2 + x / scale;
      let cy = -2 + y / scale;
      let zx = 0;
      let zy = 0;

      while (i < scale && zx * zx + zy * zy < 4) {
        let xt = zx * zy;
        zx = zx * zx - zy * zy + cx;
        zy = 2 * xt + cy;
        i++;
      }

      const fill = ctx.fillStyle;
      ctx.fillStyle = hsl(
        overCount((x + y + sin(i) * scale) * sin(i / scale), scale),
        50,
        50,
        1
      );
      ctx.fillRect(x, y, 1, 1);
      ctx.fillStyle = fill;
    }
  }
}

draw();

// let timeOutId = null;
// const ZOOM_SENSITIVITY = 0.001;

// const debounceDraw = () => {
//   clearTimeout(timeOutId);
//   timeOutId = setTimeout(() => {
//     clear();
//     draw(1000);
//   }, 300);
// };

// const onWheel = function (e) {
//   e.preventDefault();
//   const wheel = e.deltaY < 0 ? 1 : -1;
//   const zoom = Math.exp(wheel * ZOOM_SENSITIVITY);
//   scale *= zoom;

//   debounceDraw();
// };

// cnv.addEventListener("wheel", onWheel, { passive: false });
