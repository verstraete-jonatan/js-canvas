const actx = new AudioContext();
const gainNode = actx.createGain();
gainNode.connect(actx.destination);
gainNode.gain.value = 0.05;

const attackTime = 0.8;
const sustainLevel = 0.4;
const releaseTime = 0.8;
const noteLength = 0.8;

const linearFilter = actx.createBiquadFilter();
linearFilter.frequency.setValueAtTime(0.5, 0); // cutoff frequency in Hz
linearFilter.type = "lowpass";

gainNode.connect(linearFilter);

export const play = (value: number) => {
  const osc = actx.createOscillator();
  const noteGain = actx.createGain();

  noteGain.gain.setValueAtTime(0, 0);
  noteGain.gain.linearRampToValueAtTime(
    sustainLevel,
    actx.currentTime + noteLength * attackTime
  );
  noteGain.gain.setValueAtTime(
    sustainLevel,
    actx.currentTime + noteLength - noteLength * releaseTime
  );

  osc.type = "sine";

  osc.frequency.setValueAtTime(value, 0);
  osc.start(0);
  osc.stop(actx.currentTime + noteLength);
  osc.connect(noteGain);

  noteGain.connect(gainNode);
};
