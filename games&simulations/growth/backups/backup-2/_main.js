/**
 * Bg game
 */

// const elmStats = document.querySelector("#stats");
const Player = new PlayerClass(Xmid, Ymid);
const noiseDf = 500;

const Store = {
  zoff: 0,
  activeMaterials: [],
};

ctx.dark();

window.addEventListener("keydown", (ev) => {
  ev.preventDefault();
  requestAnimationFrame(() => {
    Player.move(ev.key);
  });
});

const shapes = RESOURCES.minerals.map((i) => new Mineral(i));

const init = async () => {
  async function animate() {
    // rect(0, 0, Xmax, Ymax, null, "#ffffff02");
    clear();

    // devideUpMap();
    // ctx.save();
    shapes.forEach((i) => i.draw());
    Player.draw();
    // ctx.translate(Player.x, Player.y);
    // ctx.restore();
    // zoff += 0.001;

    textCenter(Player.angle);
    // fillText(mouse.angle, Xmid, Ymid - 50);
    await pauseHalt();
    requestAnimationFrame(animate);
  }

  animate();
};
init();
