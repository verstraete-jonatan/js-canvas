const Player = new PlayerClass(Xmid, Ymid);

const Effects = [];
/** minerals.. substractes */
const Shapes = [];
const Blocks = [];
const Items = [];
// game memory:
const Store = {
  zoff: 0,
  activeMaterials: [],
};

ctx.dark();

const initControls = () => {
  const types = Object.keys(amoTypes);
  const amoSelect = document.createElement("select");

  types.forEach(
    (key) => (amoSelect.innerHTML += `<option value=${key}>${key}</option>`)
  );

  amoSelect.addEventListener("change", (e) => {
    Player.amo = amoTypes[e.target.value];
  });
  Controls.centerElm.appendChild(amoSelect);
};

const init = async () => {
  initControls();
  RESOURCES.minerals.forEach((i) => Shapes.push(new Mineral(i)));
  range(5).forEach((i) => Blocks.push(new Block()));
  Items.push(new StaticEnemyClass(100, 200));
  Items.push(new StaticEnemyClass(-100, -200));

  Items.push(new TrackingEnemyClass(300, 0));

  async function animate() {
    clear();

    // drawBackgroundV3();

    Shapes.forEach((i) => i.draw());
    Blocks.forEach((i) => i.draw());
    Items.forEach((i) => i.draw());

    Player.draw();
    Effects.forEach((i) => i.draw());

    await pauseHalt();
    requestAnimationFrame(animate);
  }

  animate();
};
init();

window.addEventListener("keydown", (ev) => {
  ev.preventDefault();
  requestAnimationFrame(() => {
    Player.onAction(ev.key);
  });
});

cnv.addEventListener("click", (e) => {
  Player.angle = getMouseWithEffect(e);
  Player.velocity -= 2;
});
