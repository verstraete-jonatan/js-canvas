# Strategy

- everything is divided up in tiles.
- when moving we push the current move to our 'history'
- movement rules:

  - random/seeded
  - either vertical or horizontal (not diagonal).
  - the target square must have free squares (that have not been visited yet).
  - if none is free (no neighboring square has free squares), we 'backtrack' to the last square in our 'history' adn repeat this process.

Quest:
when going from tile A to F, this is considered a "quest".
on a "quest" a lot can happen: bugs, sidetracks, finish line..

- Quest rules:
  - are recursively
  - calculated separately
  - when the quest is done we apply 'optimizations'.

- optimizations:
  - remove loops:
    - eg: A->F, has a sidetrack of tiles: A,B,C,A,D,E,F
      all sidetracks can be removed if we encounter A or F during the quest from A->F. So we reset to base
  - add missing tiles:
    - eg: A->F, has a route that misses tiles: A,B,F.
      In this case we construct a missing path from B->F.

NOTE:
