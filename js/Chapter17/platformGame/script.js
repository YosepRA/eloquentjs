let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

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

  touches(pos, size, type) {
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
  }
}

class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  get player() {
    return this.actors.find(a => a.type === 'player');
  }
  update(time, keys) {
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
  }

  static start(level) {
    return new State(level, level.startActors, 'playing');
  }
}

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
  update(time, state, keys) {
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
  }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
}
Player.prototype.size = new Vec(0.8, 1.5);

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
  collide(state) {
    return new State(state.level, state.actors, 'lost');
  }
  update(time, state) {
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
  collide(state) {
    let filtered = state.actors.filter(a => a !== this);
    let status = state.status;
    // Checking if there are still any coins left in the game.
    if (!filtered.some(a => a.type === 'coin')) status = 'won';

    return new State(state.level, filtered, status);
  }
  update(time) {
    let wobble = this.wobble + time * wobbleSpeed;
    let wobblePos = Math.sin(wobble) * wobbleDist;

    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
  }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }
}
Coin.prototype.size = new Vec(0.6, 0.6);

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

/* ================================================================================================== */

// Canvas Display
// → Creating and maintaining display/view with canvas instead of DOM elements.

let playerSprites = document.createElement('img');
playerSprites.src = './assets/player.png';
let otherSprites = document.createElement('img');
otherSprites.src = './assets/otherSprites.png';

// // Because of the player sprite's size, we have to adjust the player's position and size as well.
// // But note that we don't have to change player object actual x-size which is 0.8 block, but we rather ~
// // ~ "stretch" the collision point from its actual size.
// // With scale of 1 : 20px,
// // Player Object: 0.8 x 20 = 16px
// // Sprite:                   24px → 8px difference split into both sides.
const playerXOverlap = 4;

class CanvasDisplay {
  constructor(parent, level) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.min(600, level.width * scale);
    this.canvas.height = Math.min(450, level.height * scale);
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext('2d');

    this.flipPlayer = false;

    this.viewport = {
      top: 0,
      left: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
  }

  syncState(state) {
    this.updateViewport(state);
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
  }
  updateViewport(state) {
    // let { top, left, width, height } = this.viewport;
    let view = this.viewport;
    let margin = view.width / 3;
    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5));

    if (center.x < view.left + margin) {
      view.left = Math.max(center.x - margin, 0);
    } else if (center.x > view.left + view.width - margin) {
      view.left = Math.min(center.x + margin - view.width, state.level.width - view.width);
    }

    if (center.y < view.top + margin) {
      view.top = Math.max(center.y - margin, 0);
    } else if (center.y > view.top + view.height - margin) {
      view.top = Math.min(center.y + margin - view.height, state.level.height - view.height);
    }
  }
  clearDisplay(status) {
    if (status === 'won') {
      this.cx.fillStyle = 'rgb(68, 191, 255)';
    } else if (status === 'lost') {
      this.cx.fillStyle = 'rgb(44, 136, 214)';
    } else {
      this.cx.fillStyle = 'rgb(52, 166, 251)';
    }
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawBackground(level) {
    let { top, left, width, height } = this.viewport;
    let { rows } = level;
    let xStart = Math.floor(left);
    let xEnd = Math.ceil(left + width);
    let yStart = Math.floor(top);
    let yEnd = Math.ceil(top + height);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let tile = rows[y][x];
        if (tile === 'empty') continue;
        let screenX = (x - left) * scale;
        let screenY = (y - top) * scale;
        let tileX = tile === 'lava' ? scale : 0;
        this.cx.drawImage(otherSprites, tileX, 0, scale, scale, screenX, screenY, scale, scale);
      }
    }
  }
  drawPlayer(player, x, y, width, height) {
    width += playerXOverlap * 2;
    x -= playerXOverlap;
    if (player.speed.x !== 0) {
      this.flipPlayer = player.speed.x < 0;
    }

    let tile = 8;
    if (player.speed.y !== 0) {
      tile = 9;
    } else if (player.speed.x !== 0) {
      tile = Math.floor(Date.now() / 60) % 8;
    }

    this.cx.save();
    if (this.flipPlayer) {
      flipHorizontally(this.cx, x + width / 2);
    }
    let tileX = tile * width;
    this.cx.drawImage(playerSprites, tileX, 0, width, height, x, y, width, height);
    this.cx.restore();
  }
  drawActors(actors) {
    for (const actor of actors) {
      let width = actor.size.x * scale;
      let height = actor.size.y * scale;
      let x = (actor.pos.x - this.viewport.left) * scale;
      let y = (actor.pos.y - this.viewport.top) * scale;

      if (actor.type === 'player') {
        this.drawPlayer(actor, x, y, width, height);
      } else {
        let tileX = (actor.type === 'coin' ? 2 : 1) * scale;
        this.cx.drawImage(otherSprites, tileX, 0, scale, scale, x, y, scale, scale);
      }
    }
  }

  clear() {
    this.canvas.remove();
  }
}

/* ================================================================================================== */

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

function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}
