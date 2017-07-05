function Spot(x, y) {
  this.x = x;
  this.y = y;
  this.id = 0;
  this.type = 'spot';

  this.display = function() {
    noStroke();
    fill(0);
    ellipse(this.x, this.y, 5, 5);
  };
}
function Start(x, y) {
  this.x = x;
  this.y = y;
  this.id = 0;
  this.display = function() {
    noStroke();
    fill(0,255,0);
    ellipse(this.x, this.y, 20, 20);
    textSize(20);
    fill(0)
    text(this.id,this.x,this.y-10)
  };
}
function End(x, y) {
  this.x = x;
  this.y = y;
  this.id = 0;
  this.display = function() {
    noStroke();
    fill(255,0,0);
    ellipse(this.x, this.y, 20, 20);
    textSize(20);
    fill(0)
    text(this.id,this.x,this.y-10)
  };
}
function figura(puntos, r,g,b){
  this.display = function (){
    noStroke();
    fill(r,g,b, 100);
    beginShape();
    for(var i = 0; i < puntos.length; i++){
      vertex(puntos[i].x,puntos[i].y);
      fill(0);
      ellipse(puntos[i].x,puntos[i].y,5,5);
      textSize(20);
      text(puntos[i].id,puntos[i].x,puntos[i].y-10)
      fill(r,g,b, 100);
    }
    endShape(CLOSE);
  }
}