const getNewPosition = (stopRecursive = 0) => {
  // if (stopRecursive > 10) exit();
  visitedPaths.add(String(current));

  const newPaths = getNeighbours(current).filter(isAvailable);

  if (newPaths.length) {
    [current] = newPaths.splice(randint(newPaths.length - 1), 1);
    newPaths.forEach(addPath);
  } else {
    // backtrack
    let newCurrent = current;
    while (!isAvailable(current)) {
      if (!paths.length) {
        console.log("FIX ME");
        exit();
      }
      newCurrent = current;
      current = paths.pop();
      draw();
      log("backtrack", current, paths);
    }
    // addInbetweenPaths(current, newCurrent);
    // return getNewPosition(stopRecursive + 1);
  }
  requestAnimationFrame(go);
};

const go = async () => {
  if (visitedPaths.size >= totalNrSquares * 2) {
    rect(0, 0, Xmax, Ymax, null, "#fff9");
    const s2 = () => scale / 2 + Math.random() * 0;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());
    for (let [x, y] of paths) {
      ctx.lineTo(x * scale + s2(), y * scale + s2());
    }
    ctx.stroke();

    return log(".. mhn");
  }

  if (String(current) === String(END)) {
    removeLoopsV2();

    rect(0, 0, Xmax, Ymax, null, "#fff9");
    const s2 = () => scale / 2 + Math.random() * 0;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(START[0] * scale + s2(), START[1] * scale + s2());
    for (let [x, y] of paths) {
      ctx.lineTo(x * scale + s2(), y * scale + s2());
    }
    ctx.stroke();

    return;
  }
  draw();

  getNewPosition();
};

square(END[0] * scale, END[1] * scale, scale, "blue", "red");

go();
drawPath();
