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
  baseAngularAcceleration: .2,
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
  ["Mars", 3000, -350, 200, 'orange'] 
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
let spaceShipFlickerMovingImage;
let moonImage;
let blackHoleImage;
let redPlanetImage;

let spaceShipFlickerImage1; // For the flicker effect
let spaceShipFlickerImage2; // For the flicker effect
let spaceShipImage4;
let spaceShipImage5;
let font;

//Fuel icon creation
let fuelIconImage;
let fuelBarImage;

let showMissionText = true;

//sound creation
let introSound;
let missionSound;
let endSound;

function preload() {
  meteorImage = loadImage('./Meteor.png'); // Load the meteor image
  spaceShipIdleImage = loadImage('./assets/ship1.png');
  spaceShipMovingImage = loadImage('./assets/ship2.png');
  spaceShipFlickerImage1 = loadImage('./assets/ship2.png'); // Replace with the correct path if necessary
  spaceShipFlickerImage2 = loadImage('./assets/ship3.png'); // Replace with the correct path if necessary
  spaceShipImage4 = loadImage('./assets/ship4.png');
  spaceShipImage5 = loadImage('./assets/ship5.png');
  earthImage = loadImage('./earth.png');
  moonImage = loadImage('./moon.png');
  redPlanetImage = loadImage('./assets/redPlanet.png')
  blackHoleImage = loadImage('./blackHole.png')

  font = loadFont('./assets/power-clear.ttf');
  fuelIconImage = loadImage('./Fuel.png');
  fuelBarImage = loadImage('./fuelbar.png');

  introSound = loadSound('./assets/intro.wav');
  missionSound = loadSound('./assets/mission.wav');
  endSound = loadSound('./assets/end.wav');
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
    if (!introSound.isPlaying()) { // Check if the sound is not already playing
      introSound.play();
      endSound.pause();
    }
    drawStartScreen();
  } else if (gameState === "gameplay") {
     if (!missionSound.isPlaying()) { // Check if the sound is not already playing
      introSound.pause();
      missionSound.play();
    }
    updateGameplay();
    setTimeout(() => {showMissionText = false;}, 15000)
    drawMissionText();
  } else if (gameState === "endGame") {
     if (!endSound.isPlaying()) { // Check if the sound is not already playing
      missionSound.pause();
      endSound.play();
    }
    drawFuelEndGameScreen();
  }else if (gameState === "outOfBounds") {
  if (!endSound.isPlaying()) { // Check if the sound is not already playing
      missionSound.pause();
      endSound.play();
    }
    drawLostEndGameScreen();
  }else if (gameState === "collisionEnd") {
  if (!endSound.isPlaying()) { // Check if the sound is not already playing
      missionSound.pause();
      endSound.play();
    }
    drawCollisionEndGameScreen();
  }else if (gameState === "win") {
    drawWinScreen(); // Draw the win screen when in win state
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
  if (frameCount % 20 === 0) {
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
    
  fill(107, 45, 95); // Bright red for a classic retro arcade look
  textSize(32); // Size for "Start Game" text
  text("Press Enter to Start", width / 2, height - 250); // Position it 100 pixels above the bottom
    
  fill(78, 81, 128);
  textSize(22);
  text("W = THRUST, A = L-BOOST, D = R-BOOST", width /6, height - 30);

  // Blinking effect for "Start Game" text
  if (frameCount % 60 < 30) { // Toggle visibility every 30 frames for blinking effect   
    fill(255, 255, 0);
    textSize(22);
    text("insert (1) coin", width / 2 + 2, height - 50);
    
  }
}


function keyPressed() {
  if (gameState === "startScreen" && (key === ' ' || keyCode === ENTER)) {
    gameState = "gameplay";
    spaceShip.fuel = spaceShip.maxFuel; // Reset fuel
    showMissionText = true;
   setTimeout(() => {showMissionText = false;}, 15000)
    drawMissionText();
  } else if (gameState === "endGame" && keyCode === ENTER) {
    gameState = "startScreen"; // Change back to start screen
    // Reset spaceship properties
    spaceShip.positionX = 1150; // Reset to starting position near Earth
    spaceShip.positionY = 350;
    spaceShip.speed.dx = 0; // Reset any movement speed
    spaceShip.speed.dy = 0;
    spaceShip.angle = 180; // Reset orientation if needed
    spaceShip.fuel = spaceShip.maxFuel; // Refill fuel
  }else if (gameState === "outOfBounds" && keyCode === ENTER) {
    gameState = "startScreen"; // Change back to start screen
    // Reset spaceship properties
    spaceShip.positionX = 1150; // Reset to starting position near Earth
    spaceShip.positionY = 350;
    spaceShip.speed.dx = 0; // Reset any movement speed
    spaceShip.speed.dy = 0;
    spaceShip.angle = 180; // Reset orientation if needed
    spaceShip.fuel = spaceShip.maxFuel; // Refill fuel
  } else if (gameState === "collisionEnd" && keyCode === ENTER) {
    gameState = "startScreen"; // Change back to start screen
    // Reset spaceship properties
    spaceShip.positionX = 1150; // Reset to starting position near Earth
    spaceShip.positionY = 350;
    spaceShip.speed.dx = 0; // Reset any movement speed
    spaceShip.speed.dy = 0;
    spaceShip.angle = 180; // Reset orientation if needed
    spaceShip.fuel = spaceShip.maxFuel; // Refill fuel
  } else if ((gameState === "startScreen" || gameState === "win") && (key === ' ' || keyCode === ENTER)) {
    gameState = "gameplay";
    // Reset game state, including the spaceship's position, speed, angle, and fuel
    spaceShip.positionX = 1150;
    spaceShip.positionY = 350;
    spaceShip.speed.dx = 0;
    spaceShip.speed.dy = -2;
    spaceShip.angle = 180;
    spaceShip.fuel = spaceShip.maxFuel;
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
    fill(255, 87, 51); 
    text("YOU RAN OUT OF FUEL", width / 2 + 2, height / 2 + 2); // Offset the shadow slightly

    // Primary text color
//    fill(255, 0, 0); // Set the primary text color to red
//    text("YOU RAN OUT OF FUEL", width / 2, height / 2); // Draw the primary text on top
    fill(255, 255, 0);
    textSize(22);
    text("insert (1) coin", width / 2 + 2, height - 50);
  }
}

function drawLostEndGameScreen() {
 drawStarfield(); // Draw the star background first

  textSize(40); // Set the text size
  textAlign(CENTER, CENTER); // Align text to be centered

  // Blinking effect for "Game Over" text
  if (frameCount % 60 < 30) {
    // Primary text color
    fill(255, 87, 51); // Set the primary text color to red
    text("LOST IN SPACE", width / 2, height / 2); // Draw the primary text on top
    
    fill(255, 255, 0);
    textSize(22);
    text("insert (1) coin", width / 2 + 2, height - 50);
  }
}

function drawCollisionEndGameScreen() {
  drawStarfield(); // Draw the star background first
 
   textSize(40); // Set the text size
   textAlign(CENTER, CENTER); // Align text to be centered
 
   // Blinking effect for "Game Over" text
   if (frameCount % 60 < 30) {
 
     // Primary text color
     fill(255, 87, 51); // Set the primary text color to red
     text("YOU COLLIDED WITH A CELESTIAL BODY", width / 2, height / 2); // Draw the primary text on top
 
     fill(255, 255, 0);
     textSize(22);
     text("insert (1) coin", width / 2 + 2, height - 50);
   }
 }
 

function updateGameplay() {

  if (spaceShip.positionX < -5000 || spaceShip.positionX > 5000 || spaceShip.positionY < -5000 || spaceShip.positionY > 5000) {
    gameState = "outOfBounds"; // Change to out-of-bounds state
    drawLostEndGameScreen();
    return;
  }


   if (spaceShip.fuel <= 0) {
    // If the fuel is out, change the game state to "endGame"
    gameState = "endGame";
    drawFuelEndGameScreen(); // Draw the end game screen immediately
    return; // Skip drawing the rest of the gameplay elements
  }

  if (checkCollision()) {
    gameState = "collisionEnd";
    drawCollisionEndGameScreen();
    return; // Stop further drawing or updates since the game is over
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

function drawMissionText() {

   if (showMissionText && frameCount % 60 < 30) {

      let xPosition = 90; // Starting X position of the fuel bar
      let yPosition = 75; // Adjust Y position so it appears under the fuel bar
      fill('red'); // White color for the text
      textSize(32);
      textAlign(LEFT, TOP);
      text("Mission: Find Mars", xPosition, yPosition);


     }
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
  let fuelBarWidth = 220; // Width of the fuel bar
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
    if (body[0] === 'Mars') {
      image(redPlanetImage, body[1] - camX - body[3] / 2, body[2] - camY - body[3]/ 2 );
    }
  });
}


function checkCollision() {
  let speedMagnitude = sqrt(pow(spaceShip.speed.dx, 2) + pow(spaceShip.speed.dy, 2)); // Calculate the magnitude of the spaceship's speed

  for (let i = 0; i < solarSystem.length; i++) {
    let body = solarSystem[i];

    // Skip Earth in the collision check
    if (body[0] === "Earth") continue;

    let distance = calculateDistance(spaceShip.positionX, spaceShip.positionY, body[1], body[2]);
    let collisionDistance = body[3] / 2 + 20; // Assuming the spaceship's effective "radius" for collision

    // Special case for Mars: check speed if touching Mars
    if (body[0] === "Mars" && distance < collisionDistance) {
      if (speedMagnitude < 5) { // Adjust the speed threshold as needed
        gameState = "win"; // Change game state to win if speed is low enough
        return false; // No collision in terms of ending the game
      }
      // If speed is too high, treat it as a normal collision
    } else if (distance < collisionDistance) {
      return true; // Collision detected with other bodies
    }
  }
  return false; // No collision
}

// Add a drawWinScreen function
function drawWinScreen() {
  drawStarfield(); // Draw the star background first

  textSize(40); // Set the text size
  textAlign(CENTER, CENTER); // Align text to be centered
  fill(255, 215, 0); // Gold color for the win message
  text("CONGRATULATIONS, YOU'VE LANDED ON MARS!", width / 2, height / 2);

  textSize(22); // Smaller text for the restart instruction
  text("Press ENTER to restart", width / 2, height / 2 + 50);
}


let scaleFactor = 0.7;
let flickerState = false; // Track the flicker state
let lastFlickerTime = 0; // Track the last time the image was toggled

function drawSpaceShip() {
  push();
  translate(spaceShip.positionX - camX, spaceShip.positionY - camY);
  rotate(spaceShip.angle);

  let shipImage;
  // Check if the W key or up arrow key is pressed and if there's movement
  if (isMoving && (keyIsDown(UP_ARROW) || keyIsDown(87))) {
    // Implement a simple timing mechanism for flicker effect
    if (millis() - lastFlickerTime > 100) { // Change the flicker speed by adjusting the time here
      flickerState = !flickerState;
      lastFlickerTime = millis();
    }
    shipImage = flickerState ? spaceShipFlickerImage1 : spaceShipFlickerImage2;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    // Show ship4.png when D key or right arrow key is pressed
    shipImage = spaceShipImage4;
  } else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    // Show ship5.png when A key or left arrow key is pressed
    shipImage = spaceShipImage5;
  }else {
    shipImage = spaceShipIdleImage;
  }

  // Scale the image
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
