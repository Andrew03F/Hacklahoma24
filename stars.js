const canvas = document.getElementById("game");

function starfield()
  {
     for (i=0; i<10; i++)
     {
        var x = Math.floor(Math.random()*399);
        var y = Math.floor(Math.random()*399);
        var tempx = x;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
     }
  }

draw() {
    starfield();
}