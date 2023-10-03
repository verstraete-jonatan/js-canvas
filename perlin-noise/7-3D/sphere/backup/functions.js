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
const constructTree = ({
  wideness = 4,
  detlaAngle = 90,
  attenuation = 0.77,
  minLength = 20,
  startLength = 70,
  depth = 10,
} = {}) => {
  const points = [];
  const scale = 100;

  const angleVal = 10 + sin(wideness / 100) * 100;

  function make(x1, y1, len, _angle, _depth) {
    if (_depth < 0) return;
    if (len < minLength) return;

    const _x = x1 - len * cos((_angle * PI) / 180);
    const _y = y1 - len * sin((_angle * PI) / 180);
    const z = (_depth - depth) / 2;

    points.push(
      Point3D(_x / scale, _y / scale, z, sin((_x + _y + z) / 1000) * 10)
    );

    make(_x, _y, len * attenuation, _angle + angleVal, _depth - 1, true);
    make(_x, _y, len * attenuation, _angle - angleVal, _depth - 1, false);
  }
  make(800, -200, startLength, detlaAngle, depth);

  return points;
};

/** Perlin nosie */
function perlinize(x, y) {
  let a =
    ((1 + noise.simplex3(x / noiseConf.df, y / noiseConf.df, noiseConf.zoff)) *
      1.1 *
      128) /
    (PI * 2);
  return rotateVector(x * noiseConf.scale, y * noiseConf.scale, a);
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
    const { x, y, z } = vertices[i];

    vertices[i].x = x * cosTheta - y * sinTheta;
    vertices[i].y = y * cosTheta + x * sinTheta;
  }
}

function rotateY(theta) {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  for (i = 0; i < vertices.length; i++) {
    const { x, y, z } = vertices[i];

    vertices[i].x = x * cosTheta - z * sinTheta;
    vertices[i].z = z * cosTheta + x * sinTheta;
  }
}

function rotateX(theta) {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  for (i = 0; i < vertices.length; i++) {
    const { x, y, z } = vertices[i];

    vertices[i].y = y * cosTheta - z * sinTheta;
    vertices[i].z = z * cosTheta + y * sinTheta;
  }
}
