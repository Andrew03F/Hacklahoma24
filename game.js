
let spaceShip = {
  positionX: 50,
  positionY: 50,
  accelerationMagnitude: 0,
  acceleration: {
    ax: 0,
    ay: 0
  },
  speed: {
    dx: 0,
    dy: 0
  },

  angle: 135,
  angularAcc: 0,
  angularVel: 0,
  baseAcceleration: .1,
  baseAngularAcceleration: .1
}


function setup() {
    createCanvas(1800, 1000 );
    background(50);
    angleMode(DEGREES);
  }
  
function draw() {
  
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    spaceShip.angularAcc = -spaceShip.baseAngularAcceleration;
  }
  if (keyIsDown(RIGHT_ARROW)|| keyIsDown(68)) {
    spaceShip.angularAcc = spaceShip.baseAngularAcceleration;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    spaceShip.accelerationMagnitude = spaceShip.baseAcceleration;
  } 
    
  
  updatePosition()
  spaceShip.accelerationMagnitude = 0;
  spaceShip.angularAcc = 0

}

function updatePosition() {
  spaceShip.acceleration.ax = sin(spaceShip.angle) * spaceShip.accelerationMagnitude
  spaceShip.acceleration.ay = cos(spaceShip.angle) * spaceShip.accelerationMagnitude
  spaceShip.speed.dx += spaceShip.acceleration.ax;
  spaceShip.speed.dy += spaceShip.acceleration.ay;
  spaceShip.positionX += spaceShip.speed.dx;
  spaceShip.positionY -= spaceShip.speed.dy;

  spaceShip.angularVel += spaceShip.angularAcc;
  spaceShip.angularVel *= .9
  spaceShip.angle += spaceShip.angularVel;

  push();
  translate(spaceShip.positionX, spaceShip.positionY);
  fill(255, 0, 0);
  rotate(spaceShip.angle)
  triangle(-10, 20, 10, 20, 0, -20);
  pop();
}



/////

  