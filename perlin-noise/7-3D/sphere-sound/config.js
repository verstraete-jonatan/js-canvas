// const horizontal_zoom = 800;
// const vertical_zoom = horizontal_zoom;
let zoomlevel = 800;
const horizontal_offset = Xmid;
const vertical_offset = Ymid;
const depth_offset = 20;

const noiseConf = {
  scale: 20,
  df: 50,
  zoff: 200,
};

const setup = Object({
  center: { x: Xmid, y: Ymid },
  rotHorizontal: 1,
  radius: 900,
  amount: 1000,
});

let reqanim = true;

let mouse_x = 0;
let mouse_y = 0;
let mouse_down = false;

ctx.fillStyle = "orange";
ctx.lineWidth = 0.5;
ctx.strokeStyle = "#000";
ctx.invert();
