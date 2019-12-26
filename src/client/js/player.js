const { b, m, t } = require('./utils/types')
class Player {
  constructor(id, x, y, stone, wood, builders, civilian) {
    this.id = id

    this.x = x
    this.y = y

    this.stone = stone
    this.wood = wood

    this.civilian = civilian
    this.builders = builders

    this.military = {}
    this.building = []
  }
}

/**
 *  Claim a tile with the player's selected unit
 *
 * @param {Object} tile - the tile that is being clicked
 * @param {Object} selectedUnit - selected unit object
 * @param {Object} player - player object
 * @param {Object} s - p5 objects
 */
Player.prototype.claimTile = function(tile, selectedUnit, player, s) {
  switch (selectedUnit.type) {
    case 'b': // Building
      tile.tileInfo = {
        ...tile.tileInfo,
        building: { owner: player.id, type: b, name: selectedUnit.name }
      }
      player.building = [
        ...player.building,
        { id: 'facId', type: b, name: 'factory' }
      ]
      console.log(tile)
      console.log(player)
      break
    // case 'm': // Military
    //   tile.tileInfo = {
    //     ...tile.tileInfo,
    //     building: { owner: player.id, type: m /* m = Military Building */ }
    //   }
    //   player.building = [
    //     ...player.building,
    //     { id: 'milId', type: m, name: 'recruitment center' }
    //   ]
    //   break
    case 't':
      tile.tileInfo = {
        ...tile.tileInfo,
        troops: { owner: player.id, type: t, name: selectedUnit.name }
      }
      if (Object.entries(player.military).length !== 0) {
        player.military = {
          ...player.military,
          [selectedUnit.name]: [
            ...player.military[selectedUnit.name],
            { x: tile.x / tile.w, y: tile.y / tile.w, troops: 100 }
          ]
        }
      } else {
        player.military = {
          [selectedUnit.name]: [
            { x: tile.x / tile.w, y: tile.y / tile.w, troops: 100 }
          ]
        }
      }
      console.log(tile)
      console.log(player)
      break
    default:
      return
  }
  tile.occupied = true
  tile.initialize(s)
}

module.exports = { Player }
