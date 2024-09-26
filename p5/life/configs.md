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
```
