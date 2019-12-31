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
            if (
              upTile.occupied &&
              upTile.tileInfo.troops &&
              selectedUnit.count !== 30 &&
              upTile.tileInfo.troops.count !== 30
            ) {
              moveDelay(upTile, selectedUnit, selectedTile, s)
              selectedTile.x = upTile.x / tileWidth
              selectedTile.y = upTile.y / tileWidth

              selectedUnit = upTile.tileInfo.troops
              return
            }
            if (upTile.occupied && !upTile.tileInfo.troops) {
              moveDelay(upTile, selectedUnit, selectedTile, s)
              return
            }
            if (!upTile.occupied) {
              moveDelay(upTile, selectedUnit, selectedTile, s)
              return
            }
            userPressed = false
          } else {
            userPressed = false
          }
        } else {
          userPressed = false
        }
      }
      // DOWN ARROW
      if (key == 40) {
        userPressed = true
        if (selectedTile.y + 1 <= cols) {
          const downTile = grid[selectedTile.x][selectedTile.y + 1]
          if (downTile.terrain !== 'water' && !downTile.tileInfo.playerBase) {
            if (
              downTile.occupied &&
              downTile.tileInfo.troops &&
              selectedUnit.count !== 30 &&
              downTile.tileInfo.troops.count !== 30
            ) {
              merged = true

              moveDelay(downTile, selectedUnit, selectedTile, s)
              selectedTile.x = downTile.x / tileWidth
              selectedTile.y = downTile.y / tileWidth

              selectedUnit = downTile.tileInfo.troops
              return
            }
            if (downTile.occupied && !downTile.tileInfo.troops) {
              moveDelay(downTile, selectedUnit, selectedTile, s)
              return
            }
            if (!downTile.occupied) {
              moveDelay(downTile, selectedUnit, selectedTile, s)
              return
            }
            userPressed = false
          } else {
            userPressed = false
          }
        } else {
          userPressed = false
        }
      }
      // LEFT ARROW
      if (key == 37) {
        userPressed = true
        if (selectedTile.x - 1 >= 0) {
          const leftTile = grid[selectedTile.x - 1][selectedTile.y]
          if (leftTile.terrain !== 'water' && !leftTile.tileInfo.playerBase) {
            if (
              leftTile.occupied &&
              leftTile.tileInfo.troops &&
              selectedUnit.count !== 30 &&
              leftTile.tileInfo.troops.count !== 30
            ) {
              merged = true
              moveDelay(leftTile, selectedUnit, selectedTile, s)
              selectedTile.x = leftTile.x / tileWidth
              selectedTile.y = leftTile.y / tileWidth

              selectedUnit = leftTile.tileInfo.troops
              return
            }
            if (leftTile.occupied && !leftTile.tileInfo.troops) {
              moveDelay(leftTile, selectedUnit, selectedTile, s)
              return
            }
            if (!leftTile.occupied) {
              moveDelay(leftTile, selectedUnit, selectedTile, s)
              return
            }
            userPressed = false
          } else {
            userPressed = false
          }
        } else {
          console.log('hit edge')
          userPressed = false
        }
      }
      // RIGHT ARROW
      if (key == 39) {
        userPressed = true
        if (selectedTile.x + 1 <= rows) {
          const rightTile = grid[selectedTile.x + 1][selectedTile.y]
          if (rightTile.terrain !== 'water' && !rightTile.tileInfo.playerBase) {
            if (
              rightTile.occupied &&
              rightTile.tileInfo.troops &&
              selectedUnit.count !== 30 &&
              rightTile.tileInfo.troops.count !== 30
            ) {
              merged = true
              moveDelay(rightTile, selectedUnit, selectedTile, s)
              selectedTile.x = rightTile.x / tileWidth
              selectedTile.y = rightTile.y / tileWidth

              selectedUnit = rightTile.tileInfo.troops
              return
            }
            if (rightTile.occupied && !rightTile.tileInfo.troops) {
              moveDelay(rightTile, selectedUnit, selectedTile, s)
              return
            }
            if (!rightTile.occupied) {
              moveDelay(rightTile, selectedUnit, selectedTile, s)
              return
            }
            userPressed = false
          } else {
            userPressed = false
          }
        }
      } else {
        userPressed = false
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
  const _selectedUnit = Object.assign({}, selectedUnit)
  const _selectedTile = Object.assign({}, selectedTile)
  setTimeout(function() {
    const currentTile = grid[_selectedTile.x][_selectedTile.y]

    const designatedTileTroops = designatedTile.tileInfo.troops
    const currentTileTroops = currentTile.tileInfo.troops
    if (
      designatedTileTroops &&
      designatedTileTroops.count < 30 &&
      currentTileTroops
    ) {
      if (designatedTileTroops.count + currentTileTroops.count > 30) {
        const diff = 30 - designatedTileTroops.count
        designatedTile.tileInfo.troops.count += diff
        currentTileTroops.count -= diff
      } else {
        designatedTile.tileInfo.troops.count += currentTileTroops.count
        currentTile.tileInfo.troops = null
      }
    } else if (!designatedTile.tileInfo.troops) {
      designatedTile.tileInfo.troops = _selectedUnit
      currentTile.tileInfo.troops = null
    }

    designatedTile.occupied = {
      owner: player.id
    }
    currentTile.occupied = {
      owner: player.id
    }
    selectedTile.x = designatedTile.x / tileWidth
    selectedTile.y = designatedTile.y / tileWidth

    selectedUnit = designatedTile.tileInfo.troops
    currentTile.initialize(s)

    designatedTile.initialize(s)
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
    userPressed = false
  }, 500)
}
