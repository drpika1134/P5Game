const { initializeGrid, drawTiles } = require('./map/map')
const { defaultCamera } = require('./camera')
const {
  Player,
  setFarmSliderValue,
  setFarmFormValue,
  resetInputs
} = require('./Player')
const { addUnitSelectListeners } = require('./utils/unitSelect')
const { updateData } = require('./utils/updateData')

// MAP
let grid
const cols = 80
const rows = 80
const tileWidth = 40

let lastPosX = null
let lastPosY = null

let prevTile

let player

p5.disableFriendlyErrors = true

let DOM = {
  tileInfo: null,
  wood: null,
  stone: null,
  civilian: null,
  farmCustomizer: null,
  saveFarm: null,
  slider: null,
  farmInput: null,
  deployTroops: null
}

let possibleSpawnLocation = []

let selectedUnit = {
  type: null,
  name: null
}
let deploying = false
const game = new p5(s => {
  s.setup = function() {
    s.createCanvas(rows * tileWidth, cols * tileWidth)

    player = new Player('id', null, null, 0, 0, 0, 100)
    grid = initializeGrid(cols, rows, tileWidth)
    addUnitSelectListeners(selectedUnit)

    DOM.tileInfo = s.select('#tileInfo')
    DOM.wood = s.select('#wood')
    DOM.stone = s.select('#stone')
    DOM.civilian = s.select('#civilian')
    DOM.farmCustomizer = s.select('#villageCustomizer')
    DOM.saveFarm = document.getElementById('saveFarm')
    DOM.slider = document.getElementById('slider')
    DOM.farmInput = s.select('#farmInput')
    DOM.deployTroops = s.select('#deployTroops')
    s.select('#deploy').elt.addEventListener('click', function() {
      deploying = !deploying
    })
    setInterval(function() {
      const playerBuilding = player.building
      if (playerBuilding.village[0]) {
        playerBuilding.village.forEach(
          village => (player.civilian += parseInt(village.farm))
        )
        updateData(DOM, player.civilian)
      }
    }, 3000)
    s.noLoop()
  }
  s.draw = function() {
    s.background(220)

    drawTiles(s, grid, possibleSpawnLocation, player)

    DOM.wood.html(`Wood: ${player.wood}`)
    DOM.stone.html(`Stone: ${player.stone}`)
    DOM.civilian.html(`Civilian: ${player.civilian}`)
  }
  s.mousePressed = function(e) {
    if (s.mouseButton === s.LEFT && e.target.tagName === 'CANVAS') {
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
        if (tile.tileInfo.building) {
          DOM.deployTroops.style('display', 'block')
          DOM.farmCustomizer.style('display', 'none')
        }
        if (tile.tileInfo.village) {
          console.log(tile.tileInfo)
          resetInputs(DOM, tile.tileInfo.village)
          DOM.slider.oninput = function(e) {
            setFarmSliderValue(tile.tileInfo.village, DOM, e.target.value)
          }
          DOM.saveFarm.onclick = function() {
            setFarmFormValue(DOM, tile.tileInfo.village)
          }
        }

        // DOM.tileInfo.html(`Building: ${tile.tileInfo.building !== null &&
        //   tile.tileInfo.building.type}
        // Terrain: ${tile.terrain}`)
        return
      }
      if (deploying) {
        tile.tileInfo.troops = {
          owner: player.id,
          type: 'troops',
          name: 'Warrior'
        }
        tile.occupied = true
        tile.initialize(s)
        console.log(tile)
        return
      }
      player.claimTile(tile, selectedUnit, player, s, DOM)
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
