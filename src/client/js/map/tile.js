const { b, m } = require('../utils/types')

class Tile {
  /**
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @param {number} w - tile width
   * @param {string} c - tile color
   */
  constructor(x, y, w, c) {
    this.x = x
    this.y = y
    this.w = w
    this.color = c
    this.occupied = false
    this.terrain = 'land'
    this.tileInfo = {
      playerBase: false,
      village: null,
      troops: null,
      building: null
    }
  }
  /**
   * Draw the tile depends on what type of terrain it is or if its the player
   *
   * @param {Object} s - required to use p5 functions
   * @param {number} r - the random value for determining the type of terrain
   * @param {Array} possibleSpawnLocation - an array of possible spawn locations for player
   * @memberof Tile
   */
  initialize(s, r, possibleSpawnLocation) {
    this.generateTerrain(r, possibleSpawnLocation)
    this.isPlayer(this.tileInfo.playerBase)
    this.isBuilding(this.tileInfo.building)
    this.isTroops(this.tileInfo.troops)
    this.isVillage(this.tileInfo.village)
    s.fill(this.color)
    s.rect(this.x, this.y, this.w, this.w)
  }
}
Tile.prototype.isPlayer = function(player) {
  if (player) {
    this.color = 'black'
    this.occupied = true
  }
}
Tile.prototype.isTroops = function(troops) {
  if (troops) {
    this.color = 'red'
  }
}
Tile.prototype.isVillage = function(village) {
  if (village) {
    this.color = 'orange'
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
Tile.prototype.generateTerrain = function(r, possibleSpawnLocation) {
  if (r <= 0.37) {
    this.terrain = 'water'
    this.color = 'blue'
  } else if (r <= 0.52 && r >= 0.47) {
    this.terrain = 'forest'
    this.color = '#26660f' // forests
  } else if (r <= 0.65) {
    possibleSpawnLocation.push([this.x / 40, this.y / 40])
    this.terrain = 'land'
    this.color = 'green'
  } else if (r <= 0.97) {
    this.terrain = 'mountain'
    this.color = '#ad4315' // mountains
  }
}
module.exports = { Tile }
