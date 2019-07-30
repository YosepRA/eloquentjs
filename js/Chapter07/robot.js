const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  'Marketplace-Farm',
  'Marketplace-Post Office',
  'Marketplace-Shop',
  'Marketplace-Town Hall',
  'Shop-Town Hall'
];

const mailRoute = [
  "Alice's House",
  'Cabin',
  "Alice's House",
  "Bob's House",
  'Town Hall',
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  'Shop',
  "Grete's House",
  'Farm',
  'Marketplace',
  'Post Office'
];

function buildGraph(edges) {
  let graph = Object.create(null);

  function addEdge(from, to) {
    if (!graph[from]) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (const [from, to] of edges.map(road => road.split('-'))) {
    addEdge(from, to);
    addEdge(to, from);
  }

  return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    // If it isn't a valid move,
    if (!roadGraph[this.place].includes(destination)) {
      return this; // Don't change the state.
    } else {
      // If it is, create a new one.
      let parcels = this.parcels
        .map(p => {
          // If parcel's location isn't at robot's current location.
          if (p.place !== this.place) return p; // Don't do anything to that parcel.
          // Else, the robot will carry it along to the next destination.
          return { place: destination, address: p.address };
        })
        // Check if the current parcels carried by the robot is at correct destination address.
        // If yes, then filter it out because it has reached its destination.
        .filter(p => p.place !== p.address);

      return new VillageState(destination, parcels);
    }
  }
}

// let first = new VillageState('Post Office', [{ place: 'Post Office', address: "Alice's House" }]);
// let next = first.move("Alice's House");

// console.log(next.place); // "Alice's House"
// console.log(next.parcels); // [] // The parcel has been delivered, so there's no parcel left.
// console.log(first.place); // The first state is still intact for later use.

// Main Function
function runRobot(state, robot, memory = []) {
  let turn = 0;
  while (true) {
    if (state.parcels.length === 0) {
      // console.log(`Done in ${turn} turns`);
      return turn;
    }
    // Generate next move.
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    // console.log(`Moved to ${action.direction}`);

    turn++;
  }
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    // Exploring places that could be reached by current location.
    for (const place of graph[at]) {
      // If the available routes contain the goal destination,
      // then finish at that point.
      if (place === to) return route.concat(place);
      // If the available routes haven't been visited previously.
      if (!work.some(w => w.at === place)) {
        // Take that route.
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

// Robot functions
// Robot will decide which route to take.
function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}
function routeRobot(state, memory) {
  if (memory.length === 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}
function goalOrientedRobot({ place, parcels }, route) {
  // If the latest generated route has finished but there are still parcels yet to be delivered.
  if (route.length === 0) {
    // Take first random leftover parcel.
    let parcel = parcels[0];
    // If the taken parcel's place is different from robot's current place.
    if (parcel.place !== place) {
      // We want route to that parcel and to take it.
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      // Else, if the taken parcel's is at robot's current place.
      // Then, find the route to its address
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}
function lazyRobot({ place, parcels }, route) {
  if (route.length === 0) {
    let routes = parcels.map(parcel => {
      if (parcel.place !== place) {
        return { route: findRoute(roadGraph, place, parcel.place), pickUp: true };
      } else {
        return { route: findRoute(roadGraph, place, parcel.address), pickUp: false };
      }
    });

    // Choosing which route to pick by scoring each of it.
    route = routes.reduce((a, b) => (scores(a) > scores(b) ? a : b)).route;
  }
  // If there is still place(s) to go in route array. then keep going.
  return { direction: route[0], memory: route.slice(1) };

  // Scoring each parcel's route. Parcels that needs to be picked up OR ~
  // ~ the shorter route's length will yield the better score.
  function scores({ route, pickUp }) {
    return (pickUp ? 0.5 : 0) - route.length;
  }
}

VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (address === place);
    parcels.push({ place, address });
  }
  return new VillageState('Post Office', parcels);
};

// runRobot(VillageState.random(), lazyRobot, []);
// console.log(runRobot(VillageState.random(), goalOrientedRobot, []));

// Pathfinding
/* From place A, the available route are to point B and C. In deciding where to move next, we have to consider:
    - If the carried parcel(s) address is at least going towards one of those available destinations.
    - If there is a parcel in at least one of those available destinations. */

// EXERCISE

// Compare Robots
function compareRobots(robotOne, robotTwo) {
  let oneScores = [];
  let twoScores = [];
  for (let i = 0; i < 100; i++) {
    // Starting state for 5 parcels.
    let startingState = VillageState.random();
    oneScores.push(runRobot(startingState, robotOne));
    twoScores.push(runRobot(startingState, robotTwo));
  }

  let oneResult = {
    min: Math.min(...oneScores),
    max: Math.max(...oneScores),
    avg: oneScores.reduce((a, b) => a + b) / oneScores.length
  };
  let twoResult = {
    min: Math.min(...twoScores),
    max: Math.max(...twoScores),
    avg: twoScores.reduce((a, b) => a + b) / twoScores.length
  };

  return `${robotOne.name} min: ${oneResult.min}, max: ${oneResult.max}, avg: ${oneResult.avg}.
  ${robotTwo.name} min: ${twoResult.min}, max: ${twoResult.max}, avg: ${twoResult.avg}.`;
}

// compareRobots(randomRobot, routeRobot);
// console.log(compareRobots(lazyRobot, goalOrientedRobot));

// Persistent Groups
class PGroup {
  constructor(items = []) {
    this.items = items;
  }

  add(value) {
    if (this.has(value)) return this.items;
    let newSet = this.items.concat(value);
    return new PGroup(newSet);
  }

  delete(value) {
    if (!this.has(value)) return this.items;
    let newSet = this.items.filter(i => i !== value);
    return new PGroup(newSet);
    // return this.items.filter(i => i !== value);
  }

  has(value) {
    return this.items.includes(value);
  }
}

// let pGroupOne = new PGroup([1, 2, 3]);
// console.log(pGroupOne.add(3)); // [1, 2, 3]
// console.log(pGroupOne.add(4)); // [1, 2, 3, 4]
// console.log(pGroupOne.delete(5)); // [1, 2, 3, 4]
// console.log(pGroupOne.delete(4)); // [1, 2, 3]

// let pGroupTwo = pGroupOne.add(4); // [1, 2, 3, 4]
// let pGroupThree = pGroupOne.delete(3); // [1, 2]

// console.log(pGroupOne.items); // [1, 2, 3] // pGroupOne isn't destroyed.
// console.log(pGroupTwo.items, pGroupThree.items);
