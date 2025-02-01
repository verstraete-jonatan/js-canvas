/**
 * Bg game
 */

// const elmStats = document.querySelector("#stats");
const Player = new PlayerClass(Xmid, Ymid);
const noiseDf = 500;
const Effects = [];
const Shapes = [];
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

const init = async () => {
  RESOURCES.minerals.forEach((i) => Shapes.push(new Mineral(i)));
  Effects.push(new Effect(Xmid - 100, Ymid - 100));

  async function animate() {
    clear();

    // devideUpMap();

    Shapes.forEach((i) => i.draw());
    Player.draw();
    Effects.forEach((i) => i.draw());
    // zoff += 0.001;

    await pauseHalt();
    requestAnimationFrame(animate);
  }

  animate();
};
init();
