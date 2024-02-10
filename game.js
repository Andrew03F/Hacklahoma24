let spaceShip = {
  positionX: 1050, // Start near Earth
  positionY: 350,
  accelerationMagnitude: 0,
  acceleration: { ax: 0, ay: 0 },
  speed: { dx: 0, dy: 0 },
  angle: 135,
  angularAcc: 0,
  angularVel: 0,
  baseAcceleration: .1,
  baseAngularAcceleration: .1
};

// Adjusted solar system with larger planet sizes
let solarSystem = [
  ["Sun", -500, 350, 1000, 'yellow'], // Increased size for visibility
  ["Mercury", 250, 350, 25, 'darkgrey'], // Larger than before, but still the smallest planet
  ["Venus", 400, 350, 50, 'orange'], // Increased size, closer to Earth
  ["Earth", 1000, 350, 200, 'blue'], // Significantly larger, as requested
  ["Mars", 1300, 350, 35, 'red'], // Larger, maintaining relative size to Earth
  ["Jupiter", 1900, 350, 280, 'orange'] // Much larger, reflecting its status as the largest planet
];

let camX = 0;
let camY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  camX = spaceShip.positionX - width / 2; // Center horizontally on the spaceship at start
  camY = spaceShip.positionY - height / 2; // Center vertically on the spaceship at start
}

function draw() {
  background(20);

  handleInput();
  updatePosition();
  updateCamera();

  drawSolarSystem();
  drawSpaceShip();
}

function handleInput() {
  // Reset acceleration and angular acceleration each frame to ensure it only applies when keys are pressed
  spaceShip.accelerationMagnitude = 0;
  spaceShip.angularAcc = 0;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // Turn left
    spaceShip.angularAcc = -spaceShip.baseAngularAcceleration;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // Turn right
    spaceShip.angularAcc = spaceShip.baseAngularAcceleration;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // Accelerate forward
    spaceShip.accelerationMagnitude = spaceShip.baseAcceleration;
  }
}


function updatePosition() {
  // Update linear acceleration based on current angle
  spaceShip.acceleration.ax = sin(spaceShip.angle) * spaceShip.accelerationMagnitude;
  spaceShip.acceleration.ay = cos(spaceShip.angle) * spaceShip.accelerationMagnitude;

  // Update speed with acceleration
  spaceShip.speed.dx += spaceShip.acceleration.ax;
  spaceShip.speed.dy += spaceShip.acceleration.ay;

  // Update position with speed
  spaceShip.positionX += spaceShip.speed.dx;
  spaceShip.positionY -= spaceShip.speed.dy; // Y-axis inversion

  // Update angular velocity and apply damping
  spaceShip.angularVel += spaceShip.angularAcc;
  spaceShip.angularVel *= .9;
  spaceShip.angle += spaceShip.angularVel;
}

function updateCamera() {
  // Constrain camera movement within a broad range for exploration
  camX = constrain(spaceShip.positionX - width / 2, -50000, 50000);
  camY = constrain(spaceShip.positionY - height / 2, -50000, 50000);
}

function drawSolarSystem() {
  // Draw each celestial body based on its specifications in solarSystem array
  solarSystem.forEach(body => {
    fill(body[4]);
    ellipse(body[1] - camX, body[2] - camY, body[3], body[3]);
  });
}

function drawSpaceShip() {
  push();
  // Adjust for camera movement
  translate(spaceShip.positionX - camX, spaceShip.positionY - camY);
  rotate(spaceShip.angle);
  fill(255, 0, 0); // Red spaceship
  triangle(-10, 20, 10, 20, 0, -20); // Drawing the spaceship
  pop();
}



