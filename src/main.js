function setup() {
	/*
		We are setting the canvas width to the user's browser width and height here
	*/
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(220);
	rect(10, 10, 10, 10)
}

// Make the canvas size responsive if resized
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}