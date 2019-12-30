function make2DArray(cols, rows) {
  let array = new Array(cols)
  for (let i = 0; i < cols; i++) {
    array[i] = new Array(rows)
  }
  return array
}
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
function getTile(s, tileWidth, cols, rows, grid) {
  const xPosInArray = Math.floor(s.mouseX / tileWidth)
  const yPosInArray = Math.floor(s.mouseY / tileWidth)
  if (
    xPosInArray > cols ||
    xPosInArray < 0 ||
    yPosInArray > rows ||
    yPosInArray < 0
  ) {
    return false
  }
  return grid[xPosInArray][yPosInArray]
}
// Find all the necessary DOM elements
function findDOMElements(DOM, s) {
  DOM.tileInfo = s.select('#tileInfo')

  DOM.playerInfo.wood = s.select('#wood')
  DOM.playerInfo.stone = s.select('#stone')
  DOM.playerInfo.civilian = s.select('#civilian')

  DOM.military.deploy = document.getElementById('deploy')
  DOM.military.deployTroops = s.select('#deployTroops')
  DOM.military.deployTroopsAmount = s.select('#deployTroopAmount')
}

function startCivilianInterval(DOM, player) {
  setInterval(function() {
    const claimedTile = player.claimedTile
    player.wood += claimedTile.wood * 10
    player.stone += claimedTile.stone * 10
    player.civilian += player.village * 10
    DOM.playerInfo.wood.html(`${player.wood}`)
    DOM.playerInfo.stone.html(`${player.stone}`)
    DOM.playerInfo.civilian.html(`${player.civilian}`)
    // DOM.playerInfo.stone.html(`${      parseInt(DOM.playerInfo.stone) + claimedTile.stone * 10
    // }`)
  }, 3000)
}

function updateDeployableRange(grid, tile, rows, cols) {
  for (let i = tile.x - 3; i <= tile.x + 3; i++) {
    for (let y = tile.y - 3; y <= tile.y + 3; y++) {
      if (i >= 0 && i <= rows && y >= 0 && y < cols) {
        grid[i][y].canDeploy = true
      }
    }
  }
}

module.exports = {
  make2DArray,
  getRandomInt,
  findDOMElements,
  startCivilianInterval,
  getTile,
  updateDeployableRange
}
