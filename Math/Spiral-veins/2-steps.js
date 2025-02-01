const main = (nrPoints = 0) => {
  const totalToDraw = 500 * 1000;

  const createTriangle = (x, y, s = 200) => {
    const res = [];
    const a = (Math.PI * 2) / nrPoints;
    const rotate = degRad(-90);

    for (let i = 0; i < nrPoints; i++) {
      if (i == 0)
        res.push({
          x: x + s * Math.cos(a * i + rotate),
          y: y + s * Math.sin(a * i + rotate),
        });
      else
        res.push({
          x: x + s * Math.cos(a * i + rotate),
          y: y + s * Math.sin(a * i + rotate),
        });
    }

    return res;
  };

  const points = createTriangle(Xmax * 2, Ymax * 2, 500);
  let current = points[0];

  const setNew = ({ x, y }) => {
    current = {
      x: (x - current.x) / PI,
      y: (y - current.y) / PI,
    };
  };

  const draw = () => {
    const r = randint(nrPoints - 1);
    setNew(points[r]);
    point(current.x, current.y, 2, COLORS[r]);
  };

  for (let i = 0; i < totalToDraw; i++) {
    draw();
  }
};

let i = 0;
const animate = async () => {
  if (i < 1000) {
    clear();
    main(++i);
    requestAnimationFrame(animate);
  }
};

animate();
