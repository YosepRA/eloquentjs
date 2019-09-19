class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    // This is how to "copy" an array.
    // A copied array binding won't have the same reference as the original one.
    let copy = this.pixels.slice();
    for (const { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }

  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
}

function updateState(state, action) {
  return Object.assign({}, state, action);
  // Using triple dots is another way to do this. But it hasn't been standardized yet
  // return Object.assign({}, { ...state, ...action });
}

// DOM creator helper function.
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  // Code below is equivalent to add attributes to DOM elements. The difference is that while the one above ~
  // ~ can't assign a unique attributes like "data-", it can assign a function towards event properties such as ~
  // ~ onload, onkeydown, and such.
  // for (const attr of Object.keys(attrs)) {
  //   dom.setAttribute(attr, attrs[attr]);
  // }
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

/* ======================================================================================================== */

const scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt('canvas', {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }

  syncState(picture) {
    if (this.picture === picture) return;
    // let changed = [];
    // if (this.picture) {
    //   for (let y = 0; y < picture.height; y++) {
    //     for (let x = 0; x < picture.width; x++) {
    //       if (this.picture.pixel(x, y) !== picture.pixel(x, y)) {
    //         changed.push({ x, y, color: picture.pixel(x, y) });
    //       }
    //     }
    //   }
    // }
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }

  mouse(downEvent, onDown) {
    // If clicked button isn't left button, do nothing.
    if (downEvent.button !== 0) return;
    let pos = pointerPosition(downEvent, this.dom);
    let onMove = onDown(pos);
    if (!onMove) return;
    const move = moveEvent => {
      // If there's no button clicked while hovering.
      if (moveEvent.buttons === 0) {
        this.dom.removeEventListener('mousemove', move);
      } else {
        let newPos = pointerPosition(moveEvent, this.dom);
        // If while moving the cursor but still in the same position, cut the process to avoid applying ~
        // ~ "onMove" on the same position.
        if (newPos.x === pos.x && newPos.y === pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.dom.addEventListener('mousemove', move);
  }

  touch(startEvent, onDown) {
    let pos = pointerPosition(startEvent.touches[0], this.dom);
    let onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;

    const move = moveEvent => {
      let newPos = pointerPosition(moveEvent.touches[0], this.dom);
      if (newPos.x === pos.x && newPos.y === pos.y) return;
      pos = newPos;
      onMove(newPos);
    };
    const end = () => {
      this.dom.removeEventListener('touchmove', move);
      this.dom.removeEventListener('touchend', end);
    };
    this.dom.addEventListener('touchmove', move);
    this.dom.addEventListener('touchend', end);
  }
}

function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext('2d');

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  // if (changed.length !== 0) {
  //   for (const { x, y, color } of changed) {
  //     cx.fillStyle = color;
  //     cx.fillRect(x * scale, y * scale, scale, scale);
  //   }
  // } else {
  //   for (let y = 0; y < picture.height; y++) {
  //     for (let x = 0; x < picture.width; x++) {
  //       cx.fillStyle = picture.pixel(x, y);
  //       cx.fillRect(x * scale, y * scale, scale, scale);
  //     }
  //   }
  // }

  // if (oldPicture) {
  //   for (let y = 0; y < newPicture.height; y++) {
  //     for (let x = 0; x < newPicture.width; x++) {
  //       if (oldPicture.pixel(x, y) !== newPicture.pixel(x, y)) {
  //         cx.fillStyle = newPicture.pixel(x, y);
  //         cx.fillRect(x * scale, y * scale, scale, scale);
  //       }
  //     }
  //   }
  // } else {
  //   for (let y = 0; y < newPicture.height; y++) {
  //     for (let x = 0; x < newPicture.width; x++) {
  //       cx.fillStyle = newPicture.pixel(x, y);
  //       cx.fillRect(x * scale, y * scale, scale, scale);
  //     }
  //   }
  // }
}

function pointerPosition(domEvent, dom) {
  // Get DOMRect object. It contains informations about DOM element's position and size relative ~
  // ~ to viewport's top left corner.
  let rect = dom.getBoundingClientRect();
  // Returning the unscaled position of a pixel.
  return {
    x: Math.floor((domEvent.clientX - rect.left) / scale),
    y: Math.floor((domEvent.clientY - rect.top) / scale)
  };
}

/* ======================================================================================================== */

class PixelEditor {
  constructor(state, config) {
    const { tools, controls, dispatch } = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      // "tools" is a mapped object of tool with a function that can implement each tool as its value.
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      // If it returns a move handler.
      if (onMove) return pos => onMove(pos, this.state);
    });
    // "controls" is an array of component constructors.
    this.controls = controls.map(Control => new Control(state, config));
    this.dom = elt(
      'div',
      {
        tabIndex: 0,
        onkeydown: event => keyBind(event, dispatch)
      },
      this.canvas.dom,
      elt('br'),
      ...this.controls.reduce((a, c) => a.concat(' ', c.dom), [])
    );
  }

  syncState(state) {
    this.state = state;
    // This is where the view is updating.
    this.canvas.syncState(state.picture);
    for (const control of this.controls) {
      control.syncState(state);
    }
  }
}

class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt(
      'select',
      {
        onchange: () => dispatch({ tool: this.select.value })
      },
      ...Object.keys(tools).map(tool =>
        elt(
          'option',
          {
            selected: tool === state.tool
          },
          tool
        )
      )
    );
    this.dom = elt('label', null, '🖌 Tools: ', this.select);
  }

  syncState(state) {
    this.select.value = state.tool;
  }
}

class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt('input', {
      type: 'color',
      value: state.color,
      onchange: () => dispatch({ color: this.input.value })
    });
    this.dom = elt('label', null, '🎨 Color: ', this.input);
  }

  syncState(state) {
    this.input.value = state.color;
  }
}

// To draw a single pixel.
function draw(start, state, dispatch) {
  let positions = [];
  let drawn = [];
  function drawPixel({ x, y }, state) {
    // Add new position to array of positions and keep concatenating as the pointer drags on.
    positions.push({ x, y });
    // Start with at least two of the latest data to avoid recalculating from the first position.
    let start = positions.length > 2 ? positions.length - 2 : 0;
    // To give drawLine function two positions to draw pixels inbetween.
    for (let i = start; i < positions.length; i++) {
      let from = positions[i];
      let to = positions[i + 1];
      // If there is no next point.
      if (!to) {
        // Add the first point(from) as the last point of the calculation.
        drawn = drawn.concat({ x: from.x, y: from.y, color: state.color });
        continue;
      }
      // Store the inbetween pixels and continue if there's still points in the array.
      drawn = drawn.concat(drawLine(from, to, state));
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawPixel(start, state);
  return drawPixel;
}

// To draw a solid colored rectangle.
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

// Adjacent pixel coordinate both horizontally and vertically (except diagonal).
const around = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }];

// Do a bucket fill.
function fill({ x, y }, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{ x, y, color: state.color }];
  for (let done = 0; done < drawn.length; done++) {
    for (const { dx, dy } of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      // If the next pixel is,
      // - Inside the boundary edges.
      // - Has the same color as the original pixel.
      // - Has never been visited by this code before.
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) === targetColor &&
        !drawn.some(p => p.x === x && p.y === y)
      ) {
        drawn.push({ x, y, color: state.color });
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

// Color Picker
function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

/* ======================================================================================================== */

class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      'button',
      {
        onclick: () => this.save()
      },
      '💾 Save'
    );
  }

  save() {
    let canvas = elt('canvas');
    drawPicture(this.picture, canvas, 1);
    let link = elt('a', {
      href: canvas.toDataURL(),
      download: 'pixelart.png'
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) {
    this.picture = state.picture;
  }
}

class LoadButton {
  constructor(_, { dispatch }) {
    this.dom = elt(
      'button',
      {
        onclick: () => startLoad(dispatch)
      },
      '📁 Load'
    );
  }

  syncState() {}
}

function startLoad(dispatch) {
  let input = elt('input', {
    type: 'file',
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (!file) return;
  let reader = new FileReader();
  reader.addEventListener('load', () => {
    let image = elt('img', {
      src: reader.result,
      onload: () => dispatch({ picture: pictureFromImage(image) })
    });
  });
  reader.readAsDataURL(file);
}

// We can't read pixel data coming right from an image element. But we can draw it onto a canvas and then call its ~
// ~ 2d context method "getImageData" to access its pixel data, convert it to fit our Picture.pixels structure, ~
// ~ and finally create a new picture out of it.
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt('canvas', { width, height });
  let cx = canvas.getContext('2d');
  cx.drawImage(image, 0, 0);
  let pixels = [];
  // CanvasRenderingContext2D.getImageData();
  // → returns an ImageData object representing the underlying pixel data for a specified portion of the canvas.
  let { data } = cx.getImageData(0, 0, width, height);

  function hex(n) {
    // Number.prototype.toString()
    // → Convert a number to a string. The first parameter value is a radix number to define ~
    // base number (2 ~ 36) for representing numeric value.
    // Code below will represent a number to be a hexadecimal format (16 digits based).
    return n.toString(16).padStart(2, '0');
  }

  for (let i = 0; i < data.length; i += 4) {
    // "data" is a linear array representing color components for each image's pixel data.
    // Each pixel occupies 4 data index inside "data" array. Each will contain the value of ~
    // ~ red, green, blue, alpha respectively in a 255 bits value format.
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push('#' + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

// Main State Updating Control.
// To implement Undo functionality, we need to add more properties in our passing state. Namely "done" and "doneAt".
// "done" will contain an array of picture object. The most upfront object to be the latest update of a picture.
// "doneAt" will have timestamp as to when the history last updated.
function historyUpdateState(state, action) {
  if (action.undo === true) {
    if (state.done.length === 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    });
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    });
  } else {
    return Object.assign({}, state, action);
  }
}

class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt(
      'button',
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length === 0,
        id: 'undo'
      },
      '⮪ Undo'
    );
  }

  syncState(state) {
    this.dom.disabled = state.done.length === 0;
  }
}

/* ======================================================================================================== */

let startState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0
};

let baseTools = { draw, rectangle, fill, pick, circle };
let baseControls = [ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton];

function startPixelEditor({ state = startState, tools = baseTools, controls = baseControls }) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });
  return app.dom;
}

/* ======================================================================================================== */

// EXERCISE

// KEYBOARD BINDING
function keyBind({ ctrlKey, metaKey, key }, dispatch) {
  if ((ctrlKey && key === 'z') || (metaKey && key === 'z')) {
    dispatch({ undo: true });
  } else {
    for (const tool of Object.keys(baseTools)) {
      // If key pressed is the same with any tool's first letter.
      if (key === tool[0]) {
        dispatch({ tool });
      }
    }
  }
}

// CIRCLE
function circle(center, state, dispatch) {
  function drawCircle(pos) {
    let radius = Math.sqrt(Math.pow(center.x - pos.x, 2) + Math.pow(center.y - pos.y, 2));
    let drawn = [{ x: center.x, y: center.y, color: state.color }];
    // for (let rad = 0; rad < 7; rad++) {
    //   let xEnd = Math.floor(Math.cos(rad) * radius);
    //   let yEnd = Math.floor(Math.sin(rad) * radius);

    //   for (let y = center.y; y < yEnd; y++) {
    //     for (let x = center.x; x < xEnd; x++) {
    //       if (
    //         x >= 0 &&
    //         x < state.picture.width &&
    //         y >= 0 &&
    //         y < state.picture.height &&
    //         !drawn.some(p => x === p.x && y === p.y)
    //       ) {
    //         drawn.push({ x, y, color: state.color });
    //       }
    //     }
    //   }
    // }

    for (let done = 0; done < drawn.length; done++) {
      for (const { dx, dy } of around) {
        let x = drawn[done].x + dx;
        let y = drawn[done].y + dy;
        let distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
        if (
          x >= 0 &&
          x < state.picture.width &&
          y >= 0 &&
          y < state.picture.height &&
          !drawn.some(p => x === p.x && y === p.y) &&
          distance < radius
        ) {
          drawn.push({ x, y, color: state.color });
        }
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawCircle(center);
  return drawCircle;
}

// PROPER LINES
// Giving it an array of positions and will return an array of pixel properties.
function drawLine(from, to, { color }) {
  // Every offset position of a pixel.
  const around = [
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 }
  ];
  // Start with the beginning point.
  let drawn = [{ x: from.x, y: from.y, color }];

  function distToTarget(pos) {
    return Math.sqrt(Math.pow(to.x - pos.x, 2) + Math.pow(to.y - pos.y, 2));
  }

  for (let done = 0; done < drawn.length; done++) {
    let pointsAround = around.map(({ dx, dy }) => {
      return { x: drawn[done].x + dx, y: drawn[done].y + dy };
    });
    if (pointsAround.some(p => p.x === to.x && p.y === to.y)) {
      // If one of the offset position is the final goal, then finish here.
      // and return the path up to the point before final goal.
      return drawn;
    } else {
      let closest = pointsAround.reduce((a, c) => (distToTarget(c) < distToTarget(a) ? c : a));
      drawn.push({ x: closest.x, y: closest.y, color });
    }
  }
}
