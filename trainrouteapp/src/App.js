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

      for (let neighbour in connectionGraph[currentNode]) {
          let newDist = shortestDistances[currentNode] + connectionGraph[currentNode][neighbour];
          if (newDist < shortestDistances[neighbour]) {
              shortestDistances[neighbour] = newDist;
              prevNodes[neighbour] = currentNode;
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
    //
    <div class="container col-xl-10 col-xxl-8 px-4 py-5">
      <div class="row align-items-center g-lg-5 py-5">
        <div class="col-lg-7 text-center text-lg-start">
          <h1 class="display-1 fw-bold lh-1 text-body-emphasis mb-3"><i>Route</i>Planner</h1>
          <p class="col-lg-10 fs-4">Jah bless</p>
        </div>
        <div class="col-md-10 mx-auto col-lg-5 p-4 p-md-5 border rounded-3 bg-body-tertiary">
          <div class="form-floating input-group mb-1">
            <div class="input-group-prepend col-2 col-md-3">
              <label class="input-group-text inputLeft" for="inputGroupSelect01">From: </label>
            </div>
            <select class="custom-select inputRight" value={startStation} onChange={e => setStartStation(e.target.value)}>
              {stations.map(station => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>
          </div>

          <div class="form-floating input-group mb-4">
            <div class="input-group-prepend col-2 col-md-3">
              <label class="input-group-text inputLeft" for="inputGroupSelect01">To: </label>
            </div>
            <select class="custom-select inputRight" value={endStation} onChange={e => setEndStation(e.target.value)}>
              {stations.map(station => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>
          </div>

          <div class="form-floating input-group mb-3">
              <button class="rounded-4 submitBtn" onClick={planRoute}>Plan Route</button>
          </div>
          <div class="row">
            <div class="col-lg-12">
              Journey: {plannedRoute.join(' -> ')}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;