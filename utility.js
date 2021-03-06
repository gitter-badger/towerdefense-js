// Make sure the user doesn't lose their game
window.onbeforeunload = function(event) {
	//event.returnValue = "You will lose your game progress!";
}

// Utility Functions
function init() {
	Game.canvas = document.getElementById("game");
	ctx = Game.canvas.getContext("2d");
  	WIDTH = Game.canvas.width;
 	HEIGHT = Game.canvas.height;
 	
 	// Mouse Handling
	Game.canvas.onmousedown = function() {
		Game.mousePressed = true;
	};
	Game.canvas.onmouseup = function m_up() {
		Game.mousePressed = false;
	};
	Game.canvas.onmouseout = function m_up() {
		Game.mousePressed = false;
	};
}
function hex(a, digits) {
	var str = a.toString(16);
	if (!digits) {return str;}
	while (str.length < digits) {
		str = "0" + str;
	}
	return str;
}
// Drawing Functions
function fill(r, g, b) {
	if ((r < 0) || (r > 255) || (g < 0) || (g > 255) || (b < 0) || (b > 255)) {
		console.warn("Out of range");
		return;
	}
	var stylee = "#" + hex(r, 2) + hex(g, 2) + hex(b, 2);
	ctx.fillStyle = stylee;
	return stylee;
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
function noFill() {
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
}
function clearScreen() {
  	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
function wrapText(text, x, y, line_width, line_height) {
    var line = '';
    var paragraphs = text.split('\n');
    for (var i = 0; i < paragraphs.length; i++) {
        var words = paragraphs[i].split(' ');
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > line_width && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += line_height;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        y += line_height;
        line = '';
    }
}
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
	return this;
}


// Math functions
function lerp(x, y, amt) {
	return x + (y - x) * amt;
}
Number.prototype.inRange = function(e,t) {
	return this >= e && this <= t;
}
function dist(x1, y1, x2, y2) {
	return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
}


// Play and Pause
function play() {
	if (Game.looper != null) {
		clearInterval(Game.looper);
		Game.looper = null;
	}
	if (Game.looper2 != null) {
		clearInterval(Game.looper2);
		Game.looper2 = null;
	}
	Game.looper2 = setInterval(Game.render, 33);
	Game.looper = setInterval(Game.update, 33);
}
function pause() {
	if (Game.looper == null) {
		return false;
	}
	clearInterval(Game.looper);
	Game.looper = null;
	clearInterval(Game.looper2);
	Game.looper2 = null;
}