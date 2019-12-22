class Tile {
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.clicked = false
  }
  initialize(offsetX, offsetY, newOriginX, newOriginY, dragging, r) {
    //0.4, 0.5, 0.7, 1
    if (dragging) {
      if (r <= 0.35) {
        this.color = 'blue'
      } else if (r <= 0.6) {
        this.color = 'green'
      } else if (r <= 0.7) {
        this.color = '#26660f'
      } else if (r <= 1) {
        this.color = '#ad4315'
      }
      fill(this.color)
      // Update the new position after dragging
      rect(this.x + newOriginX, this.y + newOriginY, this.w, this.w)
    } else {
      if (r <= 0.35) {
        this.color = 'blue'
      } else if (r <= 0.6) {
        this.color = 'green'
      } else if (r <= 0.7) {
        this.color = '#26660f'
      } else if (r <= 1) {
        this.color = '#ad4315'
      }
      fill(this.color)
      rect(this.x - offsetX, this.y - offsetY, this.w, this.w)
    }
  }
}
