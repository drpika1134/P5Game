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
