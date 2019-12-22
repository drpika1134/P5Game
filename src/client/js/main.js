// MAP
let grid
const cols = 60
const rows = 60
const tileWidth = 40

let lastPosX = null
let lastPosY = null

let prevTile

// CAMERA MOVEMENT
let camx = 0
let camy = 0
let offsetX = 0
let offsetY = 0

let x = 0
let y = 0

let dropped = false
let dragging = false

p5.disableFriendlyErrors = true

function setup() {
  createCanvas(windowWidth, windowHeight)

  initializeGrid()
  noLoop()
}

function draw() {
  background(220)

  // Move the map if not dropped
  if (!dropped) {
    translate(camx, camy)
  }

  drawTiles()
}

function mousePressed() {
  // Dragging mode if right mouse button is clicked
  // else click on the tile
  if (mouseButton === RIGHT) {
    startCameraMove()
  } else {
    lastPosX = null
    lastPosY = null

    // Get pos in array
    const xPosInArray = Math.floor((mouseX - x) / tileWidth)
    const yPosInArray = Math.floor((mouseY - y) / tileWidth)

    // Check for if inbound
    if (
      xPosInArray > cols ||
      xPosInArray < 0 ||
      yPosInArray > rows ||
      yPosInArray < 0
    ) {
      return
    }
    const tile = grid[xPosInArray][yPosInArray]

    tile.clicked = !tile.clicked
    tile.color = 'pink'
    tile.initialize(0, 0, x, y, true)
  }
}

function mouseDragged() {
  if (dragging) {
    setCameraPosition()
    redraw()
  }
}

function mouseReleased() {
  if (dragging) {
    quitCameraMode()
    redraw()
  }
}

/*function mouseMoved() {
  // O(1) solution for hovering and clicking tiles

  // Get the index of the tile hovered in array
  const xPosInArray = Math.floor((mouseX - x) / w);
  const yPosInArray = Math.floor((mouseY - y) / w);
  // Just hard-coding the value 40 (the number columns and rows)
  if (xPosInArray > 40 || xPosInArray < 0 || yPosInArray > 40 || yPosInArray < 0) {
    return;
  }
  const tile = grid[xPosInArray][yPosInArray];

  // Check if the mouse had been inside before
  if (lastPosX !== null && lastPosY !== null) {
    prevTile = grid[lastPosX][lastPosY];

    // Only reset if the tile is not clicked
    if (!prevTile.clicked) {
      // Reset the last element to its normal state
      prevTile.color = "green";
      prevTile.draw(0, 0, x, y, true);
    }
  }
  if (!tile.clicked) {
    // Change color to red when hovered over
    tile.color = "red";
    tile.draw(0, 0, x, y, true);
  }
  // Check if the last element is the same as the element being hovered on
  // If not, set it to the currnt element
  lastPosX = lastPosX !== xPosInArray ? xPosInArray : lastPosX;
  lastPosY = lastPosY !== yPosInArray ? yPosInArray : lastPosY;
}
*/