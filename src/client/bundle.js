(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Warrior } = require('./military/Warrior')
const { MilitaryCamp } = require('./building/MilitaryCamp')
const { updateDeployableRange } = require('./utils/utils')
const { Village } = require('./building/Village')
class Player {
  constructor(id, x, y, stone, wood) {
    this.id = id

    this.x = x
    this.y = y

    this.stone = stone
    this.wood = wood

    this.civilian = 1000
    this.claimedTile = {
      land: 0,
      wood: 0,
      stone: 0
    }
    this.village = 0
    this.deployed = 0
    this.deployMax = 100
  }
}
const troopCost = 2
Player.prototype.deployTroop = function(tile, player, DOM, s) {
  if (tile.canDeploy && tile.terrain !== 'water') {
    const troopsToDeploy = parseInt(DOM.military.deployTroopsAmount.value())
    if (
      player.deployed <= player.deployMax &&
      player.deployed + troopsToDeploy <= player.deployMax
    ) {
      const warrior = new Warrior(50, 50, 50, 50, troopsToDeploy)
      tile.tileInfo.troops = warrior
      tile.occupied = {
        owner: player.id
      }
      player.deployed += troopsToDeploy
      tile.initialize(s)

      player.wood -= troopCost * troopsToDeploy
      player.stone -= troopCost * troopsToDeploy
    }
  }
}

let campCost = 200
Player.prototype.buildMilitaryCamp = function(
  grid,
  tile,
  player,
  rows,
  cols,
  s
) {
  if (player.wood >= campCost && player.stone >= campCost) {
    if (tile.terrain === 'land') {
      const tilePosX = tile.x / tile.w
      const tilePosY = tile.y / tile.w

      if (tile.occupied) {
        const militaryCamp = new MilitaryCamp(
          player.id,
          '1',
          tilePosX,
          tilePosY
        )
        player.deployMax += 20
        tile.tileInfo.building = militaryCamp
        tile.occupied = true
        tile.initialize(s)
        updateDeployableRange(grid, { x: tilePosX, y: tilePosY }, rows, cols)
        player.wood -= campCost
        player.stone -= campCost

        campCost *= 2
      }
    }
  }
}

Player.prototype.buildVillage = function(tile, s) {
  tile.tileInfo.village = new Village('id')
  tile.occupied = true
  tile.initialize(s)
  this.village++
}
module.exports = {
  Player
}

},{"./building/MilitaryCamp":2,"./building/Village":3,"./military/Warrior":9,"./utils/utils":13}],2:[function(require,module,exports){
class MilitaryCamp {
  constructor(owner, id, x, y) {
    this.owner = owner
    this.id = id

    this.x = x
    this.y = y

    this.militaryCap = 20
  }
}
module.exports = { MilitaryCamp }

},{}],3:[function(require,module,exports){
class Village {
  constructor(owner) {
    this.owner = owner
    this.civilian = 1000
  }
}
module.exports = { Village }

},{}],4:[function(require,module,exports){
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
  if (e.button == 0 || e.button == 2) {
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

},{}],5:[function(require,module,exports){
const { initializeGrid, drawTiles } = require('./map/map')
const { defaultCamera } = require('./camera')
const { Player } = require('./Player')
const {
  findDOMElements,
  startCivilianInterval,
  getTile,
  updateDeployableRange
} = require('./utils/utils')
const { updateData } = require('./utils/updateData')

const { addUnitSelectListeners } = require('./utils/unitSelect')

// MAP
let grid
const cols = 80
const rows = 80
const tileWidth = 40

let player

p5.disableFriendlyErrors = true

let DOM = {
  tileInfo: null,
  playerInfo: { wood: null, stone: null, civilian: null },
  military: {
    deploy: null,
    deployTroops: null,
    deployTroopsAmount: null
  }
}

let possibleSpawnLocation = []

let selectedUnit = null
let selectedTile = null
let userPressed = false
let merged = false

const game = new p5(s => {
  s.setup = function() {
    s.createCanvas(rows * tileWidth, cols * tileWidth)

    player = new Player('id', null, null, 1000, 1000)
    grid = initializeGrid(cols, rows, tileWidth)
    // addUnitSelectListeners(selectedUnit)
    findDOMElements(DOM, s)
    console.log(player)

    startCivilianInterval(DOM, player)
    s.noLoop()
  }
  s.draw = function() {
    s.background(220)
    let start = s.millis()
    drawTiles(s, grid, possibleSpawnLocation, player)

    updateDeployableRange(
      grid,
      { x: player.x / tileWidth, y: player.y / tileWidth },
      rows,
      cols
    )

    let end = s.millis()
    let elapsed = end - start
    console.log('Drawing Map took: ' + elapsed + 'ms.')

    DOM.playerInfo.wood.html(`${player.wood}`)
    DOM.playerInfo.stone.html(`${player.stone}`)
    DOM.playerInfo.civilian.html(`Civilian: ${player.civilian}`)
  }
  s.keyPressed = function() {
    const key = s.keyCode
    if (key == 72) defaultCamera(player.x, player.y)
    if (
      selectedUnit !== null &&
      selectedTile !== null &&
      userPressed === false
    ) {
      // UP ARROW
      if (key == 38) {
        userPressed = true
        if (selectedTile.y - 1 >= 0) {
          const upTile = grid[selectedTile.x][selectedTile.y - 1]
          if (upTile.terrain !== 'water' && !upTile.tileInfo.playerBase) {
            if (upTile.occupied && upTile.tileInfo.troops) {
              moveDelay(upTile, selectedUnit, selectedTile, s)
              if (merged) {
                selectedTile.x = upTile.x / tileWidth
                selectedTile.y = upTile.y / tileWidth

                selectedUnit = upTile.tileInfo.troops
                merged = false
              }
            }
            if (upTile.occupied && !upTile.tileInfo.troops) {
              moveDelay(upTile, selectedUnit, selectedTile, s)
            }
            if (!upTile.occupied) {
              moveDelay(upTile, selectedUnit, selectedTile, s)
            }
          } else {
            userPressed = false
          }
        }
      }
      // DOWN ARROW
      if (key == 40) {
        userPressed = true
        if (selectedTile.y + 1 <= cols) {
          const downTile = grid[selectedTile.x][selectedTile.y + 1]
          if (downTile.terrain !== 'water' && !downTile.tileInfo.playerBase) {
            if (downTile.occupied && downTile.tileInfo.troops) {
              merged = true

              moveDelay(downTile, selectedUnit, selectedTile, s)
              selectedTile.x = downTile.x / tileWidth
              selectedTile.y = downTile.y / tileWidth

              selectedUnit = downTile.tileInfo.troops
            }
            if (downTile.occupied && !downTile.tileInfo.troops) {
              moveDelay(downTile, selectedUnit, selectedTile, s)
            }
            if (!downTile.occupied) {
              moveDelay(downTile, selectedUnit, selectedTile, s)
            }
          } else {
            userPressed = false
          }
        }
      }
      // LEFT ARROW
      if (key == 37) {
        userPressed = true
        if (selectedTile.x - 1 >= 0) {
          const leftTile = grid[selectedTile.x - 1][selectedTile.y]
          if (leftTile.terrain !== 'water' && !leftTile.tileInfo.playerBase) {
            if (leftTile.occupied && leftTile.tileInfo.troops) {
              merged = true
              console.log('unit', selectedUnit)
              moveDelay(leftTile, selectedUnit, selectedTile, s)
              selectedTile.x = leftTile.x / tileWidth
              selectedTile.y = leftTile.y / tileWidth

              selectedUnit = leftTile.tileInfo.troops
            }
            if (leftTile.occupied && !leftTile.tileInfo.troops) {
              moveDelay(leftTile, selectedUnit, selectedTile, s)
            }
            if (!leftTile.occupied) {
              moveDelay(leftTile, selectedUnit, selectedTile, s)
            }
          } else {
            userPressed = false
          }
        }
      }
      // RIGHT ARROW
      if (key == 39) {
        userPressed = true
        if (selectedTile.x + 1 <= rows) {
          const rightTile = grid[selectedTile.x + 1][selectedTile.y]
          if (rightTile.terrain !== 'water' && !rightTile.tileInfo.playerBase) {
            if (rightTile.occupied && rightTile.tileInfo.troops) {
              merged = true
              moveDelay(rightTile, selectedUnit, selectedTile, s)
              selectedTile.x = rightTile.x / tileWidth
              selectedTile.y = rightTile.y / tileWidth

              selectedUnit = rightTile.tileInfo.troops
            }
            if (rightTile.occupied && !rightTile.tileInfo.troops) {
              moveDelay(rightTile, selectedUnit, selectedTile, s)
            }
            if (!rightTile.occupied) {
              moveDelay(rightTile, selectedUnit, selectedTile, s)
            }
          } else {
            userPressed = false
          }
        }
      }
    }
  }
  s.mousePressed = function(e) {
    if (s.mouseButton === s.RIGHT && e.target.tagName === 'CANVAS') {
    }
  }
  s.mouseReleased = function(e) {
    if (e.button === 0 && e.target.tagName === 'CANVAS') {
      const tile = getTile(s, tileWidth, cols, rows, grid)
      if (!tile) return
      if (tile.tileInfo.playerBase) return
      console.log(tile)
      // Check if the tile has something on it
      // if the tile has troops on it, we assume that they want to move it
      if (tile.occupied) {
        if (tile.tileInfo.troops) {
          const tilePosX = tile.x / tileWidth
          const tilePosY = tile.y / tileWidth
          if (selectedTile !== null) {
            if (
              selectedUnit !== tile.tileInfo.troops &&
              selectedTile.x !== tilePosX &&
              selectedTile.x !== tilePosY
            ) {
              userPressed = false
            }
          }

          selectedUnit = tile.tileInfo.troops
          selectedTile = { x: tilePosX, y: tilePosY }
        }
        return
      }
      // only deploy troops if in range
      if (tile.canDeploy) {
        DOM.military.deployTroops.style('display', 'block')
        DOM.military.deployTroopsAmount.value('')

        DOM.military.deploy.onclick = function() {
          player.deployTroop(tile, player, DOM, s)
          DOM.playerInfo.wood.html(`${player.wood}`)
          DOM.playerInfo.stone.html(`${player.stone}`)
        }
      }
    }
    if (e.button === 1 && e.target.tagName === 'CANVAS') {
      const tile = getTile(s, tileWidth, cols, rows, grid)
      if (!tile) return
      if (tile.tileInfo.playerBase) return
      if (tile.occupied) return
      console.log(tile)
      player.buildVillage(tile, s)
    }
  }
}, 'inner')
function moveDelay(designatedTile, selectedUnit, selectedTile, s) {
  setTimeout(function() {
    const currentTile = grid[selectedTile.x][selectedTile.y]

    const designatedTileTroops = designatedTile.tileInfo.troops
    if (designatedTileTroops && designatedTileTroops.count < 30) {
      if (designatedTileTroops.count + currentTile.tileInfo.troops.count > 30) {
        const diff = 30 - designatedTileTroops.count
        designatedTile.tileInfo.troops.count += diff
        currentTile.tileInfo.troops.count -= diff
      } else {
        designatedTile.tileInfo.troops.count +=
          currentTile.tileInfo.troops.count
        currentTile.tileInfo.troops = null
      }
    } else if (!designatedTile.tileInfo.troops) {
      currentTile.tileInfo.troops = null

      designatedTile.tileInfo.troops = selectedUnit
    }

    designatedTile.occupied = {
      owner: player.id
    }
    userPressed = false

    currentTile.initialize(s)
    designatedTile.initialize(s)

    selectedTile.x = designatedTile.x / tileWidth
    selectedTile.y = designatedTile.y / tileWidth

    selectedUnit = designatedTileTroops

    merged = true
    switch (designatedTile.terrain) {
      case 'land':
        player.claimedTile.land++
        break
      case 'forest':
        player.claimedTile.wood++
        break
      case 'mountain':
        player.claimedTile.stone++
        break
      default:
        break
    }
  }, 500)
}

},{"./Player":1,"./camera":4,"./map/map":7,"./utils/unitSelect":11,"./utils/updateData":12,"./utils/utils":13}],6:[function(require,module,exports){
const { building, building_types } = require('../utils/types')

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
    this.canDeploy = false
    this.tileInfo = {
      playerBase: false,
      troops: null,
      building: null,
      village: null
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
    this.isOccupied(this.occupied)
    this.isPlayer(this.tileInfo.playerBase)
    this.isBuilding(this.tileInfo.building)
    this.isTroops(this.tileInfo.troops)
    this.isVillage(this.tileInfo.village)

    s.fill(this.color)
    s.rect(this.x, this.y, this.w, this.w)

    if (this.tileInfo.troops) {
      s.textAlign(s.CENTER)
      s.fill('white')
      s.textSize(16)
      s.text(
        this.tileInfo.troops.count,
        this.x + this.w * 0.5,
        this.y + this.w - 13
      )
    }
  }
}
Tile.prototype.isVillage = function(village) {
  if (village) {
    this.color = '#fc03f4'
  }
}
Tile.prototype.isOccupied = function(occupied) {
  if (occupied) {
    this.color = 'orange'
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

Tile.prototype.isBuilding = function(_building) {
  if (_building) {
    this.color = 'grey'
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

},{"../utils/types":10}],7:[function(require,module,exports){
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

},{"../camera":4,"../utils/utils":13,"./Tile":6}],8:[function(require,module,exports){
class MilitaryUnit {
  constructor(attack, defense, mobility, attackSpeed) {
    this.attack = attack
    this.defense = defense
    this.mobility = mobility
    this.attackSpeed = attackSpeed
  }
}

module.exports = { MilitaryUnit }

},{}],9:[function(require,module,exports){
const { MilitaryUnit } = require('./MilitaryUnit')
class Warrior extends MilitaryUnit {
  constructor(attack, defense, mobility, attackSpeed, count) {
    super(attack, defense, mobility, attackSpeed)
    this.count = count
  }
}
module.exports = { Warrior }

},{"./MilitaryUnit":8}],10:[function(require,module,exports){
const building = 'building'
const troop = 'troop'

const building_types = {
  military: 'military',
  village: 'village',
  production: 'production'
}
// const troopTypes;

module.exports = { building, troop, building_types }

},{}],11:[function(require,module,exports){
const { building, troop, building_types } = require('./types')

function addUnitSelectListeners(selectedUnit) {
  const village = document.getElementById('v')

  village.addEventListener('click', function() {
    selectedUnit.type = building
    selectedUnit.name = building_types.village
  })
}
module.exports = { addUnitSelectListeners }

},{"./types":10}],12:[function(require,module,exports){
function updateData(DOM, civilian) {
  DOM.playerInfo.civilian.html(`Civilian: ${civilian}`)
}
module.exports = { updateData }

},{}],13:[function(require,module,exports){
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
function getTile(s, tileWidth, cols, rows, grid) {
  const xPosInArray = Math.floor(s.mouseX / tileWidth)
  const yPosInArray = Math.floor(s.mouseY / tileWidth)
  if (
    xPosInArray > cols ||
    xPosInArray < 0 ||
    yPosInArray > rows ||
    yPosInArray < 0
  ) {
    return false
  }
  return grid[xPosInArray][yPosInArray]
}
// Find all the necessary DOM elements
function findDOMElements(DOM, s) {
  DOM.tileInfo = s.select('#tileInfo')

  DOM.playerInfo.wood = s.select('#wood')
  DOM.playerInfo.stone = s.select('#stone')
  DOM.playerInfo.civilian = s.select('#civilian')

  DOM.military.deploy = document.getElementById('deploy')
  DOM.military.deployTroops = s.select('#deployTroops')
  DOM.military.deployTroopsAmount = s.select('#deployTroopAmount')
}

function startCivilianInterval(DOM, player) {
  setInterval(function() {
    const claimedTile = player.claimedTile
    player.wood += claimedTile.wood * 10
    player.stone += claimedTile.stone * 10
    player.civilian += player.village * 10
    DOM.playerInfo.wood.html(`${player.wood}`)
    DOM.playerInfo.stone.html(`${player.stone}`)
    DOM.playerInfo.civilian.html(`${player.civilian}`)
    // DOM.playerInfo.stone.html(`${      parseInt(DOM.playerInfo.stone) + claimedTile.stone * 10
    // }`)
  }, 3000)
}

function updateDeployableRange(grid, tile, rows, cols) {
  for (let i = tile.x - 3; i <= tile.x + 3; i++) {
    for (let y = tile.y - 3; y <= tile.y + 3; y++) {
      if (i >= 0 && i <= rows && y >= 0 && y < cols) {
        grid[i][y].canDeploy = true
      }
    }
  }
}

module.exports = {
  make2DArray,
  getRandomInt,
  findDOMElements,
  startCivilianInterval,
  getTile,
  updateDeployableRange
}

},{}]},{},[5]);
