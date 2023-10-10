# trainRouteApp
A proof of concept Route Planner with example DB structure, making use of Dijkstra's <i>Shortest Path Algorithm</i> 

Shortest Path details: https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/


## Database Structure
### Stations
| stationId | stationName | isClosed |
|----------|----------|----------|
| INT PRIMARTY KEY AUTO_INCREMENT | CHAR(1) UNIQUE | BIT |
<br>
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
<br>
```sql

CREATE TABLE lines (
    lineId INT PRIMARY KEY AUTO_INCREMENT,
    lineName CHAR(1) UNIQUE NOT NULL,
    isClosed TINYINT(1) DEFAULT 0
);

```
### StaionRoutes
Handles which Stations are in which lines, including stations with multiple lines. Makes use of FORIENG KEY values relating to Stations and Lines tables.
<br>
| stationLineID | stationId | lineId |
|----------|----------|----------|
| INT PRIMARY KEY AUTO_IMCREMENT | INT | INT |
|  | FOREIGN KEY (stationId) REFERENCES stations(stationId) | FOREIGN KEY (lineId) REFERENCES lines(lineId)  |
<br>
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