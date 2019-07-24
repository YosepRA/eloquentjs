// Creating special class for specific error to raise and catch.
class InputError extends Error {}

function promptDirection(question) {
  let direction = prompt(question);
  if (direction.toLowerCase() === 'left') return 'L';
  if (direction.toLowerCase() === 'right') return 'R';

  // This will raise an exception, stops all calls in the stack ~
  // ~ and go to a code which can handle the exception.
  throw new InputError(`Invalid direction: ${direction}`);
}

function look() {
  let result = promptDirection('Which way?');
  if (result === 'R') {
    return 'a house.';
  } else {
    return 'two angry bears.';
  }
}
// We can make custom exception handler with "try-catch block".
// If we're aiming for specific error (in this case an input error), then we can create a class ~
// ~ inheriting Error Object and check it with "instanceof" to differentiate between our specific ~
// ~ error and any other possible errors. The purpose is to avoid giving wrong message when we're ~
// ~ expecting a specific error.
try {
  console.log('You see ' + look());
} catch (err) {
  if (err instanceof InputError) {
    console.log('InputError: ' + err);
  } else {
    throw err;
  }
}

let accounts = {
  a: 30,
  b: 20,
  c: 50
};

function getAccount() {
  let account = prompt('Account name?');
  if (!Object.keys(accounts).includes(account)) {
    throw new Error("Account doesn't exist!");
  }
  return account;
}

function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
    accounts[from] -= amount;
    progress = 1;
    accounts[getAccount()] += amount;
    progress = 2;
  } finally {
    if (progress == 1) {
      accounts[from] += amount;
    }
  }
}

// transfer from a to b with amount of 10.
// transfer(getAccount(), 10);
