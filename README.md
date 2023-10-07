# trainRouteApp
A proof of concept Route Planner with example DB structure, making use of Dijkstra's <i>Shortest Path Algorithm</i> 

Shortest Path details: https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/


## Database Structure
### Stations
| stationId | stationName | isClosed |
|----------|----------|----------|
| INT PRIMARTY KEY AUTO_INCREMENT | CHAR(1) UNIQUE | BIT |

### Lines
| lineId | lineName | isClosed | 
|----------|----------|----------|
| INT PRIMARY KEY AUTO_INCREMENT | VARCHAR(20) UNIQUE NOT NULL | BIT |

### StaionRoutes
Handles which Stations are in which lines, including stations with multiple lines. Makes use of FORIENG KEY values relating to Stations and Lines tables.

| stationLineID | stationId | lineId |
|----------|----------|----------|
| INT PRIMARY KEY AUTO_IMCREMENT | INT | INT |
|  | FOREIGN KEY (stationId) REFERENCES stations(stationId) | FOREIGN KEY (lineId) REFERENCES lines(lineId)  |

### Route
Handles station order for a line

| routeId | lineId | stationId | stationOrder | isClosed |
|----------|----------|----------|----------|----------|
| INT PRIMARY KEY AUTO_INCREMENT | INT | INT | INT NOT NULL | BIT |
| | FOREIGN KEY (lineId) REFERENCES lines(lineId) | FOREIGN KEY (stationId) REFERENCES stations(stationId)| |

### Dependencies
-Node<br>
-React<br>
-DB mockup in dbMockUp.js