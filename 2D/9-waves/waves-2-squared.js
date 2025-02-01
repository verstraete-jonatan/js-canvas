const sets = {
  // name: [freq, amp]
  field: [20000.009, 13],
  squared: [20000.009, 410],
};

const detail = 5;
let amp = 1;
let freq = -20000;
let iterations = 0;

const main = () => {
  (() => {
    Controls.init();
    Controls.create("amp", "range");
    Controls.input.min = 1;
    Controls.input.max = 1000;
    Controls.input.value = amp;
    Controls.input.addEventListener("change", (e) => {
      amp = e.target.value;
    });
    Controls.add();

    Controls.create("freq", "range");
    Controls.input.min = 0;
    Controls.input.max = 20000;
    Controls.input.value = Number(freq);
    Controls.input.addEventListener("change", (e) => {
      freq = e.target.value;
    });
    Controls.add();

    for (let [k, v] of Object.entries(sets)) {
      Controls.create(k, "button");
      Controls.input.value = "-";

      Controls.input.addEventListener("click", (e) => {
        freq = v[0];
        amp = v[1];
      });
      Controls.add();
    }
  })();

  window.onkeydown = (ev, inc = 1) => {
    ev.preventDefault();
    const { key } = ev;
    if (key === "ArrowUp") {
      amp -= inc;
    } else if (key === "ArrowDown") {
      amp += inc;
    } else if (key === "ArrowLeft") {
      freq -= inc / 1000;
    } else if (key === "ArrowRight") {
      freq += inc / 1000;
    }
  };

  ctx.dark();
  ctx.fillStyle = "#0af2";

  const det = detail * 10;

  async function animate() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    iterations += 0.01;

    for (let x = 0; x < Xmax; x += detail) {
      for (let y = 100; y < Ymax - 100; y += detail) {
        n = x + y;
        a = x + cos(x * freq + iterations) * amp;
        b = y + sin(y * freq - iterations) * amp;

        // ctx.fillStyle = (x + y) % (detail * 2) == 0 ? "#0af3" : "#fa03";
        ctx.fillStyle = hsl(Math.abs(sin((a + b + iterations) / 2)) * 360);

        ctx.fillRect(a, b, detail, detail);
      }
    }
    textCenter(String([freq, amp]));

    requestAnimationFrame(animate);
  }

  animate();
};
main();
