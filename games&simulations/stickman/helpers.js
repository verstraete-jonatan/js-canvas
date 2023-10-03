let zoff = 0;
const df = 500;

const getNoise = (x, y) => noise.simplex3(x / df, y / df, zoff);

//  (x is in between b's width) && (y is inbetween b's height)
// ( a.x > b.x && a.x < (b.x + b.w) ) && ( a.y < b.y && a.y > (b.y - b.h) )
const isTouching = (a, b) =>
  Boolean(a.x > b.x && a.x < b.x + b.w && a.y >= b.y && a.y < b.y + b.h);

let mousePos = { x: Xmid, y: Ymid };

let ismousingover = false;
document.addEventListener("click", (e) => {
  ismousingover = !ismousingover;
  if (ismousingover) setMouse(e);
});

const setMouse = (e) => {
  if (ismousingover) return;
  ismousingover = true;
  // make mouse coords relative to the canvas  ignoring scroll in this case
  const bounds = cnv.getBoundingClientRect();
  mousePos.x = e.pageX - bounds.left;
  mousePos.y = e.pageY - bounds.top;
  setTimeout(() => {
    ismousingover = false;
  }, 100);
};
// add mouse move listener to whole page
addEventListener("mousemove", setMouse);
