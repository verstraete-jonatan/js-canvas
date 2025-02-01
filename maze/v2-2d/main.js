/**
 * @todo
 * been an idiot.. currently the path is stored in a map and if coming over the same tile twice, this overwrites the previous tile.
 * This creates weird angles in the route.
 * Solutions:
 * - convert map to array again, and simply push to that array, but keep the map as a backbone structure to easy know which tile corresponds to which,
 * but don't use the map for making up the route (makes sense right?).
 * - quick fix?: when overwriting a tile, properly detect loops (an overwrite by definition means the route has a loop)
 */
const getPrevByIndex = (prevIdx = 0) => {
  for (let val of getSortedPath()) {
    if (val.neighbours && val.pathIndex > 0 && val.pathIndex < prevIdx) {
      return val;
    }
  }
};

window.addEventListener("keydown", ({ key }) => {
  if (key == "Enter") {
    pause = false;
  }
});
const getNewPosition = async (stopRecursive = 0) => {
  clear();
  showGrid();
  showPath();
  // pause = true;
  // await pauseHalt();

  if (stopRecursive === null) return null;
  if (stopRecursive > 1000) exit();

  // regular flow, check for available neighbours
  if (current?.neighbours?.length) {
    const prevIdx = current.pathIndex;

    [current] = current.neighbours.splice(
      randint(current.neighbours.length - 1),
      1
    );

    // if (current.pathIndex !== null) {
    //   clearAllPrevious(prevIdx);
    // }
    current.pathIndex = globalIndex++;
  }
  // backtrack to previous tile
  else {
    const prevIdx = current.pathIndex;
    current.neighbours = null;
    clearAllPrevious(prevIdx);
    current = getPrevByIndex(prevIdx);

    if (!current) {
      exitting("Fuucckkk this is the end...");
    }
    current.pathIndex = globalIndex++;

    // addInbetweenPaths(current, newCurrent);

    return getNewPosition(stopRecursive + 1);
  }
  current.nrVisited++;

  requestAnimationFrame(go);
};

let stopIter = 0;
const go = async () => {
  if (++stopIter / 4 >= totalNrSquares * 2) {
    return log(".. mhn");
  }

  if (isEnd(current)) {
    showPath();

    return;
  }
  drawTile(current);
  getNewPosition();
};

square(END[0] * scale, END[1] * scale, scale, "blue", "red");

ctx.dark();
go();
// drawPath();
