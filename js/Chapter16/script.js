class Level {
  constructor(plan) {
    let rows = plan
      .trim()
      .split('\n')
      .map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];
    this.rows = rows.map((row, y) => {
      return row.map((char, x) => {
        let type = levelChars[char];
        if (typeof type === 'string') return type;
        this.startActors.push(type.create(new Vec(x, y), char));
        return 'empty';
      });
    });
  }
}
// Check whether an actor collides with a grid element.
Level.prototype.touches = function(pos, size, type) {
  let xStart = Math.floor(pos.x),
    xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y),
    yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
      let here = isOutside ? 'wall' : this.rows[y][x];
      if (here === type) return true;
    }
  }
  return false;
};

class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  get player() {
    // Array.prototype.find() will return the first item that fulfills the given condition.
    return this.actors.find(a => a.type === 'player');
  }

  static start(level) {
    return new State(level, level.startActors, 'playing');
  }
}
// SandBox State update.
// EloquentJS Exercise: Pause Functionality
// State.prototype.update = function(time, keys) {
//   if (keys.p && this.status === 'playing') {
//     return new State(this.level, this.actors, 'paused');
//   } else if (keys.Escape && this.status === 'paused') {
//     return new State(this.level, this.actors, 'playing');
//   }
//   let actors = this.actors.map(actor => actor.update(time, this, keys));
//   let newState = new State(this.level, actors, this.status);

//   if (newState.status !== 'playing') return newState;

//   let player = newState.player;
//   // Check if the player touches a grid lava block.
//   // Note: This is different with collision check between actors below this if-statement. This one is for ~
//   // ~ BACKGROUND/GRID lava blocks, not actor lava such as dripping lava.
//   if (this.level.touches(player.pos, player.size, 'lava')) {
//     return new State(this.level, actors, 'lost');
//   }
//   // Check collision between player and actors.
//   for (const actor of actors) {
//     if (actor !== player && overlap(actor, player)) {
//       newState = actor.collide(newState);
//     }
//   }
//   return newState;
// };
State.prototype.update = function(time, keys) {
  let actors = this.actors.map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status !== 'playing') return newState;

  let player = newState.player;
  // Check if the player touches a grid lava block.
  // Note: This is different with collision check between actors below this if-statement. This one is for ~
  // ~ BACKGROUND/GRID lava blocks, not actor lava such as dripping lava.
  if (this.level.touches(player.pos, player.size, 'lava')) {
    return new State(this.level, actors, 'lost');
  }
  // Check collision between player and actors.
  for (const actor of actors) {
    if (actor !== player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

const playerXSpeed = 7,
  gravity = 30,
  jumpSpeed = 17;

class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return 'player';
  }

  static create(pos) {
    // With player's size to be 1.5 block high, we have to adjust its coordinates to match player's position ~
    // ~ prior to the block below it. In short, moving it up a bit so the feet will step up properly.
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
}
Player.prototype.size = new Vec(0.8, 1.5);
Player.prototype.update = function(time, state, keys) {
  let pos = this.pos;

  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  else if (keys.ArrowRight) xSpeed += playerXSpeed;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, 'wall')) {
    pos = movedX;
  }

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, 'wall')) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }

  return new Player(pos, new Vec(xSpeed, ySpeed));
};

// MONSTER ADDITION
// Added Monster actor from original version.
class Monster {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return 'monster';
  }
  update(time, state) {
    let newPos = this.pos.plus(this.speed.times(time));
    let { rows } = state.level;
    if (!state.level.touches(newPos, this.size, 'wall')) {
      let bottomLeft = this.pos.plus(new Vec(-1, 1));
      let bottomRight = this.pos.plus(new Vec(1, 1));
      let leftX = Math.ceil(bottomLeft.x);
      let leftY = bottomLeft.y;
      let rightX = Math.floor(bottomRight.x);
      let rightY = bottomRight.y;

      if (rows[leftY][leftX] === 'empty' || rows[rightY][rightX] === 'empty') {
        // To avoid position stuck around the edges.
        let turnPos = rows[leftY][leftX] === 'empty' ? new Vec(0.1, 0) : new Vec(-0.1, 0);
        return new Monster(this.pos.plus(turnPos), this.speed.times(-1));
      }
      return new Monster(newPos, this.speed);
    } else {
      return new Monster(this.pos, this.speed.times(-1));
    }
  }
  collide(state) {
    let monMinusOne = this.pos.plus(new Vec(0, -1));
    if (state.player.pos.y < monMinusOne.y) {
      let filtered = state.actors.filter(a => a !== this);
      return new State(state.level, filtered, state.status);
    } else {
      return new State(state.level, state.actors, 'lost');
    }
  }

  static create(pos) {
    return new Monster(pos, new Vec(4, 0));
  }
}
Monster.prototype.size = new Vec(1, 1);

class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() {
    return 'lava';
  }

  static create(pos, char) {
    // Horizontal moving lava.
    if (char === '=') {
      return new Lava(pos, new Vec(2, 0));
    } else if (char === '|') {
      // Vertical moving lava.
      return new Lava(pos, new Vec(0, 2));
    } else if (char === 'v') {
      // Dripping lava. Once lava hits an obstacle, its position will be reset to its starting point.
      return new Lava(pos, new Vec(0, 2), pos);
    }
  }
}
Lava.prototype.size = new Vec(1, 1);
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, 'lost');
};
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));

  if (!state.level.touches(newPos, this.size, 'wall')) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    // If it hits a wall and it's a dripping lava, reset its position.
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    // If it hits a wall and it's a horizontal moving lava, revert the direction.
    return new Lava(this.pos, this.speed.times(-1));
  }
};

const wobbleSpeed = 8,
  wobbleDist = 0.1;

class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() {
    return 'coin';
  }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    // Coins have wobbling effect. To achieve that, we will use Math.sin() cycle ~
    // ~ and randomize the starting point to avoid synchronous effect.
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }
}
Coin.prototype.size = new Vec(0.6, 0.6);
Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a !== this);
  let status = state.status;
  // Checking if there are still any coins left in the game.
  if (!filtered.some(a => a.type === 'coin')) status = 'won';

  return new State(state.level, filtered, status);
};
Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;

  return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
};

const levelChars = {
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  o: Coin,
  m: Monster,
  '=': Lava,
  '|': Lava,
  v: Lava
};

// let simpleLevel = new Level(simpleLevelPlan);
// console.log(`${simpleLevel.width}, ${simpleLevel.height}`);

/* ================================================================================================== */

const scale = 20;

// Helper function to create DOM element, assign attributes, and append its children.
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (const attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (const child of children) {
    dom.appendChild(child);
  }
  return dom;
}

class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt('div', { class: 'game' }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() {
    this.dom.remove();
  }
}
// syncState
// → Remove and Redraw the actor's DOM elements based on given state.
// Note: We aren't reusing the DOM elements because then we have to keep an eye to the DOM and game ~
// ~ state association to make sure we update the view based on the game's state. Given there are not ~
// ~ much of actors in the game, constantly redrawing it won't be that expensive in regards of performance. ~
// ~ So, if we plan to expand it further, consider reusing instead of redrawing to be an improvement to the game.
DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};
// scrollPlayerIntoView
// → Create a "neutral space" in the middle part of 1/3 of screen size, and use the other 2/3 on each edge as a ~
// ~ point to scroll the screen.
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // Wrapper viewport's far edges.
  let left = this.dom.scrollLeft,
    right = left + width;
  let top = this.dom.scrollTop,
    bottom = top + height;

  let player = state.player;
  // To get the position of player's block center point.
  let center = player.pos.plus(player.size.times(0.5)).times(scale);
  // Horizontal view control.
  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  // Vertical view control.
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};

function drawGrid(level) {
  return elt(
    'table',
    {
      class: 'background',
      style: `width: ${level.width * scale}px`
    },
    ...level.rows.map(row => {
      return elt(
        'tr',
        { style: `height: ${scale}px` },
        ...row.map(type => elt('td', { class: type }))
      );
    })
  );
}

function drawActors(actors) {
  return elt(
    'div',
    {},
    ...actors.map(actor => {
      let rect = elt('div', { class: `actor ${actor.type}` });
      rect.style.width = `${actor.size.x * scale}px`;
      rect.style.height = `${actor.size.y * scale}px`;
      rect.style.left = `${actor.pos.x * scale}px`;
      rect.style.top = `${actor.pos.y * scale}px`;
      return rect;
    })
  );
}

function overlap(actor1, actor2) {
  return (
    actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y
  );
}

function trackKeys(keys) {
  let down = Object.create(null);
  function track(e) {
    if (keys.includes(e.key)) {
      down[e.key] = e.type === 'keydown';
      e.preventDefault();
    }
  }
  window.addEventListener('keydown', track);
  window.addEventListener('keyup', track);
  down.unregister = () => {
    window.removeEventListener('keydown', track);
    window.removeEventListener('keyup', track);
  };
  return down;
}
// SandBox arrowKeys.
// EloquentJS Exercise: Pause Functionality.
// const arrowKeys = trackKeys(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'p', 'Escape']);

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  let running = 'yes';
  return new Promise(resolve => {
    function escHandler(e) {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (running === 'no') {
        running = 'yes';
        runAnimation(frame);
      } else if (running === 'yes') {
        running = 'pausing';
      } else {
        running = 'yes';
      }
    }
    window.addEventListener('keydown', escHandler);
    let arrowKeys = trackKeys(['ArrowLeft', 'ArrowUp', 'ArrowRight']);

    function frame(time) {
      if (running === 'pausing') {
        running = 'no';
        return false;
      }
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status === 'playing') {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        window.removeEventListener('keydown', escHandler);
        arrowKeys.unregister();
        resolve(state.status);
        return false;
      }
    }
    runAnimation(frame);
  });
}

async function runGame(plans, Display) {
  let lives = 3;
  for (let level = 0; level < plans.length; ) {
    console.log(`Level: ${level + 1}, Lives: ${lives}`);
    let status = await runLevel(new Level(plans[level]), Display);
    if (status === 'won') {
      level++;
      lives = 3;
    } else {
      lives--;
      if (lives === 0) {
        console.log('GAME OVER');
        level = 0;
        lives = 3;
      }
    }
  }
  console.log("You've won!!");
}
