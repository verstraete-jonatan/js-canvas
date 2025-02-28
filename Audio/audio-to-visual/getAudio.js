const GatherAudio = (MAIN = () => "", detail = 100) => {
  const audioElement = document.getElementById("audio_01") || {};
  // help audio node
  const audioCtx = new AudioContext();
  // analyser node gives frequency
  const analyser = audioCtx.createAnalyser();
  // size of data
  analyser.fftSize = 2048; // 256; // 2048
  // convert domElm to audioElm
  const source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  // connnects to output device
  source.connect(audioCtx.destination);

  let data = new Uint8Array(analyser.frequencyBinCount);

  audioElement.onplay = () => {
    pause = false;
    audioCtx.resume();
    animate();
  };
  audioElement.onpause = () => {
    pause = true;
  };
  async function animate() {
    analyser.getByteFrequencyData(data);

    /** INSET FUNCTION HERE */
    MAIN(detail ? data.slice(0, detail) : data);

    if (pause) {
      audioElement.pause();
    }
    await pauseHalt(undefined, false);
    requestAnimationFrame(animate);
    //audioElement.pause()
  }
};

function audioStart() {
  document.getElementById("start").click();
}

document.getElementById("start").onclick = (e) => {
  e.target.parentElement.remove();
  document.getElementById("audio_01").play();
};

window.onerror = () => document.getElementById("audio_01").pause();
