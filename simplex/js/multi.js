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
	var cont = 0;
	//inicia ciclo
	do{
	var basicas = [];
	for(i = 0; i < fil; i++){
		basicas[i] = []
		for(j = 0; j < col; j++){
			if(costos[i][j] != "M"){
				basicas[i][j] = entrada[i][j];
			}else basicas[i][j] = "M";
		}
	}
	getMult(basicas,multV,multU);
	var noBasicas = [];
	copiar(costos, noBasicas,false);
	console.log(JSON.stringify(basicas));
	var ruta = [];
	for(i = 0; i < fil; i++){
		for(j = 0; j < col; j++){
			if(costos[i][j] == "M"){
				costos[i][j] =  (multU[i] + multV[j]) - entrada[i][j];
				noBasicas[i][j] = (multU[i] + multV[j]) - entrada[i][j];
			}else{
				ruta.push({id:(j+1)+(i*(col-1)+i), valor: noBasicas[i][j],x:i, y:j});
				noBasicas[i][j] = (multU[i] + multV[j]) - entrada[i][j];
			}
		}
	}
	console.log(JSON.stringify(ruta));
	imprimirTabla(entrada, costos, multU, multV, ++pag, "Matriz Cij - Zij");
	var auxRuta = [];
	auxRuta = ruta.slice();
	var inicio = getMax(noBasicas);
	console.log(JSON.stringify(inicio));
	var rutaReal = []; rutaReal.push(inicio);
	getRuta(ruta, inicio, rutaReal);
	console.log(JSON.stringify(rutaReal));
	var teta = getMin(rutaReal);
	console.log(teta+'     teta')	;
	modificarMatriz(costos, rutaReal, teta);
	console.log(JSON.stringify(rutaReal));
	var a = rutaReal.find(x => x.valor == 0 && x.id != inicio.id );	
	auxRuta = auxRuta.concat(rutaReal);
	console.log(JSON.stringify(auxRuta));
	auxRuta = removeItemFromArr(auxRuta,a);
	auxRuta = removeDuplicates(auxRuta, "id");
	console.log(JSON.stringify(auxRuta));
	iniciarCostos(costos, auxRuta); cont++;
	multV = (costos[0].slice(0, col)).fill('-'); 
	multU = (costos[0].slice(0,fil)).fill('-');
	}while(cont < 4);
}
function removeItemFromArr( arr, item ) {
    return arr.filter( function( e ) {
        return e.id !== item.id;
    } );
};
function iniciarCostos(costos, cola){
	for(i = 0; i < fil; i++)
		costos[i].fill("M");
	for(i = 0; i < cola.length; i++)
		costos[cola[i].x][cola[i].y] = cola[i].valor;
}
function modificarMatriz(costos, rutaReal, teta) {
	for(i =  1; i < rutaReal.length; i++){
		if(rutaReal[i].valor < 0){
			rutaReal[i].valor *= -1;
			costos[rutaReal[i].x][rutaReal[i].y] = rutaReal[i].valor - teta;
		}else 
			costos[rutaReal[i].x][rutaReal[i].y] = rutaReal[i].valor + teta;
		rutaReal[i].valor = costos[rutaReal[i].x][rutaReal[i].y];
	}
	costos[rutaReal[0].x][rutaReal[0].y] = teta;
	rutaReal[0].valor = teta;
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
function getMin(cola) {
	var min = Infinity;
	var len = cola.length;
	while (len--) {
		if(cola[len].valor <= 0){
			if (cola[len].valor  < min) {
				min = cola[len].valor * -1;
			}
		}
	}
	return min;
}
function getRuta(cola, inicio, rutaReal){
	var actual = inicio; var dir = 'X'; 
	cola.reverse();  var idTem; 
	cola.push(inicio); 
	for(var i = cola.length-1; i > 0 ; i--){	
		if(dir == 'X'){
			idTem = cola.findIndex(obj => obj.x == actual.x);
			if(idTem != -1){
				if(cola[idTem].id != inicio.id){
					cola[idTem].valor *= -1;
					actual = cola[idTem]; dir = 'Y';
					x = cola.slice(idTem,idTem+1)
					rutaReal.push(x[0]);
					cola.splice(idTem,1);
				}else
					return;
			}else{
				rutaReal.pop(); dir = 'Y'
				actual = rutaReal[rutaReal.length-1];
			}
		}else{
			idTem = cola.findIndex(obj => obj.y == actual.y);
			if(idTem != -1){
				if(cola[idTem].id != inicio.id){
					actual = cola[idTem]; dir = 'X';
					x = cola.slice(idTem,idTem+1)
					rutaReal.push(x[0]); cola.splice(idTem,1);
				}else
					return;
			}else{
				rutaReal.pop();  dir='X'
				actual = rutaReal[rutaReal.length-1];
			}
		}
	}
}
function getMax(noBasicas) {
	var max = { valor : -Infinity};
	for(var i = 0; i < noBasicas.length-1; i++){
		var len = noBasicas[i].length-1;
		while (len--) {
			if (noBasicas[i][len] > max.valor && noBasicas[i][len] > 0) {
				max = {id:(i*(col-1)+i)+(len+1), valor : noBasicas[i][len], x : i, y : len};
			}
		}
	}
	return max;
}
function getMult(basicas,multV,multU) {
	var band = true; multU[0] = 0;
	for (; band;){
		band = false;
		for (var i = 0; i < fil; i++) {
			for (var j = 0; j < col; j++) {
				if (basicas[i][j] != 'M') {
					if (isNaN(multU[i]) && !isNaN(multV[j]))
						multU[i] = basicas[i][j] - multV[j];
					else if (isNaN(multV[j]) && !isNaN(multU[i]))
						multV[j] = basicas[i][j] - multU[i];
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
					nuevaFila+='<td colspan="2" id="multV">'+multV[(j/2)-1]+'</td>';
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
					nuevaFila+='<td rowspan="2" id="multU">'+multU[parseInt(i/2)]+'</td>';
				else if(j == ultCol-1){
					if((i % 2) == 1 ) //Oferta
						nuevaFila+='<td rowspan="2" id="oferta">'+entrada[parseInt(i/2)][col]+'</td>';
				}else{
					if((i % 2 ) == 1){
						if ((j % 2) == 0 )
							nuevaFila+='<td id="costos">'+entrada[parseInt(i/2)][(j/2)-1]+'</td>'; //costos de Transporte
						else
							nuevaFila+='<td id="signo"> </td>'; //signo de la ruta
					}else 
						if((j%2) == 1 ) //Costos marginales B y NB
							nuevaFila+='<td colspan="2" id="bNB">'+costos[(i/2)-1][parseInt(j/2)]+'</td>';
				}
				
			}
		}
		nuevaFila+="</tr>";
		tableo.append(nuevaFila);
	}
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