const removeLoopsV3 = () => {
  const removeLoop = (index, sPoints) => {
    for (let i = 1; i < 10; i++) {
      if (sPoints.includes(String(paths[index + i]))) {
        sPoints.remove(String(paths[index + i]));
        // console.log("-rem", index, i, paths[index], paths[index + i]);
        // paths.splice(index, i);
        // showGrid();
        // exit();
        return paths.splice(index, i);
      }
    }
  };
  paths.forEach((p, index) => {
    const pts = [p, ...getNeighbours(p)].map(String).filter(isNotEndpoint);
    pts.length && removeLoop(index + 1, pts);
    pts.length && removeLoop(index + 1, pts);
  });
};

const removeLoopsV2 = () => {
  const removeLoop = (index, sOriginal) => {
    for (let i = 1; i < 10; i++) {
      if (String(paths[index + i]) === sOriginal) {
        return paths.splice(index, i);
      }
    }
  };
  paths.forEach((p, index) => {
    for (let n of [p, ...getNeighbours(p)].map(String)) {
      if (!isEndPoint(n)) {
        removeLoop(index + 1, n);
      }
    }
  });
};

const removeLoops = () => {
  const removeLoop = (index, sOriginal) => {
    for (let i = index; i < index + 20; i++) {
      if (String(paths[i]) === sOriginal) {
        return paths.splice(index, i);
      }
    }
  };
  paths.forEach((n, idx) => {
    // if (idx < 16) return;
    const s = String(n);
    if (s !== sEND && s !== sSTART) {
      removeLoop(idx + 1, s);
    }
  });
};

addInbetweenPathsV3 = (indexA, indexB) => {
  if (indexB === undefined) indexB = indexA + 1;
  paths[indexB] && addInbetweenPathsV2(paths[indexA], paths[indexB], indexA);
};
// const [ax, ay] = paths[indexA]
// const [bx, by]= paths[indexB]

// add missing point(s) diagonally when backtracking
const addInbetweenPathsV2 = ([ax, ay], [bx, by], indexA) => {
  const dx = bx - ax;
  const dy = by - ay;

  const stx = rangeN(dx);
  const sty = rangeN(dy);
  let x = 0;
  let y = 0;

  const _add = () => addPath([ax + x, ay + y], indexA);

  while (stx.length || sty.length) {
    if (stx.length) {
      x = stx.shift();
      _add();
    }
    if (sty.length) {
      y = sty.shift();
      _add();
    }
  }
};

// add missing point(s) diagonally when backtracking
const addInbetweenPathsV1_2 = (index) => {
  if (!paths[index + 1]) return;

  const [ax, ay] = paths[index];
  const [bx, by] = paths[index + 1];
  const dx = bx - ax;
  const dy = by - ay;

  let totalNewTiles = dx + dy;

  const stx = rangeN(dx);
  const sty = rangeN(dy);
  let x = 0;
  let y = 0;

  const _add = () => addPath([ax + x, ay + y], index++);

  while (stx.length || sty.length) {
    if (stx.length) {
      x = stx.shift();
      _add();
    }
    if (sty.length) {
      y = sty.shift();
      _add();
    }
  }
};

// add missing point(s) when backtracking diagonally (not meant for large scale)
const addInbetweenPaths = ([ax, ay], [bx, by]) => {
  const dx = bx - ax;
  const dy = by - ay;

  if (dx && dy) {
    let x = 0;
    let y = 0;

    const _add = () => addPath([ax + x, ay + y]);

    for (x of rangeN(dx)) _add();
    for (y of rangeN(dy)) _add();
  }
};
