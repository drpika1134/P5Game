class Tile {
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.clicked = false
  }
  initialize(offsetX, offsetY, newOriginX, newOriginY, flag, r) {
    if (flag) {
      // The higher the number, the lower chance of it being ocean
      if (r > 0.55) {
        this.color = 'blue'
      }
      fill(this.color)
      // Update the new position after dragging
      rect(this.x + newOriginX, this.y + newOriginY, this.w, this.w)
    } else {
      if (r > 0.55) {
        this.color = 'blue'
      }
      fill(this.color)
      rect(this.x - offsetX, this.y - offsetY, this.w, this.w)
    }
  }
}
