function posZByAngle(x, y, z, angle, dis) {
  const _x = dis * cos(this.angle);
  const _y = dis * sin(this.angle);
  const _z = dis * sin(this.angle);

  const dx = _x - x;
  const dy = _y - y;
  const dz = _z - z;

  let rxy = sqrt(pow(dx, 2) + pow(dy, 2));
  let phi = atan(dz / rxy);
  if (dx < 0) phi += PI;

  return [x + _x, y + _y, dis * phi];
}

const Tree = {
  allBranches: [],
  isGrowing: false,
  x: 0,
  y: 0,
  z: 0,
  angle: 0,
  thickness: 20,

  init() {
    new Branch(this);
  },
  grow() {
    let isGrown = false;
    let life = 0;
    while (!isGrown) {
      if (life++ > 1000) {
        console.log(this);
        throw new Error("Someone hacked death, lets start over.");
      }
      isGrown = true;
      for (const branch of this.allBranches) {
        branch.mature();
        if (!branch.isMature) {
          isGrown = false;
        }
      }
    }
  },
  draw() {
    for (const branch of this.allBranches) {
      branch.draw();
    }
  },
};

class Branch {
  constructor(parent, depth = 0) {
    this.x = parent.x;
    this.y = parent.y;
    this.z = parent.z;
    this.parent = parent;
    this.isMature = false;
    this.depth = depth + 0.5;

    Tree.allBranches.push(this);

    //parentYAngleDirection
    this.angle = parent.angle + 2 + rFloat(-0.2, 0.2);
    this.thickness = parent.thickness - rFloat(8);

    this.nodes = [[this.x, this.y, this.z, this.thickness]];
    this.life = 0;
    this.maxAge = 1 + rInt(this.thickness * 40);
  }
  mature() {
    if (this.isMature) {
      return;
    }
    if (this.thickness < 0.1 || this.life > this.maxAge || rInt(4000) === 1) {
      this.isMature = true;
      this.nodes.push([this.x, this.y, this.z, this.thickness]);
      return;
    }
    // slight twist
    // if (rInt(80) === 1) {
    //   this.angle += rFloat(-2, 2);
    // }

    this.grow();
    this.life += 1;

    // create offspring
    if (rInt(30) === 1) {
      new Branch(this, this.depth);
      this.nodes.push([this.x, this.y, this.z, this.thickness]);
    } else if (this.life % 10 === 0) {
      this.nodes.push([this.x, this.y, this.z, this.thickness]);
    }
  }

  grow() {
    if (rInt(10) === 1) {
      this.thickness -= rFloat(0.2);
    }

    const dis = rFloat(10);
    const R = this.depth + rFloat(this.angle);
    this.x += dis * cos(rFloat(-R, R));
    this.y += dis * cos(rFloat(-R, R));
    this.z += dis * cos(rFloat(-R, R));
  }

  draw() {
    for (let [x, y, z] of this.nodes) {
      push();
      translate(x, y, z);
      box(10);
      pop();
    }

    stroke(`hsl(${hue}, 100%, 50%)`);
    // strokeWeight(1.5);

    let prev = null;
    this.nodes.forEach(([x, y, z]) => {
      if (prev) {
        push();
        line(x, y, z, prev[0], prev[1], prev[2]);
        pop();
      }
      prev = [x, y, z];
    });
  }
}
