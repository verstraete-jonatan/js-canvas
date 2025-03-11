// actx AND MASTER VOLUME
let AudioContext = window.AudioContext || window.webkitAudioContext;

const actx = new AudioContext();
const gainNode = actx.createGain();
gainNode.connect(actx.destination);
gainNode.gain.value = 0.05;

let waveform = "sine";

// Envelope
let attackTime = 0.3;
let sustainLevel = 0.4;
let releaseTime = 0.3;
let noteLength = 0.1;

// Vibrato
let vibratoSpeed = 1;
let vibratoAmount = 100;

// const delay = actx.createDelay(500);
// const feedback = actx.createGain();
// const delayAmountGain = actx.createGain();

// delayAmountGain.connect(delay);
// delay.connect(feedback);
// feedback.connect(delay);
// delay.connect(gainNode);

// delay.delayTime.value = 0.5;
// delayAmountGain.gain.value = 0.5;
// feedback.gain.value = 0;

function playValue(value, x = Xmid, y = Ymid, z = 300) {
  // const listener = actx.listener;
  // listener.positionX.value = x ;
  // listener.positionY.value = y;
  // listener.positionZ.value = z - 5;

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

  // noteGain.gain.linearRampToValueAtTime(0, actx.currentTime + noteLength);

  //   lfoGain = actx.createGain();
  //   lfoGain.gain.setValueAtTime(vibratoAmount, 0);
  //   lfoGain.connect(osc.frequency);

  //   lfo = actx.createOscillator();
  //   lfo.frequency.setValueAtTime(vibratoSpeed, 0);
  //   lfo.start(0);
  //   lfo.stop(actx.currentTime + noteLength);
  //   lfo.connect(lfoGain);
  osc.type = "sawtooth"; // ["sawtooth", "sine", "square", "triangle"][randint(0, 3)];

  osc.frequency.setValueAtTime(value, 0);
  osc.start(0);
  osc.stop(actx.currentTime + noteLength);
  osc.connect(noteGain);

  noteGain.connect(gainNode); //.connect(compressor)
  // noteGain.connect(delay);
}
