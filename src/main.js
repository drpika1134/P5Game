let tile
let grid
let w = 40
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

let dragged = false
let dragging = false

// wheel zoom
let zoomWidth = w
let zoomHeight = w
let mouseScroll = false

const cols = 60
const rows = 60
p5.disableFriendlyErrors = true

function make2DArray(cols, rows) {
  let array = new Array(cols)
  for (let i = 0; i < cols; i++) {
    array[i] = new Array(rows)
  }
  return array
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  grid = make2DArray(cols, rows)

  for (let i = 0; i < cols; i++) {
    for (let x = 0; x < rows; x++) {
      grid[i][x] = new Tile(i * w, x * w, w, 'green')
    }
  }
  noLoop()
}

function draw() {
  background(220)

  // Only translate the map if it's not being dragged
  if (!dragged) {
    translate(camx, camy)
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const square = grid[i][j]
      // The higher the multiplier, the more cluster it gets
      const r = noise(i * 0.3, j * 0.3)
      if (!dragged) square.initialize(offsetX, offsetY, 0, 0, false, r)
      else square.initialize(0, 0, x, y, true, r)
    }
  }
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    offsetX = mouseX - x
    offsetY = mouseY - y
    dragging = true
  } else {
    lastPosX = null
    lastPosY = null

    // Get pos in array
    const xPosInArray = Math.floor((mouseX - x) / w)
    const yPosInArray = Math.floor((mouseY - y) / w)

    // Just hard-coding the value 40 (the number columns and rows)
    if (
      xPosInArray > cols ||
      xPosInArray < 0 ||
      yPosInArray > rows ||
      yPosInArray < 0
    ) {
      return
    }
    const tile = grid[xPosInArray][yPosInArray]

    // if (tile !== undefined) {
    // change status to clicked and color to pink
    tile.clicked = !tile.clicked
    tile.color = 'pink'
    tile.initialize(0, 0, x, y, true)
    // }
  }
}

function mouseDragged() {
  if (dragging) {
    camx = mouseX
    camy = mouseY
    dragged = false
    redraw()
  }
}

function mouseReleased() {
  if (dragging) {
    // Quit dragging
    dragging = false

    x = mouseX - offsetX
    y = mouseY - offsetY

    dragged = true

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
