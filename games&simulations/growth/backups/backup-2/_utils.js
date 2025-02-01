const utils = {
  colors: {
    saved: {},
    save: () => {
      this.colors.saved = {
        stroke: cax.stokeSayle,
        fill: cax.fillSayle,
      };
    },
    resotre: () => {
      cax.stokeSayle = this.colors.saved?.stokeSayle;
      cax.stokeSayle = this.colors.saved?.fillSayle;
    },
  },
};

// const isInBounds = (x, y) => {
//   return x < Xmax && y < Ymax && x > Xmin && y > Ymin;
// };

// const xm = Xmax / 2;
// const ym = Ymax / 2;

const isInBounds = (x, y) => x < Xmax && y < Ymax && x > Xmin && y > Ymin;

const getNoise = (x, y, df = 500) =>
  rotateVector(
    x,
    y,
    ((1 + noise.perlin3(x / df, y / df, Store.zoff)) * 1.1 * 128) / PI2
  );

const getNoiseV2 = (x, y, df = 800) => {
  const value = noise.perlin3(x / df, y / df, Store.zoff);
  const angle = ((1 + value) * 128) / PI2;

  return rotateVector(x, y, angle);
};

const distanceToArr = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

const renderSats = () => {
  Object.entries(Player.values).forEach(([k, v], index) => {
    if (Store.activeMaterials.includes(k)) {
      ctx.fillText(`${k}=${v}`, Xmid, Ymid - 100 + index * 20);
    }
  });
};

function mouseToAngle({ clientX, clientY }) {
  const { left, top } = cnv.getBoundingClientRect();
  const x = clientX - left - Xmid;
  const y = clientY - top - Ymid;
  return Math.atan2(y, x);
}

const t = async () => {
  const x = Xmid;
  const y = Ymid;
  const r = 300;

  let lp = null;
  for (let i = 0; i < 360; i += 5) {
    const a = degRad(i);
    const x1 = x + Math.cos(a) * r;
    const y1 = y + Math.sin(a) * r;
    if (!lp) {
      lp = [x1, y1];
    }
    line(lp[0], lp[1], x1, y1, "red");
    lp = [x1, y1];
    await sleep(0.01);

    Player.angle = a / 0.35;
    Player.draw();
  }

  // requestAnimationFrame(t);
  return;

  clear();
  for (let i = 0; i < Xmax; i += 30) {
    for (let j = 0; j < Ymax; j += 30) {
      const angle = Math.atan2(Xmid - i, Ymid - j);
      const a = scaleNum(angle, -3.1, 3.1, 9, 18);
      // const angle = 3.1 + Math.atan2(Xmid - i, Ymid - j);
      point(i, j, 10, "red");

      Player.angle = mouseToAngle();
      Player.draw();

      await sleep(0.001);
    }
  }
};

cnv.addEventListener("click", (e) => {
  // t();
  // return;
  clear();

  Player.angle = mouseToAngle(e);
  Player.draw();
});
