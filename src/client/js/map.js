function initializeGrid() {
  grid = make2DArray(cols, rows)

  // Initialize Tile objects
  for (let i = 0; i < cols; i++) {
    for (let x = 0; x < rows; x++) {
      // From top to bottom
      grid[i][x] = new Tile(i * tileWidth, x * tileWidth, tileWidth, 'blue')
    }
  }
}

function drawTiles() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const square = grid[i][j]
      // The higher the multiplier, the more cluster it gets
      const r = noise(i * 0.3, j * 0.3)

      square.initialize(r)
    }
  }
  // TODO: Teammate should spawn closer to each other
  if (isPlayerSpawned == false) {
    spawn()
  }
}
function spawn() {
  let random =
    possibleSpawnLocation[getRandomInt(5, possibleSpawnLocation.length / 2)]
  const square = grid[random[0]][random[1]]
  square.tileInfo.playerBase = {
    name: 'DrPika',
    id: player.id
  }
  square.initialize(noise(random[0] * 0.3, random[1] * 0.3))
  isPlayerSpawned = true
  player.x = square.x
  player.y = square.y
  addListeners(square.x, square.y)
}
