/* ==================================================================================== */

// PARSER

function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  if ((match = /^["']([^"]*)["']/.exec(program))) {
    // String value.
    expr = { type: 'value', value: match[1] };
  } else if ((match = /^\d+\b/.exec(program))) {
    // Number value.
    expr = { type: 'value', value: Number(match[0]) };
  } else if ((match = /^[^\s(),"]+/.exec(program))) {
    // Identifiers.
    expr = { type: 'word', name: match[0] };
  } else {
    throw new SyntaxError('Unexpected syntax: ' + program);
  }
  // Return the parsed object and the remainder of the program.
  return parseApply(expr, program.slice(match[0].length));
}
// Removing whitespaces from the start of a program.
function skipSpace(string) {
  let skippable = string.match(/^(\s|#.*)*/);
  return string.slice(skippable[0].length);
}

function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] !== '(') {
    return { expr: expr, rest: program };
  }
  // If it's an application.
  program = skipSpace(program.slice(1));
  expr = {
    type: 'apply',
    operator: expr,
    args: []
  };
  // Parsing the arguments.
  while (program[0] !== ')') {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] === ',') {
      program = skipSpace(program.slice(1));
    } else if (program[0] !== ')') {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  // At this point, application's arguments have been parsed and the parsing will be continued ~
  // ~ to the next expression.
  return parseApply(expr, program.slice(1));
}

function parse(program) {
  let { expr, rest } = parseExpression(program);
  // Egg programs is just a single huge expression. Anything more will be regarded as an error.
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError('Unexpected text after program');
  }
  return expr;
}

// console.log(parse(`if(<(x, 20),print('Smaller'),print('Larger'))`));

/* ==================================================================================== */

// EVALUATOR - 207

const specialForms = Object.create(null);

function evaluate(expr, scope) {
  if (expr.type === 'value') {
    return expr.value;
  } else if (expr.type === 'word') {
    if (expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError('Undefined binding: ' + expr.name);
    }
  } else if (expr.type === 'apply') {
    let { operator, args } = expr;
    if (operator.type === 'word' && operator.name in specialForms) {
      return specialForms[operator.name](expr.args, scope);
    } else {
      let op = evaluate(operator, scope);
      if (typeof op === 'function') {
        // Parsing arguments value and calling the function.
        return op(...args.map(arg => evaluate(arg, scope)));
      } else {
        throw new TypeError('Applying a non-function');
      }
    }
  }
}

/* ==================================================================================== */

// SPECIAL FORMS - 208

// IF
// Three arguments, 0 = condition, 1 = true, 2 = false.
specialForms.if = (args, scope) => {
  if (args.length !== 3) {
    throw new SyntaxError('Wrong number of arguments to if');
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};
// WHILE
// Two arguments, 0 = condition, 1 = do
specialForms.while = (args, scope) => {
  if (args.length !== 2) {
    throw new SyntaxError('Wrong number of arguments to while');
  }
  while (evaluate(args[0], scope)) {
    evaluate(args[1], scope);
  }
  // Since "undefined" value isn't available in Egg, we return "false" ~
  // ~ to indicate a function which doesn't produce a meaningful value.
  return false;
};
// DO
// Executes all arguments and returns a value produced by the last argument.
specialForms.do = (args, scope) => {
  let value = false;
  for (const arg of args) {
    value = evaluate(arg, scope);
  }
  return value;
};
// DEFINE
// Assignment expression.
// 0 = word, 1 = expression that produces value.
specialForms.define = (args, scope) => {
  if (args.length !== 2 || args[0].type !== 'word') {
    throw new SyntaxError('Incorrect use of define');
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};

/* ==================================================================================== */

// THE ENVIRONMENT - 210

// Defining global scope.
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
for (const op of ['+', '-', '*', '/', '==', '<', '>']) {
  topScope[op] = Function('a, b', `return a ${op} b`);
}
topScope.print = value => {
  console.log(value);
  return value;
};
// Running program with a clean scope.
function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}

// run(`
// do(define(total, 0),
//    define(count, 1),
//    while(<(count, 11),
//          do(define(total, +(total, count)),
//             define(count, +(count, 1)))),
//    print(total))
// `);
// → 55

/* ==================================================================================== */

// FUNCTION - 211

// Function expression.
// Accepts any number of parameters, and the last parameter is the function's body.
specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError('Functions need body');
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type !== 'word') {
      throw new SyntaxError('Parameters must be a word');
    }
    return expr.name;
  });
  return function() {
    if (arguments.length !== params.length) {
      throw new SyntaxError('Wrong number of arguments');
    }
    let localScope = Object.create(scope);
    // Adding arguments to the scope.
    for (let i = 0; i < arguments.length; i++) {
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope);
  };
};

// run(`
// do(define(plusOne, fun(a, +(a, 1))),
//    print(plusOne(10)))
// `);
// // → 11
// run(`
// do(define(pow, fun(base, exp,
//                    if(==(exp, 0),
//                       1,
//                       *(base, pow(base, -(exp, 1)))))),
//    print(pow(2, 10)))
// `);
// // → 1024

/* ==================================================================================== */

// EXERCISE - 214

// ARRAY
topScope.array = (...values) => values;
topScope.length = array => array.length;
topScope.element = (array, n) => array[n];
// run(`
// do(define(x, array(1,2,3)),
//    print(element(x, 0)))`);
// run(`
// do(define(sum, fun(array,
//      do(define(i, 0),
//         define(sum, 0),
//         while(<(i, length(array)),
//           do(define(sum, +(sum, element(array, i))),
//              define(i, +(i, 1)))),
//         sum))),
//    print(sum(array(1, 2, 3))))
// `);
// // → 6

// COMMENTS
// console.log(parse('# hello\nx'));
// // → {type: "word", name: "x"}

// console.log(parse('a # one\n #asdasd\n   # two\n()'));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}

// CLOSURE
// run(`
// do(define(f, fun(a, fun(b, +(a, b)))),
// print(f(4)(5)))
// `);
// → 9

// FIXING SCOPE
specialForms.set = (args, scope) => {
  if (args.length !== 2 || args[0].type !== 'word') {
    throw new SyntaxError('Incorrect usage of SET');
  }
  function findScope(name, scope) {
    if (!scope) throw new ReferenceError(`Undefined binding: '${name}'`);
    else if (!Object.prototype.hasOwnProperty.call(scope, name)) {
      scope = findScope(name, Object.getPrototypeOf(scope));
    }
    return scope;
  }
  let value = evaluate(args[1], scope);
  scope = findScope(args[0].name, scope);
  scope[args[0].name] = value;
  return value;
};

// run(`
//   do(define(x, 10),
//      define(addByTen, fun(set(x, 20))),
//      print(x),
//      print(addByTen()),
//      print(x))
// `);
// run(`
// do(define(x, 4),
//    define(setx, fun(val, set(x, val))),
//    setx(50),
//    print(x))
// `);
// // → 50
// run(`set(quux, true)`);
// // → Some kind of ReferenceError
