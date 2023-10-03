cnv.addEventListener("mouseover", function (e) {
  reqanim = window.requestAnimationFrame(animate);
});

cnv.addEventListener("mouseout", function (e) {
  window.cancelAnimationFrame(reqanim);
  mouse_down = false;
});
cnv.addEventListener("mousedown", function (e) {
  mouse_down = true;
});
cnv.addEventListener("mouseup", function (e) {
  mouse_down = false;
});

function getMousePos(cnv, evt) {
  const rect = cnv.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
cnv.addEventListener("mousemove", function (e) {
  const mousePos = getMousePos(cnv, e);

  const mouse_x_prev = mouse_x;
  const mouse_y_prev = mouse_y;

  mouse_x = mousePos.x;
  mouse_y = mousePos.y;

  if (mouse_down) {
    rotateY((mouse_x_prev - mouse_x) / 100);
    rotateX((mouse_y_prev - mouse_y) / 100);
  }
});

function draw() {
  if (reqanim) {
    async function animate() {
      if (!mouse_down) {
        rect(0, 0, Xmax, Ymax, null, "#fff1");
        noiseConf.zoff += 0.005;
        rotateZ(0.001);
        rotateX(0.001);
      } else clear();

      ctx.beginPath();
      for (j = 0; j < edges.length; j++) {
        const pointStart = vertices[edges[j][0]];
        const pointEnd = vertices[edges[j][1]];

        const noise_start = perlinize(pointStart._x, pointStart._y);
        const noise_end = perlinize(pointEnd._x, pointEnd._y);

        const edge_start = [
          pointStart.x + noise_start.x,
          pointStart.y + noise_start.y,
          pointStart.z,
        ];
        const edge_end = [
          pointEnd.x + noise_end.x,
          pointEnd.y + noise_end.y,
          pointEnd.z,
        ];

        ctx.moveTo(
          (edge_start[0] * horizontal_zoom) / (depth_offset - edge_start[2]) +
            horizontal_offset,
          (edge_start[1] * vertical_zoom) / (depth_offset - edge_start[2]) +
            vertical_offset
        );

        ctx.lineTo(
          (edge_end[0] * horizontal_zoom) / (depth_offset - edge_end[2]) +
            horizontal_offset,
          (edge_end[1] * vertical_zoom) / (depth_offset - edge_end[2]) +
            vertical_offset
        );
      }
      ctx.closePath();
      ctx.stroke();
      for (let idx of listerners) {
        const i = vertices[edges[idx][0]];

        const n = getNoise(i.x, i.y);
        const v = mapNum(n, 0, 200, 20, 4000);
        playValue(v, i[0] / 10, i[1] / 10, v * 100);
        point(
          (i.x * horizontal_zoom) / (depth_offset - i.z) + horizontal_offset,
          (i.y * vertical_zoom) / (depth_offset - i.z) + vertical_offset,
          10,
          "red"
        );
      }
      reqanim = window.requestAnimationFrame(animate);
    }
    animate();
  }
}

const vertices = projectSphere();
const edges = vertices.map((i, idx, arr) => [
  idx,
  overcount(idx - 1, arr.length - 1),
]);

const getLister = (idx = 50) => floor(mapNum(idx, 0, 100, 0, edges.length));
const listerners = [getLister(51.1), getLister(51.3), getLister(51.4)];

draw();
