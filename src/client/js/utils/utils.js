function make2DArray(cols, rows) {
  let array = new Array(cols)
  for (let i = 0; i < cols; i++) {
    array[i] = new Array(rows)
  }
  return array
}

/* CAMERA MOVEMENT */
function startCameraMove() {
  offsetX = mouseX - x
  offsetY = mouseY - y
  dragging = true
}

function quitCameraMode() {
  // Quit dragging
  dragging = false

  // Set new origin
  x = mouseX - offsetX
  y = mouseY - offsetY

  dropped = true
}

function setCameraPosition() {
  camx = mouseX
  camy = mouseY
  dropped = false
}
