class Tile {
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.occupied = false

    /*
      playerBase: {
        name: <String>,
        id: <String>
      }
      troops: {
        swordsmen: <Int>
        ...
        ownerId: <Int>
      }
      building: [

      ]
    */
    this.tileInfo = { playerBase: false, troops: false, building: false }
  }
  initialize(offsetX, offsetY, newOriginX, newOriginY, dragging, r) {
    if (dragging) {
      this.generateTerrain(r)
      this.isPlayer(this.tileInfo.playerBase)
      this.isBuilding(this.tileInfo.building)

      fill(this.color)
      rect(this.x + newOriginX, this.y + newOriginY, this.w, this.w)
    } else {
      this.generateTerrain(r)
      this.isPlayer(this.tileInfo.playerBase)
      this.isBuilding(this.tileInfo.building)

      fill(this.color)
      rect(this.x - offsetX, this.y - offsetY, this.w, this.w)
    }
  }
}
Tile.prototype.isPlayer = function(player) {
  if (player) {
    this.color = 'black'
  }
}
Tile.prototype.isTroops = function(troops) {
  if (troops) {
    this.color = 'red'
  }
}
Tile.prototype.isBuilding = function(building) {
  switch (building.type) {
    case 'Building':
      this.color = 'grey'
      break
    case 'Military':
      this.color = 'pink'
      break
    default:
      return
  }
  return
}
Tile.prototype.generateTerrain = function(r) {
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
