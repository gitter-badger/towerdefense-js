// Found this routine on Stack Overflow.
function isCanvasSupported(){
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

var WIDTH;
var HEIGHT;
var ctx;



var Game = {
	// Used for loading the game.
	loaded: false,
	canvas: null,
	get context() {
		return ctx;
	}
	
	// Game variables and constants.
    towers: [],
    enemies: [],
    shots: [],
    
    money: 500,
    lives: 50,
    
    track: {
    	start: [0, 0],
    	path: []
    },
    
    boardWidth: 15,
    boardHeight: 10,
    
    // Used for clearInterval() for pausing.
    looper: null
};

Game.update = function() {
	
};

Game.render = function() {
	
};

function init() {
	ctx = $('#canvas')[0].getContext("2d");
  	WIDTH = $("#canvas").width();
 	HEIGHT = $("#canvas").height();
  	
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



window.onload = function() {
	Game.loaded = true;
	Game.canvas = document.getElementById("#game");
	Game.context = canvas.getContext('2d');
}

function startGame() {
	Game.towers = [];
	Game.enemies = [];
	Game.shots = [];
	
}

function pause() {
	if (Game.looper == null) {
		return false;
	}
	clearInterval(Game.looper);
}