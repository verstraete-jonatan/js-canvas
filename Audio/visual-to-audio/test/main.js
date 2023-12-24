let interval = 0;
const faders = [];
class Fader {
  constructor(freq = 0) {
    this.life = 0;
    this.s = randint(20, 50);
    this.color = randint(360);

    this.x = mapNum(freq, 16.35, 4978.03, 100, Xmax - 300);
    const rm = randint(100, 300);
    this.y = mapNum(freq, 16.35, 4978.03, rm, Ymax - rm);
  }
  draw() {
    log(this.life);
    if (this.life++ >= 1) {
      faders.splice(
        faders.findIndex((i) => i.color),
        1
      );
      return;
    }
    circle(
      this.x,
      this.y,
      this.s,
      null,
      hsl(this.color, 50, 50, 1 - sin(this.life / 15))
    );
  }
}

// "sawtooth", "sine", "square", "triangle"
const abc = [noteFreq["A4"], noteFreq["B4"], noteFreq["C4"]];
const melody1 = [
  noteFreq["A5"],
  noteFreq["B5"],
  noteFreq["C5"],
  noteFreq["C5"],
  noteFreq["G5"],
  noteFreq["E5"],
  null,
  null,
];
const main = async () => {
  rect(0, 0, Xmax, Ymax, null, "#fff3");
  if (interval % 4 === 0) {
    const n = melody1.next();
    if (n) {
      note(n, "sine", 0.8);
      faders.push(new Fader(n));
    }
  }

  if (interval % 2 === 0) {
    const n = [noteFreq["A4"], noteFreq["B4"], noteFreq["C4"]][
      1 + Math.round(sin(interval / 10))
    ];
    note(n, "square", -0.05);
  }

  if (interval % 3 === 0) {
    note(noteFreq["G3"]);
  }

  if (interval % 8 === 0) {
    note(noteFreq["E3"], "square");
  }

  if (interval % 9 === 0) {
    note(noteFreq["C3"], "triangle");
  }

  if (interval % 20 === 0) {
    note(noteFreq["A1"], "sine", 1);
  }

  faders.map((i) => i.draw());
  await pauseHalt();
  await sleep(0.1);
  interval++;
  requestAnimationFrame(main);
};

textCenter("Click to start");
document.body.onclick = !interval && main;

/*
let detail = 1;

for (let _ of range(15)) {
  let prev = -1;
  let i = 0;
  let count = 0;
  while (sin(i) > prev) {
    prev = sin(i);
    i += detail;
    count++;
    if (count > 50000000) {
      prev = Infinity;
      console.log("...", detail, i, prev);
      continue
    }
  }
  console.warn(`${detail} => ${count}    ${i} - ${prev}`);
  detail /= 10;
}




1 => 3 
0.1 => 17 
0.01 => 158 
0.001 => 1572 
0.0001 => 15709 
0.00001 => 157081 
0.0000010000000000000002 => 1570797 
1.0000000000000002e-7 => 15707964

... nears PI/2
*/
