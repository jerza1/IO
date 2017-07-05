var fil; var col; var pag;
function inicio() {
	var matriz = document.getElementById('entrada').value;
	if(matriz.length == 0){
		msj = $("#alert");
		msj.addClass("w3-show"); msj.text("Los datos no son validos")
		return;
	}
	pag = 1;
	resolver(matriz, pag);
}
function resolver(matriz, pag) {
	
		matriz = crearMatriz(matriz);	
		fil = matriz.length-1;
		col = matriz[0].length-1;

		var matrizOp = [];
		copiar(matriz,matrizOp);
		esquinaNE(matrizOp); var cont = 0;
		do{
		//Z = calcularZ(matriz, matrizOp);
		var matrizMult = [];
		for(i = 0; i < fil; i++){
			matrizMult[i] = []
			for(j = 0; j < col; j++){
				if(matrizOp[i][j] != "M"){
					matrizMult[i][j] = matriz[i][j];
				}else matrizMult[i][j] = "M";
			}
		}
		
		var aV = (matrizOp[0].slice(0, col)).fill('-'); 
		var aU = (matrizOp[0].slice(0,fil)).fill('-');
		getMulti(matrizMult,aV,aU);
		var matrizCZ = [];
		copiar(matrizOp, matrizCZ);
		var ruta = [];
		for(i = 0; i < fil; i++){
			for(j = 0; j < col; j++){
				if(matrizOp[i][j] == "M"){
					matrizOp[i][j] =  (aU[i] + aV[j]) - matriz[i][j];
					matrizCZ[i][j] = (aU[i] + aV[j]) - matriz[i][j];
				}else{
					ruta.push({ valor: matrizCZ[i][j],x:i, y:j, contX:0,
						contY:0, id:(j+1)+(col*i), goX:0, goY:0
					});
					matrizCZ[i][j] = (aU[i] + aV[j]) - matriz[i][j];
				}
			}
		}
		var inicio = getMax(matrizCZ);
		ruta.push(inicio);
		getRuta(ruta);

		var rutaReal = []; rutaReal.push(inicio);
		var actual = inicio; var dire = "X";
		for(j =  0; j < ruta.length; j++){
			var i = 0; var find = false
			while(i < ruta.length && find == false){
				if(dire == 'X'){			
					if(ruta[i].goX == actual.id){
						ruta[i].valor *= -1;
						dire = 'Y'; find = true;
						actual = ruta[i]; rutaReal.push(ruta[i]);
					}
				}else
				if(ruta[i].goY == actual.id){
					dire = 'X'; find = true;
					actual = ruta[i]; rutaReal.push(ruta[i]);
				}i++;
			}
		}
		ruta = ruta.concat(rutaReal);
		ruta = removeDuplicates(ruta, "id");
		var teta = getMin(rutaReal);
		imprimirTabla(matriz, matrizOp, aU, aV, rutaReal, pag);  pag+=1;
		modificarMatriz(matrizOp, rutaReal, teta);
		imprimirTabla(matriz, matrizOp, aU, aV, rutaReal, pag); pag+=1;
		ruta = ruta.concat(rutaReal);
		ruta = removeDuplicates(ruta, "id");
		a = soloNeg(matrizOp, ruta);
		cont+=1;
		}while(cont <= 2);
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
function soloNeg(matrizOp, ruta) {
	var band = true; 
 	for(var j = 0; j < fil; j++){
		for(var k = 0; k < col; k++){
			for(var i = 1; i < ruta.length ; i++){
				if(ruta[i].id != (k+1)+(col*j))
					if(matrizOp[j][k] > 0)
						band=false
			}
		}
	}
	//console.log(matrizOp + "H");
  return band;
}
function modificarMatriz(matrizOp, rutaReal, teta) {
	for(var i = 1; i < rutaReal.length; i++){
		sig = false;
		for(var j = 0; j < matrizOp.length && sig == false; j++){
			for(var k = 0; k < matrizOp[j].length && sig == false; k++){
				if(rutaReal[i].id == (k+1)+(col*j)){
					if(rutaReal[i].valor < 0){
						rutaReal[i].valor *=-1;
						matrizOp[j][k] = rutaReal[i].valor -  teta;
					}else
						matrizOp[j][k] = rutaReal[i].valor +  teta;
					rutaReal[i].valor = matrizOp[j][k];
					sig = true
				}
				if(rutaReal[0].id == (k+1)+(col*j)){
					matrizOp[j][k] = teta;
					rutaReal[0].valor = teta;
				}
			}
		}
	}
}

function imprimirTabla(matriz,matrizOp, aU, aV, rutaReal, pag) {
	var solucion = $('#solucion');
	solucion.append('<div class=""><h3>Tabla'+pag+'</h3></div><div id="tab'+pag+'" class="w3-content w3-center"></div>');
	var div = $('#tab'+pag);
	div.append('<table class="w3-table-all w3-card-4 w3-centered" id="tableo'+pag+'"></table>');
	tableo = $('#tableo'+pag); var nuevaFila = "<tr class='w3-light-gray'>";
	for(i =  0; i < (fil*2)+2; i++){
		nuevaFila = '<tr>'
		for(j = 0; j < (col*2)+2; j++){
			if(i == 0){
				if(j == 0)
					nuevaFila+='<td>U<sub>ij</sub>&bsol;V<sub>ij<sub></td>'
				else if(j == (col*2)+1){
					nuevaFila+='<td>Oferta</td>';
				}else if((j % 2) == 0){
					nuevaFila+='<td colspan="2">'+aV[(j/2)-1]+'</td>';
				}
			}else{
				if(j == 0 && (i % 2) == 1 && i != (fil*2)+1)
					nuevaFila+='<td rowspan="2">'+aU[parseInt(i/2)]+'</td>';
				if ((j % 2) == 0 && j != (col*2)+1	&& j != 0 &&  (i % 2) == 1 && i != (fil*2)+1)
					nuevaFila+='<td>'+matriz[parseInt(i/2)][(j/2)-1]+'</td>';
				else if((j % 2) == 1 &&  (i % 2) == 1 && j != (col*2)+1 && j != 0 && i != (fil*2)+1)
							nuevaFila+='<td> </td>';
				else if((i % 2) == 0 && j != 0 && (j%2) == 1 && j != (col*2)+1 )
					nuevaFila+='<td colspan="2">'+matrizOp[(i/2)-1][parseInt(j/2)]+'</td>';
				else if( j != 0 && (j%2) == 1 && j != (col*2)+1 && i == (fil*2)+1)
					nuevaFila+='<td colspan="2">'+matriz[fil][parseInt(j/2)]+'</td>';
				else if(i == (fil*2)+1 && j == 0)
					nuevaFila+='<td>Demanda</td>'
				else if(i == (fil*2)+1 && j == (col*2)+1)
					nuevaFila+='<td></td>'
				if(j == (col*2)+1 && (i % 2) == 1 && i != (fil*2)+1 )
					nuevaFila+='<td rowspan="2">'+matriz[parseInt(i/2)][col]+'</td>';
			}
		}
		nuevaFila+="</tr>";
		tableo.append(nuevaFila);
	}
}
function crearMatriz(matriz) {
	var arr = matriz.split(' ');
	arr = arr.toString();
	arr = arr.split('\n');
	len = arr.length;
	for(i = 0; i < len; i++)
		arr[i] = JSON.parse("["+arr[i]+"]");
	return arr;
}
function eliminaRep(inicio,ruta) {
	for(var i = 0; i < ruta.length; i++){
		if(inicio.id == ruta[i].id){
			ruta.splice(i,1);
		}
	}
}
function getRuta(ruta){
	for(i = 0; i < ruta.length-1; i++){
		for(j = i+1; j < ruta.length; j++){
			if(ruta[i].x == ruta[j].x || inicio.x == ruta[j].x){
				ruta[i].contX++; ruta[j].contX++;
				ruta[i].goX = ruta[j].id;
				ruta[j].goX = ruta[i].id;
				inicio.contX++; inicio.goX = ruta[j].id;
			}
			if(ruta[i].y == ruta[j].y){
				ruta[i].contY++; ruta[j].contY++;
				ruta[i].goY = ruta[j].id;
				ruta[j].goY = ruta[i].id;
				inicio.contY++; inicio.goY = ruta[j].id;
			}
		}
	}
	for(i = 0; i < ruta.length; i++){
		if(ruta[i].contY == 0 || ruta[i].contX == 0){
			ruta.splice(i,1);
		}
	}
}
function getMax(matrizCZ) {
	var max = { valor : -Infinity};
	for(var i = 0; i < matrizCZ.length; i++){
		var len = matrizCZ[i].length;
		while (len--) {
			if (matrizCZ[i][len] > max.valor && matrizCZ[i][len] > 0) {
				max = { valor : matrizCZ[i][len], x : i, y : len, contX:0, contY:0, id:(len+1)+(i*len)};
			}
		}
	}
	return max;
}
function getMin(ruta) {
	var min = Infinity;
	var len = ruta.length;
	while (len--) {
		if(ruta[len].valor < 0){
			if (ruta[len].valor * -1 < min) {
				min = ruta[len].valor * -1;
			}
		}
	}
	return min;
}
function getMulti(matrizMult,aV,aU) {
	var i = 0; var j = 0;
	do{
		var resuleto = true;
		while(i < fil){
			while(j < col){
				if(i == 0){
					if(matrizMult[i][j] != "M" && aV[j] == '-'){
						aU[i] = 0; aV[j] = matrizMult[i][j];
					}
				}else{
					if(matrizMult[i][j] != "M"){
						if(aU[i] != '-' && aV[j] == '-'){
							aV[j] = matrizMult[i][j] - aU[i];
						}if(aU[i] == '-' && aV[j] != '-'){ 
							aU[i] = matrizMult[i][j] - aV[j];
						}if(aU[i] == '-' && aV[j] == '-'){
							resuleto = false;
						}
					}
				}j++;
			} i++; j =0;
		}
		if(resuleto == false){ i = 0; j = 0;}
	}while(resuleto != true);	
}

function calcularZ(matriz, matrizOp){
	var Z = 0; 
	for(var i = 0; i < fil; i++){
		for(var j = 0; j < col; j++){
			if(matrizOp[i][j] != "M"){
				Z += matriz[i][j] * matrizOp[i][j];
			}
		}
	}
	return Z;
}
function copiar(matriz, matrizOp) {
	for (var i = 0; i < matriz.length; i++) {
		matrizOp[i] = matriz[i].slice();	
	}
}
function esquinaNE(matrizOp){
	var i = 0; var j = 0;
	while((i+j) < (fil + col)-1){
		minimo = Math.min(matrizOp[i][col], matrizOp[fil][j]);
		matrizOp[i][j] = minimo;
		matrizOp[i][col] = matrizOp[i][col] - minimo;
		matrizOp[fil][j] = matrizOp[fil][j] - minimo;
		if(matrizOp[i][col] == 0){
			matrizOp[i].fill("M",(j+1),col); i++;
		}else{
			for(k = (i+1); k < fil; k++)
				matrizOp[k][j] = "M";
			j++; 
		}
	}
}

function redondear4(number) {
	numString = number.toFixed(4);
	numDecimal = 0;
	len = numString.length;
	for(var i=1;i<=4;i++)
		if(numString[len-i]!='0')
			break;
		else
			numDecimal++;
		return parseFloat(number.toFixed(4-numDecimal));
}