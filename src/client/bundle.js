(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

const { initializeGrid, drawTiles } = require('./map/map')
const { defaultCamera } = require('./camera')
const { Player } = require('./player')
const { b, m } = require('./utils/types')
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

},{"./camera":1,"./map/map":3,"./player":5,"./utils/types":6}],3:[function(require,module,exports){
const { make2DArray, getRandomInt } = require('../utils/utils')
const { addListeners } = require('../camera')
const { Tile } = require('./tile')

let isPlayerSpawned = {
  spawned: false
}

let grid
/**
 * Initialize each element in the grid array to Tile Object
 *
 * @param {int} cols
 * @param {int} rows
 * @param {int} tileWidth
 */
function initializeGrid(cols, rows, tileWidth) {
  grid = make2DArray(cols, rows)

  for (let i = 0; i < cols; i++) {
    for (let x = 0; x < rows; x++) {
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
    possibleSpawnLocation[getRandomInt(5, possibleSpawnLocation.length / 3)]

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

},{"../camera":1,"../utils/utils":7,"./tile":4}],4:[function(require,module,exports){
const { b, m } = require('../utils/types')

class Tile {
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.occupied = false
    this.terrain = 'land'
    this.tileInfo = {
      playerBase: false,
      troops: null,
      building: null
    }
  }
  /**
   * Draw the tile depends on what type of terrain it is or if its the player
   *
   * @param {object} s
   * @param {float} r
   * @param {array} possibleSpawnLocation
   * @memberof Tile
   */
  initialize(s, r, possibleSpawnLocation) {
    this.generateTerrain(r, possibleSpawnLocation)
    this.isPlayer(this.tileInfo.playerBase)
    this.isBuilding(this.tileInfo.building)

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
  if (r <= 0.35) {
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

},{"../utils/types":6}],5:[function(require,module,exports){
class Player {
  constructor(id, x, y, stone, wood, builders, civilian, military, building) {
    this.id = id

    this.x = x
    this.y = y

    this.stone = stone
    this.wood = wood

    this.civilian = civilian
    this.builders = builders

    this.military = military
    this.building = building
  }
}

module.exports = { Player }

},{}],6:[function(require,module,exports){
const m = 'MILITARY BUILDING'
const b = 'BUILDING'

module.exports = { m, b }

},{}],7:[function(require,module,exports){
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

},{}]},{},[2]);
