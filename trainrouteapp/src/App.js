import React, { useState } from 'react';
import { connectionGraph, closedStations, closedLines, routes } from './dataMockUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
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
  const [closedStations, setClosedStations] = useState([]);  // Now a state variable
  const [closedLines, setClosedLines] = useState([]);        // Now a state variable

  const toggleStationClosure = (station) => {
    if (closedStations.includes(station)) {
      setClosedStations(prevStations => prevStations.filter(s => s !== station));
    } else {
      setClosedStations(prevStations => [...prevStations, station]);
    }
  }
  // Handle toggling a line's closed state
  const toggleLineClosure = (line) => {
    if (closedLines.includes(line)) {
      setClosedLines(prevLines => prevLines.filter(l => l !== line));
    } else {
      setClosedLines(prevLines => [...prevLines, line]);
    }
  }

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
  <div class="container col-xl-10 col-xxl-8 px-4">
    {/** Introduction row */}
    <div class="row align-items-center g-lg-5 pt-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 class="display-1 fw-bold lh-1 text-body-emphasis mb-3"><i>Route</i>Planner</h1>
        <p class="col-lg-10 fs-4">A prototype Route Planner for the underground train network shown below:</p>
      </div>
    </div>
    {/** Main row */}
    <div class="row align-items-start g-lg-5 pb-5">
      <div class="col-lg-7">
        <img src={map} class="img-fluid mb-4" alt="Map"></img>
        <p class="col-lg-10 fs-6">The route planner makes use of Dijkstra's <i>Shortest Path Algorithm</i> to work out the best route between stations on the network, more information on the algorithm can
        be found <a href="https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/">here</a></p>
      </div>
      {/** Journey Seletcion */} 
      <div class="col-lg-5 p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <h1 class="display-6 fw-bold lh-1 text-body-emphasis mb-4"><i>My</i>Journey</h1>
        {/** From: */} 
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
        {/** To: */} 
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
        {/** Plan Route Button */}  
        <div class="form-floating input-group mb-4">
            <button class="rounded-4 submitBtn" onClick={planRoute}>Plan Route</button>
        </div>
        {/** Route Results */}      
        <div id="routeResults" className={`${isActive ? "returnedRoute" : ""} row pt-2`}>
          <div class="col-lg-12">
            <h3>Journey: </h3>
            <div className="journeyResult">
              {/** Fragment rather than a join to avoid concatenation (lets us use the icon) */}
              {plannedRoute.map((route, index) => (
                <React.Fragment key={index}>
                  {route}
                  {index !== plannedRoute.length - 1 && 
                      <FontAwesomeIcon icon={faArrowRight} size="2xs" style={{ color: "#ffffff", paddingRight: '1rem', paddingLeft: '1rem' }}/>
                  }
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <br></br>
        {/** Debug */}
        <div class="accordion accordion-flush" id="debugMenu">
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Debug Menu
              </button>
            </h2>
            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#debugMenu">
              <div class="accordion-body">
                {/* UI to toggle closed stations */}
                <div>
                      <h6>Toggle Closed Stations</h6>
                      {Object.keys(connectionGraph).map(station => (
                          <button onClick={() => toggleStationClosure(station)}>
                              {station} {closedStations.includes(station) ? "(Closed)" : "(Open)"}
                          </button>
                      ))}
                </div>
                <br></br>
                {/* UI to toggle closed lines */}
                <div>
                    <h6>Toggle Closed Lines</h6>
                    {["Blue", "Pink", "Black", "Red", "Circular"].map(line => (
                        <button onClick={() => toggleLineClosure(line)}>
                            {line} {closedLines.includes(line) ? "(Closed)" : "(Open)"}
                        </button>
                    ))}
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/** Footer */}
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top">
      <p class="col-md-4 mb-0 text-muted"><a class="footerLink" href="https://github.com/thatMail/trainRouteApp"><FontAwesomeIcon icon={faGithub} size="xl" style={{ paddingRight: '1rem' }} />Luke Mayell</a></p>
    </footer>
  </div>
  );
}
export default App;