const sets = {
  // name: [freq, amp]
  field: [20000.009, 13],
  squared: [20000, 410],
};

const detail = 5;
let amp = 13;
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

  window.onkeydown = (ev, inc = 1, inc2 = 0.0001) => {
    ev.preventDefault();
    const { key } = ev;
    if (key === "ArrowUp") {
      amp -= inc;
    } else if (key === "ArrowDown") {
      amp += inc;
    } else if (key === "ArrowLeft") {
      freq -= inc2;
    } else if (key === "ArrowRight") {
      freq += inc2;
    }
  };

  ctx.dark();
  ctx.fillStyle = "#0af2";
  ctx.lineWidth = 7;

  async function animate() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // ctx.fillRect(0, 0, Xmax, Ymax, "#fff1");

    iterations += 0.01;

    for (let x = 0; x < Xmax; x += detail) {
      for (let y = 100; y < Ymax - 100; y += detail) {
        const a = x + cos(x * freq + iterations) * amp;
        const b = y + sin(y * freq + iterations) * amp;

        let colValue = sin(a + b + iterations) * 360; //+ iterations * 100

        // colValue = smoothSquareWave(colValue, 0.1, 0.1, 0.001) * 360;

        ctx.strokeStyle = `hsl(${colValue},50%, 50%, 0.6)`;
        // ctx.strokeStyle = "#f003";
        // ctx.fillStyle = cl;
        ctx.strokeRect(a, b, detail * 2, detail * 2);
        // circle(a, b, detail, "#f003", false);
      }
    }
    // textCenter(String([freq, amp]));

    requestAnimationFrame(animate);
  }

  animate();
  return;
  const arr = [1, 5, 9, 2, 6, 7, 9, 0];
  const sx = Xmax / arr.length - 100;
  const sy = Ymax / 10;

  function interpol(a, b) {
    return smoothSquareWave(a, 0.1, 8, 0.001);
    return b - (a - b) * -0.7;
  }

  simpleGraph(arr, { stroke: "blue", margin: 100 });

  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i];
    let b = arr[i + 1] || a;
    let c = interpol(a, b);
    log(a, b, c);

    let x = 100 + i * sx;
    let y = 100 + c * sy;

    // point(x, y, 10, "red");
    ctx.lineTo(x, y);
    // fillText(JSON.stringify([a, b, c]), x, y, "red");
  }
  ctx.stroke();
};
main();
