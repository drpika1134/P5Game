class Tile {
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.occupied = false
    this.terrain = 'land'
    this.tileInfo = {
      playerBase: false,
      troops: null,
      building: null
    }
  }
  initialize(r) {
    this.generateTerrain(r)
    this.isPlayer(this.tileInfo.playerBase)
    this.isBuilding(this.tileInfo.building)

    fill(this.color)
    rect(this.x, this.y, this.w, this.w)
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
  if (building) {
    switch (building.type) {
      case b: // building
        this.color = 'grey'
        break
      case m: // military building
        this.color = 'pink'
        break
      default:
        return
    }
  }
  return
}
Tile.prototype.generateTerrain = function(r) {
  if (r <= 0.35) {
    this.terrain = 'water'
    this.color = 'blue'
  } else if (r <= 0.52 && r >= 0.47) {
    this.terrain = 'forest'
    this.color = '#26660f' // forests
  } else if (r <= 0.65) {
    possibleSpawnLocation.push([this.x / tileWidth, this.y / tileWidth])
    this.terrain = 'land'
    this.color = 'green'
  } else if (r <= 0.97) {
    this.terrain = 'mountain'
    this.color = '#ad4315' // mountains
  }
}
