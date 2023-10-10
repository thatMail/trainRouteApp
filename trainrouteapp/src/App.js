import React, { useState } from 'react';
import { connectionGraph, closedStations, closedLines, routes } from './dataMockUp';
import map from './img/map.jpg';

//Dijkstra Algorithm for shortest path calculations across map
function dijkstra(connectionGraph, start, closedStations, closedLines) {
  const shortestDistances = {};
  const prevNodes = {};
  const unvisitedNodes = new Set(Object.keys(connectionGraph));

  // Set distances to infinity and previous nodes to null
  for (let node in connectionGraph) {
      shortestDistances[node] = Infinity;
      prevNodes[node] = null;
  }
  shortestDistances[start] = 0;

  while (unvisitedNodes.size > 0) {
    let currentNode = getClosestNode(shortestDistances, unvisitedNodes);

    for (let neighbor in connectionGraph[currentNode]) {
        if (closedStations.includes(neighbor) || isPartOfClosedLine(currentNode, neighbor, closedLines, routes)) {
            continue;  // Exclude closed stations and closed lines
        }

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

//Check for closed lines
function isPartOfClosedLine(currentNode, neighbor, closedLines, routes) {
  // Find the line that connects currentNode and neighbor
  const route = routes.find(route => 
      (route.start_station === currentNode && route.end_station === neighbor) || 
      (route.start_station === neighbor && route.end_station === currentNode)
  );

  // Return whether this line is in the list of closed lines
  return route && closedLines.includes(route.line);
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
  const [startStation, setStartStation] = useState('A');
  const [endStation, setEndStation] = useState('A');
  const [plannedRoute, setPlannedRoute] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const planRoute = () => {
    const { distances, paths } = dijkstra(connectionGraph, startStation, closedStations, closedLines);
    let path = [];
    let currentNode = endStation;

    while (currentNode) {
        path.push(currentNode);
        currentNode = paths[currentNode];
    }
    path.reverse();

    setPlannedRoute(path);
    setIsActive(false);
};

return (
  <div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 class="display-1 fw-bold lh-1 text-body-emphasis mb-3"><i>Route</i>Planner</h1>
        <p class="col-lg-10 fs-4">A prototype Route Planner for the underground train network shown below:</p>
        <img src={map} class="img-fluid mb-4" alt="Map"></img>
        <p class="col-lg-10 fs-6">The route planner makes use of Dijkstra's <i>Shortest Path Algorithm</i> to work out the best route between stations on the network, more information on the algorithm can
        be found <a href="https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/">here</a></p>
      </div>

      <div class="col-md-10 mx-auto col-lg-5 p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <div class="form-floating input-group mb-1">
          <div class="input-group-prepend col-2 col-md-3">
            <label class="input-group-text inputLeft" for="inputGroupSelect01">From: </label>
          </div>
          <select class="custom-select inputRight" value={startStation} onChange={e => setStartStation(e.target.value)}>
            {Object.keys(connectionGraph).map(station => (
                <option key={station} value={station} disabled={closedStations.includes(station)}>
                    {station} {closedStations.includes(station) ? "(Closed)" : ""}
                </option>
            ))}
          </select>
        </div>

        <div class="form-floating input-group mb-4">
          <div class="input-group-prepend col-2 col-md-3">
            <label class="input-group-text inputLeft" for="inputGroupSelect01">To: </label>
          </div>
          <select class="custom-select inputRight" value={endStation} onChange={e => setEndStation(e.target.value)}>
            {Object.keys(connectionGraph).map(station => (
                <option key={station} value={station} disabled={closedStations.includes(station)}>
                    {station} {closedStations.includes(station) ? "(Closed)" : ""}
                </option>
            ))}
          </select>
        </div>

        <div class="form-floating input-group mb-4">
            <button class="rounded-4 submitBtn" onClick={planRoute}>Plan Route</button>
        </div>

        <div id="routeResults" className={`${isActive ? "returnedRoute" : ""} row pt-2`}>
          <div class="col-lg-12">
            <h3>Journey: </h3>{plannedRoute.join(' -> ')}
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}
export default App;