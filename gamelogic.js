// Found this routine on Stack Overflow.
function isCanvasSupported(){
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

var Game = {
	// Used for loading the game.
	loaded: false,
	canvas: null,
	context: null,
	
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