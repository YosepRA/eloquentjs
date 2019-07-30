const { roadGraph } = require('./modules/roadGraph');

// const mailRoute = [
//   "Alice's House",
//   'Cabin',
//   "Alice's House",
//   "Bob's House",
//   'Town Hall',
//   "Daria's House",
//   "Ernie's House",
//   "Grete's House",
//   'Shop',
//   "Grete's House",
//   'Farm',
//   'Marketplace',
//   'Post Office'
// ];

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
      console.log(`Done in ${turn} turns`);
      return turn;
    }
    // Generate next move.
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);

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
// function randomRobot(state) {
//   return { direction: randomPick(roadGraph[state.place]) };
// }
// function routeRobot(state, memory) {
//   if (memory.length === 0) {
//     memory = mailRoute;
//   }
//   return { direction: memory[0], memory: memory.slice(1) };
// }
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
// function lazyRobot({ place, parcels }, route) {
//   if (route.length === 0) {
//     let routes = parcels.map(parcel => {
//       if (parcel.place !== place) {
//         return { route: findRoute(roadGraph, place, parcel.place), pickUp: true };
//       } else {
//         return { route: findRoute(roadGraph, place, parcel.address), pickUp: false };
//       }
//     });

//     // Choosing which route to pick by scoring each of it.
//     route = routes.reduce((a, b) => (scores(a) > scores(b) ? a : b)).route;
//   }
//   // If there is still place(s) to go in route array. then keep going.
//   return { direction: route[0], memory: route.slice(1) };

//   // Scoring each parcel's route. Parcels that needs to be picked up OR ~
//   // ~ the shorter route's length will yield the better score.
//   function scores({ route, pickUp }) {
//     return (pickUp ? 0.5 : 0) - route.length;
//   }
// }

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

console.log(runRobot(VillageState.random(), goalOrientedRobot, []));
