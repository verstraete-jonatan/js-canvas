function main() {
  GRID.init();
  for (let i of range(20)) {
    drops.push(new Drop(randint(Xmax), randint(Ymax)));
  }
  //   const obj = new Obj();
  async function animate() {
    // clear();
    rect(0, 0, Xmax, Ymax, null, "#1118");
    // GRID.draw();
    // obj.draw();
    drops.forEach((i) => i.draw());

    await pauseHalt();
    // await sleep(0.5);
    // zoff += 0.05;
    requestAnimationFrame(animate);
  }
  animate();
}

ctx.background("#fff");
main();
