const testPath_1 = [
  // top-left -> top-right
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [7, 2],
  // -> bottom-right
  [7, 3],
  [7, 4],
  [7, 5],
  // -> bottom-left
  [6, 5],
  [5, 5],
  [4, 5],
  [3, 5],
  // make loop
  [2, 5],
  [1, 5],
  [1, 6],
  [1, 7],
  [2, 7],
  [3, 7],
  [3, 6],
  [3, 5],
  // -> top-left (start)
  [3, 4],
  [3, 3],
];

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
  const kA = asKey(5, 5);
  const kB = asKey(3, 8);

  current = gridMap.get(kA);
  current.pathIndex = 1;

  const prev = gridMap.get(kB);
  prev.pathIndex = 0;

  // TODO: following should use new grid mechanism
  addInbetweenPathsV2(current, prev, i);
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

const testRemoveLoops_1 = async () => {
  gridMap.forEach((k) => {
    k.pathIndex = null;
  });

  testPath_1.forEach((n, idx) => {
    const item = gridMap.get(asKey(...n));

    if (item.pathIndex === null) {
      item.pathIndex = idx;
      return;
    }

    const targetPathIndex = item.pathIndex;

    // remove all prev paths up to that point, as this means this was a loop all the way to this point

    for (let [k, v] of gridMap) {
      if (
        v.pathIndex !== null &&
        // Math.abs(v.pathIndex - targetPathIndex) < 2 &&
        v.pathIndex > targetPathIndex
      ) {
        // cancel tiles
        v.pathIndex = null;
        v.neighbours = null;
      }
    }

    item.pathIndex = targetPathIndex;
  });

  /**
   *
   * TODO:::::
   *
   *
   *
   * using this system there can't be any duplicates..
   * Need to check for duplicates when overwriting the pathIndex of an existing item..
   */

  const path = getSortedPath();

  log("-> 1: ", path.length);

  const removeLoop = (pt) => {
    for (let i = 1; i < 10; i++) {
      // ends up at same point (= loop)
      if (path[i] === pt) {
        log("remove loopzz", pt);

        //
        range(i).forEach((prevPoint) => {
          prevPoint += 1;
          if (path[prevPoint]) {
            path[prevPoint].neighbours = null;
            path[prevPoint].pathIndex = null;
          } else {
            log("no prev", prevPoint);
          }
        });

        return;
      }
    }
  };

  // path.forEach((p, index) => {
  //   if (p.pathIndex === null) return;
  //   removeLoop(p);
  // });
};

const main = () => {
  clear();

  // testEnd();
  testRemoveLoops_1();

  showGrid();
  showPath();
};
// ctx.dark();
main();
