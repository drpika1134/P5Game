// MAP
let grid
const cols = 60
const rows = 60
const tileWidth = 40

let lastPosX = null
let lastPosY = null

let prevTile

let player

p5.disableFriendlyErrors = true

// TODO: set this to whatever the player clicked on menu bar
let selectedUnit

let tileInfoDOM
let woodDOM
let stoneDOM
let civilianDOM

let possibleSpawnLocation = []
let isPlayerSpawned = {
  spawned: false
}

function setup() {
  let cnv = createCanvas(rows * tileWidth, cols * tileWidth)
  cnv.parent('inner')
  initializeGrid()
  player = new Player('id', null, null, 0, 0, 0, 100, [], [])

  tileInfoDOM = select('#tileInfo')
  woodDOM = select('#wood')
  stoneDOM = select('#stone')
  civilianDOM = select('#civilian')
  noLoop()
}

function draw() {
  background(220)

  drawTiles()
  woodDOM.html(`Wood: ${player.wood}`)
  stoneDOM.html(`Stone: ${player.stone}`)
  civilianDOM.html(`Civilian: ${player.civilian}`)
}

function mousePressed() {
  // Dragging mode if right mouse button is clicked
  // else click on the tile
  if (mouseButton === LEFT) {
    // Get pos in array
    const xPosInArray = Math.floor(mouseX / tileWidth)
    const yPosInArray = Math.floor(mouseY / tileWidth)

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

    if (tile.tileInfo.playerBase) return
    if (tile.occupied) {
      tileInfoDOM.html(`Building: ${tile.tileInfo.building.type}
      Terrain: ${tile.terrain}`)
      return
    }
    switch (selectedUnit) {
      case 'b': // Building
        tile.tileInfo = {
          ...tile.tileInfo,
          building: { owner: player.id, type: b /* b = Building */ }
        }
        player.building = [
          ...player.building,
          { id: 'facId', type: b, name: 'factory' }
        ]
        break
      case 'm': // Military
        tile.tileInfo = {
          ...tile.tileInfo,
          building: { owner: player.id, type: m /* m = Military Building */ }
        }
        player.building = [
          ...player.building,
          { id: 'milId', type: m, name: 'recruitment center' }
        ]
        break
      default:
        return
    }
    tile.occupied = true
    tile.initialize()
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
