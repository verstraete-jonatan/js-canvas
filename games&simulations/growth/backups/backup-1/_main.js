/**
 * Bg game
 */
const Player = new PlayerClass(Xmid, Ymid);
let zoff = 0;
const noiseDf = 500;

const pts = [
  [200, 300],
  [400, 300],
  [500, 400],
];

window.addEventListener("keydown", (ev) => {
  ev.preventDefault();
  requestAnimationFrame(() => {
    Player.move(ev.key);
  });
});

const init = async () => {
  async function animate() {
    // rect(0, 0, Xmax, Ymax, null, "#ffffff02");
    clear();
    await pauseHalt();
    ctx.save();
    Player.draw();
    devideUpMap();
    ctx.restore();
    zoff += 0.001;

    requestAnimationFrame(animate);
  }

  animate();
};
init();
