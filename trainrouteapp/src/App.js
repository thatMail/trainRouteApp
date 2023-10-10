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
      if (
        closedStations.includes(neighbor) 
        && isPartOfDifferentClosedLine(currentNode, neighbor, closedLines, routes)
      ) {
          continue;  // Exclude routes that pass through closed stations on different lines
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

// work out of the path can continue through a closed station on the same line
function isPartOfDifferentClosedLine(currentNode, neighbor, closedLines, routes) {
  // Find the line that connects currentNode and neighbor
  const route = routes.find(route => 
      (route.start_station === currentNode && route.end_station === neighbor) || 
      (route.start_station === neighbor && route.end_station === currentNode)
  );

  // Check if this line is in the list of closed lines
  const lineIsClosed = route && closedLines.includes(route.line);

  // If the line is not closed, then it's not part of a different closed line
  if (!lineIsClosed) return false;

  // Now, check if currentNode and neighbor are part of the same closed line
  const neighborLines = routes.filter(route => 
      route.start_station === neighbor || route.end_station === neighbor
  ).map(route => route.line);

  const currentNodeLines = routes.filter(route => 
      route.start_station === currentNode || route.end_station === currentNode
  ).map(route => route.line);

  // If both currentNode and neighbor share a line that's not closed, then they are part of the same open line
  for (let line of currentNodeLines) {
      if (neighborLines.includes(line) && !closedLines.includes(line)) {
          return false;
      }
  }

  return true;
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
  <div className="container col-xl-10 col-xxl-8 px-4">
    {/** Introduction row */}
    <div className="row align-items-center g-lg-5 pt-5">
      <div className="col-lg-7 text-center text-lg-start">
        <h1 className="display-1 fw-bold lh-1 text-body-emphasis mb-3"><i>Route</i>Planner</h1>
        <p className="col-lg-10 fs-4">A prototype Route Planner for the underground train network shown below:</p>
      </div>
    </div>
    {/** Main row */}
    <div className="row align-items-start g-lg-5 pb-5">
      <div className="col-lg-7">
        <img src={map} className="img-fluid mb-4" alt="Map"></img>
        <p className="col-lg-10 fs-6">The route planner makes use of Dijkstra's <i>Shortest Path Algorithm</i> to work out the best route between stations on the network, more information on the algorithm can
        be found <a href="https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/">here</a></p>
      </div>
      {/** Journey Seletcion */} 
      <div className="col-lg-5 p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <h1 className="display-6 fw-bold lh-1 text-body-emphasis mb-4"><i>My</i>Journey</h1>
        {/** From: */} 
        <div className="form-floating input-group mb-1">
          <div className="input-group-prepend col-2 col-md-3">
            <label className="input-group-text inputLeft" for="inputGroupSelect01">From: </label>
          </div>
          <select className="custom-select inputRight" value={startStation} onChange={e => setStartStation(e.target.value)}>
            {Object.keys(connectionGraph).map(station => (
                <option key={station} value={station} disabled={closedStations.includes(station)}>
                    {station} {closedStations.includes(station) ? "(Closed)" : ""}
                </option>
            ))}
          </select>
        </div>
        {/** To: */} 
        <div className="form-floating input-group mb-4">
          <div className="input-group-prepend col-2 col-md-3">
            <label className="input-group-text inputLeft" for="inputGroupSelect01">To: </label>
          </div>
          <select className="custom-select inputRight" value={endStation} onChange={e => setEndStation(e.target.value)}>
            {Object.keys(connectionGraph).map(station => (
                <option key={station} value={station} disabled={closedStations.includes(station)}>
                    {station} {closedStations.includes(station) ? "(Closed)" : ""}
                </option>
            ))}
          </select>
        </div>
        {/** Plan Route Button */}  
        <div className="form-floating input-group mb-4">
            <button className="rounded-4 submitBtn" onClick={planRoute}>Plan Route</button>
        </div>
        {/** Route Results */}      
        <div id="routeResults" className={`${isActive ? "returnedRoute" : ""} row pt-2`}>
          <div className="col-lg-12">
            <h3>Journey: </h3>
            <div className="journeyResult">
              {/** Fragment rather than a join to avoid concatenation (lets us use the icon), added demarkation of closed stations in journey */}
              {plannedRoute.map((route, index) => (
                <React.Fragment key={index}>
                  {route}{closedStations.includes(route) && "*"}
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
        <div className="accordion accordion-flush" id="debugMenu">
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Debug Menu
              </button>
            </h2>
            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#debugMenu">
              <div className="accordion-body">
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
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top">
      <p className="col-md-4 mb-0 text-muted"><a className="footerLink" href="https://github.com/thatMail/trainRouteApp"><FontAwesomeIcon icon={faGithub} size="xl" style={{ paddingRight: '1rem' }} />Luke Mayell</a></p>
    </footer>
  </div>
  );
}
export default App;