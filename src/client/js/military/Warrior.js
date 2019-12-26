const { MilitaryUnit } = require('./MilitaryUnit')
class Warrior extends MilitaryUnit {
  constructor(attack, defense, mobility, attackSpeed) {
    super(attack, defense, mobility, attackSpeed)
  }
}
module.exports = { Warrior }
