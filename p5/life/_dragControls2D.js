const zoomFactor = 1.23;
const dragSensitivity = 1;

let offsetZ = 1;

let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0,
  offsetY = 0;

let dragging = false;
let isZooming = false;

let isOrbitMode = true;

document.addEventListener("keydown", ({ key }) => {
  if (key === "m") {
    isOrbitMode = !isOrbitMode;
  }
});

const onMove = (e) => {
  if (!dragging || isOrbitMode) return;
  const dx = (e.clientX - dragStartX) * dragSensitivity;
  const dy = (e.clientY - dragStartY) * dragSensitivity;
  offsetX += dx;
  offsetY += dy;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
};

// const onZoom = (delta) => {
//   console.log(delta, offsetZ);
//   if (delta > 0) {
//     offsetZ /= zoomFactor;
//   } else {
//     offsetZ *= zoomFactor;
//   }

//   offsetZ = Math.max(offsetZ, 5);
//   offsetZ = Math.min(offsetZ, -5);
// };

// document.addEventListener(
//   "wheel",
//   (e) => {
//     if (!isOrbitMode) {
//       e.preventDefault();
//       onZoom(Math.sign(e.deltaY));
//     }
//   },
//   { passive: false }
// );
document.addEventListener("mousedown", ({ clientX, clientY }) => {
  if (!isOrbitMode) {
    dragging = true;
    dragStartX = clientX;
    dragStartY = clientY;
  }
});

document.addEventListener("mousemove", onMove);
document.addEventListener("mouseup", () => {
  if (!isOrbitMode) {
    dragging = false;
  }
});
