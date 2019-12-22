class Player {
  constructor(x, y) {
    this.playerX = x
    this.playerY = y
  }
  initialize(offsetX, offsetY, newOriginX, newOriginY, dragging) {
    if (dragging) {
      fill('black')

      // Update the new position after dragging
      rect(
        this.playerX + newOriginX,
        this.playerY + newOriginY,
        tileWidth,
        tileWidth
      )
    } else {
      fill('black')

      rect(this.playerX - offsetX, this.playerY - offsetY, tileWidth, tileWidth)
    }
  }
}
