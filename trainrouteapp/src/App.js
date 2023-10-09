import React, { useState } from 'react';
import connectionGraph, { stations, lines, stationLines, routes } from './dataMockUp';

//Dijkstra Algorithm for shortest path calculations across map
function dijkstra(connectionGraph, start) {
  const shortestDistances = {};
  const prevNodes = {};
  const unvisitedNodes = new Set(Object.keys(connectionGraph));

  // Initialize distances to infinity and previous nodes to null
  for (let node in connectionGraph) {
      shortestDistances[node] = Infinity;
      prevNodes[node] = null;
  }
  shortestDistances[start] = 0;

  while (unvisitedNodes.size > 0) {
      let currentNode = getClosestNode(shortestDistances, unvisitedNodes);

      for (let neighbor in connectionGraph[currentNode]) {
          let newDist = shortestDistances[currentNode] + connectionGraph[currentNode][neighbor];
          if (newDist < shortestDistances[neighbor]) {
              shortestDistances[neighbor] = newDist;
              prevNodes[neighbor] = currentNode;
          }
      }
      unvisitedNodes.delete(currentNode);
  }

  return { distances: shortestDistances, paths: prevNodes };
}

function getClosestNode(distances, unvisitedNodes) {
  return Array.from(unvisitedNodes).reduce((closestNode, node) => {
      if (!closestNode || distances[node] < distances[closestNode]) {
          return node;
      }
      return closestNode;
  }, null);
}

function App() {
  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);
  const [plannedRoute, setPlannedRoute] = useState([]);

  const planRoute = () => {
    const { distances, paths } = dijkstra(connectionGraph, startStation);
    let path = [];
    let currentNode = endStation;

    while (currentNode) {
        path.push(currentNode);
        currentNode = paths[currentNode];
    }
    path.reverse();

    setPlannedRoute(path);
};

  return (
    <div>
      <h1>Train Route Planner</h1>
      <div>
        <label>Start Station:</label>
        <select value={startStation} onChange={e => setStartStation(e.target.value)}>
          {stations.map(station => (
            <option key={station.id} value={station.name}>{station.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>End Station:</label>
        <select value={endStation} onChange={e => setEndStation(e.target.value)}>
          {stations.map(station => (
            <option key={station.id} value={station.name}>{station.name}</option>
          ))}
        </select>
      </div>
      <button onClick={planRoute}>Plan Route</button>
      <div>
        Shortest Path: {plannedRoute.join(' -> ')}
      </div>
    </div>
  );
}

export default App;