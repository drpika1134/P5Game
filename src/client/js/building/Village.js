class Village {
  constructor(owner, civilian, farm) {
    this.owner = owner
    this.civilian = civilian
    this.farm = farm
    this.barracks = 0
    this.military = {}
  }
}
module.exports = { Village }
