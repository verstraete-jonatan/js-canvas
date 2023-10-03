let zoomlevel = 800;
const horizontal_offset = Xmid;
const vertical_offset = Ymid;
const depth_offset = 20;

const noiseConf = {
  // amplitude
  amp: 10,
  // (inverse freqency) | diffusion
  freq: 70,
  zoff: 0,
};

const setup = Object({
  center: { x: Xmid, y: Ymid },
  rotHorizontal: 1,
  radius: 600,
  amount: 1400,
});

const threeConf = {
  wideness: 4,
  detlaAngle: 90,
  attenuation: 0.8,
  minLength: 20,
  startLength: 70,
  depth: 10,
};

let reqanim = true;

let mouse_x = 0;
let mouse_y = 0;
let mouse_down = false;

ctx.fillStyle = "orange";
ctx.lineWidth = 0.5;
ctx.strokeStyle = "#000";
ctx.invert();
