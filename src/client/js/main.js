const { initializeGrid, drawTiles } = require('./map/map')
const { defaultCamera } = require('./camera')
const { Player } = require('./player')
const { b, m } = require('./utils/types')

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

let tileInfoDOM
let woodDOM
let stoneDOM
let civilianDOM
let possibleSpawnLocation = []

let selectedUnit
function addEventListeners() {
  const building = document.getElementById('b')
  const militaryBuilding = document.getElementById('m')
  building.addEventListener('click', function() {
    selectedUnit = 'b'
  })
  militaryBuilding.addEventListener('click', function() {
    selectedUnit = 'm'
  })
}
const game = new p5(s => {
  s.setup = function() {
    s.createCanvas(rows * tileWidth, cols * tileWidth)

    player = new Player('id', null, null, 0, 0, 0, 100, [], [])
    grid = initializeGrid(cols, rows, tileWidth)
    addEventListeners()

    tileInfoDOM = s.select('#tileInfo')
    woodDOM = s.select('#wood')
    stoneDOM = s.select('#stone')
    civilianDOM = s.select('#civilian')

    s.noLoop()
  }
  s.draw = function() {
    s.background(220)

    drawTiles(s, grid, possibleSpawnLocation, player)

    woodDOM.html(`Wood: ${player.wood}`)
    stoneDOM.html(`Stone: ${player.stone}`)
    civilianDOM.html(`Civilian: ${player.civilian}`)
  }
  s.mousePressed = function() {
    if (s.mouseButton === s.LEFT) {
      const xPosInArray = Math.floor(s.mouseX / tileWidth)
      const yPosInArray = Math.floor(s.mouseY / tileWidth)

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
        console.log(tile)
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
      tile.initialize(s)
    }
  }
  s.keyPressed = function() {
    if (s.keyCode == 72) defaultCamera(player.x, player.y)
  }
}, 'inner')

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
