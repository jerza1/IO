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
  return sol.length == 1 ? 0 : sol
}

/**
 * Al inicio solamente se recibe el grafo con los nodos adyacentes, se agregar sus demás atributos
 * @param {object} grafo representación del grafo
 * @returns {object} grafo con nuevos atributos
 */
function inicializar(grafo) {
  for (var i = 0; i < grafo.length; i++) {
    grafo[i].vis = 'white'
    grafo[i].c = Number.POSITIVE_INFINITY
    grafo[i].padre = null
    grafo[i].dis = 0
    grafo[i].cord = [grafo[i].x, grafo[i].y]
  }
  return grafo
}

/**
 * Simulación de un cola de prioridad (Para UCS)
 * @param {array} pila cola en la cual se agregará el elemento
 * @param {integer} elemento elemento a agregar
 * @returns {array} pila en donde se está almacenando los nodos
 */
function encolar(pila, elemento) {
  pila.push(elemento)
  pila.sort(function(a, b) {
    if (a[1] > b[1]) return 1
    if (a[1] < b[1]) return -1
    return 0
  })
  return pila
}

/**
 * Cálculo de la distancia como primera heurísta
 * @param {object} grafo representación del grafo
 * @param {integer} nodo nodo al cual se va a calcular la distancia
 * @returns {object} grafo con distancias calculadas
 */
function distancia(grafo, nodo) {
  var mostDis = document.getElementById('simulation');
  mostDis.style.display = 'block';
 // document.getElementById('dist').style.display = 'block';
  mostDis.innerHTML = '';
  for (var i = 0; i < grafo.length - 1; i++) {
    grafo[i].dis = Math.sqrt(Math.pow(grafo[i].cord[0] - grafo[nodo].cord[0], 2) + Math.pow(grafo[i].cord[1] - grafo[nodo].cord[1], 2))/100
    mostDis.innerHTML += 'Nodo: ' + i + ' (' + redondear2(grafo[i].x) + ', ' + redondear2(grafo[i].y) + ')<br> distancia = ' + redondear2(grafo[i].dis) + '<br>';
  }

  return grafo
}

/**
 * Imprime la pila
 * @param {array} pila pila a imprimir
 * @param {integer} tipo tipo de búsqueda
 * @returns {array} arreglo con los datos a imprimir
 */
function Pila(pila, tipo) {
  var res = []
  for (var i = 0; i < pila.length; i++)
    res[i] = (tipo == 1 || tipo == 4 || tipo == 5) ?
    " nodo : " + pila[i][0] + "-> costo = " + redondear2(pila[i][1]) : redondear2(pila[i][0]);
  return res
}

/**
 * Algoritmo de búsqueda
 * @param {object} grafo representación del grafo
 * @param {integer} tipo tipo de búsqueda {0:BFS, 1:UCS, 2:DFS, 3:DFS Limitado, 4:Ávara, 5:A*} Nota: El DFS iterativo se puede realizar con llamadas secuenciales al DFS Limitado
 * @param {integer} inicio nodo inicial desde el cual se comienza a buscar
 * @param {integer} fin nodo final de busqueda
 * @param {integer} limite limite para DFS Limitado e Iterativo, en otro caso debe ser -1
 * @returns {object} solucion como un objeto JSON de la ruta y costo, en caso de no encontrar retorna el nodo de inicio en ruta y costo igual a 0
 */
function busqueda(grafo, tipo, inicio, fin, limite) {
  var pila = [],
    solucion

  var mostrarRuta = document.getElementById('ruta');
  mostrarRuta.innerHTML = '';
  grafo = inicializar(grafo)
  grafo = distancia(grafo, fin)

  grafo[inicio].c = 0
  if (tipo == 1) {
    encolar(pila, [inicio, grafo[inicio].c])
  } else if (tipo == 4 || tipo == 5) {
    encolar(pila, [inicio, grafo[inicio].dis, grafo[inicio].c])
  } else {
    pila.push([inicio])
  }
  grafo[inicio].vis = 'grey'
  mostrarRuta.innerHTML += 'Inicio<br>';
  mostrarRuta.innerHTML += 'Pila: [' + Pila(pila, tipo).toString() + ']<br>';

  while (pila.length > 0) {
    var u, costo, nodos

    u = (tipo == 2 || tipo == 3) ? pila.pop() : pila.shift()
    mostrarRuta.innerHTML += 'Se extrae: ' + u[0] + '<br>';
    if (u[0] == fin) {
      mostrarRuta.innerHTML += 'Fin<br>';
      return {
        ruta: ruta(grafo, fin),
        costo: grafo[fin].c
      }
    }
    nodos = grafo[u[0]].ady
    if (grafo[u[0]].c < limite || limite == -1) {
      for (var i = 0; i < nodos.length; i++) {
        if (tipo == 5) {
          nuevo_costo = grafo[u[0]].c + nodos[i][1]
          if (grafo[nodos[i][0]].vis == 'white' || nuevo_costo < grafo[nodos[i][0]].c) {
            grafo[nodos[i][0]].vis = 'grey'
            grafo[nodos[i][0]].padre = u[0]
            grafo[nodos[i][0]].c = nuevo_costo
            costo = nuevo_costo + grafo[nodos[i][0]].dis
            encolar(pila, [nodos[i][0], costo])
            mostrarRuta.innerHTML += 'A pila: [' + nodos[i][0] + ', ' + redondear2(costo) + ']<br>';
          }
          grafo[u[0]].vis = 'black'
        }
        else if (grafo[nodos[i][0]].vis == 'white') {
          grafo[nodos[i][0]].vis = 'grey'
          grafo[nodos[i][0]].padre = u[0]
          switch (tipo) {
            case 1:
              grafo[nodos[i][0]].c = grafo[u[0]].c + nodos[i][1]
              encolar(pila, [nodos[i][0], grafo[nodos[i][0]].c])
              mostrarRuta.innerHTML += 'A pila: [' + nodos[i][0] + ', ' + grafo[nodos[i][0]].c + ']<br>';
              break
            case 4:
              grafo[nodos[i][0]].c = grafo[u[0]].c + nodos[i][1]
              encolar(pila, [nodos[i][0], grafo[nodos[i][0]].dis])
              mostrarRuta.innerHTML += 'A pila: [' + nodos[i][0] + ', ' + redondear2(grafo[nodos[i][0]].dis) + ']<br>';
              break
            default:
              grafo[nodos[i][0]].c = grafo[u[0]].c + 1
              pila.push([nodos[i][0]])
              mostrarRuta.innerHTML += 'A pila: ' + nodos[i][0] + '<br>';
              break
          }
        }
      }
      grafo[u[0]].vis = 'black'
      mostrarRuta.innerHTML += 'Pila: [' + Pila(pila, tipo).toString() + '] <br>';
    }
  }
  return {
    ruta: inicio,
    costo: 0
  }
}

function redondear2(number) {
  if (!isNaN(number)) {
    numString = number.toFixed(2);
    numDecimal = 0;
    len = numString.length;
    for (i = 1; i <= 2; i++)
      if (numString[len - i] != '0')
        break;
      else
        numDecimal++;
    return parseFloat(number.toFixed(2 - numDecimal));
  }
}
