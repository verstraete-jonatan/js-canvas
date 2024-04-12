const dd = (x, y, idx) => rect(x, y, x + scale, y + scale, null, getColor(idx));

const getColor = (n) => {
  return "white";
  return hsl(rootSum(n) * 36);
};

const rootSum = (n) => {
  if (String(n).length > 1) {
    return rootSum(String(n).split("").map(Number).sum());
  }
  return n;
};

const baseNums = [2, 3, 5, 9];
function isPrime(num) {
  if (num === 2 || num === 3) return true;
  if (baseNums.some((n) => num % n === 0)) return false;
  const sqrtnum = floor(sqrt(num));
  for (let i = 3; i < sqrtnum + 1; i += 2) {
    if (num % i == 0) {
      return false;
    }
  }
  return num != 1;
}

const primes = new Set();

function draw() {
  clear();
  let index = 0;
  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;
  let segmentLength = 1;
  let segmentPassed = 0;

  const maxX = Xmax * scale;
  const maxY = Ymax * scale;

  ctx.fillStyle = "#fff";
  while (index < TOTAL_POINTS * TOTAL_POINTS) {
    if (!primes.has(index) && isPrime(index)) {
      primes.add(index);
      // rect(x, y, x + scale, y + scale, null, getColor(idx));
      // ctx.fillRect(x, y, x + scale, y + scale);
      dd(Xmid + x * scale, Ymid + y * scale, index);
    }

    x += dx;
    y += dy;
    index++;

    // Check if the segment has been passed
    segmentPassed++;

    // If the segment has been passed completely
    if (segmentPassed === segmentLength) {
      segmentPassed = 0;

      // Change direction
      const temp = dx;
      dx = -dy;
      dy = temp;

      // Increase segment length every two turns
      if (dy === 0) {
        segmentLength++;
      }
    }

    if (x >= TOTAL_POINTS || y >= TOTAL_POINTS || x > maxX || y > maxY) {
      break;
    }
  }
}

let scale = 1;
let zoom = 0;
let tx = Xmid;
let ty = Ymid;
let tIndex = 0;
let isDragging = false;

const ZOOM_SENSITIVITY = 0.1;
const DRAG_SENSITIVITY = 1;

const MAX_ZOOM = 10;
const MIN_ZOOM = 0.3;
const TOTAL_POINTS = 200;

ctx.dark();
ctx.imageSmoothingEnabled = false;
const boundBox = cnv.getBoundingClientRect();

draw();
let timeOutId = null;
const debounceDraw = () => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(() => {
    clear();
    draw(1000);
  }, 500);
};

const showPreview = (x = Xmid, y = Ymid) => {
  clear();

  square(x, y, (TOTAL_POINTS / 2) * scale, null, "white", {
    centered: true,
  });
  // square(x, y, (TOTAL_POINTS / 200) * scale, null, "#aaa", {
  //   centered: true,
  // });
};

const onWheel = function (e) {
  e.preventDefault();
  const wheel = e.deltaY < 0 ? 1 : -1;
  const zoom = Math.exp(wheel * ZOOM_SENSITIVITY);
  scale *= zoom;

  showPreview();
  debounceDraw();
};

cnv.addEventListener("mouseup", function (e) {
  isDragging = false;
  draw();
});

cnv.addEventListener("mousedown", function (e) {
  isDragging = true;
});

cnv.addEventListener("mousemove", function (e) {
  // return;
  if (isDragging) {
    const mouseX = e.clientX - boundBox.left;
    const mouseY = e.clientY - boundBox.top;
    const distanceX = mouseX - tx;
    const distanceY = mouseY - ty;
    tx = distanceX;
    ty = distanceY;

    // tIndex = Math.floor(Math.sqrt(distanceX ** 2 + distanceY ** 2));

    showPreview(tx, ty);
  }
});

cnv.addEventListener("wheel", onWheel, { passive: false });
