const Tree = {
  allBranches: [],
  isGrowing: false,
  x: 0,
  y: 0,
  z: 0,
  depth: 0,
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
        if (!branch.isMature) {
          branch.mature();
          isGrown = false;
        }
      }
    }
    this.draw();
  },
  draw() {
    for (const branch of this.allBranches) {
      branch.draw();
    }
  },
};

class Branch {
  constructor({ x, y, z, angle, depth = 0 }) {
    this.x = x;
    this.y = y;
    this.z = z;

    const df = 1;
    // this.angle =
    //   angle + (-1 + noise(this.x / df, this.y / df, this.z / df)) * 100;

    this.angle = angle + 2 + rFloat(-0.2, 0.2);

    this.isMature = false;
    this.depth = depth + 1;
    this.thickness = 2;

    Tree.allBranches.push(this);

    //parentYAngleDirection

    this.nodes = [[this.x, this.y, this.z, this.thickness]];
    this.life = 0;
    this.maxAge = 20; //- this.depth;
  }
  mature() {
    if (this.isMature) {
      return;
    }
    if (this.thickness < 0.1 || this.life > this.maxAge || this.depth > 10) {
      this.isMature = true;
      this.nodes.push([this.x, this.y, this.z, this.thickness]);
      return;
    }

    this.grow();
    this.life += 1;

    // create offspring

    const createSubBranch = rInt(9); // getSquareNoise(this.x + this.y + this.z);
    if (createSubBranch === 1) {
      console.log(1);
      new Branch(this);
      this.nodes.push([this.x, this.y, this.z, this.thickness]);
    } else if (this.life % 10 === 0) {
      this.nodes.push([this.x, this.y, this.z, this.thickness]);
    }
  }

  grow() {
    // const [x, y, z] = posZByAngle(
    //   this.x,
    //   this.y,
    //   this.z,
    //   radDeg(this.angle),
    //   0.000000001 // || Math.abs(50 - this.depth * 5)
    // );

    const [x, y, z] = posZByAngle(
      this.x,
      this.y,
      this.z,
      radDeg(this.angle),
      0.00000000001 // || Math.abs(50 - this.depth * 5)
    );

    // if (this.life > 21) {
    //   console.log({ x, y, z, _x: this.x });
    //   exit();
    // }

    this.x += x;
    this.y += y;
    this.z += z + rInt(10);
    return;

    const dis = 10; //rFloat(10);
    const R = (this.depth + rFloat(this.angle)) / (5 / this.depth);
    this.x += dis * cos(rFloat(-R, R));
    this.y += dis * sin(rFloat(-R, R));
    this.z += dis * sin(rFloat(-R, R));
  }

  draw() {
    strokeWeight(0);

    // for (let [x, y, z] of this.nodes) {
    //   push();
    //   translate(x, y, z);
    //   box(10);
    //   pop();
    // }

    stroke(`hsl(${(this.depth / 50) * 350}, 100%, 50%)`);
    strokeWeight(this.thickness);

    let prev = null;
    this.nodes.forEach((n) => {
      if (prev) {
        push();
        line(n[0], n[1], n[2], prev[0], prev[1], prev[2]);
        pop();
      }
      prev = n;
    });
  }
}
