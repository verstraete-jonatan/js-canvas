pause = true;

window.addEventListener("keydown", (ev) => {
  if (ev.key === " ") {
    pause = !pause;
  }
});

const main = async () => {
  await pauseHalt();

  const synth = new Tone.Synth().toDestination();

  while (!pause) {
    const v = 200 + getNoise(0, 0) * 600;
    zoff += 1;
    const now = Tone.now();
    synth.triggerAttackRelease(v, 0.03, now);
    await sleep(0.00002);
  }
};

main();
