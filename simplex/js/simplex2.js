var nVar, numHol, numArt, numExc, nRes;
var varHol, varArt, varExc; var varBasicas; var matriz;
var modoSegundaFase; var fase; var error = false;
var mensajeError = "";
var historial = [];
var historialFila, historialColumna;
var pagina = 0; var inicializado = false;
function inicio() {
	nVar = parseInt(document.getElementById('nvar').value);
	nRes = parseInt(document.getElementById('nres').value);
	if(isNaN(nVar) || isNaN(nRes) || nVar < 1 || nRes < 1)	{
		msj = $("#msj1");
		msj.addClass("w3-show"); msj.text("Los datos no son validos")
		return;
	}
	$("#msj1").removeClass("w3-show");
	tabla = $('#tablaRes');
	tabla.empty();
	var cabeceras, cabeza;
	//Se agregan las cabeceras de la tabla de restricciones
	tabla.append('<tr id="cabeceras"></tr>');
	cabeceras = $('#cabeceras');
	cabeceras.empty();
	for (var i = 0; i < nVar; i++) {
		cabeceras.append('<th>X' + (i+1) + '</th>');
		cabeceras.append('<th style="min-width:20px;"></th>');
	}
	cabeceras.append('<th style="min-width:20px"></th>');
	cabeceras.append('<th style="min-width:20px"></th>');
	cabeceras.append('<th>R</th>');
	cabeceras.append('<tr>');

	//Se agregan los campos a la tabla de la función objetivo
	tablaObjetivo = $('#funcionObjetivo');
	tablaObjetivo.empty();
	tablaObjetivo.append('<tr id="cabeza"></tr>');
	tablaObjetivo.append('<tr id="coeficientesObjetivo"></tr>');
	coefObj = $('#coeficientesObjetivo');
	for (var i = 0; i < nVar+2; i++) {
		if(i==0) {
			coefObj.append('<td><input type="text" class="coef" value="1" disabled></td>');
			coefObj.append('<td>=</td>');
		}else
			if(i==nVar+1)
				coefObj.append('<td hidden><input type="text" class="coef" value="0" hidden></td>');
			else {
				if(i!=1)
					coefObj.append('<td><label>+</label></td>');
				coefObj.append('<td><input type="text" class="coef" ></td>');
			}
	}
	//Se agregan las cabeceras de la tabla de la función objetivo
	cabeza = $('#cabeza');
	cabeza.append('<th>Z</th>');
	for (var i = 0; i < nVar; i++) {
		cabeza.append('<th style="min-width:20px"></th>');
		cabeza.append('<th>X' + (i+1) + '</th>');
	}
	for(i=0;i<nRes;i++) {
		tabla.append('<tr id="fila' + (i+1) + '"></tr>');
		fila = $('#fila' + (i+1));
	//Se agrega cada entrada de coeficientes de cada restricción
		for(j=0;j<=nVar+2;j++) {
		    if(j==0) //Se pone el coeficiente correspondiente a la columna de los coeficientes de Z
				fila.append('<td hidden><input type="text" class="coef" value="0" hidden></td>');
			else if(j==nVar+1) {
				fila.append('<td></td>');
				fila.append('<td> <select name="desigualdad"><option value="0">≤<option value="1">≥<option value="2">=</select> </td>');
			}else {
				if(j==nVar+2)
					fila.append('<td></td>');
				else if(j!=1)
					fila.append('<td><label>+</label></td>');
				fila.append('<td><input type="text" class="coef"></td>');
			}
		}
	}
	tabla.append('<a href="#a" onclick="resolver()" id="a" class="w3-btn w3-round-xlarge w3-green w3-center">Resolver</a>');
}
function resolver() {
	coeficientes = document.getElementsByClassName('coef');
	for(i=0;i<coeficientes.length;i++) {
		if(isNaN(parseFloat(coeficientes[i].value))) {
			msj = $("#msj2"); msj.addClass("w3-show"); msj.text("Los datos no son validos")
			return;
		}
	}
	$("#msj2").removeClass("w3-show");
	tabla = $('#solucion');
	if(dosFases()!=true) {
		fase = 0;
		tabla.append('<h3 style="text-align:center">Aplicamos el Simplex Normal</h3>');
		iterarSolucion();
		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(historial[historial.length-1]),historial.length-1,"Tabla Final","",false);
		imprimir_Respuesta(varBasicas,matriz,numColumnas);
	}else {
		//La primer fase consiste en un problema de minización siempre
		fase = 1;
		tabla.append("<h3 style='text-align:center'>Aplicamos el Simplex de dos Fases</h3>");
		modoSegundaFase= document.getElementById('minMax').value;	//Se guarda el objetivo inicial
		document.getElementById('minMax').value=1;					//El modo de dos fases siempre minimiza primero
		iterarSolucion();	//Comienza la primer fase
		fase = 2; //Inicia la fase dos del método
		inicializado = false;
		document.getElementById('minMax').value= modoSegundaFase;
		iterarSolucion();
		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(historial[historial.length-1]),historial.length-1,"Tabla Final","",false);
		imprimir_Respuesta(varBasicas,matriz,numColumnas);
	}
}
//Esta función itera sobre la matriz principal para hallar la solución
function iterarSolucion() {
	if(inicializado==false) {
			inicializarMatriz();	
	}
	if(fase==1)	{//Se tiene que llevar los coeficientes de las variables artificiales de la función objetivo a 0
		for(i=nVar+numHol+1;i<nVar+numHol+numArt+1;i++) {
			for(j=1;j<=nRes;j++) {
				if(matriz[j][i]==1) {
					var coArtificial = matriz[0][i];
					for(k=0;k<numColumnas;k++) {
						matriz[0][k] += (matriz[j][k]*coArtificial*-1); 
					}
					break;
				}
			}
		}
		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(historial[historial.length-1]),historial.length-1,"Eliminamos la columna de variables artificiales","Sumamos las ecuaciones que contienen a las artificiales con la función objetivo auxiliar",false);
	}
	if(fase==2) {//Debemos verificar que los coeficientes de las variables de básicas en Z sean 0
			for(i=0;i<nRes;i++) {
				if(matriz[0][varBasicas[i]]!=0) {
					for(j=1;j<numFilas;j++) {
						if(matriz[j][varBasicas[i]]==1) {
							aux = -matriz[0][varBasicas[i]];
							for(k=0;k<numColumnas;k++) {
								matriz[0][k]=redondear(redondear(matriz[0][k])+(matriz[j][k]*aux ));
							}
							break;
						}
					}
				}
			}
		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(historial[historial.length-1]),historial.length-1,"Actualizamos las columnas de las variables básicas","",false);
				
	}
	while(matriz_resuelta()!=true) {
		columna = columna_pivote();
		fila = fila_pivote(columna);
		if(fila==-1) {	//Solución no acotada
			error=true;
			mensajeError = "Solución no acotada";
			break;
		}
		historialColumna.push(columna);
		historialFila.push(fila);
		//Se selecciona el elemento de la fila y columna pivote como pivote
		pivote = matriz[fila][columna];

		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(historial[historial.length-1]),historial.length-1,"Seleccionamos la variable que entra y sale","",true);
		
		varBasicas[fila-1]=columna;
		//Dividir los coeficientes de la fila pivote, entre el valor pivote
		for(i=0;i<numColumnas;i++) {
			matriz[fila][i]= matriz[fila][i]/pivote;
		}
		pivote= pivote/pivote;
		//Eliminar los coeficientes de la columna pivote usando al pivot
		for(i=0;i<numFilas;i++) { 
			if(i!=fila) {
				var temporal = (-matriz[i][columna])/pivote;
				for(j=0;j<numColumnas;j++) {
					matriz[i][j] = matriz[i][j] + temporal*matriz[fila][j];  
				}
			}
		}
		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(historial[historial.length-1]),historial.length-1,"Actualizamos la tabla","Fila pivote: Nuevo Elemento FP = Anterior Elemento FP / Pivote <br> Resto de las filas: Nuevo Elemento Fila = Anterior Elemento Fila - (Anterior Elemento Fila en CP * Nuevo Elemento FP)",false);
		
	}	
	if(error==true) {
		alert(mensajeError);
		return;
	}
	for(i=0;i<varBasicas.length;i++)
	//Se busca en la columna de Z por el primer 1
	if(fase==1) {
		for(i=0;i<matriz.length;i++)
			for(j=0;j<numArt;j++)
			    matriz[i].splice(nVar+numHol+1,1) 	//Quitamos la columna de las variables artificiales
		for(i=0;i<varBasicas.length;i++)
			if(varBasicas[i]>(nVar+numHol))
				varBasicas[i]-=numArt;			//Reducimos los índices de las variables básicas que sean más grandes que las artificiales
		numColumnas-=numArt;
		numArt = 0;
		for(i=0;i<numFilas;i++) {
			for(j=0;j<matriz[i].length;j++)
				matriz[i][j]= redondear(matriz[i][j]);
		}
		
		historial.push(clonarMatriz(matriz));
		imprimir_tabla(clonarMatriz(matriz),historial.length-1,"Tabla final","Sin la(s) variable(s) artificial(es)",false);
	}
}
function dosFases() {
	x = $('[name=desigualdad]');
	for(i=0;i<x.length;i++)
		if(x[i].value!=0)
			return true;
	return false;
}
function columna_pivote() {
	if($('#minMax').val()==1) { //Es minimización
		var maximo = Number.NEGATIVE_INFINITY;
		var indice = -1
		for(i=1;i<=nVar+numHol+numArt+numExc;i++) {
			if(matriz[0][i]>0 && matriz[0][i]>maximo) { //Valor más grande estrictamente positivo 
				maximo=matriz[0][i];
				indice=i;
			}
		}
		return indice;
	}else {										//Es maximización
		var minimo = Number.POSITIVE_INFINITY;
		var indice = -1
		for(i=1;i<=nVar+numHol+numArt+numExc;i++) {
			if(matriz[0][i]<0 && matriz[0][i]<minimo) { //Valor más pequeño estrictamente negativo 
				minimo=matriz[0][i];
				indice=i;
			}
		}
		return indice;
	}
}

function fila_pivote(indice_columna_pivote) {
	var minimo = Number.POSITIVE_INFINITY;
	var indice = -1

	for(i=1;i<=nRes;i++) {
		if(matriz[i][indice_columna_pivote]>0)
			if(Math.min(minimo,(matriz[i][numColumnas-1]/matriz[i][indice_columna_pivote]))<minimo) {
				minimo=matriz[i][numColumnas-1]/matriz[i][indice_columna_pivote];
				indice = i;
			}
	}
	if(indice==-1)
		alert("No existe variable candidata a salir. Solución no acotada");
	return indice;	
}
//Esta función almacena los valores de entrada a una matriz de javascript para facilitar su uso
function inicializarMatriz() {
	x = document.getElementsByName('desigualdad');
	arregloDesigualdad = new Array(x.length);
	for(i=0;i<x.length;i++) //Se itera el array de selects con los operadores de las desigualdades
		arregloDesigualdad[i]=x[i].value; //Se copian los valores del tipo de operador de desigualdad a un Array de javascript
	numHol = numExc = numArt = 0;
	varHol = []; 	varArt = []; 	varExc = [];

	//Iteramos en los operadores para determinar el número de variables de holgura, artificiales y exceso
	for(i=0;i<arregloDesigualdad.length;i++) {
		if(arregloDesigualdad[i]=="0")
			varHol.push(i+1);
		if(arregloDesigualdad[i]=="1") {
			if(fase!=2)
				varArt.push(i+1);
			varExc.push(i+1);
		}
		if(arregloDesigualdad[i]=="2" && fase!= 2) 
			varArt.push(i+1);
	}
	numHol = varHol.length; numArt = varArt.length;	numExc = varExc.length;
	numFilas = nRes+1;
	numColumnas = nVar + numHol + numArt + numExc + 2;	
	//Se crea la matriz con la que se realizará el algoritmo
	if(fase!=2) {
		matriz = new Array(nRes+1);
		for (var i = 0; i < matriz.length; i++) 
			matriz[i] = new Array(nVar + numHol + numArt + numExc + 2); //+2 para los coeficientes Z y R
	//Se ponen todos los valores a 0
		for(i=0;i<matriz.length;i++)
			for(j=0;j<matriz[i].length;j++)
				matriz[i][j]=0;
			
	}
	coeficientes = document.getElementsByClassName("coef");
	matriz[0][0]=1;
	//Se agregan los coeficientes de la función objetivo multiplicando por -1

	if(fase==1) { //Cambiamos la función objetivo por la suma de las variables artificiales
		for(i=0;i<numArt;i++) {
			matriz[0][1+nVar+numHol+i]=parseFloat(1)*-1; 
		}
	}else {//Usamos la función objetivo 
		for(i=1;i<=nVar;i++)
			matriz[0][i]=parseFloat(coeficientes[i].value)*-1;
	}
	
	if(fase!=2) {
	//Se agregan todos los valores del lado derecho
		for(i=1;i<numFilas;i++)
			matriz[i][numColumnas-1]=parseFloat(coeficientes[(i+1)*(nVar+2)-1].value);
		

	//Se agregan los coeficientes de las restricciones
		for(i=1;i<numFilas;i++)
			for(j=1;j<=nVar;j++)
				matriz[i][j]=parseFloat(coeficientes[i*(nVar+2)+j].value);

	//Se agregan los coeficientes 1 de todas las variables de holgura en las filas que guarda el vector varHol
		for(i=0;i<numHol;i++) {
			matriz[varHol[i]][nVar+i+1]=1;
		}

	//Se agregan los coeficientes 1 de todas las variables artificiales en las filas que guarda el vector varArt
		for(i=0;i<numArt;i++) {
			matriz[varArt[i]][nVar+numHol+i+1]=1;
		}
	//Se agregan los coeficientes -1 de todas las variables de exceso en las filas que guarda el vector varExc
		for(i=0;i<numExc;i++) {
			matriz[varExc[i]][nVar+numHol+numArt+i+1]=-1;
		}
		while(historial.length>0)
			historial.pop();
	}
	if(fase!=2) {
		historialFila = [];
		historialColumna = [];
	}	
		
	var matriz_temporal = clonarMatriz(matriz);
	historial.push(matriz_temporal);
	if(fase!=2) {
		varBasicas = new Array(nRes);
		for(i=0;i<nRes;i++) {
			for(j=1;j<=nRes;j++) {
				if(matriz[j][nVar+i + 1] == 1) {
					varBasicas[j-1]=nVar+i+1;
				}
			}
		}
	}
	switch(fase) {
		case 0: 
		imprimir_tabla(matriz_temporal, historial.length-1, "Definimos la tabla inicial", "Normalizamos las restricciones e igualamos la función objetivo a 0  " ,false);
		break;
		case 1:
		imprimir_tabla(matriz_temporal, historial.length-1, "Definimos la tabla inicial Fase 1", "Definimos una nueva función objetivo, las artificiales en -1 y el resto de terminos en cero",false);
		break;
		case 2:
		imprimir_tabla(matriz_temporal, historial.length-1, "Definimos la tabla inicial Fase 2","Tomamos la tabla Final sin variables artificiales y cambiamos la función objetivo por la original igualada a 0", false);
		break;
	}
		
	inicializado = true;
}

function matriz_resuelta() {
	if(document.getElementById('minMax').value==1) { //Es minimización
		for(i=1;i<=nVar+numHol+numArt+numExc;i++)
			if(redondear(matriz[0][i])>0)
				return false;
	} else {
		for(i=1;i<=nVar+numHol+numArt+numExc;i++)
			if(redondear(matriz[0][i])<0)
				return false;
		}
	return true;
}

function clonarMatriz( arr ) {
	var copy = [];
	for(i=0;i<arr.length;i++) {
		var nuevoArray = [];
		copy.push(nuevoArray);
		for(j=0;j<arr[i].length;j++) {
			copy[i][j]= arr[i][j];
		}
	}
	return copy;
}

function imprimir_tabla(tableo,indiceTableo, mensaje, submensaje, especial) {
	pagina++;
	$('#solucion').append('<div class=""><h3> ' + mensaje + '</h3></div><div class="w3-content w3-center" id="contenidoPagina' + pagina + '"></div>');

	divTabla = $('#contenidoPagina' + pagina);
	if(submensaje!="")
		divTabla.append('<p>' +  submensaje + '</p>');
	divTabla.append('<table id="tabla' + indiceTableo + '" class="w3-table-all w3-card-4 w3-centered" > </table>');
		tablaTemporal = document.getElementById('tabla' + indiceTableo);
		var nuevaFila = "<tr class='w3-light-gray'>";
		for (i = 0; i < numColumnas; i++) {
			if (i==0) 
				nuevaFila+='<th style="max-width:80px">Variables básicas</th>';
			if(i>0 && i<=nVar)
				nuevaFila+="<th>X" + i + "</th>";
			if(i>nVar && i<=nVar+numHol)
				nuevaFila+="<th>H" + (i-nVar) + "</th>";
			if(i>nVar+numHol && i<=nVar+numHol+numArt)
				nuevaFila+="<th>A" + (i-nVar-numHol) + "</th>";
			if(i>nVar+numHol+numArt && i<=nVar+numHol+numArt+numExc)
				nuevaFila+="<th>E" + (i-nVar-numHol-numArt) + "</th>";
			if(i==numColumnas-1)
				nuevaFila+="<th>R.H.</th>";
		}	
		if(especial)
			nuevaFila+="<th>Cociente</th>";
		nuevaFila+="</tr>";
		tablaTemporal.insertAdjacentHTML('beforeEnd',nuevaFila);
		if(especial) {
			var filaP = historialFila.pop();
			var colP = historialColumna.pop();
			var sum = 0;
			if (fase==2)
				sum = 1;
			for(var i=0;i<numFilas;i++) {
					nuevaFila ='<tr> ';
			for(var j=0;j<numColumnas;j++)
				if(j == 0)
					if (i == 0)
						nuevaFila+='<td style="background-color:#F7BE81; text-align:center"> ' + "Z" +"</td>";//Se pinta el cuadro de Z
					else
						nuevaFila+='<td style="text-align:center"> ' + varibaleBasica(varBasicas[i-1]) +"</td>";
				else if(colP == j)
					if(filaP == i)
						nuevaFila+='<td style="background-color:#8AF781; text-align:center"> ' + redondear4(tableo[i][j]) +"</td>"; //Es el valor pivote
					else
						nuevaFila+='<td style="text-align:center"> ' + redondear4(tableo[i][j]) +"</td>"; //Pertenece a la fila o columna pivote
				else
					nuevaFila+='<td style="text-align:center">' + redondear4(tableo[i][j]) +"</td>";

				if(i!=0)
					nuevaFila+='<td style="text-align:center">' + redondear4(tableo[i][numColumnas-1]) + " / " + redondear4(tableo[i][colP]) + " = " + redondear4(tableo[i][numColumnas-1]/tableo[i][colP])  +   '</td>';
				else
					nuevaFila+='<td style="text-align:center"> No aplica </td>'
				nuevaFila+="</tr>";
				tablaTemporal.insertAdjacentHTML('beforeEnd',nuevaFila);
	
			}
		} else {
			for(var i=0;i<numFilas;i++) {
				nuevaFila ='<tr> ';
				for(var j=0;j<numColumnas;j++)
					if(j == 0)
						if(i==0)
							nuevaFila+='<td style="background-color:#F7BE81; text-align:center"> ' + "Z" +"</td>";
						else
							nuevaFila+='<td style="text-align:center"> ' + varibaleBasica(varBasicas[i-1]) +"</td>";
					else
						nuevaFila+='<td style="text-align:center">' +  redondear4(tableo[i][j])	 +"</td>";
					nuevaFila+="</tr>";
					tablaTemporal.insertAdjacentHTML('beforeEnd',nuevaFila);
		
			}
		}
}
function redondear(number) { return parseFloat(number.toFixed(10)); }
function redondear2(number) { return parseFloat(number.toFixed(2)); }

function redondear4(number) {
	numString = number.toFixed(4);
	numDecimal = 0;
	len = numString.length;
	for(i=1;i<=4;i++)
		if(numString[len-i]!='0')
			break;
		else
			numDecimal++;
		return parseFloat(number.toFixed(4-numDecimal));
}	
function varibaleBasica(indice) {
	if(indice >=1 && indice< nVar+1) {
		return "X" + indice;
	}
	if(indice >=1+nVar && indice< numHol+nVar+1) {
		return "H" + (indice - nVar);
	}
	if(indice >=1+nVar+numHol && indice< (numArt + numHol+nVar+1)) {
		return "A" + (indice - (nVar+numHol));
	}
	if(indice >=1+nVar+numHol+numArt && indice< (numExc+numArt+numHol+nVar+1)) {
		return "E" + (indice - (nVar+numHol+numArt));
	}
}

function imprimir_Respuesta(varBasicas, matriz,numColumnas){
	var resultados = document.getElementById('tabla' + (pagina-1));
	resultados.childNodes[2].childNodes[0].childNodes[nVar+numHol+numArt+numExc+2].className = "resultado";
	for(i=1;i<=nVar;i++) {
		if(varBasicas.indexOf(i)!=-1 && matriz[varBasicas.indexOf(i)+1][i]==1) { //La variable inicial es una variable básica
			resultados.childNodes[varBasicas.indexOf(i)+3].childNodes[0].childNodes[nVar+numHol+numArt+numExc+2].className = "resultado";
		}
	}
	respuesta = $('#respuesta');
	w3.addClass('#respuesta','w3-show');
	respuesta.append("<h4>Solución</h4>");
	for(i=nVar;i>=1;i--) {
	    if(varBasicas.indexOf(i)!=-1 && matriz[varBasicas.indexOf(i)+1][i]==1) //La variable inicial es una variable básica
		respuesta.append('<p>X' + i + ' = ' + redondear2(matriz[varBasicas.indexOf(i)+1][numColumnas-1]) + '</p>');
		else
			respuesta.append('<p>X' + i + ' = 0</p>');
	}
	for(i=0;i<numFilas;i++) {
		if(matriz[i][0]==1) {
			respuesta.append('<p>Z  = ' + redondear2(matriz[i][numColumnas-1]) + '</p>');
			break;
		}
	}
}