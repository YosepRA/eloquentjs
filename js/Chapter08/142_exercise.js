// RETRY
class MultiplicatorUnitFailure extends Error {}

function multiply(x, y) {
  let random = Math.floor(Math.random() * 10 + 1);
  // This will give 20% success call.
  if ([1, 2].includes(random)) {
    return x * y;
  } else {
    throw new MultiplicatorUnitFailure('Invalid Unit');
  }
}

function reliableMultiplier(x, y) {
  while (true) {
    console.log('looping');
    try {
      return multiply(x, y);
    } catch (err) {
      if (!(err instanceof MultiplicatorUnitFailure)) {
        throw err;
      }
    }
  }
}

// console.log(reliableMultiplier(2, 2));

/* ======================================================================================== */

// THE LOCKED BOX
const box = {
  locked: true,
  unlock() {
    this.locked = false;
  },
  lock() {
    this.locked = true;
  },
  _content: [],
  get content() {
    if (this.locked) throw new Error('Locked!');
    return this._content;
  }
};

function withBoxUnlocked(cb) {
  box.unlock();
  try {
    let contents = box.content;
    if (contents) {
      box._content = cb(box.content);
    }
    console.log('Finished: ', box.content); // [1, 2, 3]
  } catch (err) {
    console.log(err);
  } finally {
    // "finally" will always run no matter if "try" block raise an exception or not.
    box.lock();
    console.log(box.locked);
  }
}

// withBoxUnlocked(content => content.concat([1, 2, 3]));
