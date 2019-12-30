const { MilitaryUnit } = require('./MilitaryUnit')
class Warrior extends MilitaryUnit {
  constructor(attack, defense, mobility, attackSpeed, count) {
    super(attack, defense, mobility, attackSpeed)
    this.count = count
  }
}
module.exports = { Warrior }
