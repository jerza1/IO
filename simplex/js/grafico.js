var colores = ['blue','green','yellow','purple','lime','navy','magenta','maroon'];
/**nRes[integer]: número de restricciones
* zX1[float],zX2[float]: valor de X1 y X2 de función objetivo
* rectas[array]: recta de cada ecuación
*/
var zX1; var zX2;
var nRes;  var rectas = [];
var maxX1; var maxX2;
/** [inicio agrega input segun nRes]*/
function inicio() {
	nRes = parseInt($('#nres').val());
	if(isNaN(nRes)) {
		w3.addClass('#alert','w3-show');
		$('#nres').focus();
		return;
	}
	w3.removeClass('#alert','w3-show'); 
	w3.addClass('#Demo2','w3-show'); $('#Demo2').prev().addClass('w3-light-blue');
    w3.addClass('#Demo3','w3-show'); $('#Demo3').prev().addClass('w3-light-blue');
	w3.removeClass('#msj1','w3-show'); w3.addClass('#msj1','w3-hide');
	w3.addClass('#form','w3-show');
	$('#form2').empty();
	for (var i = 1; i <= nRes; i++) {
		elem = $("<tr><td><input type='text'class='coeficientes1'>+<td>\
				  <input type='text' class='coeficientes1'><td><select\
				  name='desigualdad'><option value='0'><=<option value='1'>\
				  =<option value='2'>>=<td><input type='text' class='coeficientes1'>"
				 );
		 $('#form2').append(elem);	
	}
	elem = $("<a href='#grafica' onclick='resolver()' class='w3-btn w3-round-xlarge\
			  w3-green'>Graficar</a>"
			);
	$('#form2').append(elem);
}
/** [resolver verifica valores de coeficiente y función objetivo,
			  obtiene las rectas de cada ecuación,
			  obtiene coordenada máxima]*/
function resolver() {
	var rFact= [];
	var coef = $('.coeficientes1');
	for(i = 0; i < coef.length; i++) {
		if(isNaN(parseFloat(coef[i].value))) {
			w3.addClass('#alert2','w3-show');
			return;
		}
	}
	w3.removeClass('#msj2','w3-show'); w3.addClass('#msj2','w3-hide');
	w3.removeClass('#alert2','w3-show');
	w3.addClass('#Demo4','w3-show'); $('#Demo4').prev().addClass('w3-light-blue');

	var x1 = []; var x2 = []; var r = [];
	zX1 = parseFloat(coef[0].value);
	zX2 = parseFloat(coef[1].value);
	for(i = 0; i < nRes; i++ ) {
		x1.push(parseFloat(coef[2+(i*3)].value));
		x2.push(parseFloat(coef[2+(i*3)+1].value));
		r.push(parseFloat(coef[2+(i*3)+2].value));
	}
	var inter = [];	inter[0]=[];  inter[1]=[];
	var max = -1;
	for(i = 0; i < nRes; i++ ) {
		rectas[i] = [];
		if(x1[i] == 0 ) {		
			rectas[i].push(0);
			rectas[i].push(r[i]/x2[i]);
			rectas[i].push('inf');
			rectas[i].push(r[i]/x2[i]);
		}else if(x2[i] == 0) {
			rectas[i].push(r[i]/x1[i]);
			rectas[i].push(0);
			rectas[i].push(r[i]/x1[i]);
			rectas[i].push('inf');
		}else if(r[i] == 0){
			rectas[i].push(0);
			rectas[i].push(0);
			ax = (x2[i]*-100)/x1[i];
			rectas[i].push(ax);
			rectas[i].push(x2[i]*100);
		}
		else{
			rectas[i].push(0);
			rectas[i].push(r[i]/x2[i]);
			rectas[i].push(r[i]/x1[i]);
			rectas[i].push(0);
		}
		for(j = 0;j < 2;j++) {
			if(rectas[i][j*2]!='inf')
				max=Math.max(max,rectas[i][j*2]);
		}
	}
	var pot = parseInt(Math.log10(max));
	cXmax = parseInt(max/(Math.pow(10,pot)));
	cXmax++;	cXmax*=(Math.pow(10,pot));

	for(i = 0;i < nRes; i++) {
		for(j = 0;j < 2; j++) {
			if(rectas[i][j*2]=='inf')
				rectas[i][j*2]=cXmax;
		}
		for(j = 0; j < 2; j++) {
			if(rectas[i][j*2+1]=='inf')
				rectas[i][j*2+1]=cXmax;
		}
	}
	for(i = 0; i < nRes; i++) {
		inter[0].push(rectas[i][0]);
		inter[1].push(rectas[i][1]);
		inter[0].push(rectas[i][2]);
		inter[1].push(rectas[i][3]);
	}
	inter[0].push(0.0);
	inter[1].push(0.0);

	intersecciones(inter,coef);

	var puntos = [];
	for(i = 0;i < inter[0].length; i++){ puntos.push({x:inter[0][i],y:inter[1][i]}); }

	areaSol(inter,coef,puntos,rFact);
	if(rFact.length > 2 ){
		convex(rFact);
	}else{
		dibujar(rFact,rFact);
	}
	
}
/** [intersecciones obtiene las intersecciones de cada recta siempre que pueda]
* @param array inter coordenadas de cada recta ej (9,0),(0,9)
* @param array coef  valor de cada input con clase coeficientes
*/
function intersecciones(inter,coef) {
	for(i = 0; i < nRes-1; i++) {
		for(j = i+1; j < nRes; j++) {
			iY = (parseFloat(coef[2+j*3+1].value)/parseFloat(coef[2+i*3+1].value))*(-1);
			iX = (iY*parseFloat(coef[2+i*3+2].value)+parseFloat(coef[2+j*3+2].value))/(iY*parseFloat(coef[2+i*3].value)+parseFloat(coef[2+j*3].value));
			iY = (parseFloat(coef[2+i*3+2].value)-iX*parseFloat(coef[2+i*3].value))/parseFloat(coef[2+i*3+1].value);
			if(iX>= 0.0 && iY>=0.0) {
				inter[0].push(iX);
				inter[1].push(iY);
			}
		}
	}
}
/** [areaSol obtiene la region factible del problema]
* @param array inter coordenadas de cada recta ej (9,0),(0,9)
* @param array coef  valor de cada input con clase coeficientes
* @param object puntos guarda las intersecciones con formato x:3,y:4
* @param array rFact guarda los puntos del area de soluciones
*/
function areaSol(inter,coef,puntos,rFact) {
	desigualdad = document.getElementsByName('desigualdad');
	
	for(i = 0; i < inter[0].length; i++) {
		var band = true;
		for(j = 0; j < nRes; j++) {
			res = parseFloat(coef[2+j*3+2].value);
			pEval = inter[0][i] * parseFloat(coef[2+j*3].value) + inter[1][i] * parseFloat(coef[2+j*3+1].value);
			operador = parseInt(desigualdad[j].value);
			switch(operador) {
				case 0:
				if(pEval.toFixed(8) <= res)
					break;
				else{ 
					band = false; }
				break;
				case 1:
				if(pEval.toFixed(8) == res)
					break;
				else{ 
					band = false; }
				break;
				case 2:
				if(pEval.toFixed(8) >= res)
					break;
				else{ 
					band = false; }
				break;
				default:
				console.error("No hay intersecciones");
				break;
			}
		}
		if(band == true) {
			if(puntos[i].x >= 0 && puntos[i].y >= 0){
				rFact.push(puntos[i]);
			}
		}
	}	
}
/** [convex ordena los puntos de rFact con el Método Graham]
* @param array rFact guarda los puntos del area de soluciones
*/
function convex(rFact){
	rFact.sort(function(a,b){ return a.y == b.y ? a.x - b.x : a.y - b.y; });
	
	var inferior = []; var n = rFact.length;
	for(var i = 0; i < n; i++){
		while(inferior.length >= 2 && area2(rFact[i], inferior[inferior.length - 1], inferior[inferior.length - 2]) <= 0){
			inferior.pop();
		}
		inferior.push(rFact[i]);
	}
	var superior = [];
	for(var i = n - 1; i >= 0 ; i--){
		while(superior.length >= 2 && area2(rFact[i], superior[superior.length - 1], superior[superior.length - 2]) <= 0){
			superior.pop();
		}
		superior.push(rFact[i]);
	}
	superior.pop();
	inferior.pop();
	dibujar(inferior.concat(superior),rFact);
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
/**[dibujar crea el canvas dibuja las rectas, la región factible y la funcion objetivo]
*  @param array poligono arreglo de objetos que guarda las puntos de la región factible
*/
function dibujar(poligono,rFact){
	var zMin = Number.POSITIVE_INFINITY, zMax = Number.NEGATIVE_INFINITY;
	var pMax, pMin;
	for(i = 0;i < rFact.length; i++){
		if(zMin > rFact[i].x*zX1 + rFact[i].y*zX2){
			zMin = rFact[i].x*zX1 + rFact[i].y*zX2;
			pMin = rFact[i];
		}
		if(zMax < rFact[i].x*zX1 + rFact[i].y*zX2){
			zMax = rFact[i].x*zX1 + rFact[i].y*zX2;
			pMax = rFact[i];
		}
	}
	poligono.push(poligono[0]);	
	var data = [];
	for(i = 0;i < nRes; i++) {
		data.push({'label':'E'+(i+1),'type':'line','backgroundColor':colores[i],'borderColor':colores[i],
				'data':[{x:rectas[i][0],y:rectas[i][1]},{x:rectas[i][2],y:rectas[i][3]}],'fill':false});
	}

	data.push({'label':'ZMAX','type':'line','backgroundColor':'red','borderColor':'red',
				'data':[{x:zMax/zX1,y:0},{x:0,y:zMax/zX2}],'fill':false});
	data.push({'label':'ZMIN','type':'line','backgroundColor':'orange','borderColor':'orange',
				'data':[{x:zMin/zX1,y:0},{x:0,y:zMin/zX2}],'fill':false});

	data.push({'label':'RF','type':'line','backgroundColor':'rgba(0,0,0,0.3)','borderColor':'rgba(0,0,0,0.3)',
				'data':poligono,'fill':true,'pointRadius':4});
	$('canvas').remove();
	
	$('#Demo4').append('<canvas id="lineChart" class="w3-show">\
						Tu navegador no soporta el elemento CANVAS</canvas>');
	var ctx = document.getElementById("lineChart");
	var myChart = new Chart(ctx);
	
	Chart.defaults.global.elements.line.tension = 0.0;
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			datasets: data,
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}],
			},
			tooltips: {
				enabled: true,
				mode: 'single',
				callbacks: {
					title: function (tooltipItem) { 
						return "Punto "; 
					},
					label: function(tooltipItems) {
						return "X: " + tooltipItems.xLabel.toFixed(4) + " Y: " + tooltipItems.yLabel.toFixed(4);
					},
					footer: function (tooltipItem) { return ""; }
				}
			}
		}
	});
	
	w3.addClass('#datos','w3-show');
	$('#card').remove();
	$('#datos').append("<div class= 'w3-panel w3-card-4 w3-pale-blue' id='card'>\
						<h2>Punto Mínimo<br>X1: "+pMin.x.toFixed(4)+"<br>X2: "+pMin.y.toFixed(4)+"<br>Zmin: "+zMin.toFixed(4)+
						"<h2>Punto Máximo<br>X1: "+pMax.x.toFixed(4)+"<br>X2: "+pMax.y.toFixed(4)+"<br>Zmax: "+zMax.toFixed(4));
}