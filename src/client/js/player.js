const { Warrior } = require('./military/Warrior')
const { MilitaryCamp } = require('./building/MilitaryCamp')
const { updateDeployableRange } = require('./utils/utils')
const { Village } = require('./building/Village')
class Player {
  constructor(id, x, y, stone, wood) {
    this.id = id

    this.x = x
    this.y = y

    this.stone = stone
    this.wood = wood

    this.civilian = 1000
    this.claimedTile = {
      land: 0,
      wood: 0,
      stone: 0
    }
    this.village = 0
    this.deployed = 0
    this.deployMax = 100
  }
}
const troopCost = 2
Player.prototype.deployTroop = function(tile, player, DOM, s) {
  if (tile.canDeploy && tile.terrain !== 'water') {
    const troopsToDeploy = parseInt(DOM.military.deployTroopsAmount.value())
    if (
      player.deployed <= player.deployMax &&
      player.deployed + troopsToDeploy <= player.deployMax
    ) {
      const warrior = new Warrior(50, 50, 50, 50, troopsToDeploy)
      tile.tileInfo.troops = warrior
      tile.occupied = {
        owner: player.id
      }
      player.deployed += troopsToDeploy
      tile.initialize(s)

      player.wood -= troopCost * troopsToDeploy
      player.stone -= troopCost * troopsToDeploy
    }
  }
}

let campCost = 200
Player.prototype.buildMilitaryCamp = function(
  grid,
  tile,
  player,
  rows,
  cols,
  s
) {
  if (player.wood >= campCost && player.stone >= campCost) {
    if (tile.terrain === 'land') {
      const tilePosX = tile.x / tile.w
      const tilePosY = tile.y / tile.w

      if (tile.occupied) {
        const militaryCamp = new MilitaryCamp(
          player.id,
          '1',
          tilePosX,
          tilePosY
        )
        player.deployMax += 20
        tile.tileInfo.building = militaryCamp
        tile.occupied = true
        tile.initialize(s)
        updateDeployableRange(grid, { x: tilePosX, y: tilePosY }, rows, cols)
        player.wood -= campCost
        player.stone -= campCost

        campCost *= 2
      }
    }
  }
}

Player.prototype.buildVillage = function(tile, s) {
  tile.tileInfo.village = new Village('id')
  tile.occupied = true
  tile.initialize(s)
  this.village++
}
module.exports = {
  Player
}
