const showGrid = (drawAsync = false) => {
  if (drawAsync) {
    (async () => {
      for (let [x, y] of paths) {
        square(x * scale, y * scale, scale, "blue", "#F336");
        ctx.fillStyle = "black";
        // ctx.fillText(String(idx), x * scale + randint(20), y * scale);
        ctx.fillStyle = "green";

        ctx.fillText(String([x, y]), x * scale, y * scale + 10 + randint(20));
        await sleep(0.5);
      }
    })();
  } else {
    paths.forEach(([x, y], idx) => {
      square(x * scale, y * scale, scale, "blue", "#F336");
      ctx.fillStyle = "black";
      ctx.fillText(String(idx), x * scale + randint(20), y * scale);
      ctx.fillStyle = "green";

      ctx.fillText(String([x, y]), x * scale, y * scale + 10 + randint(20));
    });
  }
};

const showPath = () => {
  rect(0, 0, Xmax, Ymax, null, "#fff9");
  const s2 = () => scale / 2 + Math.random() * 10;

  ctx.lineWidth = 5;

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());
  for (let [x, y] of paths) {
    //   square(x * scale, y * scale, scale, "blue", "#F336");
    ctx.lineTo(x * scale + s2(), y * scale + s2());
  }
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());

  for (let [x, y] of paths) {
    //   square(x * scale, y * scale, scale, "blue", "#F336");
    ctx.lineTo(x * scale + s2(), y * scale + s2());
  }
  ctx.stroke();

  paths.map((i) => point(...i, 20, "black"));
};
