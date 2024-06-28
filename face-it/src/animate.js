const _APP = async () => {
  const { cos, sin, atan, floor } = Math;

  const PI = Math.PI;
  const PI2 = Math.PI * 2;

  const degRad = (i) => i * (PI / 180);

  // const cnv =
  //   document.getElementById("canvas_01") ||
  //   document.querySelector("canvas") ||
  //   document.createElement("canvas");
  // const ctx = cnv.getContext("2d");

  const cnv = window.cnv;
  const ctx = window.ctx;

  cnv.height = window.innerHeight;
  cnv.width = window.innerWidth;

  let pause = false;
  let exit = false;

  const Ymid = cnv.height / 2;
  const Ymax = cnv.height;

  const Xmid = cnv.width / 2;
  const Xmax = cnv.width;

  function clear(setColor = null) {
    return;
    if (setColor) {
      rect(0, 0, cnv.width, cnv.height, false, setColor);
    } else {
      ctx.clearRect(0, 0, Xmax, Ymax);
    }
  }

  function rect(x1, y1, x2, y2, stroke = "#000", fill) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y1);

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.closePath();
  }

  function line(x1, y1, x2, y2, stroke = null, fill = null) {
    if (stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  function point(x, y, s = 10, fill) {
    if (isObj(x)) {
      fill = s;
      s = y || s;
      y = x.y;
      x = x.x;
    }
    circle(x, y, s / 2, null, fill);
  }

  function circle(x = Xmid, y = Ymid, r = 200, stroke = "#111", fill) {
    if (r < 0) r *= -1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.closePath();
  }

  function textCenter(txt, size = 20, color = null) {
    const l = ctx.font;
    if (color) ctx.fillStyle = color;
    txt = str(txt);
    ctx.font = size + "px verdana";
    ctx.fillText(txt, Xmid - (txt.length * size) / 3.2, Ymid);
    ctx.font = l;
  }

  function overCount(i, max, min = 0, nullable = true) {
    let stopinifnite = 0;
    while (i >= max) {
      stopinifnite++;
      if (stopinifnite > 1000) exitting("INFITE max");
      if (nullable && i == 0) return i;
      i -= max;
    }
    while (i < min) {
      stopinifnite++;
      if (stopinifnite > 1000) exitting("INFITE min");

      if (nullable && i == 0) return i;
      i += posInt(min || 1);
    }
    return i;
  }

  function rotateVector(x, y, angle, rad = 1, isDeg = false) {
    let _x = degRad(x);
    let _y = degRad(y);
    // ? numbers that make is somehow even rotations
    const ang = isDeg ? degRad(-angle - 50.5) : -angle - 50.5;

    const cs = cos(ang) * rad;
    const sn = sin(ang) * rad;
    return {
      x: toFixed(_x * cs - _y * sn),
      y: toFixed(_x * sn + _y * cs),
      angle: angle,
    };
  }

  function toFixed(nr, amt = 3) {
    return +nr.toFixed(amt);
  }

  function numMax(n, max) {
    return n > max ? max : n;
  }

  function range(n = 1, detail = 1) {
    if (n < 0) return nRange(n);
    let res = [];
    for (let i = n < 0 ? n : 0; i < n; i += detail) {
      res.push(+i);
    }
    return res;
  }

  function nRange(n = 1) {
    if (n > 0) return range(n);
    let res = [];
    for (let i = 0; i > n; i--) {
      res.push(i);
    }
    return res;
  }

  function range0(n = 1) {
    //[...new Array(floor(window.innerWidth/pxScale))].map((i, idx)=>idx)
    // return new Array(n)
    let res = [];
    for (let i = n < 0 ? n : 0; i < n; i += 1) {
      res.push(0);
    }
    return res;
  }

  function rangeF(f = () => "", n = 1) {
    let res = [];
    for (let i = n < 0 ? n : 0; i < n; i += 1) {
      res.push(f(i));
    }
    return res;
  }

  function rangeSign(n = 1, sign) {
    // return new Array(n)
    let res = [];
    for (let i = n < 0 ? n : 0; i < n; i += 1) {
      res.push(sign);
    }
    return res.join("");
  }

  function sleep(s = 0.1) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }

  async function pauseHalt(sl, overlay = true) {
    if (sl) {
      await sleep(sl);
    }
    if (pause) {
      if (overlay) overlayDIV.set("=", "overlay-pause", "overlay-fixed");
      //else textCenter("||", 200, "white")
      let timeout = 0;
      while (pause) {
        await sleep();
        timeout++;
        if (timeout > 2000) {
          pause = false;
          if (overlay) {
            overlayDIV.remove();
            overlayDIV.set("TIME-OUT, press r", "overlay-fixed", "red");
            Events.setKey("r", () => window.location.reload());
            exitting("sleep timeout");
          }
        }
      }
      if (overlay) overlayDIV.remove();
    }
    return;
  }

  function exitting(msg = "--exit--", force = false) {
    throw new Error(msg);
  }

  function repeatF(f = () => {}, times = 10) {
    for (let i = 0; i < times; i += 1) {
      f((i = i));
    }
  }

  function repeatS(s = "", times = 1) {
    let r = s;
    for (let i = 1; i < times; i += 1) {
      r += s;
    }
    return r;
  }

  function ctxError(s) {
    clear();
    textCenter(s);
    throw new Error(s);
  }

  function isObj(n) {
    return Object.is(n);
  }

  function isClass(a) {
    return !Object.is(a) && a.__proto__.constructor.name !== "Object";
  }

  function isArray(n) {
    return n instanceof Array;
  }

  function isString(n) {
    return typeof n === "string"; //n instanceof String
  }

  function isInt(n) {
    return n instanceof Number;
  }

  function str(a) {
    return String(a);
  }

  function int(a) {
    return +a;
  }

  function posInt(a) {
    return a < 0 ? a * -1 : a;
  }

  function negInt(a) {
    return a > 0 ? a * -1 : a;
  }

  function isNeg(a) {
    return a < 0;
  }

  function isPos(a) {
    return a > 0;
  }

  function oppInt(a) {
    return a > 0 ? -1 : 1;
  }

  function hex(
    int,
    strLen = 1,
    formatted = false,
    { bit6 = false, transparency = 1 } = {}
  ) {
    // ff=255, fff=4095
    let hex = int.toString(16);
    while (hex.length < strLen) {
      hex = "0" + hex;
    }
    if (bit6 || transparency) {
      // fff => ffffff
      if (hex.length === 3)
        hex = hex
          .split("")
          .map((i, idx) => i + i)
          .join("");
      // fff/ffffff => ffffff22
      if (transparency) hex += (transparency * 255).toString(16);
    }
    return formatted ? "#" + hex : hex;
  }

  function hsl(v, s = 50, l = 50, a = 1, obj = false) {
    return obj ? { v: v, s: s, l: l, a: a } : `hsl(${v},${s}%, ${l}%, ${a})`;
  }

  function hslTo(h, s = 0, l = 0, hex = false, raw = true) {
    if (typeof h === "string") {
      [h, s, l] = h
        .match(/\d*/g)
        .filter((i) => i)
        .map((i) => (+i < 0 ? (i *= -1) : +i));
    }
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return hex
        ? Math.round(255 * color)
            .toString(16)
            .padStart(2, "0")
        : Math.round(color * 255); // convert to Hex and prefix "0" if needed
    };
    return raw && !hex ? [f(0), f(8), f(4)] : "#" + f(0) + f(8) + f(4);
  }

  function randint(a = 1, b = 0, rounded = true) {
    const n = b
      ? Math.random() * (b - a + 1) + a
      : Math.random() * (a - b + 1) + b;
    return rounded ? floor(n) : n;
  }

  /**
   *
   *
   *
   *
   *
   *
   *
   *    *
   *
   *
   *
   *
   *
   *
   *   *
   *
   *
   *
   *
   *
   *
   *   *
   *
   *
   *
   *
   *
   *
   *   *
   *
   *
   *
   *
   *
   *
   *   *
   *
   *
   *
   *
   *
   *
   *
   *
   */

  const drops = [];
  let dropamt = 5000;
  const gridDetail = 20;
  const grid = [];
  let gloablColor = 0;

  const noiseSetup = {
    df: 500,
    zoff: 1,
    scale: 1,
    off() {
      this.zoff += 0.002;
    },
  };
  /**
   * Explenation for not curious enough people abou the argument in the All class.
   If you don't take your steps in life (All class) youre purpoe in life will be lost.
   If you curve in a system (Grid class) you will look for even more system and stability.
   If you want to life like a drop you experiance a short but colourfull life (like the Drp class object being removed from the memory when it reaches 10px under the screen)
   */

  class All {
    constructor(yourPurposeInLife = "lost") {
      this.purposeInLife = yourPurposeInLife;
      this.noiseEffect = 0.1 + Math.random();
    }
    getNoise(x, y, z) {
      const { df, zoff, scale: noiseScale } = noiseSetup;
      let value = noise.perlin3(x / df, y / df, zoff) * this.noiseEffect;

      const angle = ((1 + value) * 1.1 * 128) / (PI * 2);
      return rotateVector(x * noiseScale, y, angle);
    }
  }

  class Grid extends All {
    constructor() {
      super("be in balance");
      this.points = [];
      for (let x of range(Xmax)) {
        for (let y of range(Ymax)) {
          if (x % gridDetail == 0 && y % gridDetail == 0)
            this.points.push({ x: x, y: y });
        }
      }
    }
    draw() {
      for (let p of this.points) {
        const { x, y } = p;
        const v = this.getNoise(x, y);
        line(x, y, x + v.x, y + v.y, "#666");
      }
    }
  }

  class Drop extends All {
    constructor() {
      super("to flower");
      this.speed = (randint(10) + 0.1) / 20;
      this.x = randint(Xmax);
      this.y = -20;

      this.width = this.speed * 10;
      this.color = 0;
    }
    draw() {
      const { x, y, width } = this;
      this.y += this.speed;

      if (y > Ymax + 10) {
        const idx = drops.indexOf(this);
        if (idx === -1) {
          exitting("Whaaat");
        }
        drops.splice(idx, 1, new Drop());
        // drops.remove(this);
        // drops.push(new Drop());
        return;
      }
      const v = this.getNoise(x, y);

      circle(x + v.x, y + v.y, width, hsl(this.color + gloablColor));

      this.color += 0.1;
    }
  }

  const drawFace = () => {
    const mesh = window.humanInstance?.result.face[0]?.mesh;

    mesh?.forEach((a, index) => {
      let [x, y, z] = a;

      x += 1;

      // push();

      circle(x, y, 10 * (z / 100) + 1, null, "red");

      // box(10);
      // pop();
    });
  };

  async function main() {
    //ctx.globalCompositeOperation = "multiply"
    // ctx.globalAlpha = 1;
    const grid = new Grid();

    async function animation() {
      rect(0, 0, Xmax, Ymax, null, "#00000008");
      // grid.draw();

      if (drops.length < dropamt) drops.push(new Drop());
      for (let i of drops) i.draw();
      drawFace();

      noiseSetup.off();
      gloablColor = overCount(gloablColor + 0.1, 360);

      await pauseHalt();
      requestAnimationFrame(animation);
    }

    animation();
  }

  main();
};

window.addEventListener("load", async () => {
  function sleep(s = 0.1) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }
  while (1) {
    await sleep(0.5);
    if (window.humanInstance?.result.face[0]?.mesh && window.cnv) {
      console.log("init");
      _APP();
      return;
    }
  }
});
