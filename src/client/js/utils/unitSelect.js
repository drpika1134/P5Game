/**
 * Detect what the player has chosen (building, troops, etc...) to put on map
 * @param {Object} selectedUnit
 */
function addUnitSelectListeners(selectedUnit) {
  const building = document.getElementById('b')
  const militaryBuilding = document.getElementById('m')
  const troops = document.getElementById('t')
  building.addEventListener('click', function() {
    selectedUnit.type = 'b'
    selectedUnit.name = 'building'
  })
  militaryBuilding.addEventListener('click', function() {
    selectedUnit.type = 'm'
    selectedUnit.name = 'military'
  })
  troops.addEventListener('click', function() {
    selectedUnit.type = 't'
    selectedUnit.name = 'warrior'
  })
}
module.exports = { addUnitSelectListeners }
