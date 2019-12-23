class Player {
  /*
    military: {
      swordsmen: <int>, archers: <int>
    }
    building: [
      {x: <int>, y: <int>, type: <string>}
    ]

  */
  constructor(id, x, y, stone, wood, miners, military, building) {
    this.id = id
    this.x = x
    this.y = y
    this.stone = stone
    this.wood = wood
    this.miners = miners
    this.military = military
    this.building = building
  }
}
