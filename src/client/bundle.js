(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { b, m, t, v } = require('./utils/types')
const { Village } = require('./Village')
const { updateData } = require('./utils/updateData')
class Player {
  constructor(id, x, y, stone, wood, buiilders, civilian) {
    this.id = id

    this.x = x
    this.y = y

    this.stone = stone
    this.wood = wood

    this.civilian = civilian
    this.builders = builders

    this.military = {}
    this.building = {
      factory: [],
      village: []
    }
  }
}
/**
 *  Claim a tile with the player's selected unit
 *
 * @param {Object} tile - the tile that is being clicked
 * @param {Object} selectedUnit - selected unit object
 * @param {Object} player - player object
 * @param {Object} s - p5 objects
 */
Player.prototype.claimTile = function(tile, selectedUnit, player, s, DOM) {
  if (selectedUnit.type !== null) {
    // if the selected unit type is village and the tile terrain is land
    if (selectedUnit.type === 'v') {
      if (tile.terrain === 'land') {
        let village = new Village('id', 200, 10)
        resetInputs(DOM, village)

        DOM.farmCustomizer.style('display', 'block')
        /*
          For some reason, addEventListener won't work here as it will cause the number of farms to 
          be the same for every city when changed in one city
        */
        DOM.slider.oninput = function(e) {
          setFarmSliderValue(tile.tileInfo.village, DOM, e.target.value)
        }
        DOM.saveFarm.onclick = function() {
          setFarmFormValue(DOM, village)
        }
        updatePlayerAndTile(tile, player, village, selectedUnit)

        player.civilian += village.population
        updateData(DOM, player.civilian)

        console.log(tile)
        console.log(player)
        tile.occupied = true
        tile.initialize(s)
      }
    } else {
      console.log('claim')
      updatePlayerAndTile(tile, player, null, selectedUnit)

      tile.occupied = true
      tile.initialize(s)
    }
  }
}
/* UPDATE GAME INFO */
function updatePlayerAndTile(tile, player, village, selectedUnit) {
  switch (selectedUnit.type) {
    case 'b':
      player.building.factory.push({ id: 'fac', type: b, name: 'factory' })
      tile.tileInfo.building = {
        owner: player.id,
        type: b,
        name: selectedUnit.name
      }
      break
    case 'v':
      player.building.village.push(village)
      tile.tileInfo.village = village
      break
    case 't':
      player.military[selectedUnit.name] = 100
      tile.tileInfo.troops = {
        owner: player.id,
        type: t,
        name: selectedUnit.name
      }
      break
    default:
      return
  }
}
/* DOM */
function setFarmSliderValue(village, DOM, value) {
  village.farm = value
  DOM.farmInput.value(value)
}
function setFarmFormValue(DOM, village, inputValue) {
  village.farm = DOM.farmInput.value()
  DOM.slider.value = DOM.farmInput.value()
}
function resetInputs(DOM, village) {
  DOM.slider.value = village.farm
  DOM.farmInput.value(village.farm)
}

module.exports = {
  Player,
  setFarmSliderValue,
  setFarmFormValue,
  resetInputs
}

},{"./Village":2,"./utils/types":7,"./utils/updateData":9}],2:[function(require,module,exports){
class Village {
  constructor(owner, population, farm) {
    this.owner = owner
    this.population = population
    this.farm = farm
  }
}
module.exports = { Village }

},{}],3:[function(require,module,exports){
let offX
let offY
let canvas
function addListeners(playerX, playerY) {
  canvas = document.getElementById('inner')

  canvas.addEventListener('mousedown', mouseDown, false)
  window.addEventListener('mouseup', mouseUp, false)
  defaultCamera(playerX, playerY)
}

function defaultCamera(playerX, playerY) {
  canvas.style.position = 'absolute'
  canvas.style.top = 0 - playerY + 350 + 'px'
  canvas.style.left = 0 - playerX + 500 + 'px'
}

function mouseUp() {
  window.removeEventListener('mousemove', divMove, true)
}

function mouseDown(e) {
  if (e.button !== 4 && !(e.button < 2)) {
    offY = e.clientY - parseInt(canvas.offsetTop)
    offX = e.clientX - parseInt(canvas.offsetLeft)
    window.addEventListener('mousemove', divMove, true)
  }
}

function divMove(e) {
  canvas.style.position = 'absolute'
  canvas.style.top = e.clientY - offY + 'px'
  canvas.style.left = e.clientX - offX + 'px'
}
module.exports = { addListeners, defaultCamera }

},{}],4:[function(require,module,exports){
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
  farmInput: null
}

let possibleSpawnLocation = []

let selectedUnit = {
  type: null,
  name: null
}

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
    DOM.farmCustomizer = s.select('#villageFarm')
    DOM.saveFarm = document.getElementById('saveFarm')
    DOM.slider = document.getElementById('slider')
    DOM.farmInput = s.select('#farmInput')
    setInterval(function() {
      if (player.building.village[0]) {
        player.building.village.forEach(
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

},{"./Player":1,"./camera":3,"./map/map":6,"./utils/unitSelect":8,"./utils/updateData":9}],5:[function(require,module,exports){
const { b, m } = require('../utils/types')

class Tile {
  /**
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @param {number} w - tile width
   * @param {string} c - tile color
   */
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.occupied = false
    this.terrain = 'land'
    this.tileInfo = {
      playerBase: false,
      village: null,
      troops: null,
      building: null
    }
  }
  /**
   * Draw the tile depends on what type of terrain it is or if its the player
   *
   * @param {Object} s - required to use p5 functions
   * @param {number} r - the random value for determining the type of terrain
   * @param {Array} possibleSpawnLocation - an array of possible spawn locations for player
   * @memberof Tile
   */
  initialize(s, r, possibleSpawnLocation) {
    this.generateTerrain(r, possibleSpawnLocation)
    this.isPlayer(this.tileInfo.playerBase)
    this.isBuilding(this.tileInfo.building)
    this.isTroops(this.tileInfo.troops)
    this.isVillage(this.tileInfo.village)
    s.fill(this.color)
    s.rect(this.x, this.y, this.w, this.w)
  }
}
Tile.prototype.isPlayer = function(player) {
  if (player) {
    this.color = 'black'
    this.occupied = true
  }
}
Tile.prototype.isTroops = function(troops) {
  if (troops) {
    this.color = 'red'
  }
}
Tile.prototype.isVillage = function(village) {
  if (village) {
    this.color = 'orange'
  }
}
Tile.prototype.isBuilding = function(building) {
  if (building) {
    switch (building.type) {
      case b: // building
        this.color = 'grey'
        break
      case m: // military building
        this.color = 'pink'
        break
      default:
        return
    }
  }
  return
}
Tile.prototype.generateTerrain = function(r, possibleSpawnLocation) {
  if (r <= 0.37) {
    this.terrain = 'water'
    this.color = 'blue'
  } else if (r <= 0.52 && r >= 0.47) {
    this.terrain = 'forest'
    this.color = '#26660f' // forests
  } else if (r <= 0.65) {
    possibleSpawnLocation.push([this.x / 40, this.y / 40])
    this.terrain = 'land'
    this.color = 'green'
  } else if (r <= 0.97) {
    this.terrain = 'mountain'
    this.color = '#ad4315' // mountains
  }
}
module.exports = { Tile }

},{"../utils/types":7}],6:[function(require,module,exports){
const { make2DArray, getRandomInt } = require('../utils/utils')
const { addListeners } = require('../camera')
const { Tile } = require('./Tile')

let isPlayerSpawned = {
  spawned: false
}

/**
 * Initialize each element in the grid array to Tile Object
 *
 * @param {int} cols
 * @param {int} rows
 * @param {int} tileWidth
 */
function initializeGrid(cols, rows, tileWidth) {
  let grid = make2DArray(cols, rows)
  for (let x = 0; x < rows; x++) {
    for (let i = 0; i < cols; i++) {
      grid[i][x] = new Tile(i * tileWidth, x * tileWidth, tileWidth, 'blue')
    }
  }
  return grid
}

/**
 * Draw the tiles and the player on the map
 *
 * @param {object} s
 * @param {array} grid
 * @param {array} possibleSpawnLocation
 * @param {class} player
 */
function drawTiles(s, grid, possibleSpawnLocation, player) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const square = grid[i][j]
      const r = s.noise(i * 0.3, j * 0.3)

      square.initialize(s, r, possibleSpawnLocation)
    }
  }
  if (isPlayerSpawned.spawned == false) {
    spawn(s, grid, possibleSpawnLocation, player)
  }
}

/**
 * Pick a random location and spawn the player there
 *
 * @param {object} s
 * @param {array} grid
 * @param {array} possibleSpawnLocation
 * @param {class} player
 */
function spawn(s, grid, possibleSpawnLocation, player) {
  let randomLocation =
    possibleSpawnLocation[getRandomInt(5, possibleSpawnLocation.length / 4)]

  const square = grid[randomLocation[0]][randomLocation[1]]
  square.tileInfo.playerBase = {
    name: 'DrPika',
    id: player.id
  }
  square.initialize(
    s,
    s.noise(randomLocation[0] * 0.3, randomLocation[1] * 0.3),
    possibleSpawnLocation
  )
  isPlayerSpawned.spawned = true

  player.x = square.x
  player.y = square.y
  Object.freeze(isPlayerSpawned)
  addListeners(square.x, square.y)
}

module.exports = {
  initializeGrid,
  drawTiles
}

},{"../camera":3,"../utils/utils":10,"./Tile":5}],7:[function(require,module,exports){
const m = 'MILITARY BUILDING'
const b = 'BUILDING'
const t = 'TROOPS'
const v = 'VILLAGE'
module.exports = { m, b, t, v }

},{}],8:[function(require,module,exports){
/**
 * Detect what the player has chosen (building, troops, etc...) to put on map
 * @param {Object} selectedUnit
 */
function addUnitSelectListeners(selectedUnit) {
  const building = document.getElementById('b')
  const militaryBuilding = document.getElementById('m')
  const troops = document.getElementById('t')
  const village = document.getElementById('v')

  building.addEventListener('click', function() {
    selectedUnit.type = 'b'
    selectedUnit.name = 'building'
  })
  militaryBuilding.addEventListener('click', function() {
    selectedUnit.type = 'm'
    selectedUnit.name = 'military'
  })
  troops.addEventListener('click', function() {
    selectedUnit.type = 't'
    selectedUnit.name = 'warrior'
  })
  village.addEventListener('click', function() {
    selectedUnit.type = 'v'
    selectedUnit.name = 'village'
  })
}
module.exports = { addUnitSelectListeners }

},{}],9:[function(require,module,exports){
function updateData(DOM, civilian) {
  DOM.civilian.html(`Civilian: ${civilian}`)
}
module.exports = { updateData }

},{}],10:[function(require,module,exports){
function make2DArray(cols, rows) {
  let array = new Array(cols)
  for (let i = 0; i < cols; i++) {
    array[i] = new Array(rows)
  }
  return array
}
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
module.exports = {
  make2DArray,
  getRandomInt
}

},{}]},{},[4]);
