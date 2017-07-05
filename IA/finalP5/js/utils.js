function figuras() {
	activar(1);	
}
function iniMeta() {
	activar(2);
}
function start() {
	activar(3);
}
function activar(x) {
  w3.addClass('#btn1','w3-white');
  w3.addClass('#btn2','w3-white');
  w3.addClass('#btn3','w3-white');
  if(x == 1){
    w3.removeClass('#btn1','w3-white');
    w3.addClass('#btn1','w3-blue');
  }else if( x == 2){
    w3.removeClass('#btn2','w3-white');
    w3.addClass('#btn2','w3-blue');
  }else{
    w3.removeClass('#btn3','w3-white');
    w3.addClass('#btn3','w3-blue');
  }
}