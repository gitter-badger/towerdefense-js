console.log("Hey everyone! You can mess with the game by typing things like Game.money = 60000 or Game.enemies = [] (this last one clears the whole screen of enemies)! But if you think that's wrong, don't do it.");

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
    looper: null,
    looper2: null
};
var TOWER_INFO = [
	{
		name: "Regular Tower",
		description: "Normal tower. Average range, damage, and fire rate.",
		cost: 200
	}
];


Game.drawPath = function() {
	var bWidth = 600, bHeight = 400;
	var tileWidth = bWidth / this.boardWidth;
	for (var tX = 0; tX < this.boardWidth; tX++) {
		for (var tY = 0; tY < this.boardHeight; tY++) {
			var xpos = tX * tileWidth;
			var ypos = 100 + tY * tileWidth;
			if ((tX + tY) % 2 == 0) {
				fill(0, 0, 0);
			} else {
				fill(255, 255, 255);
			}
			rect(xpos, ypos, tileWidth, tileWidth);
		}
	}
};

Game.drawInfo = function() {
	ctx.font = "20px Arial";
	fill(0, 0, 255);
	//ctx.fillText("Money: " + this.money, 30, 30);
};


Game.update = function() {
	
};

Game.render = function() {
	clearScreen();
	
	Game.drawPath();
	Game.drawInfo();
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