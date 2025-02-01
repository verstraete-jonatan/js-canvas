import { Human } from "../dist/human.esm.js";

const humanInstance = new Human({
  cacheSensitivity: 0,
  modelBasePath: "../models",
  filter: { enabled: true, equalization: true },
  debug: false,
  face: {
    enabled: true,
    detector: { rotation: false, return: false, mask: false },
    description: { enabled: false },
    iris: { enabled: false },
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false },
  },
  body: { enabled: true },
  hand: { enabled: true },
  object: { enabled: true },
  gesture: { enabled: false },
});

humanInstance.env.perfadd = !1;
window.humanInstance = humanInstance;

const t = {
  video: document.getElementById("video"),
  canvas: document.getElementById("canvas"),
  source: document.getElementById("source"),
  ctx: null,
};
t.ctx = t.canvas.getContext("2d");
window.ctx = t.ctx;
window.cnv = t.canvas;

async function videoDetectLoop() {
  const face = humanInstance.result.face[0];
  if (!t.video.paused) {
    if (face?.tensor) {
      humanInstance.tf.dispose(face.tensor);
    }
    await humanInstance.detect(t.video);
    requestAnimationFrame(videoDetectLoop);
  }
}

async function mainRender() {
  humanInstance.next(humanInstance.result);

  // a.gesture = [];
  // a.performance = {};
  // a.face[0] && (a.face[0].annotations = {});
  // a.persons[0]?.face.annotations && (a.persons[0].face.annotations = {});

  // if (a.persons?.length) {
  //   console.warn(humanInstance);
  //   return;
  // }
  // if (window.MESH) return;

  // await humanInstance.draw.all(t.canvas, a);
  // t.canvas.style.display = "none";

  setTimeout(mainRender, 0);
}

window.onload = async () => {
  const n = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      resizeMode: "none",
      width: { ideal: document.body.clientWidth },
    },
  });
  t.video.srcObject = n;
  t.video.play();
  await new Promise((resolve) => {
    t.video.onloadeddata = () => resolve(true);
  });

  await humanInstance.load();
  await humanInstance.warmup();

  await videoDetectLoop();
  mainRender();
};
