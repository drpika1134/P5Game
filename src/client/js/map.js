function initializeGrid() {
  grid = make2DArray(cols, rows)

  // Initialize Tile objects
  for (let i = 0; i < cols; i++) {
    for (let x = 0; x < rows; x++) {
      // From top to bottom
      grid[i][x] = new Tile(i * tileWidth, x * tileWidth, tileWidth, 'green')
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
        square.initialize(offsetX, offsetY, 0, 0, false, r)
      } else {
        square.initialize(0, 0, x, y, true, r)
      }
    }
  }
}
