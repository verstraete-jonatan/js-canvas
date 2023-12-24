const main = () => {
  const detail = 20;
  let amp = 50;
  let freq = 20000;
  let iterations = 0;

  // (() => {
  //   Controls.init();
  //   Controls.create("amp", "range");
  //   Controls.input.min = 1;
  //   Controls.input.max = 1000;
  //   Controls.input.value = 100;
  //   Controls.input.addEventListener("change", (e) => {
  //     amp = e.target.value;
  //   });
  //   Controls.add();

  //   Controls.create("freq", "range");
  //   Controls.input.min = -20000;
  //   Controls.input.max = 20000;
  //   Controls.input.value = 20000;
  //   Controls.input.addEventListener("change", (e) => {
  //     freq = e.target.value;
  //   });
  //   Controls.add();
  // })();

  window.onkeydown = ({ key }, inc = 1) => {
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

  async function animate() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    iterations += 0.01;

    for (let x = 0; x < Xmax; x += detail) {
      for (let y = 0; y < Ymax; y += detail) {
        a = x + cos(x * freq + iterations) * amp;
        b = y + sin(y / freq - iterations + (y + x) / 20) * amp;

        ctx.fillStyle = (x + y) % (detail * 2) == 0 ? "#0af3" : "#fa03";

        ctx.fillRect(a, b, detail, detail);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
};
main();
