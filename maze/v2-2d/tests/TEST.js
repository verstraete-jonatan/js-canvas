const testEnd = async () => {
  paths.length = 0;

  [
    // corner
    START,
    [10, 11],
    [10, 12],
    [10, 13],
    [9, 13],
    [8, 13],
    [8, 12],
    [9, 12],
    [10, 12],
    [11, 12],
    [12, 12],
    [13, 12],
    // other
    [13, 13],
    [14, 14],
    [15, 15],
    [16, 16],
    // corner 2
    [13, 11],
    [13, 10],
    [14, 10],
    [15, 10],

    // back
    [14, 10],
    [13, 10],
    [12, 10],
    [11, 10],
    START,
  ].forEach((n) => addPath(n));

  [...paths].forEach((p, idx) => addInbetweenPathsV1_2(idx));
  // [...paths].forEach((p, idx) => {
  //   const b = paths[idx + 1];
  //   b && addInbetweenPaths(p, b);
  // });

  // addInbetweenPathsV2();
  // removeLoopsV3();
};

const testInBetween = async () => {
  paths.length = 0;

  const connect = (pts, col) => {
    addInbetweenPathsV2(...pts);
    // addInbetweenPaths(...pts);

    const s2 = scale / 2;
    pts.map((i) => point(i[0] * scale + s2, i[1] * scale + s2, 40, col));
  };

  connect(
    [
      [1, 1],
      [7, 3],
    ],
    "blue"
  );
  connect(
    [
      [5, 5],
      [3, 8],
    ],
    "red"
  );

  connect(
    [
      [4, 8],
      [5, 5],
    ],
    "orange"
  );
};

const testInBetweenV2 = async () => {
  // TODO: does this work
  current = gridMap.get(asKey(5, 5));
  current.pathIndex = 1;
  const prev = gridMap.get(asKey(3, 8));
  prev.pathIndex = 0;

  // [
  //   [5, 5],
  //   [3, 8],
  //   // [6, 6],
  //   // [4, 8],
  // ].forEach((n) => addPath(n));

  const sortItemsIndDirection3 = (a, b, c) => {
    const arr = [a, b, c];
    arr.sort(([ax, ay], [bx, by]) => Math.hypot(bx, by) - Math.hypot(ax, ay));
    console.log(arr[0], a);
    if (arr[0] !== a) return arr;
    return arr.reverse();
  };

  const sortItemsIndDirection2 = (a, b) => {
    const arr = [a, b];
    arr.sort(([ax, ay], [bx, by]) => Math.hypot(bx, by) - Math.hypot(ax, ay));
    console.log(arr[0], a);
    if (arr[0] !== a) return arr;
    return arr.reverse();
  };

  for (let i = 0; i <= paths.length - 1; i++) {
    const item = paths[i];
    // const n2 = paths[index + 2];
    const n1 = paths[i + 1];
    if (n1) {
      const [a, b] = sortItemsIndDirection2(item, n1);

      // addInbetweenPathsV2(a, b, i);
      clear();
      showGrid();
      showPath();

      clear();
      await showGrid(true)();
      await sleep(0.5);
      await pauseHalt();

      // addInbetweenPathsV2(item, n1, index);
    }
  }
  showPath();
};

const testInBetweenV3 = async () => {
  paths.length = 0;
  current = [1, 1];

  [
    [3, 3],
    [1, 1],
  ].forEach((n) => addPath(n));

  addInbetweenPathsV3(1, 0);
};

const main = () => {
  // testEnd();
  testInBetweenV2();

  showGrid();
  showPath();
};

// ctx.dark();
main();
