const journal = require('./data/journal');

// Main Function
function findSolution(journal, highAndLowEvents) {
  let eventHigh = highAndLowEvents.highest.event,
    eventLow = highAndLowEvents.lowest.event,
    combinedEvent = `${eventHigh} ${eventLow}`;
  for (const entry of journal) {
    if (entry.events.includes(eventHigh) && !entry.events.includes(eventLow)) {
      entry.events.push(combinedEvent);
    }
  }

  return phi(tableFor(combinedEvent, journal));
}

function findEventsPhi(journal) {
  // Get the list of all events.
  let events = listAllEvents(journal);
  // Structure
  // [{event: 'carrots', phiCoefficient: 0.00...}];
  let result = [];
  // Calculate phi coefficient for each event.
  for (const event of events) {
    let table = tableFor(event, journal);
    let phiCoefficient = phi(table);

    result.push({ event, phiCoefficient });
  }

  return result;
}

// To find the highest and lowest value of resulting phi coefficient calculation.
function highestAndLowestPhi(eventsPhi) {
  let phis = [];
  let result = {};
  let highest, lowest;

  for (const eventPhi of eventsPhi) {
    const phiCoefficient = eventPhi.phiCoefficient;
    phis.push(phiCoefficient);
  }
  highest = Math.max(...phis);
  lowest = Math.min(...phis);

  for (const eventPhi of eventsPhi) {
    const phiCoefficient = eventPhi.phiCoefficient;
    if (phiCoefficient === highest) {
      result.highest = eventPhi;
    } else if (phiCoefficient === lowest) {
      result.lowest = eventPhi;
    }
  }

  return result;
}

// To compute the phi coefficient value.
function phi([n00, n01, n10, n11]) {
  return (n11 * n00 - n10 * n01) / Math.sqrt((n11 + n10) * (n00 + n01) * (n11 + n01) * (n00 + n10));
}

// To create table for computing phi coefficient.
function tableFor(event, journal) {
  // [n00, n01, n10, n11]
  // Index position based on 2 bits binary value.
  let data = [0, 0, 0, 0];

  for (const entry of journal) {
    let index = 0;
    if (entry.events.includes(event)) {
      index++;
    }
    if (entry.squirrel) {
      index += 2;
    }
    data[index]++;
  }

  return data;
}

function listAllEvents(journal) {
  let events = [];

  for (const entry of journal) {
    for (const event of entry.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }
  }

  return events;
}

let eventsPhi = findEventsPhi(journal);
let highAndLowEvents = highestAndLowestPhi(eventsPhi);

// console.log(findSolution(journal, highAndLowEvents));
console.log(highAndLowEvents);
