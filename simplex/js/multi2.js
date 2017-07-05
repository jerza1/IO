var fil; var col; var pag;
function inicio() {
	var entrada = $('#entrada').val();
	if(entrada.length == 0){
		msj = $("#alert");
		msj.addClass("w3-show"); msj.text("Por favor ingrese los datos...")
		return;
	}
	$('#solucion').empty();
	pag = 0;
	resolver(entrada, pag);
}
function resolver(entrada, pag){
	entrada = crearMatriz(entrada);
	fil = entrada.length-1;
	col = entrada[0].length-1;
	var costos = []; 
	copiar(entrada,costos,true);
	var multV = (costos[0].slice(0, col)).fill('-'); 
	var multU = (costos[0].slice(0,fil)).fill('-');
	imprimirTabla(entrada, costos, multU, multV, ++pag, "Tabla Inicial");
	copiar(entrada,costos,false);
	esquinaNE(costos);
	//inicia ciclo
	do{
		var costosBas = [];
		for(i = 0; i < fil; i++){
			costosBas[i] = []
			for(j = 0; j < col; j++){
				if(costos[i][j] != "M"){
					costosBas[i][j] = entrada[i][j];
				}else costosBas[i][j] = "M";
			}
		}
		getMult(costosBas,multV,multU);
		var noBasicas = [];
		copiar(costos, noBasicas,false);
		var basicas = [];
		for(i = 0; i < fil; i++){
			for(j = 0; j < col; j++){
				if(costos[i][j] == "M"){
					costos[i][j] =  (multU[i] + multV[j]) - entrada[i][j];
					noBasicas[i][j] = (multU[i] + multV[j]) - entrada[i][j];
				}else{
					basicas.push({id:(j+1)+(i*(col-1)+i),valor: noBasicas[i][j],x:i, y:j});
					noBasicas[i][j] = (multU[i] + multV[j]) - entrada[i][j];
				}
			}
		}
		imprimirTabla(entrada, costos, multU, multV, ++pag, "Matriz con variables Basicas y No Basicas");
		var valZ = calcularZ(entrada,basicas,pag);
		pintarBas(basicas, pag, valZ);
		var continuar = soloNeg(noBasicas);
		if(!continuar){
			var inicio = getMax(noBasicas);
			basicas.unshift(inicio);
			var cola = [{coor:[inicio.x,inicio.y],ruta:[inicio]}];
			cola = getRuta(basicas, inicio, cola);
			imprimirTabla(entrada, costos, multU, multV, ++pag, "Matriz mostrando Ruta");
			var teta = getMin(cola);
			pintarRuta(cola, pag, teta);
			modificarMatriz(costos, cola, teta);
			var a = cola['ruta'].find(x => x.valor == 0 && x.id != inicio.id );	
			basicas = basicas.concat(cola['ruta']);
			basicas = removeItemFromArr(basicas,a);
			basicas = removeDuplicates(basicas, "id");
			iniciarCostos(costos, basicas);
			multV = (costos[0].slice(0, col)).fill('-'); 
			multU = (costos[0].slice(0,fil)).fill('-');
		}
	}while(!continuar);
}
function pintarBas(basicas,pag, Z){
	var tabla = $('#tableo'+pag).contents();
	divZ = $('div#tabla'+pag).find('p#valorZ'+pag);
	for(var i = 0; i < basicas.length; i++){
		a = tabla.find('td#bNB'+basicas[i].id);
		a.css("background",'#000fff4d ');
	}
	divZ.append('Z = ' + redondear2(Z));
}
function pintarRuta(cola,pag, teta){
	var tabla = $('#tableo'+pag).contents();
	sig = tabla.find('td#signo');
	divZ = $('div#tabla'+pag).find('p#valorZ'+pag);
	for(var i = 0; i < cola['ruta'].length; i++){
		a = tabla.find('td#bNB'+cola['ruta'][i].id);
		if(i == 0)
			a.css("background",'rgba(51, 242, 23, 0.65) ');
		else if(i % 2 == 0){
			a.css("background",'#0000ff4d ');
			sig[cola['ruta'][i].id-1].append('+');
		}else{
			a.css("background",'#fb03034d ');
			sig[cola['ruta'][i].id-1].append('-');
		}
	}
	divZ.append('Teta = '+ teta);
}
function calcularZ(entrada, basicas,pag){
	var Z = 0; 
	for(var i = 0; i < basicas.length; i++){
		Z += entrada[basicas[i].x][basicas[i].y] * basicas[i].valor;
	}
	return Z;
}
function soloNeg(noBasicas) {
	var band = true;
	for(var i = 0; i <= fil-1; i++){
		a = noBasicas[i].findIndex(x => x > 0 && x != "M")
		if(a != -1)
			band = false;
	}
	return band;

}
function removeItemFromArr( arr, item ) {
    return arr.filter( function( e ) {
        return e.id !== item.id;
    } );
}
function iniciarCostos(costos, basicas){
	for(i = 0; i < fil; i++)
		costos[i].fill("M");
	for(i = 0; i < basicas.length; i++)
		costos[basicas[i].x][basicas[i].y] = basicas[i].valor;
}
function modificarMatriz(costos, cola, teta) {
	for(i =  1; i < cola['ruta'].length; i++){
		if(i % 2 == 1)
			costos[cola['ruta'][i].x][cola['ruta'][i].y] = cola['ruta'][i].valor - teta;
		else 
			costos[cola['ruta'][i].x][cola['ruta'][i].y] = cola['ruta'][i].valor + teta;
		cola['ruta'][i].valor = costos[cola['ruta'][i].x][cola['ruta'][i].y];
	}
	costos[cola['ruta'][0].x][cola['ruta'][0].y] = teta;
	cola['ruta'][0].valor = teta;
}
function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
}
function getMin(basicas) {
	var min = Infinity;
	var len = basicas['ruta'].length;
	while (len--) {
		if(len % 2 == 1){
			if (basicas['ruta'][len].valor  < min) {
				min = basicas['ruta'][len].valor;
			}
		}
	}
	return min;
}
function getRuta(basicas, inicio, cola){
	var actual = cola.shift();
	do{
		if(actual['ruta'].length % 2 == 1){
			for(var i = 0; i < basicas.length; i++){
				if(basicas[i].x == actual.coor[0] && basicas[i].y != actual.coor[1]){
					cola.push({coor:[basicas[i].x,basicas[i].y], ruta:actual.ruta.slice()});
					cola[cola.length-1]['ruta'].push(basicas[i]);
				}
			}
		}else{
			for(var i = 0; i < basicas.length; i++){
				if(basicas[i].y == actual.coor[1] && basicas[i].x != actual.coor[0] ){
					cola.push({coor:[basicas[i].x,basicas[i].y], ruta:actual.ruta.slice()});
					cola[cola.length-1]['ruta'].push(basicas[i]);
				}
			}
		}
		actual = cola.shift();
		actual.coor[0] == inicio.x && actual.coor[1] == inicio.y ? band = false : band = true ;
	}while(band == true);
	actual['ruta'].pop();
	return actual;
}
function getMax(noBasicas) {
	var max = { valor : -Infinity};
	for(var i = 0; i < noBasicas.length-1; i++){
		var len = noBasicas[i].length-1;
		while (len--) {
			if (noBasicas[i][len] > max.valor && noBasicas[i][len] > 0) {
				max = {id:(i*(col-1)+i)+(len+1),valor : noBasicas[i][len], x : i, y : len};
			}
		}
	}
	return max;
}
function getMult(costosBas,multV,multU) {
	var band = true; multU[0] = 0;
	for (; band;){
		band = false;
		for (var i = 0; i < fil; i++) {
			for (var j = 0; j < col; j++) {
				if (costosBas[i][j] != 'M') {
					if (isNaN(multU[i]) && !isNaN(multV[j]))
						multU[i] = costosBas[i][j] - multV[j];
					else if (isNaN(multV[j]) && !isNaN(multU[i]))
						multV[j] = costosBas[i][j] - multU[i];
					else if (isNaN(multV[j]) && isNaN(multU[i]))
						band = true;
				}
			}
		}
	}
}
function crearMatriz(entrada) {
	var matriz = entrada.split(' ');
	matriz = matriz.toString();
	matriz = matriz.split('\n');
	var len = matriz.length;
	for(i = 0; i < len; i++)
		matriz[i] = JSON.parse("["+matriz[i]+"]");
	var oferta = 0;	var long = matriz[0].length-1;
	var demanda = 0;
	for(i = 0; i < len; i++)
		oferta += matriz[i][long]
	for(i = 0; i < long; i++)
		demanda += matriz[len-1][i];
	if(oferta != demanda){
		if(oferta > demanda){
			for(i = 0; i < len; i++)
				matriz[i].splice(long,0,0);
			matriz[len-1][long] = (oferta-demanda);
			matriz[len-1][long+1] = oferta;
		}else{
			matriz.push(matriz[len-1].slice());
			matriz[len-1].fill(0);
			matriz[len-1][long] = (demanda-oferta);
			matriz[len][long] = demanda;
		}
	}else
		matriz[len-1][long] = demanda;
	return matriz;
}
function copiar(matriz, costos,init) {
	if(init == true){
		for (var i = 0; i < matriz.length; i++) 
			costos[i] = matriz[i].slice().fill("--");	
	}else
		for (var i = 0; i < matriz.length; i++) 
			costos[i] = matriz[i].slice();	
}
function imprimirTabla(entrada,costos,multU,multV, pag, msj) {
	var ultFil = (fil*2)+2; var ultCol = (col*2)+2;
	var divSolucion = $('#solucion');
	divSolucion.append('<div class=""><h3>'+msj+'</h3></div><div id="tabla'+pag+'"\
						class="w3-content w3-center"></div>');
	var divTabla = $('#tabla'+pag);
	divTabla.append('<table class="w3-table w3-card-4 w3-centered" id="tableo'+pag+'"></table>');
	tableo = $('#tableo'+pag); var nuevaFila = "<tr class='w3-light-gray'>";
	for(i =  0; i < ultFil; i++){
		nuevaFila = '<tr>'
		for(j = 0; j < ultCol; j++){
			if(i == 0){
				if(j == 0) //Uij \ Vij
					nuevaFila+='<td class="w3-light-gray" style="width:30px;">U<sub>ij</sub>&bsol;V<sub>ij<sub></td>'
				if(j == ultCol-1)
					nuevaFila+='<td class="w3-light-gray" style="20px;">Oferta</td>';
				if((j % 2) == 0 && j != 0 && j != ultCol-1) //multiplicadores en V
					nuevaFila+='<td colspan="2" id="multV">'+redondear2(multV[(j/2)-1])+'</td>';
			}else if(i == ultFil-1){
				if(j == 0)
					nuevaFila+='<td class="w3-light-gray">Demanda</td>'
				else if( (j%2) == 1 && j != ultCol-1)//Demanda
					nuevaFila+='<td colspan="2">'+entrada[fil][parseInt(j/2)]+'</td>';
				if(j == ultCol-1) //suma(Oferta) = suma(Demanda)
						nuevaFila+='<td>'+entrada[fil][col]+'</td>'
			}
			else{
				if(j == 0 && (i % 2) == 1)//multiplicadores en U
					nuevaFila+='<td rowspan="2" id="multU">'+redondear2(multU[parseInt(i/2)])+'</td>';
				else if(j == ultCol-1){
					if((i % 2) == 1 ) //Oferta
						nuevaFila+='<td rowspan="2" id="oferta">'+entrada[parseInt(i/2)][col]+'</td>';
				}else{
					if((i % 2 ) == 1){
						if ((j % 2) == 0 )
							nuevaFila+='<td id="costos">'+entrada[parseInt(i/2)][(j/2)-1]+'</td>'; //costos de Transporte
						else
							nuevaFila+='<td id="signo"></td>'; //signo de la ruta
					}else 
						if((j%2) == 1 ){ //Costos marginales B y NB
							id = (parseInt(j/2)+1)+(((i/2)-1)*(col-1)+((i/2)-1))
							nuevaFila+='<td colspan="2" id="bNB'+id+'">'+redondear2(costos[(i/2)-1][parseInt(j/2)])+'</td>';
						}
				}
				
			}
		}
		nuevaFila+="</tr>";
		tableo.append(nuevaFila);
	}
	divTabla.append('<p id="valorZ'+pag+'"></p>');
}
function esquinaNE(costos){
	var i = 0; var j = 0;
	while((i+j) < (fil + col)-1){
		minimo = Math.min(costos[i][col], costos[fil][j]);
		costos[i][j] = minimo;
		costos[i][col] = costos[i][col] - minimo;
		costos[fil][j] = costos[fil][j] - minimo;
		if(costos[i][col] == 0){
			costos[i].fill("M",(j+1),col); i++;
		}else{
			for(k = (i+1); k < fil; k++)
				costos[k][j] = "M";
			j++; 
		}
	}
}
function redondear2(number) {
	if(!isNaN(number)){
	numString = number.toFixed(2);
	numDecimal = 0;
	len = numString.length;
	for(var i=1;i<=2;i++)
		if(numString[len-i]!='0')
			break;
		else
			numDecimal++;
		return parseFloat(number.toFixed(2-numDecimal));
	}else
		return '--';
}