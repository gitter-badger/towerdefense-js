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
    	path: [
    		[0, 1], [1, 1], [1, 2], [1, 3], [1, 4],
    		[1, 5], [1, 6], [1, 7], [1, 8], [2, 8],
    		[3, 8], [3, 7], [3, 6], [4, 6], [4, 5],
    		[4, 4], [3, 4], [3, 3], [3, 2], [4, 2],
    		[5, 2], [6, 2], [7, 2], [7, 3], [7, 4],
    		[8, 4], [9, 4], [10,4], [11,4], [12,4],
    		[13,4], [13,3], [13,2], [13,1], [12,1],
    		[11,1], [10,1], [10,2], [10,3], [10,4],
    		[10,5], [10,6], [9, 6], [8, 6], [7, 6],
    		[7, 7], [6, 7], [6, 8], [6, 9], [7, 9],
    		[8, 9], [9, 9], [10,9], [10,8], [11,8],
    		[12,8], [13,8], [13,7], [14,7]
    	]
    },
    
    // frame counter
    frame: 0,
    
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
Game.Enemy = function EnemyConstructor() {
	this.x = 0;
	this.y = 0;
};
Game.Enemy.prototype.draw = function() {
	ellipse(this.x, this.y, 40, 40);
};
Game.Enemy.prototype.update = function() {
	
};

Game.drawPath = function() {
	var bWidth = 600, bHeight = 400;
	var tileWidth = bWidth / this.boardWidth;
	for (var tX = 0; tX < this.boardWidth; tX++) {
		for (var tY = 0; tY < this.boardHeight; tY++) {
			var xpos = tX * tileWidth;
			var ypos = 100 + tY * tileWidth;
			ctx.fillStyle = "#008800";
			rect(xpos, ypos, tileWidth, tileWidth);
		}
	}
	var path = [].concat([this.track.start]).concat(this.track.path)
	for (var i = 0; i < path.length; i++) {
		var coords = path[i];
		var tX = coords[0];
		var tY = coords[1];
		var xpos = tX * tileWidth;
		var ypos = 100 + tY * tileWidth;
		fill(180, 160, 80);
		rect(xpos, ypos, tileWidth, tileWidth);
		ctx.stroke()
	}
};

Game.drawInfo = function() {
	ctx.font = "20px Arial";
	ctx.fillStyle = "#0000ff";
	ctx.fillText("Money: " + this.money, 30, 30);
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
	Game.frame = 0;
	play();
}