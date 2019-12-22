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

      // Is the map dropped or still being dragged
      if (!dropped) {
        if (i == 1 && j == 1) {
          square.isPlayer = true
          // square.initialize(0, 0, x, y, true, r)
        }
        square.initialize(offsetX, offsetY, 0, 0, false, r)
      } else {
        if (i == 1 && j == 1) {
          square.isPlayer = true
          // square.initialize(0, 0, x, y, true, r)
        }
        square.initialize(0, 0, x, y, true, r)
      }
    }
  }
}
