var GX = [{
  ady: [
    [1, 0],
    [2, 0],
    [3, 0]
  ] //0
}, {
  ady: [
    [0, 0],
    [4, 0]
  ] //1
}, {
  ady: [
    [0, 0],
    [4, 0],
    [5, 0],
    [6, 0]
  ] //2
}, {
  ady: [
    [0, 0],
    [7, 0]
  ] //3
}, {
  ady: [
    [1, 0],
    [2, 0]
  ] //4
}, {
  ady: [
    [2, 0],
    [8, 0]
  ] //5
}, {
  ady: [
    [2, 0],
    [9, 0],
    [10, 0]
  ] //6
}, {
  ady: [
    [3, 0],
    [11, 0]
  ] //7
}, {
  ady: [
    [5, 0],
    [9, 0],
    [13, 0],
    [14, 0]
  ] //8
}, {
  ady: [
    [6, 0],
    [8, 0],
    [10, 0]
  ] //9
}, {
  ady: [
    [6, 0],
    [9, 0],
    [12, 0]
  ] //10
}, {
  ady: [
    [7, 0],
    [12, 0]
  ] //11
}, {
  ady: [
    [10, 0],
    [11, 0]
  ] //12
}, {
  ady: [
    [8, 0]
  ] //13
}, {
  ady: [
    [8, 0]
  ] //14
}]

var GXcost = [{
    ady: [ //0
      [1, 75],
      [2, 140],
      [3, 118]
    ],
    cord: [0, 0],
    dis: 366
  },
  {
    ady: [ //1
      [0, 75],
      [4, 71]
    ],
    cord: [0, 0],
    dis: 374
  },
  {
    ady: [ //2
      [0, 140],
      [4, 151],
      [5, 90],
      [6, 80]
    ],
    cord: [0, 0],
    dis: 253
  },
  {
    ady: [ //3
      [0, 118],
      [7, 111]
    ],
    cord: [0, 0],
    dis: 329
  },
  {
    ady: [ //4
      [1, 71],
      [2, 151]
    ],
    cord: [0, 0],
    dis: 380
  },
  {
    ady: [ //5
      [2, 90],
      [8, 211]
    ],
    cord: [0, 0],
    dis: 176
  },
  {
    ady: [ //6
      [2, 80],
      [9, 97],
      [10, 146]
    ],
    cord: [0, 0],
    dis: 193
  },
  {
    ady: [ //7
      [3, 111],
      [11, 70]
    ],
    cord: [0, 0],
    dis: 244
  },
  {
    ady: [ //8
      [5, 211],
      [9, 101],
      [14, 85],
      [13, 90]
    ],
    cord: [0, 0],
    dis: 0
  },
  {
    ady: [ //9
      [6, 97],
      [8, 101],
      [10, 138]
    ],
    cord: [0, 0],
    dis: 100
  },
  {
    ady: [ //10
      [6, 146],
      [9, 138],
      [12, 120]
    ],
    cord: [0, 0],
    dis: 160
  },
  {
    ady: [ //11
      [7, 70],
      [12, 75]
    ],
    cord: [0, 0],
    dis: 241
  },
  {
    ady: [ //12
      [10, 75],
      [11, 120]
    ],
    cord: [0, 0],
    dis: 242
  },
  {
    ady: [ //13
      [8, 90]
    ],
    cord: [0, 0],
    dis: 77
  },
  {
    ady: [ //14
      [8, 85],
      [15, 142],
      [16, 98]
    ],
    cord: [0, 0],
    dis: 80
  },
  {
    ady: [ //15
      [14, 142],
      [17, 92],
    ],
    cord: [0, 0],
    dis: 199
  },
  {
    ady: [ //16
      [14, 98],
      [18, 86]
    ],
    cord: [0, 0],
    dis: 151
  },
  {
    ady: [ //17
      [15, 92],
      [19, 87]
    ],
    cord: [0, 0],
    dis: 226
  },
  {
    ady: [ //18
      [16, 86]
    ],
    cord: [0, 0],
    dis: 161
  },
  {
    ady: [ //19
      [17, 87]
    ],
    cord: [0, 0],
    dis: 234
  }
]

function buscar(grafo, tipo, inicio, fin, limite) {
  var g = clonar(grafo)
  return busqueda(grafo, tipo, inicio, fin, limite)
}

var s, iteraciones = 5
/*
s = buscar(GX, 0, 0, 8, -1)
console.log("BFS = [", s.ruta.toString(), "], costo = ", s.costo);

s = buscar(GXcost, 1, 0, 8, -1)
console.log("UCS = [", s.ruta.toString(), "], costo = ", s.costo);

s = buscar(GX, 2, 0, 8, -1)
console.log("DFS = [", s.ruta.toString(), "], costo = ", s.costo);

s = buscar(GX, 3, 0, 8, 3)
console.log("DFS Limitado = [", s.ruta.toString(), "], costo = ", s.costo);
*/
for (var i = 0; i < iteraciones; i++) {
  s = buscar(GX, 3, 0, 8, i)
  console.log("DFS Iterativo #", i, " = [", s.ruta.toString(), "], costo = ", s.costo);
}
/*
s = buscar(GXcost, 4, 0, 8, -1)
console.log("Avara = [", s.ruta.toString(), "], costo = ", s.costo);

s = buscar(GXcost, 5, 0, 8, -1)
console.log("A* = [", s.ruta.toString(), "], costo = ", s.costo);
*/