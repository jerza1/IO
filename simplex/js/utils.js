/**[w3IncludeHTML agrega plantillas]*/
function w3IncludeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          elmnt.innerHTML = this.responseText;
          elmnt.removeAttribute("w3-include-html");
          w3IncludeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}
/**[acordeon oculta o muestra div Demo]
* @param tag id identificador de elemento
*/
function acordeon(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        w3.addClass('#'+id,'w3-show');
        x.previousElementSibling.className += " w3-light-blue";
    } else { 
        w3.removeClass('#'+id,'w3-show');
        x.previousElementSibling.className = 
        x.previousElementSibling.className.replace(" w3-light-blue", "");
    }
}
/**[w3IncludeHTML agrega plantillas]*/
function activarNav() {
	var x = document.getElementById('navDemo');
	if (x.className.indexOf("w3-show") == -1) {
		w3.addClass('#navDemo','w3-show');
	} else { 
		w3.removeClass('#navDemo','w3-show');
	}
}

/*function gcd(a, b) {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }

    return a;
}

export default class Fraction {

    constructor(numerator, denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
    }

    simplify() {
        let divisor = gcd(this.numerator, this.denominator);
        return new Fraction(this.numerator / divisor, this.denominator / divisor);
    }

}*/
