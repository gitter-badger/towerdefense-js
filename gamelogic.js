console.log("Hey everyone! You can mess with the game by typing JavaScript commands like Game.money = 60000 or Game.enemies = [] (this last one clears the whole screen of enemies)! But if you think that's wrong, don't do it.");

// Found this routine on Stack Overflow.
function isCanvasSupported(){
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

var WIDTH;
var HEIGHT;
var ctx;
var TILE_SIZE = 40;

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
    sell: 0.8, // sell back ratio
    selectedTower: -1,
    selectedType: -1,
    
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
    		[12,8], [13,8], [13,7], [13,6], [14,6]
    	]
    },
    
    // frame counter
    frame: 0,
    
    boardWidth: 15,
    boardHeight: 10,
    
    // Used for clearInterval() for pausing.
    looper: null,
    looper2: null,
    
    // mouse variables
    mouseX: 0,
    mouseY: 0,
    mousePressed: false,
    
    // popups
    popup: false
};
var TOWER_INFO = [
	{
		name: "Regular Tower",
		description: "Normal tower. Average range, damage, and fire rate.",
		cost: 200,
		delay: 45,
		damage: 10,
		range: 3,
		upgrades: [
			{
				// What happens to the stats?
				data: {damage: "+5", range: "+0.25", delay: "-5"},
				cost: 140
			},
			{
				// This upgrade makes the tower level 3.
				data: {damage: "+7.5", range: "+0.25", delay: "-3"},
				cost: 200
			},
			{
				data: {damage: "+7.5", range: "+0.5", delay: "-2"},
				cost: 250
			},
			{
				data: {damage: "+15"},
				cost: 275
			},
			{
				// Level 6, ultimate upgrade but very pricey
				data: {damage: "+30", range: "+1", delay: "-15"},
				cost: 750
			}
		],
		
		draw: function(x, y, angle) {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(angle);
			fill(0, 0, 0);
			rect(-1, -2, 18, 4);
			rect(17, -5, 3, 10);
			ctx.fillStyle = "#ff0000";
			circle(0, 0, 12);
			ctx.restore();
		}
	},
	{
		name: "Laser Tower",
		description: "The laser tower shoots a beam when an enemy gets in range. Touches all enemies in that line.",
		cost: 300,
		delay: 60,
		damage: 15,
		range: 2.25,
		upgrades: [
			{ data: {damage: "+5", delay: "+5", range: "+0.25"}, cost: 250},
			{ data: {damage: "+10", delay: "-5", range: "+0.25"}, cost: 275},
			{ data: {delay: "-10", range: "+0.5"}, cost: 300},
			{ data: {damage: "+15", delay: "-5"}, cost: 350},
			// ultimate upgrade (L6)
			{ data: {damage: "+25", delay: "-15", range: "+1"}, cost: 720}
		],
		
		draw: function(x, y, angle) {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(angle);
			fill(50, 200, 70);
			circle(0, 0, 8);
			fill(0, 0, 255);
			rect(4, -2, 8, 4);
			
			ctx.restore();
		}
	}
];



var WAVES = [
//              5    0    5    0    5    0    5    0    5
	{wave: "0000000000", message: "That was too easy, try the next round.", delay: 500},
	{wave: "00000000000000000000", message: "Great job. Now here comes the fast enemy.", delay: 400}
];


Game.Enemy = function Enemy() {
	this.x = Game.track.start[0];
	this.y = Game.track.start[1];
	
	this.prev = Game.track.start;
	this.next = Game.track.path[0];
	this.segment = 0;
	
	this.speed = 1.0; // tiles/sec
	
	this.t = 0;
};
Game.Enemy.prototype.draw = function() {
	var bWidth = 600, bHeight = 400;
	var tileSize = bWidth / Game.boardWidth;
	
	ctx.save();
	ctx.fillStyle = "#ff6600";
	circle((this.x + 1/2) * tileSize, 100 + (this.y + 1/2) * tileSize, 15);
	ctx.restore();
};
Game.Enemy.prototype.update = function() {
	this.t += (this.speed / 30);
	this.x = lerp(this.prev[0], this.next[0], this.t);
	this.y = lerp(this.prev[1], this.next[1], this.t);
	if (this.t >= 1) {
		if ((this.segment + 1) >= Game.track.path.length) {
			Game.lives -= 1;
			this.deleteMe = true;
			return;
		}
		this.prev = this.next;
		this.segment++;
		this.next = Game.track.path[this.segment];
		this.t -= 1;
	}
};

Game.drawEnemies = function() {
	for (var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw();
	}
};
Game.updateEnemies = function() {
	for (var i = this.enemies.length - 1; i >= 0; i--) {
		this.enemies[i].update();
		if (this.enemies[i].deleteMe) {
			this.enemies.splice(i, 1);
		}
	}
};

// test
function testEnemy() {
	Game.enemies.push(new Game.Enemy());
}







Game.Tower = function Tower(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	
	this.range = type.range;
	this.delay = type.delay;
	this.damage = type.damage;
	this.lastFired = -Infinity;
	
	this.angle = 0;
	
	this.level = 1; // tower level
	this.totalCost = type.cost;
	
	this.upgrades = this.type.upgrades;
}
Game.Tower.prototype.draw = function( ) {
	var otherParam = undefined;
	this.type.draw(this.x * TILE_SIZE, 100 + this.y * TILE_SIZE, this.angle, otherParam);
};
Game.Tower.prototype.upgrade = function() {
	var up = this.type.upgrades[this.level - 1].data;
	if (!up) return;
	for (var type in up) {
		if (this[type] !== undefined) {
			var what = up[type];
			var foo = what.substr(1, what.length - 1);
			switch (what[0]) {
				case "=":
					if (isNaN(foo * 1)) {
						this[type] = foo;
					} else {
						this[type] = foo * 1;
					}
				break;
				case "+": case "-":
					this[type] += (what[0] === "+" ? 1 : -1) * foo;
				break;
				case "*":
					this[type] *= (foo * 1);
				break;
				case "/":
					if (foo != 0) this[type] /= (foo * 1);
				break;
			}
		}
	}
	this.level++;
};

Game.drawTowers = function() {
	for (var i = 0; i < this.towers.length; i++) {
		this.towers[i].draw();
	}
}










// draw path routine
Game.drawPath = function() {
	ctx.strokeStyle = "#000000";
	var bWidth = 600, bHeight = 400;
	var tileWidth = bWidth / this.boardWidth;
	/*for (var tX = 0; tX < this.boardWidth; tX++) {
		for (var tY = 0; tY < this.boardHeight; tY++) {
			var xpos = tX * tileWidth;
			var ypos = 100 + tY * tileWidth;
			ctx.fillStyle = "#008800";
			rect(xpos, ypos, tileWidth, tileWidth);
		}
	}*/
	ctx.fillStyle = "#008800";
	rect(0, 100, bWidth, bHeight);
	var path = [].concat([this.track.start]).concat(this.track.path)
	for (var i = 0; i < path.length; i++) {
		var coords = path[i];
		var tX = coords[0];
		var tY = coords[1];
		var xpos = tX * tileWidth;
		var ypos = 100 + tY * tileWidth;
		fill(180, 160, 80);
		if (i == 0) {
			ctx.fillStyle = "#5555ff";
		}
		if (i == (path.length - 1)) {
			fill(255, 0, 0);
		}
		rect(xpos, ypos, tileWidth, tileWidth);
		ctx.stroke()
	}
};

Game.drawInfo = function() {
	ctx.textAlign = "left";
	ctx.font = "20px Futura";
	ctx.fillStyle = "#00ff00";
	ctx.fillText("Money: " + this.money, 30, 30);
	ctx.fillText("Lives: " + this.lives, 30, 60);
	ctx.fillText("Wave: " + this.wave, 30, 550);
};

Game.drawTowerInfo = function() {
	ctx.textAlign = "center";
	ctx.font = "20px Futura";
	ctx.fillText("Buy Towers", 700, 100);
	
	for (var i = 0; i < TOWER_INFO.length; i++) {
		var twr = TOWER_INFO[i];
		var x = 650 + 50 * (i % 3);
		var y = 150 + 50 * Math.floor(i / 3);
		if (Game.selectedType == i) {
			ctx.strokeStyle = "#FFFFFF";
			ctx.strokeRect(x - 20, y - 20, 40, 40);
		}
		twr.draw(x, y, 0);
		
		if (Game.mouseX.inRange(x - 15, x + 15) && Game.mouseY.inRange(y - 15, y + 15)) {
			ctx.font = "16px Futura";
			fill(255, 255, 255);
			wrapText(twr.description, 700, 480, 200, 18);
			
			if (Game.mousePressed && Game.money >= twr.cost) {
				Game.selectedType = i;
			}
		}
	}
};

// Place tower routine
Game.placeTowers = function() {
	// check out of bounds
	if (!this.mousePressed || !(Game.mouseX.inRange(0, 600) && Game.mouseY.inRange(100, 500))) {
		return;
	}
	
	if (Game.selectedType >= 0) {
		var twr = TOWER_INFO[Game.selectedType];
		if (Game.money < twr.cost) { return; }
		
		var mx = Game.mouseX, my = Game.mouseY;
		var tX = mx / 40, tY = (my - 100) / 40;
		
		// check for track overlap
		var path = [].concat([this.track.start]).concat(this.track.path);
		for (var i = 0; i < path.length; i++) {
			var ttX = path[i][0], ttY = path[i][1]; // track
			var xx = ttX * TILE_SIZE, yy = 100 + ttY * TILE_SIZE; // x/y positions
			if (mx+12 > xx && mx-12 < xx + TILE_SIZE && my+12 > yy && my-12 < yy + TILE_SIZE) {
				Game.selectedType = -1;
				Game.popup = {
					text: "No placing towers on the track.",
					width: 120,
					height: 70,
					tSize: 20
				};
				return;
			}
		}
		
		Game.money -= twr.cost;
		Game.towers.push(new Game.Tower(tX, tY, twr));
		Game.selectedType = -1;
	}
};
// Select towers
Game.selectTowers = function() {
	// check out of bounds
	if (!(Game.mouseX.inRange(0, 600) && Game.mouseY.inRange(100, 500))) {
		return console.log("Out of bounds to select a tower. Mouse pressed = " + Game.mousePressed + ". Position = (" + Game.mouseX + ", " + Game.mouseY + ")");
	}
	
	Game.selectedTower = -1;
	var mx = Game.mouseX / TILE_SIZE;
	var my = (Game.mouseY - 100) / TILE_SIZE;
	for (var i = 0; i < Game.towers.length; i++) {
		var twr = Game.towers[i];
		if (dist(twr.x, twr.y, mx, my) < 15 / TILE_SIZE) {
			Game.selectedTower = i;
			console.log("Selecting tower " + i);
		}
	}
};

// Draw Upgrades
Game.drawUpgrades = function() {
	if (this.selectedTower !== -1) {
		var twr = Game.towers[Game.selectedTower];
		
		// Draw Range
		noFill();
		circle(twr.x * TILE_SIZE, twr.y * TILE_SIZE + 100, twr.range * TILE_SIZE);
		ctx.stroke();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		// draw tower name
		ctx.font = "16px Futura";
		fill(0, 255, 0);
		ctx.fillText(twr.type.name + " L" + twr.level, 700, 275);
		
		if (twr.level < 6) {
			// Draw Upgrade Button
			fill(255, 255, 255);
			ctx.roundRect(620, 300, 160, 50, 5).fill();
			fill(0, 0, 192);
			ctx.fillText("Upgrade Tower", 700, 325);
		}
		fill(255, 255, 255);
		ctx.roundRect(620, 360, 160, 50, 5).fill();
		fill(0, 0, 192);
		ctx.fillText("Sell Tower", 700, 385);
		
		// Upgrade Tower
		if (Game.mouseTicks == 1 && Game.mouseX.inRange(620, 780) && Game.mouseY.inRange(300, 350)) {
			if (twr.level < 6) {
				var up = twr.upgrades[twr.level - 1];
				if (Game.money >= up.cost) {
					twr.upgrade();
				}
			}
		}
		
		// Sell Tower
		if (Game.mousePressed && Game.mouseX.inRange(620, 780) && Game.mouseY.inRange(360, 410)) {
			Game.money += Game.sell * twr.totalCost;
			Game.towers.splice(Game.selectedTower, 1);
			Game.selectedTower = -1;
		}
		ctx.textBaseline = "alphabetic";
	}
};


function mouseClicked() {
	Game.placeTowers();
	Game.selectTowers();
};

/******************************************\
 *                                        *
 *  �  �  ���   ���    ��   �����  �����  *
 *  �  �  �  �  �  �  �  �    �    �      *
 *  �  �  ���   �  �  ����    �    ���    *
 *  �  �  �     �  �  �  �    �    �      *
 *   ��   �     ���   �  �    �    �����  *
 *                                        *
\******************************************/

Game.update = function() {
	if (Game.mousePressed) {
		Game.mouseTicks++;
	} else {
		Game.mouseTicks = 0;
	}
	
	// don't play for pop ups
	if (this.popup) {
		return;
	}
	Game.placeTowers();
	Game.updateEnemies();
}



/******************************************\
 *										  *
 *  ����   ����  �  �  ���   ����  ����   *
 *  �   �  �     �� �  �  �  �     �   �  *
 *  ����   ���   � ��  �  �  ���   ����   *
 *  �  �   �     �  �  �  �  �     �  �   *
 *  �   �  ����  �  �  ���   ����  �   �  *
 *									      *
\******************************************/
Game.render = function() {
	var e = document.createElement("img");
	e.src = "background_800x600.png";
	ctx.drawImage(e, 0, 0);
	
	Game.drawPath();
	Game.drawEnemies();
	Game.drawTowers();
	
	Game.drawInfo();
	Game.drawTowerInfo();
	Game.drawUpgrades();
	
	window.status = Game.popup;
	if (Game.popup) {
		fill(255, 255, 255);
		//stroke(0, 0, 0);
		ctx.roundRect(
			400 - Game.popup.width / 2,
			300 - Game.popup.height / 2,
			Game.popup.width,
			Game.popup.height,
			5
		);
		ctx.fill();
		fill(0, 0, 0);
		ctx.textAlign = "center";
		ctx.font = Game.popup.tSize + "px Futura";
		wrapText(" \n " + Game.popup.text, 400, 300 - Game.popup.height / 2, Game.popup.width, Game.popup.tSize);
	}
}


window.onload = function() {
	Game.loaded = true;
	Game.canvas = document.getElementById("#game");
	init();
	setTimeout(startGame, 200);
}

function startGame() {
	Game.towers = [];
	Game.enemies = [];
	Game.shots = [];
	Game.money = 3000;
	Game.lives = 50;
	Game.frame = 0;
	Game.wave = 0;
	play();
	
	Game.popup = {
		text: "\nWelcome! Click this box to close.\n\nClick on towers to select them. You can upgrade or sell from there.",
		width: 300,
		height: 170,
		tSize: 20
	};
	
	Game.canvas.onmousemove = function(event) {
		Game.mouseX = event.layerX;
		Game.mouseY = event.layerY;
	}
	Game.canvas.onclick = function() {
		mouseClicked();
		Game.popup = false;
	}
}