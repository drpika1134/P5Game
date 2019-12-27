const { b, m, t, v } = require('./utils/types')
const { Village } = require('./Village')
const { updateData } = require('./utils/updateData')
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
    this.building = {
      factory: [],
      village: []
    }
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
Player.prototype.claimTile = function(tile, selectedUnit, player, s, DOM) {
  if (selectedUnit.type !== null) {
    // if the selected unit type is village and the tile terrain is land
    if (selectedUnit.type === 'v') {
      if (tile.terrain === 'land') {
        let village = new Village('id', 200, 10)
        resetInputs(DOM, village)

        DOM.farmCustomizer.style('display', 'block')
        /*
          For some reason, addEventListener won't work here as it will cause the number of farms to 
          be the same for every city when changed in one city
        */
        DOM.slider.oninput = function(e) {
          setFarmSliderValue(tile.tileInfo.village, DOM, e.target.value)
        }
        DOM.saveFarm.onclick = function() {
          setFarmFormValue(DOM, village)
        }
        updatePlayerAndTile(tile, player, village, selectedUnit)

        player.civilian += village.population
        updateData(DOM, player.civilian)

        console.log(tile)
        console.log(player)
        tile.occupied = true
        tile.initialize(s)
      }
    } else {
      console.log('claim')
      updatePlayerAndTile(tile, player, null, selectedUnit)

      tile.occupied = true
      tile.initialize(s)
    }
  }
}
/* UPDATE GAME INFO */
function updatePlayerAndTile(tile, player, village, selectedUnit) {
  switch (selectedUnit.type) {
    case 'b':
      player.building.factory.push({ id: 'fac', type: b, name: 'factory' })
      tile.tileInfo.building = {
        owner: player.id,
        type: b,
        name: selectedUnit.name
      }
      break
    case 'v':
      player.building.village.push(village)
      tile.tileInfo.village = village
      break
    case 't':
      player.military[selectedUnit.name] = 100
      tile.tileInfo.troops = {
        owner: player.id,
        type: t,
        name: selectedUnit.name
      }
      break
    default:
      return
  }
}
/* DOM */
function setFarmSliderValue(village, DOM, value) {
  village.farm = value
  DOM.farmInput.value(value)
}
function setFarmFormValue(DOM, village, inputValue) {
  village.farm = DOM.farmInput.value()
  DOM.slider.value = DOM.farmInput.value()
}
function resetInputs(DOM, village) {
  DOM.slider.value = village.farm
  DOM.farmInput.value(village.farm)
}

module.exports = {
  Player,
  setFarmSliderValue,
  setFarmFormValue,
  resetInputs
}
