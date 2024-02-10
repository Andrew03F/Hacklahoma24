
function setup() {
    createCanvas(512, 384, document.getElementById("game"));
    background(50)
  }
  
  function draw() {
    if (mouseIsPressed) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
  }
  //test change