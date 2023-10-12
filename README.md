# trainRouteApp
A proof of concept Route Planner with example DB structure, making use of Dijkstra's <i>Shortest Path Algorithm</i> details <a href="https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/">here</a>.

For prototype data is stored in /trainrouteapp/src/dataMockUp.js

## Proposed Database Structure
### Stations
| stationId | stationName | isClosed |
|----------|----------|----------|
| INT PRIMARTY KEY AUTO_INCREMENT | CHAR(1) UNIQUE | BIT |

```sql
CREATE TABLE stations (
    stationId INT PRIMARY KEY AUTO_INCREMENT,
    stationName CHAR(1) UNIQUE NOT NULL,
    isClosed TINYINT(1) DEFAULT 0
);
```
### Lines
| lineId | lineName | isClosed | 
|----------|----------|----------|
| INT PRIMARY KEY AUTO_INCREMENT | VARCHAR(20) UNIQUE NOT NULL | BIT |

```sql
CREATE TABLE lines (
    lineId INT PRIMARY KEY AUTO_INCREMENT,
    lineName CHAR(1) UNIQUE NOT NULL,
    isClosed TINYINT(1) DEFAULT 0
);
```
### StaionRoutes
Handles which Stations are in which lines, including stations with multiple lines. Makes use of FORIENG KEY values relating to Stations and Lines tables.

| stationLineID | stationId | lineId |
|----------|----------|----------|
| INT PRIMARY KEY AUTO_IMCREMENT | INT | INT |
|  | FOREIGN KEY (stationId) REFERENCES stations(stationId) | FOREIGN KEY (lineId) REFERENCES lines(lineId)  |

```sql
CREATE TABLE stationRoutes (
    stationLineId INT PRIMARY KEY AUTO_INCREMENT,
    stationId INT,
    lineId INT,
    FOREIGN KEY (stationId) REFERENCES stations(stationId),
    FOREIGN KEY (lineId) REFERENCES lines(lineId)
);
```
### Route
Handles station order for a line

| routeId | lineId | stationId | stationOrder | 
|----------|----------|----------|----------|
| INT PRIMARY KEY AUTO_INCREMENT | INT | INT | INT NOT NULL |
| | FOREIGN KEY (lineId) REFERENCES lines(lineId) | FOREIGN KEY (stationId) REFERENCES stations(stationId) | |

```sql
CREATE TABLE route (
    routeId INT PRIMARY KEY AUTO_INCREMENT,
    lineId INT,
    stationId INT,
    stationOrder INT NOT NULL,
    FOREIGN KEY (line_id) REFERENCES lines(line_id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id)
);
```

### Views for closed Stations or Lines
#### Closed Stations:
```sql
CREATE VIEW closedStations AS
SELECT id, name
FROM stations
WHERE isClosed = TRUE;
```
#### Closed Lines:
```sql

CREATE VIEW closedLines AS
SELECT id, name
FROM lines
WHERE isClosed = TRUE;
```

## Improvements
- Move connectionsGraph constant data in the Routes Table
- Use table to store route of each station's connections, not just station, line, and order of the line.
- This should let us remove the need for some of the helper functions which the algorithm is currently reliant on
- New db structure to accomodate:
  
  | routeId | startStationId | endStationId | lineId | distance |
  |----------|----------|----------|----------|----------|
  | Primary Key | Foreing key | Foreing key | Foreing key | | |
  | | Stations(stationId) | Stations(stationId) | Lines(lineID) | Connection weight |

- Distance column replaces the connectionGraph. This structure change should increase efficiancy:
  - Find all stations directly connected to a given station //required for Algorithm.
  - Determine the line of any given direct connection.
  - Easier to detect if we're changing line between stations, if so we can apply a pre-determined penalty value for the line change.
 
- Adjust Dijkstra's Algorithm to handle the new routes table data
- Improve handling for closed stations, with the additional connection data for each station journey's will only be able to continue through a colsed station on the same line.
- Penalty weighting is now considered for changing lines, this should reflect a more 'real world' use cases. Shorter journey's with line changes will still win if the journey is still shorter including the penalty!
#### Plan for Dijkstra's Algorithm iteration
```
function findShortestPath(startStation, endStation):
    initialize distances with infinity for all stations except startStation
    initialize priority queue with startStation (distance 0)
    
    while priority queue is not empty:
        currentStation = pop station with smallest distance from priority queue
        for each neighbouring station of currentStation:
            if it's on the same line:
                if nextStation is open or nextStation is on the route to endStation on the same line:
                    update distance if new distance is smaller
                    add nextStation to priority queue
            else:
                consider the penalty for changing the line
                update distance if new distance (including penalty) is smaller
                add nextStation to priority queue
    
    return path to endStation
```
