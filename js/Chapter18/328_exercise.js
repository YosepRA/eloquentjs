// // CONTENT NEGOTIATION
// // → A request can send an "Accept" request headers. It will define the type of file a user wants.
// // Though most server will ignore this header, but if it's capable of encoding the resource in many ways, ~
// // ~ the server can send it according to user's request.

// fetch('https://eloquentjavascript.net/author', { headers: { Accept: 'application/json' } })
//   .then(response => response.text())
//   .then(text => console.log(text))
//   .catch(err => console.log(err));

/* ========================================================================================================== */

// // JAVASCRIPT WORKBENCH

// let code = document.getElementById('code');
// let output = document.getElementById('output');

// document.querySelector('button').addEventListener('click', () => {
//   try {
//     let fun = new Function(code.value);
//     output.textContent = fun();
//   } catch (err) {
//     output.textContent = err;
//   }
// });

/* ======================================================================================================== */

// CONWAY'S WAY OF LIFE
// Rules:
// - Any alive cell which has less than 2 and more than 3 → DEAD (x < 2 && x > 4)
// - Any alive cell which has two or three live neightbors → LIVE (2 < x < 3)
// - Any dead cell which has EXACTLY 3 live neightbors → turn to LIVE (x == 3)

// 3 x 3 grid

let grid = document.querySelectorAll('input[type=checkbox]');

// let state = [
//   { live: false, neighbors: 0 },
//   { live: true, neighbors: 0 },
//   { live: false, neighbors: 0 },
//   { live: true, neighbors: 0 },
//   { live: true, neighbors: 0 },
//   { live: false, neighbors: 0 },
//   { live: false, neighbors: 0 },
//   { live: false, neighbors: 0 },
//   { live: false, neighbors: 0 }
// ];

let state = {
  width: 3,
  height: 3,
  rightEdges: [3, 6, 9],
  cells: [
    { live: false, neighbors: 0, index: 0 },
    { live: true, neighbors: 0, index: 1 },
    { live: false, neighbors: 0, index: 2 },
    { live: true, neighbors: 0, index: 3 },
    { live: true, neighbors: 0, index: 4 },
    { live: false, neighbors: 0, index: 5 },
    { live: false, neighbors: 0, index: 6 },
    { live: false, neighbors: 0, index: 7 },
    { live: false, neighbors: 0, index: 8 }
  ]
};

// let state = [
//   [{ live: false, neighbors: 0 }, { live: true, neighbors: 0 }, { live: false, neighbors: 0 }],
//   [{ live: false, neighbors: 0 }, { live: true, neighbors: 0 }, { live: false, neighbors: 0 }],
//   [{ live: false, neighbors: 0 }, { live: true, neighbors: 0 }, { live: false, neighbors: 0 }]
// ];

function updateView(state) {
  for (let i = 0; i < grid.length; i++) {
    grid[i].checked = state.cells[i].live;
  }
}

updateView(state);

// To transform cell's current state according to the rules.
function updateCell(state) {
  for (let i = 0; i < state.cells.length; i++) {
    let cell = state.cells[i];
    // Calculate amount of live neighbors.
    aliveNeighbors(cell);
  }
  for (const cell of state.cells) {
    // Dealing with live state based on rules.
    if (!cell.live && cell.neighbors === 3) {
      cell.live = true;
    } else if (cell.neighbors < 2 || cell.neighbors > 3) {
      cell.live = false;
    }
  }
}

// Hard coded 3 x 3 grid.
//
function aliveNeighbors(cell) {
  cell.neighbors = 0;
  let cellIndex = state.cells.findIndex(c => c === cell);
  let top = cellIndex - 3;
  let bottom = cellIndex + 3;

  // Left
  checkNeighbors(top - 1, cell);
  checkNeighbors(cellIndex - 1, cell);
  checkNeighbors(bottom - 1, cell);

  // Middle
  checkNeighbors(top, cell);
  checkNeighbors(bottom, cell);

  // Right
  if (!state.rightEdges.includes(cellIndex + 1)) {
    checkNeighbors(top + 1, cell);
    checkNeighbors(cellIndex + 1, cell);
    checkNeighbors(bottom + 1, cell);
  }
}

function checkNeighbors(index, cell) {
  if (state.cells[index]) {
    if (state.cells[index].live) cell.neighbors++;
    // if (state.cells[index].live) cell.neighbors.push(state.cells[index]);
  }
}

updateCell(state);
updateView(state);
console.log(state);

/* ======================================================================================================== */

class State {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.rightEdges = [];
    for (let row = 0; row < this.height; row++) {
      this.rightEdges.push((row + 1) * this.width);
    }

    this.cells = [];
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.cells.push(new Cell(false, 0));
      }
    }
  }

  update(grid) {
    for (let i = 0; i < grid.length; i++) {
      this.cells[i].live = grid[i].checked;
    }
  }
}

class Cell {
  constructor(live, neighbors) {
    this.live = live;
    this.neighbors = neighbors;
  }

  update(grid) {
    let neighbors = 0;
    for (const cell of grid) {
      // Top
      // Middle
      // Bottom
    }
  }
}
