/**
 * a Stickman Walking game
 */

const init = async () => {
  Game = new GameClass();
  Player = new PlayerClass();
  // const ants = range(5).map((i) => new Ant(i * 10, 200));
  // Game.background.set("line", new PerlinLine());
  // Game.background.set("line2", new PerlinLine());
  // range(10).forEach((i, idx) =>
  //   Game.background.set("shape_" + idx, new FloatingShape("square_" + idx))
  // );

  Game.createBlock(Xmid - 400, Game.ground - 100);
  Game.createBlock(Xmid - 220, Game.ground - 190);
  Game.createBlock(Xmid - 40, Game.ground - 290);

  Events.setKeys([
    ["ArrowRight", () => Player.move("right")],
    ["ArrowLeft", () => Player.move("left")],
    ["ArrowUp", () => Player.move("up")],
    ["ArrowDown", () => Player.move("down")],
  ]);

  const pts = [];

  async function animate() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // rect(0, 0, Xmax, Ymax, null, "#000f");
    /** INSERT: back */
    Game.renderBackground();
    // lightsource
    setLightSpot(Game.lightSource);
    /** INSERT: front */

    Game.renderForeground();
    // ants.map((a) => a.animate());
    Player.show();
    if (Player.yAcceleration || Player.yVelocity) {
      pts.push([Player.x, Player.y]);
    }
    pts.map((i) => point(...i, 10, "white"));
    /** END  */
    ctx.shadowColor = "transparent";
    rect(0, Game.ground, Xmax, Game.ground + 10, null, "#200");
    Game.zoff += 0.002;
    // if (Player.y < Game.ground) await sleep(0.1);
    await pauseHalt(false, false);
    requestAnimationFrame(animate);
  }

  animate();
};
init();
