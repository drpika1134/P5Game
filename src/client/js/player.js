class Player {
  constructor(id, x, y, stone, wood, builders, civilian, military, building) {
    this.id = id

    this.x = x
    this.y = y

    this.stone = stone
    this.wood = wood

    this.civilian = civilian
    this.builders = builders

    this.military = military
    this.building = building
  }
}
function playerSelect(type) {
  selectedUnit = type
}
