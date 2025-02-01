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

function draw(audioData) {
  if (!audioData) return;

  // const dLength = audioData.length / 6;
  // const f20 = round(audioData.slice(0, 1).sum());
  // const f80 = round(audioData.slice(0, 3).sum() / 3);
  // const f2000 = round(audioData.slice(45, 50).sum() / 5);
  // const f8000 = round(
  //   audioData.slice(dLength * 2, audioData.length).sum() / dLength
  // );

  if (!mouse_down) {
    // rect(0, 0, Xmax, Ymax, null, "#fff1");
    clear();
    noiseConf.zoff += 0.0003;
    rotateZ(0.001);
    rotateX(0.001);
  } else clear();

  ctx.beginPath();
  const average = audioData.length / edges.length;

  for (j = 0; j < edges.length; j++) {
    const pointStart = vertices[edges[j][0]];
    const pointEnd = vertices[edges[j][1]];

    const audioValue = 1; // audioData[Math.floor(average * j)] / 400;
    //  * ((1 / edges.length) * (j || 1));
    const noise_start = perlinize(
      pointStart._x * -audioValue,
      pointStart._y * audioValue
    );

    const noise_end = perlinize(
      pointEnd._x * -audioValue,
      pointEnd._y * audioValue
    );

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
      (edge_start[0] * zoomlevel) / (depth_offset - edge_start[2]) +
        horizontal_offset,
      (edge_start[1] * zoomlevel) / (depth_offset - edge_start[2]) +
        vertical_offset
    );

    ctx.lineTo(
      (edge_end[0] * zoomlevel) / (depth_offset - edge_end[2]) +
        horizontal_offset,
      (edge_end[1] * zoomlevel) / (depth_offset - edge_end[2]) + vertical_offset
    );
  }
  ctx.closePath();
  ctx.stroke();
}

function setupControls(html = false) {
  Controls.create("zoom", "range");

  Controls.input.max = 1000;
  Controls.input.min = 1;
  Controls.input.value = zoomlevel;

  Controls.input.onchange = (e) => {
    zoomlevel = e.target.value;
  };
  Controls.add();
}

setupControls();

const vertices = projectSphere(); //[...constructTree(), ...projectSphere()];

const edges = vertices.map((i, idx, arr) => [
  idx,
  overCount(idx - 1, arr.length - 1),
]);

GatherAudio((d) => draw([...d]));
