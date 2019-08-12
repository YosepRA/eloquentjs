const { defineRequestType } = require('./crow-tech');

// Designing a request system to expect a potential tranmission errors.
/* In this case, we will retry sending a request if the prior request(s) hasn't got any response within a period 
of time and give up by throwing a "Timeout" error after sending requests for a few time. */
// This will either resolve or reject the promise or will get timed out.
class Timeout extends Error {}

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      /* This is a convention where the response handler's first parameter to be an "error" (if any) and the second
      one will be the actual value if it succeeds. */
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      // Set a timeout for probable RTO.
      setTimeout(() => {
        if (done) return;
        if (n < 3) attempt(n + 1);
        else reject(new Timeout('Request Timed Out'));
      }, 250);
    }
    attempt(1);
  });
}

// Wrapped function for defining new request type.
/* With this structure, we can provide a more precise error routing. So any expected error will be directed 
towards the proper handler. */
function requestType(name, handler) {
  // "callback" will be called once either the response or failure occur.
  defineRequestType(name, (nest, content, source, callback) => {
    try {
      /* "handler" will handle certain type of request and will either resolve or reject a promise depending
      on handler's process result. */
      /* This is using a convention where the first argument given to callback to be an error value and the
      second to be a success value. */
      /* Note that if the handler doesn't throw any error, the first argument given to callback must be filled
      with a falsey(null) value regardless. And if an exception is thrown, we can omit the second argument.
      Just like the usual JS function flow. */
      Promise.resolve(handler(nest, content, source))
        .then(response => callback(null, response))
        .catch(err => callback(err));
    } catch (err) {
      callback(err);
    }
  });
}

exports.request = request;
exports.requestType = requestType;
