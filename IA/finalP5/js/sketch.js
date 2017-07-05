var grafo1; var nodos; var grafo2; var cuadro;
var ctx;  var puntoIM; var ar; var camino; var greeting;
var rectas; var lados; var noQuitar; var sel; var gg;
function buscar(grafo, tipo, inicio, fin, limite) {
  var g = clonar(grafo)
  return busqueda(grafo, tipo, inicio, fin, limite)
}
function setup() {
	ctx = createCanvas(640, 480);
	ctx.parent('network');
	sel = createSelect();
	sel.parent('algoritm');
	sel.addClass('w3-select');
  	sel.option('Escoge un algoritmo');
  	sel.option('Avida');
  	sel.option('A*');
  	sel.option('Amplitud');
  	sel.option('Profundidad');
  	sel.option('Profundidad Limitada');
  	sel.option('Profundidad Iterativa');
  	sel.option('Costo Uniforme');
  	sel.changed(mySelectEvent);
  	cuadro = createInput(4);
  	cuadro.addClass('w3-card');
  	cuadro.parent('lista');
  	greeting = createElement('h6', 'Limite/Iteraciones');
  	greeting.parent('lista');
	grafo1 = []; nodos = []; camino = [];
	puntoIM = []; grafo2 = []; 
	ar = []; rectas = []; lados = [];
	noQuitar = false; gg = []; 
}
function mySelectEvent(){
	camino = [];
	if(gg.length != 0){
		op = sel.value();
		var mt = 1; var sol = document.getElementById('solucion');
		sol.innerHTML = '';
		if(op == 'Amplitud'){
			s = buscar(gg, 0, 0, mt, -1)
			camino.push(s.ruta); 
			sol.innerHTML = "BFS = ["+ s.ruta.toString()+ "], costo = "+ s.costo;
		}else if(op == 'Profundidad'){
			s = buscar(gg, 2, 0, mt, -1)
			camino.push(s.ruta);
			sol.innerHTML = "DFS = ["+ s.ruta.toString()+ "], costo = "+ s.costo;
		}else if(op == 'Profundidad Limitada'){
			s = buscar(gg, 3, 0, mt, parseInt(cuadro.value()))
			camino.push(s.ruta);
			sol.innerHTML = "DFS Limitado = ["+ s.ruta.toString()+ "], costo = "+ s.costo;
		}else if(op == 'Profundidad Iterativa'){
			for (var i = 0; i < parseInt(cuadro.value()); i++) {
				s = buscar(gg, 3, 0, mt, i)
				camino.push(s.ruta);
				sol.innerHTML += "DFS Iterativo #"+ i+ " = ["+ s.ruta.toString()+ "], costo = "+ s.costo+"<br>";
			}
		}else if(op == 'Costo Uniforme'){
			s = buscar(gg, 1, 0, mt, -1)
			camino.push(s.ruta);
			sol.innerHTML = "UCS = ["+ s.ruta.toString()+ "], costo = "+ s.costo;
		}else if(op == 'Avida'){
			s = buscar(gg, 4, 0, mt, -1)
			camino.push(s.ruta);
			sol.innerHTML = "Avara = ["+ s.ruta.toString()+ "], costo = "+ s.costo;
		}else if(op == 'A*'){
			s = buscar(gg, 5, 0, mt, -1)
			camino.push(s.ruta);
			sol.innerHTML = "A* = ["+ s.ruta.toString()+ "], costo = "+ s.costo;
		} 
	}
}
function draw() {
	background(255);
	for (var i = 0; i < nodos.length; i++) {
		nodos[i].display();
	}
	for (var i = 0; i < grafo1.length; i++) {
		grafo1[i].display();
	}
	for(var j = 0; j < puntoIM.length; j++){
			puntoIM[j].display();
	}
	for(var j = 0; j < rectas.length; j++){
		stroke(0);
		line(rectas[j].r[0],rectas[j].r[1],rectas[j].r[2],rectas[j].r[3])
	}
	for(var k = 0; k < camino.length;k++){
		fill(0,255,0);
		for(var j = 0; j < camino[k].length-1; j++)
			ellipse(gg[camino[k][j]].x, gg[camino[k][j]].y,20,20);
	}
}

function mousePressed(){
	var a = document.getElementsByName('bar-slc');
	if(mouseX > 0 && mouseX < 640 && mouseY > 0 && mouseY < 480){
		if(a[0].value == 0){
			if(mouseButton == LEFT){
				nodos.push(new Spot(mouseX,mouseY));
			}else{
				convex(nodos);
				nodos = []; camino = [];
			}
		}else if(a[0].value == 1){ camino = []
			if(mouseButton == RIGHT){
				puntoIM = [];
			}else
			if(puntoIM.length < 2){
				puntoIM.length == 0 ? puntoIM.push(new Start(mouseX,mouseY)) : puntoIM.push(new End(mouseX,mouseY));	;
			}
		}else if(a[0].value = 2){
			if(puntoIM.length == 2){
				ar = []; lados = []; rectas = [];
				if(noQuitar) grafo2.shift();
				calcDist(puntoIM,grafo2);
			}else{
				alert('Selecciona Inicio y Meta');
			}
		}
	}
}
/** [convex ordena los puntos de nodos con el Método Graham]
* @param array nodos guarda los puntos del area de soluciones
*/
function convex(nodos){
	nodos.sort(function(a,b){ return a.y == b.y ? a.x - b.x : a.y - b.y; });
	var inferior = []; var n = nodos.length;
	for(var i = 0; i < n; i++){
		while(inferior.length >= 2 && area2(nodos[i], inferior[inferior.length - 1],
			  inferior[inferior.length - 2]) <= 0){
			inferior.pop();
		}
		inferior.push(nodos[i]);
	}
	var superior = [];
	for(var i = n - 1; i >= 0 ; i--){
		while(superior.length >= 2 && area2(nodos[i], superior[superior.length - 1],
		      superior[superior.length - 2]) <= 0){
			superior.pop();
		}
		superior.push(nodos[i]);
	}
	superior.pop();  inferior.pop();
	r = random(255);  g = random(255);  b = random(255);
	grafo1.push(new figura(inferior.concat(superior),r,g,b));
	grafo2.push(inferior.concat(superior));
}
/** [area2 calcula el area de 3 puntos y verifica hacia donde gira]
* @param object origen punto de inicio
* @param object aux punto intermedio
* @param object destino punto final
*/
function area2(origen, aux, destino){	
	var ab = [aux.x - origen.x, aux.y - origen.y];
	ab = [-ab[1], ab[0]];
	var ac = [destino.x - aux.x, destino.y - aux.y];
	return (ab[0] * ac[0]) + (ab[1] * ac[1]);
}
	
function calcDist(p,g){
	var nodes = []
	g.unshift(p); noQuitar = true;
	for(var i = 0, len = 0; i < g.length; i++){
		for (var j = 0; j < g[i].length; j++) {
			g[i][j].id = len + j;
			nodes.push(g[i][j]);
		}len += g[i].length;
	}
	for(var i = 1; i < g.length; i++){
		for (var j = 0; j < g[i].length; j++) {
			if(j+1 == g[i].length){
				ar.push({from:g[i][j].id , to:g[i][0].id,
					r:[g[i][j].x,g[i][j].y,g[i][0].x,g[i][0].y],
					costo:dist(g[i][j].x,g[i][j].y,g[i][0].x,g[i][0].y )});
				lados.push(ar[ar.length-1]);
			}else 	{
				ar.push({from:g[i][j].id , to:g[i][j+1].id,
					r:[g[i][j].x,g[i][j].y,g[i][j+1].x,g[i][j+1].y],
					costo:dist(g[i][j].x,g[i][j].y,g[i][j+1].x,g[i][j+1].y)});
				lados.push(ar[ar.length-1]);
			}
			for(var k = i+1; k < g.length; k++){
				for (var m = 0; m < g[k].length; m++) {
					ar.push({from:g[i][j].id , to:g[k][m].id,
						r:[g[i][j].x,g[i][j].y,g[k][m].x,g[k][m].y ],
						costo:dist(g[i][j].x,g[i][j].y,g[k][m].x,g[k][m].y )});
				}
			}
			ar.push({from:g[i][j].id , to:g[0][0].id,
				r:[g[i][j].x,g[i][j].y,g[0][0].x,g[0][0].y],
				costo:dist(g[i][j].x,g[i][j].y,g[0][0].x,g[0][0].y )});
			ar.push({from:g[i][j].id , to:g[0][1].id,
				r:[g[i][j].x,g[i][j].y,g[0][1].x,g[0][1].y],
				costo:dist(g[i][j].x,g[i][j].y,g[0][1].x,g[0][1].y )});
		}
	}
	var ban; rectas = lados.slice();
	for(var i = 0; i < ar.length; i++){
		for(var k = 0; k < lados.length; k++){
			if(iguales(ar[i],lados[k]))
				ar.splice(i,1);
		}
	}
	for(var i = 0; i < ar.length;i++ ){
		rectas.push(ar[i]); 
		for(var j = 0; j < lados.length; j++){
			ban = colision(ar[i]['r'][0],ar[i]['r'][1],ar[i]['r'][2],ar[i]['r'][3],
				lados[j]['r'][0],lados[j]['r'][1],lados[j]['r'][2],lados[j]['r'][3],true);
			if(ban.x != false)
				if(ban.x != ar[i].r[0] && ban.y != ar[i].r[1])
					if(ban.x != ar[i].r[2] && ban.y != ar[i].r[3]){
						rectas.pop();
						j = lados.length;
					}
		}
	}
	rectas.push({from:g[0][0].id , to:g[0][1].id,
				r:[g[0][0].x,g[0][0].y,g[0][1].x,g[0][1].y],
				costo:dist(g[0][0].x,g[0][0].y,g[0][1].x,g[0][1].y )})
	ban = false;
	for(var i = 0; i < lados.length; i++){
		ban = colision(p[0].x,p[0].y,p[1].x,p[1].y,lados[i].r[0],lados[i].r[1],lados[i].r[2],lados[i].r[3]);
		if(ban == true)
			i = lados.length;
	}
	if(ban == true)
		rectas.pop();
	gg = colectar(rectas, nodes);

}

function colectar(aristas, nodes){
  var from; var grafoFrom = []; var grafoTo = [];
  for(var i = 0; i <= nodes.length; i++){
    grafoFrom[i] = []; grafoTo[i] = [];
    for(var j = 0; j < aristas.length; j++){
      if(aristas[j].from == i){
        grafoFrom[i].push([aristas[j].to,redondear2(aristas[j].costo)]);
      }
      if(aristas[j].to == i){
        grafoTo[i].push([aristas[j].from,redondear2(aristas[j].costo)]);
      }
    }
  }
  for(var i = 0; i < nodes.length; i++){
    grafoFrom[i] = {ady:grafoFrom[i].concat(grafoTo[i]), x:nodes[i].x,y:nodes[i].y};
  } 
  return grafoFrom;
}
function iguales(a,b){
	if(a['r'][0] == b['r'][0] && a['r'][1] == b['r'][1] &&
	   a['r'][2] == b['r'][2] && a['r'][3] == b['r'][3])
		return true
	else
		return false;
}
function colision(a,b,c,d,e,f,g,h,i){var j,k=((g-e)*(b-f)-(h-f)*(a-e))/((h-f)*(c-a)-(g-e)*(d-b)),l=((c-a)*(b-f)-(d-b)*(a-e))/((h-f)*(c-a)-(g-e)*(d-b));if(k>=0&&1>=k&&l>=0&&1>=l){if(i)var m=a+k*(c-a),n=b+k*(d-b);return i?j={x:m,y:n}:!0}return i?j={x:!1,y:!1}:!1}
function activar() {
	var a = document.getElementsByName('bar-slc');
  w3.addClass('#btn1','w3-white');
  w3.addClass('#btn2','w3-white');
  w3.addClass('#btn3','w3-white');
  if(a[0].value == 0){
    w3.removeClass('#btn1','w3-white');
    w3.addClass('#btn1','w3-blue');
  }else if( a[0].value == 1){
    w3.removeClass('#btn2','w3-white');
    w3.addClass('#btn2','w3-blue');
  }else{
    w3.removeClass('#btn3','w3-white');
    w3.addClass('#btn3','w3-blue');
  }
}
function redondear2(number) {
  if(!isNaN(number)){
    numString = number.toFixed(2);
    numDecimal = 0;
    len = numString.length;
    for(i=1;i<=2;i++)
      if(numString[len-i]!='0')
        break;
      else
        numDecimal++;
      return parseFloat(number.toFixed(2-numDecimal));
    }
}