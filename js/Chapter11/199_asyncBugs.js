function anyStorage(nest, target, name) {
  if (nest.name === target) return storage(nest, name);
  else return routeRequest(nest, target, 'storage', name);
}

// Enumerating through nests to list out the number of chicks in every village.
// The code below will be problematic because there will be asynchronous gaps inbetween exectution.
// The binding state will be the old value instead of an updated one for every iteration.
async function chicks(nest, year) {
  let list = '';
  await Promise.all(
    network(nest).map(async n => {
      // map will run first and assign list with initial value which is an empty string.
      // and it will be applied to every elements of the array.
      list += `${n}: ${await anyStorage(nest, n, `chicks at ${year}`)}\n`;
    })
  );
  // In the end, the list value will be the result of the slowest respond and will always resulting in a single ~
  // ~ line value instead of a list.
  return list;
}

// Below is how to avoid the precedent "chicks" function.
async function chicks(nest, year) {
  // Building up an array of lines.
  let lines = network(nest).map(async n => {
    return `${name}: ${await anyStorage(nest, n, `chicks at ${year}`)}`;
  });
  // Make a promise and join the resulting array(if sucessfully resolved) into a string.
  return await Promise.all(lines).join('\n');
}
