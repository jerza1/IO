/**
 * Clona un objeto para no modificar el original
 * @param {object} objeto a clonar
 */
function clonar(objeto) {
  return JSON.parse(JSON.stringify(objeto));
}

/**
 * Obtiene el camino solución desde un nodo final
 * @param {object} grafo representación del grafo
 * @param {integer} fin nodo final de la ruta
 * @returns {array} sol array de los nodos solución
 */
function ruta(grafo, fin) {
  var sol = [fin]
  while (grafo[fin].padre !== null) {
    fin = grafo[fin].padre
    sol.unshift(fin)
  }
  if (sol.length == 1)
    return 0
  return sol
}

/**
 * Al inicio solamente se recibe el grafo con los nodos adyacentes, se agregar sus demás atributos
 * @param {object} grafo representación del grafo
 * @returns {object} grafo con nuevos atributos
 */
function init(grafo) {
  for (var i = 0; i < grafo.length; i++) {
    grafo[i].vis = 'white'
    grafo[i].dis = Number.POSITIVE_INFINITY
    grafo[i].padre = null
  }
  return grafo
}

/**
 * Algoritmo de búsqueda BFS
 * @param {object} grafo representación del grafo
 * @param {integer} inicio nodo inicial desde el cual se comienza a buscar
 * @param {integer} fin nodo final a buscar
 * @returns {object} grafo solución
 */
function BFS(grafo, inicio, fin) {
    var solucion = document.getElementById('rutaSolucion');
  grafo = init(grafo)
  grafo[inicio].vis = 'grey'
  grafo[inicio].dis = 0
  var queue = []
  queue.push(inicio)
  solucion.innerHTML = "<h2>Recorrido<br>";
  solucion.innerHTML += "[ "+queue.map(suma)+" ]";
  while (queue.length > 0) {
    var u = queue.shift()
    if (u == fin) {
      return ruta(grafo, fin)
    }
    var nodos = grafo[u].ady
    for (var i = 0; i < nodos.length; i++) {
      if (grafo[nodos[i]].vis == 'white') {
        grafo[nodos[i]].vis = 'grey'
        grafo[nodos[i]].dis = grafo[u].dis + 1
        grafo[nodos[i]].padre = u
        queue.push(nodos[i])        
      }
    }
    solucion.innerHTML += "<br>[ "+queue.map(suma)+" ]";
    grafo[u].vis = 'black'
  }

  return 0
}

/**
 * Algoritmo de búsqueda DFS
 * @param {object} grafo representación del grafo
 * @param {integer} inicio nodo inicial desde el cual se comienza a buscar
 * @param {integer} fin nodo final a buscar
 * @returns {object} grafo solución
 */
function DFS(grafo, inicio, fin) {
  grafo = init(grafo)
  grafo[inicio].vis = 'grey'
  grafo[inicio].dis = 0
  var stack = []
  stack.push(inicio)
  while (stack.length > 0) {
    var u = stack.pop()
    if (u == fin) {
      return ruta(grafo, fin)
    }
    var nodos = grafo[u].ady
    for (var i = 0; i < nodos.length; i++) {
      if (grafo[nodos[i]].vis == 'white') {
        grafo[nodos[i]].vis = 'grey'
        grafo[nodos[i]].dis = grafo[u].dis + 1
        grafo[nodos[i]].padre = u
        stack.push(nodos[i])
      }
    }
    grafo[u].vis = 'black'
  }
  return 0
}

/**
 * Algoritmo de búsqueda DFS Limitada
 * @param {object} grafo representación del grafo
 * @param {integer} inicio nodo inicial desde el cual se comienza a buscar
 * @param {integer} fin nodo final a buscar
 * @param {integer} limite del DFS
 * @returns {object} grafo solución
 */
 function DFS_L(grafo, inicio, fin, limite) {
     grafo = init(grafo)
     grafo[inicio].vis = 'grey'
     grafo[inicio].dis = 0
     var stack = []
     //stack.push(inicio)
     if(grafo[inicio].dis < limite)
         stack.push(inicio)
     while (stack.length > 0) {
         //console.log("inicia")
         var u = stack.pop()
         //console.log(u+1)
         if (fin == u) {
         }
         var nodos = grafo[u].ady
         for (var i = 0; i < nodos.length; i++) {
             if (grafo[nodos[i]].vis == 'white') {
                 grafo[nodos[i]].vis = 'grey'
                 grafo[nodos[i]].dis = grafo[u].dis + 1
                 grafo[nodos[i]].padre = u
                 if(grafo[nodos[i]].dis < limite)
                     stack.push(nodos[i])
                 //console.log(nodos[i]+1)
             }
         }
         grafo[u].vis = 'black'
         //console.log('termina')
     }
     return ruta(grafo, fin)
 }

/**
 * Simulación de un cola de prioridad (Para UCS)
 * @param {array} queue cola en la cual se agregará el elemento
 * @param {integer} elemento elemento a agregar
 */
function enqueue(queue, elemento) {
  queue.push(elemento)
  queue.sort(function(a, b) {
    if (a[1] > b[1]) return 1
    if (a[1] < b[1]) return -1
    return 0
  })
  return queue
}
/**
 * Algoritmo de búsqueda UCS
 * @param {object} grafo representación del grafo
 * @param {integer} inicio nodo inicial desde el cual se comienza a buscar
 * @param {integer} fin nodo final de busqueda
 * @returns {object} solucion como un objeto JSON de la ruta y costo
 */
function UCS(grafo, inicio, fin) {
  grafo = init(grafo)
  grafo[inicio].vis = 'grey'
  grafo[inicio].dis = 0
  var queue = []
  queue.push([inicio, 0])
  while (queue.length > 0) {
    var u = queue.shift()
    var nodos = grafo[u[0]].ady
    for (var i = 0; i < nodos.length; i++) {
      if (grafo[nodos[i][0]].vis == 'white') {
        grafo[nodos[i][0]].vis = 'grey'
        grafo[nodos[i][0]].padre = u[0]
        grafo[nodos[i][0]].dis = grafo[u[0]].dis + nodos[i][1]
        queue = enqueue(queue, [nodos[i][0], grafo[nodos[i][0]].dis])
      }
    }
    grafo[u[0]].vis = 'black'
  }
  var solucion = {
    ruta: ruta(grafo, fin),
    costo: grafo[fin].dis
  }
  return solucion
}

function suma(num) {
    return num + 1;
}