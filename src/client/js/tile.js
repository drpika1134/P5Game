class Tile {
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.clicked = false
  }
  initialize(offsetX, offsetY, newOriginX, newOriginY, dragging, r) {
    if (dragging) {
      this.generateTerrain(r)
      fill(this.color)
      // Update the new position after dragging
      rect(this.x + newOriginX, this.y + newOriginY, this.w, this.w)
    } else {
      this.generateTerrain(r)
      fill(this.color)
      rect(this.x - offsetX, this.y - offsetY, this.w, this.w)
    }
  }
  generateTerrain(r) {
    if (r <= 0.35) {
      this.color = 'blue'
    } else if (r <= 0.52 && r >= 0.47) {
      this.color = '#26660f' // forests
    } else if (r <= 0.65) {
      this.color = 'green'
    } else if (r <= 0.97) {
      this.color = '#ad4315' // mountains
    }
  }
}
