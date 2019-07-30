// It expects an array of [from, to]s.
exports.buildGraph = function(edges) {
  let graph = Object.create(null);

  for (const [from, to] of edges) {
    addEdge(from, to);
    addEdge(to, from);
  }

  return graph;

  function addEdge(from, to) {
    if (!graph[from]) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
};
