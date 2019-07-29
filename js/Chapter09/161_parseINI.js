function parseINI(string) {
  let result = {};
  let section = result;

  string.split(/\r?\n/).forEach(line => {
    let match;
    if ((match = line.match(/^(\w+)=(.*)$/))) {
      section[match[1]] = match[2];
    } else if ((match = line.match(/^\[(.*)\]$/))) {
      // "section" will no longer refer to result whole object, but the new object with ~
      // ~ current section's property name.
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error(`Line ${line} is invalid`);
    }
  });

  return result;
}

let str = `name=Vasilis
[address]
city=Oklahoma`;
console.log(parseINI(str));
