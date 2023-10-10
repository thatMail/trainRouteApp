export const stations = [
    { id: 1, name: "A", isClosed: false },
    { id: 2, name: "B", isClosed: false },
    { id: 3, name: "C", isClosed: false },
    { id: 4, name: "D", isClosed: false },
    { id: 5, name: "E", isClosed: false },
    { id: 6, name: "F", isClosed: false },
    { id: 7, name: "G", isClosed: false },
    { id: 8, name: "H", isClosed: false },
    { id: 9, name: "J", isClosed: false },
    { id: 10, name: "K", isClosed: false },
    { id: 11, name: "O", isClosed: false },
    { id: 12, name: "M", isClosed: false },
    { id: 13, name: "N", isClosed: false },
  ];
  
  export const lines = [
    { id: 1, name: "Blue", isClosed: false },
    { id: 2, name: "Pink", isClosed: false },
    { id: 3, name: "Red", isClosed: false },
    { id: 4, name: "Black", isClosed: false },
    { id: 5, name: "Circular", isClosed: false },
  ];
  
  export const stationLines = [
    //A
    { id: 1, stationId: 1, lineId: 1 }, //Staiton A, Blue Line
    //B
    { id: 2, stationId: 2, lineId: 1 }, //Staiton B, Blue Line
    { id: 2, stationId: 2, lineId: 5 }, //Station B, Circular Line
    //C
    { id: 3, stationId: 3, lineId: 1 }, //Station C, Blue Line
    { id: 3, stationId: 3, lineId: 3 }, //Station C, Red Line
    //D
    { id: 4, stationId: 4, lineId: 2 }, //Station D, Pink Line
    { id: 4, stationId: 4, lineId: 3 }, //Station D, Red Line
    { id: 4, stationId: 4, lineId: 5 }, //Station D, Circular Line
    //E
    { id: 5, stationId: 5, lineId: 2 }, //Station E, Pink Line
    //F
    { id: 6, stationId: 6, lineId: 3 }, //Station F, Red Line
    //G
    { id: 7, stationId: 7, lineId: 4 }, //Station G, Black Line
    //H
    { id: 8, stationId: 8, lineId: 2 }, //Station H, Pink Line
    //J
    { id: 9, stationId: 9, lineId: 1 }, //Station J, Blue Line
    { id: 9, stationId: 9, lineId: 4 }, //Station J, Black Line
    //K
    { id: 10, stationId: 10, lineId: 4 }, //Station K, Black Line
    //M
    { id: 11, stationId: 11, lineId: 3 }, //Station M, Red Line
    { id: 11, stationId: 11, lineId: 5 }, //Station M, Circular Line
    //N
    { id: 12, stationId: 12, lineId: 5 }, //Station N, Circular Line
    //O
    { id: 13, stationId: 13, lineId: 2 }, //Station O, Pink Line
    { id: 13, stationId: 13, lineId: 4 }, //Station O, Black Line
  ];
  
  export const routes = [
    //Blue Line
    { id: 1, lineId: 1, stationId: 1, stationOrder: 1, stationClosed: false, lineClosed: false},
    { id: 2, lineId: 1, stationId: 2, stationOrder: 2, stationClosed: false, lineClosed: false },
    { id: 3, lineId: 1, stationId: 3, stationOrder: 3, stationClosed: false, lineClosed: false },
    { id: 4, lineId: 1, stationId: 9, stationOrder: 4, stationClosed: false, lineClosed: false },
    //Pink Line
    { id: 5, lineId: 2, stationId: 5, stationOrder: 1, stationClosed: false, lineClosed: false },
    { id: 6, lineId: 2, stationId: 4, stationOrder: 2, stationClosed: false, lineClosed: false },
    { id: 7, lineId: 2, stationId: 13, stationOrder: 3, stationClosed: false, lineClosed: false },
    { id: 8, lineId: 2, stationId: 8, stationOrder: 4, stationClosed: false, lineClosed: false },
    //Red Line
    { id: 9, lineId: 3, stationId: 6, stationOrder: 1, stationClosed: false, lineClosed: false },
    { id: 10, lineId: 3, stationId: 4, stationOrder: 2, stationClosed: false, lineClosed: false },
    { id: 11, lineId: 3, stationId: 3, stationOrder: 3, stationClosed: false, lineClosed: false },
    { id: 12, lineId: 3, stationId: 11, stationOrder: 4, stationClosed: false, lineClosed: false },
    //Black Line
    { id: 13, lineId: 4, stationId: 7, stationOrder: 1, stationClosed: false, lineClosed: false },
    { id: 14, lineId: 4, stationId: 13, stationOrder: 2, stationClosed: false, lineClosed: false },
    { id: 15, lineId: 4, stationId: 9, stationOrder: 3, stationClosed: false, lineClosed: false },
    { id: 16, lineId: 4, stationId: 10, stationOrder: 4, stationClosed: false, lineClosed: false },
    //Circular Line
    { id: 16, lineId: 5, stationId: 2, stationOrder: 1, stationClosed: false, lineClosed: false },
    { id: 17, lineId: 5, stationId: 4, stationOrder: 2, stationClosed: false, lineClosed: false },
    { id: 18, lineId: 5, stationId: 11, stationOrder: 3, stationClosed: false, lineClosed: false },
    { id: 19, lineId: 5, stationId: 12, stationOrder: 4, stationClosed: false, lineClosed: false },
  ];

   const connectionGraph = {
    //weighting for station to station connections on a per station basis - required for Dijkstra
    //StationId - Connecting StationId: Connection Weight
    //All station connection weights set to 1 as proof of concept
    A: { B: 1},
    B: { A: 1, C: 1, D: 1, N: 1 },
    C: { B: 1, D: 1, J: 1, M: 1 },
    D: { B: 1, C: 1, E: 1, F: 1, M: 1, O: 1},
    E: { D: 1 },
    F: { D: 1 },
    G: { O: 1},
    H: { O: 1 },
    J: { C: 1, K: 1, O: 1},
    K: { J: 1 },
    O: { D: 1, G: 1, H: 1, J: 1 },
    M: { C: 1, D: 1, N: 1 },
    N: { B: 1, M: 1 },
};
  //Station and Line Closures (see db Views in readme)
  const closedStations = [''];  // Example: Station B is closed
  const closedLines = [''];  // Example: Red line is closed

export { connectionGraph, closedStations, closedLines };