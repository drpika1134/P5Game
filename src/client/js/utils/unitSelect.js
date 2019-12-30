const { building, troop, building_types } = require('./types')

function addUnitSelectListeners(selectedUnit) {
  const village = document.getElementById('v')

  village.addEventListener('click', function() {
    selectedUnit.type = building
    selectedUnit.name = building_types.village
  })
}
module.exports = { addUnitSelectListeners }
