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
let flag = false
function drawTiles() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const square = grid[i][j]
      // The higher the multiplier, the more cluster it gets
      const r = noise(i * 0.3, j * 0.3)

      // Is the map dropped or still being dragged
      if (!dropped) {
        // TODO: player location need to be random but close to teamates
        square.initialize(offsetX, offsetY, 0, 0, false, r)
      } else {
        square.initialize(0, 0, x, y, true, r)
      }
    }
  }
  if (flag == false) {
    let random =
      possibleSpawnLocation[getRandomInt(5, possibleSpawnLocation.length / 2)]
    const square = grid[random[0]][random[1]]
    square.tileInfo.playerBase = {
      name: 'DrPika',
      id: player.id
    }
    square.initialize(
      offsetX,
      offsetY,
      0,
      0,
      false,
      noise(random[0] * 0.3, random[1] * 0.3)
    )
    flag = true
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
