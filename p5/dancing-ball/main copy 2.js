const SCALE = 100;

const setupSphere = () => {
  const degRad = (i) => i * (Math.PI / 180);
  function range(n = 1, detail = 1) {
    let res = [];
    for (let i = n < 0 ? n : 0; i < n; i += detail) {
      res.push(+i);
    }
    return res;
  }

  const R = 50;

  class Point {
    constructor(phi) {
      this.x = R * Math.sin(phi) * Math.cos(this.theta); // * tanh(this.y)
      this.y = R * Math.cos(phi);
      this.z = R * Math.sin(phi) * Math.sin(this.theta) + R;
    }
  }

  // for i in range(-90+10,90,10): # -90 to 90 south pole to north pole
  //       alt = math.radians(i)
  //       c_alt = math.cos(alt)
  //       s_alt = math.sin(alt)
  //       for j in range(0,360,10): # 360 degree (around the sphere)
  //           azi = math.radians(j)
  //           c_azi = math.cos(azi)
  //           s_azi = math.sin(azi)
  //           glVertex3d(c_azi*c_alt, s_alt, s_azi*c_alt)

  for (const i of range(360, 10)) {
    const alt = degRad(i);
    const c_alt = Math.cos(alt);
    const s_alt = Math.sin(alt);
    for (const j in range(360, 10)) {
      const azi = degRad(j);
      const c_azi = Math.cos(azi);
      const s_azi = Math.sin(azi);
      pts.push({
        x: c_azi * c_alt,
        y: s_alt,
        z: s_azi * c_alt,
      });
    }
  }

  // const S = 30;
  // const v1 = (360 * 4) / S;
  // for (let i = 0; i < S; i++) {
  //   pts.push(new Point(v1 * i));
  // }
};

const myBallz = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  smooth();

  setupSphere();
}

const pts = [];

function draw() {
  background(0);
  orbitControl(5, 5, 0.1);
  push();
  stroke(255);
  noFill();
  box(400);
  pop();

  fill(255);
  // noFill();
  // stroke("red");

  pts.forEach((i) => {
    push();
    translate(i.x * SCALE, i.y * SCALE, i.z * SCALE);
    box(10);
    pop();
  });

  // push();
  // beginShape();

  // pts.forEach((i) => {
  //   vertex(i.x * SCALE, i.y * SCALE, i.z * SCALE);
  // });
  // endShape(CLOSE);
  // pop();
}
