

// Utility Functions
function init() {
	Game.canvas = document.getElementById("game");
	ctx = Game.canvas.getContext("2d");
  	WIDTH = Game.canvas.width;
 	HEIGHT = Game.canvas.height;
}
function fill(r, g, b) {
	if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
		return;
	}
	ctx.fillStyle = "#" + r.toString(16) + g.toString(16) + b.toString(16);
}
function circle(x,y,r) {
  	ctx.beginPath();
  	ctx.arc(x, y, r, 0, Math.PI*2, true);
  	ctx.closePath();
  	ctx.fill();
}
function rect(x,y,w,h) {
  	ctx.beginPath();
  	ctx.rect(x,y,w,h);
  	ctx.closePath();
  	ctx.fill();
}
function clear() {
  	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// Play and Pause
function play() {
	setInterval(Game.render, 33);
	Game.looper = setInterval(Game.update, 33);
}
function pause() {
	if (Game.looper == null) {
		return false;
	}
	clearInterval(Game.looper);
}