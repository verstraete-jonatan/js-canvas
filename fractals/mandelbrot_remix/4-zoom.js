const zoomFactor = 1.1;
const dragSensitivity = 0.001;

let pixelSize = 1;

let mandelScale = 320;

let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0,
  offsetY = 0;
let dragging = false;
let timeOutId;
let isDrawing = false;

let zoom = 0;

const debounceDraw = () => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(() => {
    if (dragging) return;
    clear();
    mandelbrot();
  }, 100);
};

const drawLowRes = () => {
  mandelbrot(8);
  debounceDraw();
};

const onMove = (e) => {
  if (!dragging) return;
  const dx = ((e.clientX - dragStartX) * dragSensitivity) / pixelSize;
  const dy = ((e.clientY - dragStartY) * dragSensitivity) / pixelSize;
  offsetX += dx * -1;
  offsetY += dy * -1;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  drawLowRes();
};

const onZoom = (delta) => {
  zoom = delta;
  if (delta > 0) {
    mandelScale /= zoomFactor;
  } else {
    mandelScale *= zoomFactor;
  }
  drawLowRes();
};

cnv.addEventListener("wheel", (e) => {
  e.preventDefault();
  onZoom(Math.sign(e.deltaY));
});

cnv.addEventListener("mousedown", (e) => {
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
});

cnv.addEventListener("mousemove", onMove);
cnv.addEventListener("mouseup", () => {
  dragging = false;
});

const mandelbrot = (size = pixelSize) => {
  if (isDrawing) return;
  isDrawing = true;
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  for (let x = 0; x < cnv.width; x += size) {
    for (let y = 0; y < cnv.height; y += size) {
      let i = 0;
      let cx = -2 + x / mandelScale + offsetX;
      let cy = -2 + y / mandelScale + offsetY;
      let zx = cx;
      let zy = cy;

      while (i < mandelScale && zx * zx + zy * zy < 4) {
        let xt = zx * zy;
        zx = zx * zx - zy * zy + cx;
        zy = 2 * xt + cy;
        i += 1;
      }

      if (!(i > 0 && i < mandelScale)) continue;

      const r =
        (i + Math.round(i + i * Math.sin(i))).toString(16) +
        (i - 1).toString(16) +
        (i + 1).toString(16);

      ctx.fillStyle = "#" + r;
      ctx.fillRect(x, y, size, size);
    }
  }
  isDrawing = false;
};

mandelbrot();
