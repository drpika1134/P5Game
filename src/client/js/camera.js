window.onload = addListeners()
var offX
var offY

function addListeners() {
  document
    .getElementById('inner')
    .addEventListener('mousedown', mouseDown, false)
  window.addEventListener('mouseup', mouseUp, false)
}

function mouseUp() {
  window.removeEventListener('mousemove', divMove, true)
}

function mouseDown(e) {
  if (e.button !== 4 && !(e.button < 2)) {
    var div = document.getElementById('inner')
    offY = e.clientY - parseInt(div.offsetTop)
    offX = e.clientX - parseInt(div.offsetLeft)
    window.addEventListener('mousemove', divMove, true)
  }
}

function divMove(e) {
  var div = document.getElementById('inner')
  div.style.position = 'absolute'
  div.style.top = e.clientY - offY + 'px'
  div.style.left = e.clientX - offX + 'px'
}
