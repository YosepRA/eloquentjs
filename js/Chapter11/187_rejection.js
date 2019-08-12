/* This promise will raise a rejection,
The first "then" won't be evaluated because the promise doesn't return either a resolve, a value, or a new promise
Due to the rejection, "catch" will handle the promise and providing it with "reason" of the rejection
"catch" returns a new promise with a value assigned to it and thus the next "then" method gets triggered. */
new Promise((_, reject) => reject(new Error('Fail')))
  .then(value => console.log(`Handler 1: ${value}`))
  .catch(reason => {
    console.log(`Caught failure: ${reason}`);
    return 'nothing';
  })
  .then(value => console.log(`Handler 2: ${value}`));
