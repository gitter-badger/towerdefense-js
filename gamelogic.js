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
	},
	
	// Game variables and constants.
    towers: [],
    enemies: [],
    shots: [],
    
    money: null,
    lives: null,
    
    track: {
    	start: [0, 0],
    	path: []
    },
    
    boardWidth: 15,
    boardHeight: 10,
    
    // Used for clearInterval() for pausing.
    looper: null
};



Game.drawPath = function() {
	var bWidth = 600, bHeight = 400;
	var tileWidth = bWidth / this.boardWidth;
	for (var tX = 0; tX < this.boardWidth; tX++) {
		for (var tY = 0; tY < this.boardHeight; tY++) {
			var xpos = 100 + tX * 100;
			var ypos = 100 + tY * 100;
			fill(255, 255, 255);
			rect(xpos, ypos, 100, 100);
		}
	}
};


Game.update = function() {
	
};

Game.render = function() {
	
};



window.onload = function() {
	Game.loaded = true;
	Game.canvas = document.getElementById("#game");
	init();
}

function startGame() {
	Game.towers = [];
	Game.enemies = [];
	Game.shots = [];
	Game.money = 500;
	Game.lives = 50;
	play();
}