    // ...existing code...
    // Add a property to hold the worker instance
    pathWorker = null;
class CampusNavigator {
    constructor() {
        this.graph = {};
        this.locations = {};
        this.currentPath = [];
        this.initializeGraph();
        this.initializeEventListeners();
        this.initializeAlgorithmInfo();
    }

    initializeGraph() {
        // Define locations with coordinates for heuristic calculations
        this.locations = {
            'main-gate': { name: 'Main Gate', x: 400, y: 80 },
            'admin': { name: 'Admin Building', x: 400, y: 200 },
            'library': { name: 'Library', x: 550, y: 200 },
            'connecting-point': { name: 'Connecting Point', x: 400, y: 320 },
            'ac-block-a': { name: 'AC Block A', x: 250, y: 320 },
            'ac-block-b': { name: 'AC Block B', x: 400, y: 480 },
            'ac-block-c': { name: 'AC Block C', x: 550, y: 320 },
            'laundry': { name: 'Laundry', x: 300, y: 620 },
            'food-court': { name: 'Food Court', x: 400, y: 650 },
            'hostel-1': { name: 'Hostel 1', x: 150, y: 750 },
            'sports-arena': { name: 'Sports Arena', x: 400, y: 800 },
            'volleyball-court': { name: 'Volleyball Court', x: 250, y: 920 },
            'cricket-ground': { name: 'Cricket Ground', x: 550, y: 920 }
        };

        // Initialize graph with connections based on the campus map
        this.graph = {
            'main-gate': [
                { node: 'admin', distance: 180 }
            ],
            'admin': [
                { node: 'main-gate', distance: 180 },
                { node: 'library', distance: 80 },
                { node: 'connecting-point', distance: 80 }
            ],
            'library': [
                { node: 'admin', distance: 80 }
            ],
            'connecting-point': [
                { node: 'admin', distance: 80 },
                { node: 'ac-block-a', distance: 60 },
                { node: 'ac-block-c', distance: 60 },
                { node: 'ac-block-b', distance: 60 }
            ],
            'ac-block-a': [
                { node: 'connecting-point', distance: 60 }
            ],
            'ac-block-c': [
                { node: 'connecting-point', distance: 60 }
            ],
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
            'volleyball-court': [
                { node: 'sports-arena', distance: 485 }
            ],
            'cricket-ground': [
                { node: 'sports-arena', distance: 485 }
            ]
        };
    }

    initializeEventListeners() {
        const findPathBtn = document.getElementById('findPathBtn');
        const clearPathBtn = document.getElementById('clearPathBtn');
        const algorithmSelect = document.getElementById('algorithm');
        const startSelect = document.getElementById('startLocation');
        const endSelect = document.getElementById('endLocation');

        findPathBtn.addEventListener('click', () => this.findPath());
        clearPathBtn.addEventListener('click', () => this.clearPath());
        algorithmSelect.addEventListener('change', () => this.updateAlgorithmInfo());
        
        // Add visual feedback for location selection
        startSelect.addEventListener('change', () => this.updateLocationHighlight());
        endSelect.addEventListener('change', () => this.updateLocationHighlight());

        // Initial algorithm info update
        this.updateAlgorithmInfo();
    }

    initializeAlgorithmInfo() {
        this.algorithmDetails = {
            'dijkstra': {
                name: "Dijkstra's Algorithm",
                description: "Finds the shortest path between nodes in a weighted graph. Guarantees optimal solution.",
                complexity: "Time: O((V + E) log V), Space: O(V)",
                advantages: ["Guarantees shortest path", "Works with weighted graphs", "Widely used and reliable"],
                disadvantages: ["Slower than A* for single target", "Explores many unnecessary nodes"]
            },
            'astar': {
                name: "A* Search Algorithm",
                description: "Uses heuristics to guide the search towards the goal. Combines Dijkstra's accuracy with greedy best-first speed.",
                complexity: "Time: O(b^d), Space: O(b^d) where b is branching factor, d is depth",
                advantages: ["Optimal and efficient", "Uses heuristic to reduce search space", "Fast for single target searches"],
                disadvantages: ["Requires good heuristic function", "May use more memory"]
            },
            'bfs': {
                name: "Breadth-First Search",
                description: "Explores all neighbors at the current depth before moving to next depth level. Guarantees shortest path in unweighted graphs.",
                complexity: "Time: O(V + E), Space: O(V)",
                advantages: ["Guarantees shortest path (unweighted)", "Simple to implement", "Good for exploring nearby solutions"],
                disadvantages: ["Doesn't consider edge weights", "May be inefficient for weighted graphs"]
            },
            'dfs': {
                name: "Depth-First Search",
                description: "Explores as far as possible along each branch before backtracking. Does not guarantee shortest path.",
                complexity: "Time: O(V + E), Space: O(V)",
                advantages: ["Memory efficient", "Good for exploring deep solutions", "Simple implementation"],
                disadvantages: ["No shortest path guarantee", "May get stuck in long paths", "Not optimal for pathfinding"]
            }
        };
    }

    updateAlgorithmInfo() {
        const algorithmSelect = document.getElementById('algorithm');
        const algorithmDetails = document.getElementById('algorithmDetails');
        const selectedAlgorithm = algorithmSelect.value;
        const info = this.algorithmDetails[selectedAlgorithm];

        if (info) {
            algorithmDetails.innerHTML = `
                <h4>${info.name}</h4>
                <p><strong>Description:</strong> ${info.description}</p>
                <p><strong>Complexity:</strong> ${info.complexity}</p>
                <div>
                    <strong>Advantages:</strong>
                    <ul>
                        ${info.advantages.map(adv => `<li>${adv}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <strong>Disadvantages:</strong>
                    <ul>
                        ${info.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    updateLocationHighlight() {
        const startLocation = document.getElementById('startLocation').value;
        const endLocation = document.getElementById('endLocation').value;

        // Clear all highlights
        document.querySelectorAll('.node').forEach(node => {
            node.classList.remove('start', 'end', 'selected');
        });

        // Highlight start location
        if (startLocation) {
            const startNode = document.getElementById(`node-${startLocation}`);
            if (startNode) startNode.classList.add('start');
        }

        // Highlight end location
        if (endLocation) {
            const endNode = document.getElementById(`node-${endLocation}`);
            if (endNode) endNode.classList.add('end');
        }
    }

    async findPath() {
        const startLocation = document.getElementById('startLocation').value;
        const endLocation = document.getElementById('endLocation').value;
        const algorithm = document.getElementById('algorithm').value;
        const findPathBtn = document.getElementById('findPathBtn');

        if (!startLocation || !endLocation) {
            alert('Please select both start and end locations.');
            return;
        }

        if (startLocation === endLocation) {
            alert('Start and end locations cannot be the same.');
            return;
        }

        // Show loading state
        findPathBtn.disabled = true;
        findPathBtn.innerHTML = '<span class="loading"></span> Finding Path...';

        // Always create a new worker for each request
        if (this.pathWorker) {
            this.pathWorker.terminate();
            this.pathWorker = null;
        }
        this.pathWorker = new Worker('pathWorker.js');

        const startTime = performance.now();
        let finished = false;
        const timeout = setTimeout(() => {
            if (!finished) {
                finished = true;
                this.pathWorker.terminate();
                this.pathWorker = null;
                findPathBtn.disabled = false;
                findPathBtn.innerHTML = '<span class="btn-icon">🔍</span> Find Best Path';
                alert('Pathfinding took too long. Please try a different set of locations or algorithm.');
            }
        }, 2000); // 2 seconds timeout

        this.pathWorker.onmessage = (e) => {
            if (finished) return;
            finished = true;
            clearTimeout(timeout);
            const result = e.data;
            const endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);
            if (result.path.length > 0) {
                this.displayPath(result.path);
                this.showResults({
                    algorithm: this.algorithmDetails[algorithm].name,
                    distance: result.distance,
                    steps: result.path.length - 1,
                    path: result.path,
                    time: executionTime
                });
            } else {
                alert('No path found between the selected locations.');
            }
            findPathBtn.disabled = false;
            findPathBtn.innerHTML = '<span class="btn-icon">🔍</span> Find Best Path';
            this.pathWorker.terminate();
            this.pathWorker = null;
        };
        this.pathWorker.onerror = (error) => {
            if (finished) return;
            finished = true;
            clearTimeout(timeout);
            console.error('Error finding path:', error);
            alert('An error occurred while finding the path. Please try again.');
            findPathBtn.disabled = false;
            findPathBtn.innerHTML = '<span class="btn-icon">🔍</span> Find Best Path';
            this.pathWorker.terminate();
            this.pathWorker = null;
        };
        this.pathWorker.postMessage({
            graph: this.graph,
            locations: this.locations,
            start: startLocation,
            end: endLocation,
            algorithm
        });
    }

    dijkstra(start, end) {
        const distances = {};
        const previous = {};
        const visited = new Set();
        const priorityQueue = [];

        // Initialize distances
        for (const node in this.graph) {
            distances[node] = node === start ? 0 : Infinity;
            previous[node] = null;
        }

        priorityQueue.push({ node: start, distance: 0 });

        while (priorityQueue.length > 0) {
            // Sort by distance (simple priority queue implementation)
            priorityQueue.sort((a, b) => a.distance - b.distance);
            const { node: currentNode } = priorityQueue.shift();

            if (visited.has(currentNode)) continue;
            visited.add(currentNode);

            if (currentNode === end) break;

            if (this.graph[currentNode]) {
                for (const neighbor of this.graph[currentNode]) {
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

        // Reconstruct path
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

    aStar(start, end) {
        const openSet = [start];
        const cameFrom = {};
        const gScore = { [start]: 0 };
        const fScore = { [start]: this.heuristic(start, end) };

        while (openSet.length > 0) {
            // Find node with lowest fScore
            let currentNode = openSet.reduce((min, node) => 
                (fScore[node] || Infinity) < (fScore[min] || Infinity) ? node : min
            );

            if (currentNode === end) {
                // Reconstruct path
                const path = [currentNode];
                while (cameFrom[currentNode]) {
                    currentNode = cameFrom[currentNode];
                    path.unshift(currentNode);
                }
                return {
                    path,
                    distance: gScore[end]
                };
            }

            openSet.splice(openSet.indexOf(currentNode), 1);

            if (this.graph[currentNode]) {
                for (const neighbor of this.graph[currentNode]) {
                    const { node: neighborNode, distance: edgeDistance } = neighbor;
                    const tentativeGScore = gScore[currentNode] + edgeDistance;

                    if (tentativeGScore < (gScore[neighborNode] || Infinity)) {
                        cameFrom[neighborNode] = currentNode;
                        gScore[neighborNode] = tentativeGScore;
                        fScore[neighborNode] = tentativeGScore + this.heuristic(neighborNode, end);

                        if (!openSet.includes(neighborNode)) {
                            openSet.push(neighborNode);
                        }
                    }
                }
            }
        }

        return { path: [], distance: 0 };
    }

    bfs(start, end) {
        const queue = [{ node: start, path: [start], distance: 0 }];
        const visited = new Set([start]);

        while (queue.length > 0) {
            const { node: currentNode, path, distance } = queue.shift();

            if (currentNode === end) {
                return { path, distance };
            }

            if (this.graph[currentNode]) {
                for (const neighbor of this.graph[currentNode]) {
                    const { node: neighborNode, distance: edgeDistance } = neighbor;
                    
                    if (!visited.has(neighborNode)) {
                        visited.add(neighborNode);
                        queue.push({
                            node: neighborNode,
                            path: [...path, neighborNode],
                            distance: distance + edgeDistance
                        });
                    }
                }
            }
        }

        return { path: [], distance: 0 };
    }

    dfs(start, end) {
        const stack = [{ node: start, path: [start], distance: 0, visited: new Set([start]) }];

        while (stack.length > 0) {
            const { node: currentNode, path, distance, visited } = stack.pop();

            if (currentNode === end) {
                return { path, distance };
            }

            if (this.graph[currentNode]) {
                for (const neighbor of this.graph[currentNode]) {
                    const { node: neighborNode, distance: edgeDistance } = neighbor;
                    
                    if (!visited.has(neighborNode)) {
                        const newVisited = new Set(visited);
                        newVisited.add(neighborNode);
                        
                        stack.push({
                            node: neighborNode,
                            path: [...path, neighborNode],
                            distance: distance + edgeDistance,
                            visited: newVisited
                        });
                    }
                }
            }
        }

        return { path: [], distance: 0 };
    }

    heuristic(node1, node2) {
        // Euclidean distance between two points
        const loc1 = this.locations[node1];
        const loc2 = this.locations[node2];
        
        if (!loc1 || !loc2) return 0;
        
        const dx = loc1.x - loc2.x;
        const dy = loc1.y - loc2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    displayPath(path) {
        // Clear previous path highlighting
        this.clearPath();
        
        // Store current path
        this.currentPath = path;

        // Highlight path edges
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            this.highlightEdge(from, to);
        }

        // Highlight path nodes
        path.forEach((location, index) => {
            const node = document.getElementById(`node-${location}`);
            if (node) {
                if (index === 0) {
                    node.classList.add('start');
                } else if (index === path.length - 1) {
                    node.classList.add('end');
                } else {
                    node.classList.add('selected');
                }
            }
        });
    }

    highlightEdge(from, to) {
        const edges = document.querySelectorAll('.edge');
        const fromLocation = this.locations[from];
        const toLocation = this.locations[to];

        if (!fromLocation || !toLocation) return;

        // Find the edge that connects these two points
        edges.forEach(edge => {
            const x1 = parseFloat(edge.getAttribute('x1'));
            const y1 = parseFloat(edge.getAttribute('y1'));
            const x2 = parseFloat(edge.getAttribute('x2'));
            const y2 = parseFloat(edge.getAttribute('y2'));

            const isMatch = (
                (Math.abs(x1 - fromLocation.x) < 20 && Math.abs(y1 - fromLocation.y) < 20 &&
                 Math.abs(x2 - toLocation.x) < 20 && Math.abs(y2 - toLocation.y) < 20) ||
                (Math.abs(x1 - toLocation.x) < 20 && Math.abs(y1 - toLocation.y) < 20 &&
                 Math.abs(x2 - fromLocation.x) < 20 && Math.abs(y2 - fromLocation.y) < 20)
            );

            if (isMatch) {
                edge.classList.add('path');
            }
        });
    }

    clearPath() {
        // Clear path highlighting
        document.querySelectorAll('.edge').forEach(edge => {
            edge.classList.remove('path', 'highlighted');
        });

        // Clear node highlighting except start/end selections
        document.querySelectorAll('.node').forEach(node => {
            node.classList.remove('selected');
        });

        // Update location highlights based on current selection
        this.updateLocationHighlight();

        // Hide results
        const resultsPanel = document.getElementById('pathResults');
        resultsPanel.classList.add('hidden');

        // Clear stored path
        this.currentPath = [];

        // Reset Find Path button/loading state
        const findPathBtn = document.getElementById('findPathBtn');
        findPathBtn.disabled = false;
        findPathBtn.innerHTML = '<span class="btn-icon">🔍</span> Find Best Path';

        // Terminate any running worker
        if (this.pathWorker) {
            this.pathWorker.terminate();
            this.pathWorker = null;
        }
    }

    showResults(results) {
        const resultsPanel = document.getElementById('pathResults');
        
        document.getElementById('resultAlgorithm').textContent = results.algorithm;
        document.getElementById('resultDistance').textContent = `${results.distance}m`;
        document.getElementById('resultSteps').textContent = results.steps;
        document.getElementById('resultTime').textContent = `${results.time}ms`;

        // Display path sequence
        const pathContainer = document.getElementById('resultPath');
        pathContainer.innerHTML = '';

        results.path.forEach((location, index) => {
            const stepElement = document.createElement('span');
            stepElement.className = 'path-step';
            stepElement.textContent = this.locations[location].name;
            pathContainer.appendChild(stepElement);

            if (index < results.path.length - 1) {
                const arrowElement = document.createElement('span');
                arrowElement.className = 'path-arrow';
                arrowElement.textContent = '→';
                pathContainer.appendChild(arrowElement);
            }
        });

        resultsPanel.classList.remove('hidden');
    }
}

// Initialize the navigator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CampusNavigator();
});