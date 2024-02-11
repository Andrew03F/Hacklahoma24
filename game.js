//SPACESHIP Creation
let spaceShip = {
  positionX: 1150, // Start near Earth
  positionY: 350,
  accelerationMagnitude: 0,
  acceleration: { ax: 0, ay: 0 },
  speed: { dx: 0, dy: -2 },
  angle: 180,
  angularAcc: 0,
  angularVel: 0,
  baseAcceleration: .1,
  baseAngularAcceleration: 1,
  fuel: 100, // Starting fuel level
  maxFuel: 100, // Maximum fuel capacity
};

let planetDensity = 2;
let gravityConstant = .00001;
// Adjusted solar system with larger planet sizes
let solarSystem = [
  ["BlackHole", 1500, -1000, 400, 'yellow'], // Increased size for visibility
  // ["Mercury", 250, 350, 25, 'darkgrey'], // Larger than before, but still the smallest planet
  // ["Venus", 400, 350, 50, 'orange'], // Increased size, closer to Earth
  ["Earth", 1000, 350, 200, 'blue'], // Significantly larger
  ["Moon", 1400, 700, 48, 'blue'], // Larger, maintaining relative size to Earth
  // ["Jupiter", 1900, 350, 280, 'orange'] // Much larger, reflecting its status as the largest planet
];

//METEORS Creation
let meteorImage;
let meteors = [];

//Stars Creation
let starss = [];

function setupStars() {
  for (let i = 0; i < 100; i++) { // Create 100 stars, adjust number as needed
    starss.push({
      x: random(width),
      y: random(height),
      size: random(1, 3), // Randomize star size for variety
      brightness: random(150, 255) // Optional: Random brightness for a twinkling effect
    });
  }
}

//Spaceship creation
let spaceShipIdleImage; // For the idle state
let spaceShipMovingImage; // For the moving state
let moonImage;
let blackHoleImage;

let font;

//Fuel icon creation
let fuelIconImage;
let fuelBarImage;

function preload() {
  meteorImage = loadImage('./Meteor.png'); // Load the meteor image
  spaceShipIdleImage = loadImage('./alien0.png');
  spaceShipMovingImage = loadImage('./alien.png');
  earthImage = loadImage('./earth.png');
  moonImage = loadImage('./moon.png');
  blackHoleImage = loadImage('./blackHole.png')
  font = loadFont('./assets/power-clear.ttf');
  fuelIconImage = loadImage('./Fuel.png');
  fuelBarImage = loadImage('./fuelbar.png');
}


let camX = 0;
let camY = 0;
let gameState = "startScreen"; // Added game state

let stars = [];

function setup() {
  createCanvas(1024, 569, document.getElementById("game"));
  frameRate(60); // Set a consistent frame rate
  
  for(let i = 0; i < 10000; i++) {
      stars.push(new Star());
  }

  angleMode(DEGREES);
  setupStars();
  camX = spaceShip.positionX - width / 2; // Center horizontally on the spaceship at start
  camY = spaceShip.positionY - height / 2; // Center vertically on the spaceship at start
}

function draw() {
  if (gameState === "startScreen") {
    drawStartScreen();
  } else if (gameState === "gameplay") {
    updateGameplay();
  } else if (gameState === "endGame") {
    drawFuelEndGameScreen();
  }

  //image(meteorImage, 0, 0)
}


function createMeteor() {
  let meteor = {
    x: random(-width, 2 * width), // Start off-screen for a wider range
    y: random(-height, -100), // Start above the canvas
    size: random(200, 400), // Increased size range for bigger meteors
    speedX: random(1, 5), // Horizontal speed
    speedY: random(1, 5) // Vertical speed, to simulate falling
  };
  meteors.push(meteor);
}


function updateAndDrawMeteors() {
  meteors.forEach((m, index) => {
    m.x += m.speedX; // Move meteor horizontally
    m.y += m.speedY; // Move meteor vertically

    // Draw the meteor image scaled to the meteor's size
    image(meteorImage, m.x - camX, m.y - camY, m.size, m.size);

    // Adjusted condition to remove meteors
    // Ensure meteors are removed only after they fully disappear off the screen
    if (m.x - camX > width + m.size || m.y - camY > height + m.size || m.x - camX < -m.size || m.y - camY < -m.size) {
      meteors.splice(index, 1);
    }
  });

  // Periodically add new meteors
  if (frameCount % 15 === 0) {
    createMeteor();
  }
}

function drawStars() {
  starss.forEach(star => {
    fill(star.brightness);
    noStroke();
    ellipse(star.x, star.y, star.size);

    // Optional: Adjust brightness for a simple twinkling effect
    star.brightness += random(-10, 10);
    star.brightness = constrain(star.brightness, 150, 255); // Keep brightness within visible range
  });
}



function drawStartScreen() {
  background(20);

  // Update and draw meteors
  updateAndDrawMeteors();
  drawStars();
  // Draw your start screen text here
  // Make sure this comes after drawing meteors to ensure text appears on top
  drawTitleText();
}

function drawTitleText() {
  textFont(font);
  // Title "Space Ship"
  fill(224,201,251); // Bright yellow for the title for a classic retro look
  textSize(72); // Larger size for the title
  textAlign(CENTER, CENTER);
  text("LUNA NEW YEAR", width / 2, height / 2 - 50); // Keep the title in its original position
  text("LUNA NEW YEAR", width / 2 + 2, height / 2 - 50 + 2);
    
  fill(78, 81, 128);
  textSize(22);
  text("W = THRUST, A = L-BOOST, D = R-BOOST", width /6, height - 30);

  // Blinking effect for "Start Game" text
  if (frameCount % 60 < 30) { // Toggle visibility every 30 frames for blinking effect
    // "Start Game" text moved towards the bottom
    fill(255, 0, 0); // Bright red for a classic retro arcade look
    textSize(32); // Size for "Start Game" text
    text("Start Game", width / 2, height - 250); // Position it 100 pixels above the bottom

    // Adding glow effect while maintaining the blink
    fill(255, 255, 0); // Strobe color for shadow/glow
    textSize(33); // Slightly larger size for a glow effect
    text("Start Game", width / 2 + 2, height - 250 + 2); // Offset position for shadow/glow
      
    textSize(22);
    text("insert (1) coin", width / 2 + 2, height - 50);
    
  }
}


function keyPressed() {
  if (gameState === "startScreen" && (key === ' ' || keyCode === ENTER)) {
    gameState = "gameplay";
    spaceShip.fuel = spaceShip.maxFuel; // Reset fuel
    // You may also want to reset the spaceship position and other properties here
  } else if (gameState === "endGame" && keyCode === ENTER) {
    gameState = "startScreen"; // Change back to start screen
    spaceShip.fuel = spaceShip.maxFuel; // Reset fuel
    // Again, reset other necessary properties if needed
  }
  return false; // Prevent default behavior
}

function mousePressed() {
  if (gameState === "startScreen") {
    gameState = "gameplay";
  }
  return false; // Prevent default behavior
}


function drawFuelEndGameScreen() {
 drawStarfield(); // Draw the star background first

  textSize(40); // Set the text size
  textAlign(CENTER, CENTER); // Align text to be centered

  // Blinking effect for "Game Over" text
  if (frameCount % 60 < 30) {
    // Yellow shadow
    fill(255, 255, 0); // Set the shadow color to yellow
    text("YOU RAN OUT OF FUEL", width / 2 + 5, height / 2 + 5); // Offset the shadow slightly

    // Primary text color
    fill(255, 0, 0); // Set the primary text color to red
    text("YOU RAN OUT OF FUEL", width / 2, height / 2); // Draw the primary text on top
  }
}



function updateGameplay() {

   if (spaceShip.fuel <= 0) {
    // If the fuel is out, change the game state to "endGame"
    gameState = "endGame";
    drawFuelEndGameScreen(); // Draw the end game screen immediately
    return; // Skip drawing the rest of the gameplay elements
  }

  background(20);
  drawStarfield();
  handleInput();
  updatePosition();
  updateCamera();
  drawSolarSystem();
  drawSpaceShip();
  drawFuelBar();
}


let isMoving = false; // Tracks whether the spaceship is moving


function handleInput() {
  isMoving = false; //not moving initially

  if (spaceShip.fuel > 0) { // Check if there's fuel
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65) || keyIsDown(RIGHT_ARROW) || keyIsDown(68) || keyIsDown(UP_ARROW) || keyIsDown(87)) {
      isMoving = true; // Set to true if any movement key is pressed
      spaceShip.fuel -= 0.1; // Consume fuel, adjust rate as needed
    }
  }

  // Apply movement and rotation based on isMoving and remaining fuel
  if (isMoving) {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      spaceShip.angularAcc = -spaceShip.baseAngularAcceleration;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      spaceShip.angularAcc = spaceShip.baseAngularAcceleration;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      spaceShip.accelerationMagnitude = spaceShip.baseAcceleration;
    }
  } else {
    // Stop acceleration and angular acceleration when not moving or out of fuel
    spaceShip.accelerationMagnitude = 0;
    spaceShip.angularAcc = 0;
  }
}


function drawFuelBar() {
  let fuelBarWidth = 100; // Width of the fuel bar
  let fuelBarHeight = 20; // Height of the fuel bar
  let xPosition = 90; // X position of the fuel bar
  let yPosition = 50; // Y position of the fuel bar
  let iconSize = 60; // Size of the fuel icon
  let outlineThickness = 4; // Thickness of the fuel bar outline

  // Draw the fuel icon to the left of the fuel bar
  image(fuelIconImage, xPosition - iconSize - 10, yPosition - (iconSize - fuelBarHeight) / 2, iconSize, iconSize);

  // Grey outline
  fill('#808080'); // Grey color for the outline
  noStroke();
  rect(xPosition - outlineThickness, yPosition - outlineThickness, fuelBarWidth + outlineThickness * 2, fuelBarHeight + outlineThickness * 2);

  // Pastel red background
   fill('#FF6A6A');
  rect(xPosition, yPosition, fuelBarWidth, fuelBarHeight);

  // Calculate remaining fuel width
  let fuelWidth = fuelBarWidth * (spaceShip.fuel / spaceShip.maxFuel);

  // Bright green for the current fuel level
  fill('#00FF00');
  rect(xPosition, yPosition, fuelWidth, fuelBarHeight);

  // White shimmer reflection on the green part
  let shimmerWidth = fuelWidth * 0.1; // Width of the shimmer to be 10% of the fuel width
  let shimmerXPosition = xPosition + (fuelWidth * 0.5) - (shimmerWidth * 0.5); // Positioned in the middle of the green part
  fill(255, 255, 255, 130); // White with some transparency for the shimmer
  noStroke();
  rect(shimmerXPosition, yPosition, shimmerWidth, fuelBarHeight);

  //vertical black lines
  stroke(0); // Black color for the lines
  strokeWeight(1);
  for (let i = xPosition; i < xPosition + fuelWidth; i += 10) { // Use your lineSpacing variable if needed
    line(i, yPosition, i, yPosition + fuelBarHeight);
  }
}


function updatePosition() {
  // Update linear acceleration based on current angle
  spaceShip.acceleration.ax = sin(spaceShip.angle) * spaceShip.accelerationMagnitude;
  spaceShip.acceleration.ay = cos(spaceShip.angle) * spaceShip.accelerationMagnitude;

  // Update acceleration due to gravity
  let accFromGravity = getAccDueToGravity();
  spaceShip.acceleration.ax += accFromGravity[0];
  spaceShip.acceleration.ay += accFromGravity[1];

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
  console.log(spaceShip.positionX, spaceShip.positionY)
}

function updateCamera() {
  // Constrain camera movement within a broad range for exploration
  camX = constrain(spaceShip.positionX - width / 2, -5000, 5000);
  camY = constrain(spaceShip.positionY - height / 2, -5000, 5000);
}

function drawSolarSystem() {
  // Draw each celestial body based on its specifications in solarSystem array
  solarSystem.forEach(body => {
    fill(body[4]);
    ellipse(body[1] - camX, body[2] - camY, body[3], body[3]);
    if (body[0] === 'Earth') {
      image(earthImage, body[1] - camX - body[3]/ 2, body[2] - camY - body[3]/ 2);
    }
    if (body[0] === 'Moon') {
      image(moonImage, body[1] - camX - body[3]/ 2, body[2] - camY - body[3]/ 2);
    }
    if (body[0] === 'BlackHole') {
      image(blackHoleImage, body[1] - camX - 421, body[2] - camY - body[3]/ 2 - 30);
    }
  });
}


let scaleFactor = 3;
function drawSpaceShip() {
  push();
  translate(spaceShip.positionX - camX, spaceShip.positionY - camY);
  //rotate(radians(spaceShip.angle));
  rotate(spaceShip.angle);
  // Decide which image to draw based on whether the spaceship is moving
  let shipImage = isMoving ? spaceShipMovingImage : spaceShipIdleImage;

  // Assuming you want to scale the image, replace with desired scaling
  let scaledWidth = shipImage.width * scaleFactor;
  let scaledHeight = shipImage.height * scaleFactor;
  image(shipImage, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

  pop();
}
function calculateDistance(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  
  // Euclidean distance formula: √((x2 - x1)^2 + (y2 - y1)^2)
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  return distance;
}

function getAccDueToGravity() {
  let accDueToGravity = [0, 0];
  solarSystem.forEach(body => {
    // acceleration in x direction
    let distanceToBody  = calculateDistance(body[1], body[2], spaceShip.positionX, spaceShip.positionY);
    let bodyMass = calculateMass(body[3], planetDensity)
    if (body[0] === 'BlackHole') {
      bodyMass *= 4;
    }
    if (distanceToBody > 30) {
      accDueToGravity[0] +=  bodyMass * gravityConstant * (body[1] - spaceShip.positionX) 
                            / Math.pow(distanceToBody, 3);
      accDueToGravity[1] +=   bodyMass * gravityConstant *  - (body[2] - spaceShip.positionY) 
                            / Math.pow(distanceToBody, 3);
    }
  });
  
  return accDueToGravity
}

function calculateMass(radius, density) {
  // Calculate volume using the formula for volume of a sphere
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  
  // Calculate mass by multiplying volume by density
  const mass = volume * density;

  return mass;
}
function drawStarfield() {
    background(20);
    
    for(let i = 0; i < stars.length; i++) {
        stars[i].show();
        stars[i].update();
    }
    
}

class Star {
    constructor() {
        let starCoverage = 10000;
        this.x = random(starCoverage) - starCoverage / 2;
        this.y = random(starCoverage) - starCoverage / 2;
        this.size = random(1,4);
        if (this.size >=2) {
            this.size = random(1,4);
        }
    }
    
    show() {
        noStroke();
        fill(255);
        ellipse(this.x -camX, this.y - camY, this.size);
    }
    
    update() {
        this.x += .1 * -spaceShip.speed.dx * this.size;
        this.y += .1 * spaceShip.speed.dy * this.size;
        
       
    }
    setSpeed() {
        this.speed = this.size * spaceShip.speed.dx
    }
}
