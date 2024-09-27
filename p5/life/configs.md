```js
// 1. is ±stable on neighbours of 8
const smallerDie = 6;
const greaterDie = 11;
const equalLive = [5, 7, 8, 9];

// if we remove 8, it's stable on 7

// if we remove 7 we get the least stable working config, but nothing can be changes further
// also smallerDie as 6 being higher than 5 in equalLive is not correct as this will just create a flux of life but also death, no slow growth.
const smallerDie = 6;
const greaterDie = 11;
const equalLive = [5, 9];

// this gives a stable structure, small but doesn't evolve
const smallerDie = 6;
const greaterDie = 11;
const equalLive = [7, 8, 9];

// can go up until 14 otherwise at 15 it explodes, this does seems to be the largest, none explosive strucutre so far
const smallerDie = 6;
const greaterDie = 14;
const equalLive = [7, 8, 9];

// this also gives a stable but explodedly large structure
const smallerDie = 5;
const greaterDie = 11;
const equalLive = [6, 7];

// completely different config gives a repetivie but alive but exploded structure
if (grid.get(key) === false) {
  grid.set(key, [3].includes(nrNeighbours));
} else if ([5].includes(nrNeighbours)) {
  grid.set(key, true);
} else if (nrNeighbours > 10 || nrNeighbours < 4) {
  grid.set(key, false);
}
// simplified to:
if (grid.get(key) === false) {
  grid.set(key, nrNeighbours === 3);
} else if (nrNeighbours > 5 || nrNeighbours < 4) {
  grid.set(key, false);
}

// this one had a short but promising lifespan, although also exploded
// until now, everything either explodes or goes away. the hardest thing seems to be the in balance yet not stay still like rock but be alive
if (grid.get(key) === false) {
  grid.set(key, nrNeighbours === 3);
} else if (nrNeighbours > 5 || nrNeighbours < 3) {
  grid.set(key, false);
}

// this other configuration, although exploded, gives us the first ever evolving structure, although the evolving is relatively small and chaotic
let isAlive = grid.get(key);

if (!isAlive) {
  isAlive = [, 5, 6].includes(nrNeighbours);
} else if (nrNeighbours > 11 || nrNeighbours < 6) {
  isAlive = false;
}

// this version completely exploded, yet on 3 spots if gives us an infinite repeating process, similar to the original conway loops
if (!isAlive) {
  isAlive = [, 5, 6].includes(nrNeighbours);
} else if (nrNeighbours > 7 || nrNeighbours < 4) {
  isAlive = false;
}

//this seems lke the slowest growing exploded version so far, but thats probably because of the `nrNeighbours > 7` and ` 9].includes(nrNeighbours)` conflicting
// which is maybe the way to go?
if (isAlive) {
  if (nrNeighbours < 4 || nrNeighbours > 7) {
    isAlive = false;
  }
} else if ([, 5, 9].includes(nrNeighbours)) {
  isAlive = true;
}
// with similar results, but less margins between numbers
if (isAlive) {
  if (nrNeighbours < 3 || nrNeighbours > 6) {
    isAlive = false;
  }
} else if ([, 5].includes(nrNeighbours)) {
  isAlive = true;
}
```
