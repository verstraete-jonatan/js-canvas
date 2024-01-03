const getNewPosition = (stopRecursive = 0) => {
  if (stopRecursive === null) return null;
  if (stopRecursive > 1000) exit();

  if (current?.neighbours?.length) {
    const prevIdx = current.pathIndex;

    [current] = current.neighbours.splice(
      randint(current.neighbours.length - 1),
      1
    );
    current.pathIndex = prevIdx + 1;
  } else {
    current.neighbours = null;

    // backtrack
    const prevIdx = current.pathIndex;
    current = [...gridMap.values()]
      .reverse()
      .find((i) => i.pathIndex > 0 && i.pathIndex < prevIdx && i.neighbours);
    if (!current) {
      exitting("Fuucckkk this is the end...");
    }
    current.pathIndex = prevIdx + 1;

    // addInbetweenPaths(current, newCurrent);
    return getNewPosition(stopRecursive + 1);
  }
  requestAnimationFrame(go);
};

let stopIter = 0;
const go = async () => {
  if (++stopIter / 4 >= totalNrSquares * 2) {
    const s2 = () => scale / 2 + Math.random() * 0;
    rect(0, 0, Xmax, Ymax, null, "#fff9");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());
    for (let {
      pos: [x, y],
    } of gridMap.values()) {
      ctx.lineTo(x * scale + s2(), y * scale + s2());
    }
    ctx.stroke();

    return log(".. mhn");
  }

  if (isEnd(current)) {
    // removeLoopsV2();

    rect(0, 0, Xmax, Ymax, null, "#fff9");
    const s2 = () => scale / 2 + Math.random() * 0;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());
    for (let {
      src: [x, y],
    } of gridMap.values()) {
      ctx.lineTo(x * scale + s2(), y * scale + s2());
    }
    ctx.stroke();

    return;
  }
  drawTile(current.pos);
  getNewPosition();
};

square(END[0] * scale, END[1] * scale, scale, "blue", "red");

ctx.dark();
go();
drawPath();
