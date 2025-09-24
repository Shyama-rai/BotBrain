const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Example graph and locations (can be replaced with real data)
const graph = {
    'main-gate': [{ node: 'admin', distance: 180 }],
    'admin': [
        { node: 'main-gate', distance: 180 },
        { node: 'library', distance: 80 },
        { node: 'connecting-point', distance: 80 }
    ],
    'library': [{ node: 'admin', distance: 80 }],
    'connecting-point': [
        { node: 'admin', distance: 80 },
        { node: 'ac-block-a', distance: 60 },
        { node: 'ac-block-c', distance: 60 },
        { node: 'ac-block-b', distance: 60 }
    ],
    'ac-block-a': [{ node: 'connecting-point', distance: 60 }],
    'ac-block-c': [{ node: 'connecting-point', distance: 60 }],
    'ac-block-b': [
        { node: 'connecting-point', distance: 60 },
        { node: 'food-court', distance: 200 }
    ],
    'laundry': [
        { node: 'food-court', distance: 30 },
        { node: 'hostel-1', distance: 260 }
    ],
    'food-court': [
        { node: 'ac-block-b', distance: 200 },
        { node: 'laundry', distance: 30 },
        { node: 'sports-arena', distance: 280 }
    ],
    'hostel-1': [
        { node: 'laundry', distance: 260 },
        { node: 'sports-arena', distance: 500 }
    ],
    'sports-arena': [
        { node: 'food-court', distance: 280 },
        { node: 'hostel-1', distance: 500 },
        { node: 'volleyball-court', distance: 485 },
        { node: 'cricket-ground', distance: 485 }
    ],
    'volleyball-court': [{ node: 'sports-arena', distance: 485 }],
    'cricket-ground': [{ node: 'sports-arena', distance: 485 }]
};

// Simple Dijkstra implementation for backend
function dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const priorityQueue = [];
    for (const node in graph) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
    }
    priorityQueue.push({ node: start, distance: 0 });
    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { node: currentNode } = priorityQueue.shift();
        if (visited.has(currentNode)) continue;
        visited.add(currentNode);
        if (currentNode === end) break;
        if (graph[currentNode]) {
            for (const neighbor of graph[currentNode]) {
                const { node: neighborNode, distance: edgeDistance } = neighbor;
                const newDistance = distances[currentNode] + edgeDistance;
                if (newDistance < distances[neighborNode]) {
                    distances[neighborNode] = newDistance;
                    previous[neighborNode] = currentNode;
                    priorityQueue.push({ node: neighborNode, distance: newDistance });
                }
            }
        }
    }
    const path = [];
    let currentNode = end;
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = previous[currentNode];
    }
    return {
        path: path.length > 1 ? path : [],
        distance: distances[end] === Infinity ? 0 : distances[end]
    };
}

app.post('/api/pathfind', (req, res) => {
    const { start, end } = req.body;
    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end locations required.' });
    }
    const result = dijkstra(start, end);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
