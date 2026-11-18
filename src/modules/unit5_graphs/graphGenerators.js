// Unit 5: Graph Algorithms & Minimum Spanning Trees

export const UNIT5_GRAPHS = {
  // Dijkstra's Shortest Path
  dijkstra: {
    name: "Dijkstra's Shortest Path Algorithm",
    time: 'O((V + E) log V)',
    space: 'O(V)',
    pseudocode: [
      'dist[source] = 0; dist[all others] = infinity',
      'pq.insert(source, 0)',
      'while pq is not empty:',
      '  u = pq.extractMin()',
      '  for each neighbor v of u with edge weight w:',
      '    if dist[u] + w < dist[v]: dist[v] = dist[u] + w; pq.decreaseKey(v, dist[v])'
    ],
    *generate(graphData, startNode = 'A', S) {
      const graph = graphData || {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          { u: 'A', v: 'B', w: 4 },
          { u: 'A', v: 'C', w: 2 },
          { u: 'B', v: 'C', w: 1 },
          { u: 'B', v: 'D', w: 5 },
          { u: 'C', v: 'D', w: 8 },
          { u: 'C', v: 'E', w: 10 },
          { u: 'D', v: 'E', w: 2 }
        ]
      };

      const dist = {};
      const visited = new Set();
      graph.nodes.forEach(n => (dist[n] = Infinity));
      dist[startNode] = 0;

      yield S(`Initialized Dijkstra: source node ${startNode} dist = 0, all other nodes dist = ∞.`, 0, [startNode], 'none', {
        graph, dist: { ...dist }, visited: []
      });

      while (visited.size < graph.nodes.length) {
        // Pick unvisited node with smallest distance
        let u = null;
        let minDist = Infinity;
        for (const n of graph.nodes) {
          if (!visited.has(n) && dist[n] < minDist) {
            minDist = dist[n];
            u = n;
          }
        }

        if (!u || minDist === Infinity) break;
        visited.add(u);

        yield S(`Extract min: Node ${u} with current shortest distance = ${dist[u]}. Marking as finalized.`, 3, [u], 'swap', {
          graph, dist: { ...dist }, visited: Array.from(visited), activeNode: u
        });

        // Relax neighbors
        for (const edge of graph.edges) {
          let neighbor = null;
          if (edge.u === u) neighbor = edge.v;
          else if (edge.v === u) neighbor = edge.u;

          if (neighbor && !visited.has(neighbor)) {
            const newDist = dist[u] + edge.w;
            yield S(`Inspect neighbor ${neighbor} via edge weight ${edge.w}: Is (${dist[u]} + ${edge.w} = ${newDist}) < ${dist[neighbor]}?`, 5, [u, neighbor], 'cmp', {
              graph, dist: { ...dist }, visited: Array.from(visited), activeEdge: edge
            });

            if (newDist < dist[neighbor]) {
              dist[neighbor] = newDist;
              yield S(`Relaxed distance to node ${neighbor}: updated to ${newDist}!`, 5, [neighbor], 'swap', {
                graph, dist: { ...dist }, visited: Array.from(visited)
              });
            }
          }
        }
      }

      yield S(`Dijkstra complete! Shortest paths from ${startNode}: ${Object.entries(dist).map(([k, v]) => `${k}:${v}`).join(', ')}.`, 0, [], 'none', {
        graph, dist, visited: Array.from(visited)
      });
    }
  },

  // Kruskal's Minimum Spanning Tree
  kruskal: {
    name: "Kruskal's Algorithm (MST with Disjoint Set Union)",
    time: 'O(E log E)',
    space: 'O(V)',
    pseudocode: [
      'sort edges by weight ascending',
      'initialize DSU: each vertex is its own parent',
      'for edge (u, v, w) in sorted_edges:',
      '  if find(u) != find(v):',
      '    union(u, v); mst.add(edge)',
      '    if mst.size == V - 1: break'
    ],
    *generate(graphData, S) {
      if (typeof graphData === 'function') {
        S = graphData;
        graphData = null;
      }
      const edges = [
        { u: 'A', v: 'B', w: 1 },
        { u: 'B', v: 'C', w: 2 },
        { u: 'A', v: 'C', w: 4 },
        { u: 'C', v: 'D', w: 3 },
        { u: 'B', v: 'D', w: 5 }
      ];
      const sortedEdges = [...edges].sort((a, b) => a.w - b.w);
      const parent = { A: 'A', B: 'B', C: 'C', D: 'D' };

      function find(x) {
        if (parent[x] === x) return x;
        return (parent[x] = find(parent[x]));
      }

      function union(x, y) {
        parent[find(x)] = find(y);
      }

      const mstEdges = [];
      let totalCost = 0;

      yield S(`Kruskal's Algorithm: sorted all edges by weight: [${sortedEdges.map(e => `${e.u}-${e.v}(${e.w})`).join(', ')}].`, 0, [], 'none', {
        edges: sortedEdges, mstEdges: [], parent: { ...parent }
      });

      for (const e of sortedEdges) {
        yield S(`Inspect edge ${e.u} — ${e.v} (weight ${e.w}). Check if they belong to different DSU components.`, 2, [e.u, e.v], 'cmp', {
          edges: sortedEdges, activeEdge: e, mstEdges: [...mstEdges], parent: { ...parent }
        });

        const rootU = find(e.u);
        const rootV = find(e.v);

        if (rootU !== rootV) {
          union(e.u, e.v);
          mstEdges.push(e);
          totalCost += e.w;
          yield S(`find(${e.u}) ≠ find(${e.v}): No cycle created! Added edge ${e.u}-${e.v} (weight ${e.w}) to MST. Current weight = ${totalCost}.`, 4, [e.u, e.v], 'swap', {
            edges: sortedEdges, activeEdge: e, mstEdges: [...mstEdges], parent: { ...parent }
          });
        } else {
          yield S(`find(${e.u}) == find(${e.v}): Edge ${e.u}-${e.v} creates a cycle! Discarded.`, 3, [e.u, e.v], 'none', {
            edges: sortedEdges, activeEdge: e, mstEdges: [...mstEdges], parent: { ...parent }
          });
        }
      }

      yield S(`Kruskal's MST finalized! Total Minimum Spanning Tree weight = ${totalCost}.`, 5, [], 'none', {
        edges: sortedEdges, mstEdges, totalCost
      });
    }
  },

  // Cycle Detection / Bipartite Graph
  bipartiteCheck: {
    name: 'Bipartite Graph Check (2-Coloring via BFS)',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'color[all] = -1',
      'queue = [startNode]; color[startNode] = 0',
      'while queue is not empty:',
      '  u = queue.dequeue()',
      '  for v in adj[u]:',
      '    if color[v] == -1: color[v] = 1 - color[u]; enqueue(v)',
      '    else if color[v] == color[u]: return FALSE (Odd cycle found)'
    ],
    *generate(dummy, S) {
      if (typeof dummy === 'function') {
        S = dummy;
      }
      const nodes = ['0', '1', '2', '3'];
      const adj = {
        '0': ['1', '3'],
        '1': ['0', '2'],
        '2': ['1', '3'],
        '3': ['0', '2']
      };

      const color = { '0': -1, '1': -1, '2': -1, '3': -1 };
      const queue = ['0'];
      color['0'] = 0; // 0 = Blue, 1 = Red

      yield S(`Bipartite Graph Check: attempting to 2-color graph such that no two adjacent vertices share the same color.`, 0, ['0'], 'none', { color: { ...color } });

      while (queue.length > 0) {
        const u = queue.shift();
        const uColor = color[u] === 0 ? 'Blue' : 'Red';

        for (const v of adj[u]) {
          if (color[v] === -1) {
            color[v] = 1 - color[u];
            queue.push(v);
            const vColor = color[v] === 0 ? 'Blue' : 'Red';
            yield S(`Assigned opposite color (${vColor}) to neighbor node ${v}.`, 5, [u, v], 'swap', {
              color: { ...color }, activeNodes: [u, v]
            });
          } else if (color[v] === color[u]) {
            yield S(`Conflict found! Neighbors ${u} and ${v} share identical color (${uColor}). Graph is NOT Bipartite!`, 6, [u, v], 'cmp', {
              color: { ...color }, isBipartite: false
            });
            return;
          }
        }
      }

      yield S(`Valid 2-coloring verified! Graph is BIPARTITE (Contains no odd-length cycles).`, 0, [], 'none', {
        color: { ...color }, isBipartite: true
      });
    }
  }
};
