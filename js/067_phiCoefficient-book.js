const journal = require('./data/journal');

// To compute the phi coefficient value.
function phi(table) {
  return (
    (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt(
      (table[3] + table[2]) * (table[0] + table[1]) * (table[3] + table[1]) * (table[0] + table[2])
    )
  );
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

function journalEvents(journal) {
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

console.log(journalEvents(journal));
