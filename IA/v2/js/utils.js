/**[acordeon oculta o muestra div Demo]
* @param tag id identificador de elemento
*/
function acordeon(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        w3.addClass('#'+id,'w3-show');
    } else { 
        w3.removeClass('#'+id,'w3-show');
    }
}
var nodes, edges, network, data;
var cont =  1; var limite;
var inicio, meta, nodoI, nodoM; 

function addNode() {
  try {
    nodes.add({
      id:  parseInt(document.getElementById('node-id').value),
      label: document.getElementById('node-label').value
    });
    cont++;
    document.getElementById('node-id').value = cont;
    document.getElementById('node-label').value = cont;
  }
  catch (err) {
    alert(err);
  }
}

function updateNode() {
  try {
    nodes.update({
      id: parseInt(document.getElementById('node-id').value),
      label: document.getElementById('node-label').value
    });
  }
  catch (err) {
    alert(err);
  }
}
function removeNode() {
  try {
    if(cont < 1){
      cont = 1;
      document.getElementById('node-id').value = cont;
      document.getElementById('node-label').value = cont;
    }else{
      nodes.remove({id: parseInt(document.getElementById('node-id').value)});
      cont--;
      document.getElementById('node-id').value = cont;
      document.getElementById('node-label').value = cont;
    }
    
  }
  catch (err) {
    alert(err);
  }
  
}

function draw() {
  inicio = document.getElementById('inicio'); inicio.value="";
  meta = document.getElementById('meta'); meta.value="";
  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  var numN = $('#nodos').val();
  if(!isNaN(parseInt(numN))){

    for(var i = 1; i <= parseInt(numN); i++){
      nodes.add([{id:i,label:i}])
    }

    cont = parseInt(numN)+1;
    w3.addClass('#tabla','w3-show');
    document.getElementById('node-id').value = cont;
    document.getElementById('node-label').value = cont;   
  }
  var container = document.getElementById('network');
  data = {
      nodes: nodes,
      edges: edges
  };
  var options = {
      locale:'es',
      manipulation: {
        addNode: function (data, callback) {
          document.getElementById('node-operation').innerHTML = "Agregar Nodo";
          addNode2(data, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          document.getElementById('node-operation').innerHTML = "Editar Nodo";
          editNode2(data, callback);
        },
        addEdge: function (data, callback) {
          if (data.from == data.to) {
            var r = confirm("¿Desea conectar el nodo a sí mismo?");
            if (r != true) {
              callback(null);
              return;
            }
          }
          document.getElementById('edge-operation').innerHTML = "Agregar Arista";
          editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
          editWithoutDrag: function(data, callback) {
            document.getElementById('edge-operation').innerHTML = "Editar Arista";
            editEdgeWithoutDrag(data,callback);
          }
        }
      }
  };
  network = new vis.Network(container, data, options);
  network.on("click", function(params){
    datos = nodes.get(params.nodes[0]);
    if(datos.id != undefined || datos.label != undefined){
      document.getElementById('node-id').value = datos.id;
      document.getElementById('node-label').value = datos.label;
    }
  });
  network.on("doubleClick", function (params) {
    datos = nodes.get(params.nodes[0]);
    if(inicio.value == "" && datos.color == undefined){
      nodoI = datos;
      inicio.value = datos.label;
      inicio.style = "box-shadow:0 8px 16px 0 rgba(0,0,255,0.6),0 6px 20px 0 rgba(0,0,255,0.4)"
      nodes.update([{id:datos.id, color:{background:"red"}}]); 
    }else if(datos.id == nodoI.id){
      inicio.value = "";
      inicio.style = "box-shadow = ''";
      nodes.remove([{id:datos.id}]); nodes.add(nodoI); 
    }else if(meta.value == "" && datos.color == undefined && inicio.value != ""){
      nodoM = datos;
      meta.value = datos.label;
      meta.style = "box-shadow:0 8px 16px 0 rgba(0,0,255,0.6),0 6px 20px 0 rgba(0,0,255,0.4)";
      nodes.update([{id:datos.id, color:{background:"red"}}]); 
    }else if(datos.id == nodoM.id){
      meta.value = "";
      meta.style = "box-shadow = ''";
      nodes.remove([{id:datos.id}]); nodes.add(nodoM); 
    }
  }); 
}

function addNode2(data, callback) {
  document.getElementById('node-id2').value = cont;
  document.getElementById('node-label2').value = cont;
  document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
  document.getElementById('node-cancelButton').onclick = cancelNodeEdit.bind(this,callback);
  document.getElementById('node-popUp').style.display = 'block';
}
function editNode2(data, callback) {
  document.getElementById('node-id2').value = data.id;
  document.getElementById('node-label2').value = data.label;
  document.getElementById('node-saveButton').onclick = saveNodeChange.bind(this, data, callback);
  document.getElementById('node-cancelButton').onclick = cancelNodeEdit.bind(this,callback);
  document.getElementById('node-popUp').style.display = 'block';
}

function clearNodePopUp() {
  document.getElementById('node-saveButton').onclick = null;
  document.getElementById('node-cancelButton').onclick = null;
  document.getElementById('node-popUp').style.display = 'none';
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data, callback) {
  try{
    data.id = parseInt(document.getElementById('node-id2').value);
    data.label = document.getElementById('node-label2').value;
    cont++;
    clearNodePopUp();
    callback(data);
  }catch(err){
    alert(err);
  }
  document.getElementById('node-id').value = cont;
  document.getElementById('node-label').value = cont;
}
function saveNodeChange(data, callback) {
  try {
    data.id = parseInt(document.getElementById('node-id2').value);
    data.label = document.getElementById('node-label2').value;
    clearNodePopUp();
    callback(data);
  }
  catch(err){
    alert(err);
  }
}
function editEdgeWithoutDrag(data, callback) {
  document.getElementById('edge-label').value = 1;
  document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
  document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
  document.getElementById('edge-popUp').style.display = 'block';
}

function clearEdgePopUp() {
  document.getElementById('edge-saveButton').onclick = null;
  document.getElementById('edge-cancelButton').onclick = null;
  document.getElementById('edge-popUp').style.display = 'none';
}

function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}

function saveEdgeData(data, callback) {
  if (typeof data.to === 'object')
    data.to = data.to.id
  if (typeof data.from === 'object')
    data.from = data.from.id
  data.label = document.getElementById('edge-label').value;
  clearEdgePopUp();
  callback(data);
}

function prof(a){
 if(a == 2){
  document.getElementById('labelProf').innerHTML = "Limite";
  w3.addClass("#inpProf","w3-show");
 }else if(a == 3){
  document.getElementById('labelProf').innerHTML = "Iteraciones";
  w3.addClass("#inpProf","w3-show");
 }
 else{
  w3.removeClass("#inpProf","w3-show");
  document.getElementById('labelProf').innerHTML = "";
 }
}
function resolver(){
  if(nodes.length != 0 && edges.length != 0){
    if(inicio.value != "" && meta.value != ""){
      var aristas = edges.get();
      var grafo = colectar(aristas);
      var solucion = document.getElementById('solucion');
      var algoritmo = document.getElementsByName('algoritmos');
      switch(parseInt(algoritmo[0].value)) {
        case 0:
          grafoS = BFS_BFS(grafo, nodoI.id-1, nodoM.id-1);
          solucion.innerHTML = "<h2>Ruta Solución= ["+grafoS+"]<br>Costo: "+(grafoS.length-1)+"</h2>";
        break;
        case 1:
          grafoS = DFS_DFS(grafo, nodoI.id-1, nodoM.id-1);
          solucion.innerHTML = "<h2>Ruta Solución= ["+grafoS+"]<br>Costo: "+(grafoS.length-1)+"</h2>";
        break;
        case 2:
          limite = parseInt(document.getElementById('prof').value);
          grafoS = DFS_Limitada(grafo, nodoI.id-1, nodoM.id-1, limite);
          solucion.innerHTML = "<h2>Ruta Solución= ["+grafoS+"]<br>Costo: "+(grafoS.length-1)+"</h2>";
        break;
        case 3:
          limite = parseInt(document.getElementById('prof').value);
          grafoS = DFS_Iterativo(grafo, nodoI-1, nodoM-1, limite);
          solucion.innerHTML = "<h2>Ruta Solución= ["+grafoS+"]<br>Costo: "+(grafoS.length-1)+"</h2>";
          //DFS_Iterativo(GX, 0, 9, 7);
        break;
        case 4:
          var grafo2 = colectarC(aristas);
          console.log(grafo2);
          grafoS = UCS_UCS(grafo2,nodoI.id-1,nodoM.id-1);
          solucion.innerHTML = "<h2>Ruta Solución= ["+grafoS.ruta+"]<br>Costo: "+grafoS.costo+"</h2>";
        break;
        default:
        console.error("No hay intersecciones");
        break;
      }
    }else{
      alert("No nodo inicio o salida");
    }
  }else{
    alert("No hay nodos o el grafo está incompleto");
  }
  
}
function colectar(aristas){
  var from; var grafoFrom = []; var grafoTo = [];
  for(var i = 1; i <= nodes.length; i++){
    grafoFrom[i-1] = []; grafoTo[i-1] = [];
    for(var j = 0; j < aristas.length; j++){
      if(aristas[j].from == i){
        grafoFrom[i-1].push(aristas[j].to-1);
      }
      if(aristas[j].to == i){
        grafoTo[i-1].push(aristas[j].from-1);
      }
    }
  }
  for(var i = 0; i < nodes.length; i++){
    grafoFrom[i] = {ady:grafoFrom[i].concat(grafoTo[i])};
  }
  return grafoFrom;
}

function colectarC(aristas){
  var from; var grafoFrom = []; var grafoTo = [];
  for(var i = 1; i <= nodes.length; i++){
    grafoFrom[i-1] = []; grafoTo[i-1] = [];
    for(var j = 0; j < aristas.length; j++){
      if(aristas[j].from == i){
        grafoFrom[i-1].push([aristas[j].to-1, parseInt(aristas[j].label)]);
      }
      if(aristas[j].to == i){
        grafoTo[i-1].push([aristas[j].from-1, parseInt(aristas[j].label)]);
      }
    }
  }
  for(var i = 0; i < nodes.length; i++){
    grafoFrom[i] = {ady:grafoFrom[i].concat(grafoTo[i])};
  }
  return grafoFrom;
}

function BFS_BFS(grafo, inicio, fin) 
{
    var g = clonar(grafo)
    rutaZ = BFS(g, inicio, fin)
    return rutaZ.map(suma);
}
function DFS_DFS(grafo, inicio, fin) 
{
    var g = clonar(grafo)
    rutaZ = DFS(g, inicio, fin) 
    return rutaZ.map(suma);
}
function DFS_Limitada(grafo, inicio, fin, limite) 
{
    var g = clonar(grafo)
    rutaZ = DFS_L(g, inicio, fin,limite)
    return rutaZ.map(suma);
}
function UCS_UCS(grafo, inicio, fin) 
{
    var g = clonar(grafo)
    rutaZ =  UCS(g, inicio, fin);
    return rutaZ;
}
function DFS_Iterativo(grafo, inicio, fin, iteraciones) 
{
    for (var i = 0; i <= iteraciones; i++) 
    {
        var g = clonar(grafo)
        graf = DFS_Limitada(g, inicio, fin, i);
        //console.log("Profundidad Limitada= ["+DFS_Limitada(g, inicio, fin, i)+"]");
        //return graf;
        console.log("iteracion#"+i+" = "+graf)
    }
}
function suma(num) {
    return num + 1;
}