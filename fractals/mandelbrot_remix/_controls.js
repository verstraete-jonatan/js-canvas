const zoomFactor = 1.03;
const dragSensitivity = 0.005;

let pixelSize = 1;

let mandelScale = 320;

let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0,
  offsetY = 0;
let timeOutId;

let dragging = false;
let isZooming = false;
let zoom = 0;

const drawLowRes = () => {
  mandelbrot(15);
  clearTimeout(timeOutId);
  timeOutId = setTimeout(() => {
    clear();
    mandelbrot();
  }, 100);
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
  if (isZooming) zoom = delta;
  if (delta > 0) {
    mandelScale /= zoomFactor;
  } else {
    mandelScale *= zoomFactor;
  }
  drawLowRes();
};

cnv.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    onZoom(Math.sign(e.deltaY));
  },
  { passive: false }
);
cnv.addEventListener("mousedown", (e) => {
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
});

cnv.addEventListener("mousemove", onMove);
cnv.addEventListener("mouseup", () => {
  dragging = false;
});

addEventListener("keydown", ({ code }) => {
  if (code === "Space") {
    pause = !pause;
  }
});
