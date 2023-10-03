/** Point */
const Point3D = (x, y, z, theta) => ({
  x: x,
  y: y,
  z: z,
  _x: x,
  _y: y,
  _z: z,
  theta: theta,
});

/** THree */
const constructTree = () => {
  const points = [];
  const scale = 80;

  const angleVal = 10 + sin(threeConf.wideness / 100) * 100;

  function make(x1, y1, len, _angle, _depth) {
    if (_depth < 0) return;
    if (len < threeConf.minLength) return;

    const _x = x1 - len * cos((_angle * PI) / 180);
    const _y = y1 - len * sin((_angle * PI) / 180);
    const z = (threeConf.startLength * PI) / scale;

    points.push(
      Point3D(_x / scale, _y / scale, z, sin((_x + _y + z) / 1000) * 10),
      Point3D(x1 / scale, y1 / scale, z, sin((x1 + y1 + z) / 1000) * 10)
    );

    make(
      _x,
      _y,
      len * threeConf.attenuation,
      _angle + angleVal,
      _depth - 1,
      true
    );
    make(
      _x,
      _y,
      len * threeConf.attenuation,
      _angle - angleVal,
      _depth - 1,
      false
    );
  }
  make(
    0,
    setup.radius / 2 - threeConf.startLength,
    threeConf.startLength,
    threeConf.detlaAngle,
    threeConf.depth
  );

  return points;
};

/** Perlin nosie */
function perlinize(x, y) {
  let a =
    ((1 +
      noise.simplex3(x / noiseConf.freq, y / noiseConf.freq, noiseConf.zoff)) *
      1.1 *
      128) /
    (PI * 2);
  return rotateVector(x * noiseConf.amp, y * noiseConf.amp, a);
}

/** Sphere */
const pointList = range(setup.amount).map((i) => {
  const theta = i / PI;
  const phi = (i / setup.amount) * PI;

  return {
    theta: theta,
    phi: phi,
    radius: setup.radius,
  };
});

const projectSphere = () => {
  const render = [];
  const scale = 200;
  for (let i of pointList) {
    const x = i.radius * sin(i.phi) * cos(i.theta);
    const y = i.radius * cos(i.phi);
    const z = i.radius * sin(i.phi) * sin(i.theta) + i.radius;

    render.push(Point3D(x / scale, y / scale, z / scale, i.theta));
  }
  return render;
};

function rotateZ(theta) {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  for (i = 0; i < vertices.length; i++) {
    const { x, y } = vertices[i];
    vertices[i].x = x * cosTheta - y * sinTheta;
    vertices[i].y = y * cosTheta + x * sinTheta;
  }
}

function rotateY(theta) {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  for (i = 0; i < vertices.length; i++) {
    const { x, z } = vertices[i];

    vertices[i].x = x * cosTheta - z * sinTheta;
    vertices[i].z = z * cosTheta + x * sinTheta;
  }
}

function rotateX(theta) {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  for (i = 0; i < vertices.length; i++) {
    const { y, z } = vertices[i];

    vertices[i].y = y * cosTheta - z * sinTheta;
    vertices[i].z = z * cosTheta + y * sinTheta;
  }
}
