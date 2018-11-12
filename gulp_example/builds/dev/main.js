(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let strataCarousel = function() {
	let div = document.createElement("div"),
		left = document.createElement("img"),
		right = document.createElement("img"),
		img = document.createElement("img"),
		btn = document.createElement("button"),
		stratas = document.getElementsByClassName("strata"),
		i = 0;
	div.id = "strataCarousel";
	playField.insertBefore(div, playField.firstChild);
	left.src = "images/left.png";
	left.className = "arrows";
	div.appendChild(left);
	left.addEventListener('click', function() {
		i = i == 0 ? stratas.length - 1 : --i;
		img.src = stratas[i].src;
	});
	img.id = "strataView";
	img.src = stratas[i].src;
	div.appendChild(img);
	right.src = "images/right.png";
	right.className = "arrows";
	div.appendChild(right);
	right.addEventListener('click', function() {
		i = i + 1 == stratas.length ? 0 : ++i;
		img.src = stratas[i].src;
	});
	btn.id = "closeCarousel";
	btn.innerHTML = "закрыть";
	div.appendChild(btn);
	btn.addEventListener('click', function() {
		playField.removeChild(div);
	});
};
"use strict";

var player = {
	gender: false,
	move: false,
	victPts: 0,
	fleet: ["Бригантина", "Фрегат", "Галеон"],
	ship: {
		object: plrShip,
		name: false,
		direction: "top",
		movePts: 0,
		evasion: 0,
		guns: {
			left: [],
			right: [],
			top: [],
			bottom: []
		},
		reloading: []
	},
	hand: [],
	init: function(collection) {
		start.style.display = "none";
		dialog.style.display = "block";
		return new Promise(function(resolve) {
			for (let i = 0; i < collection.length; i++) {
				let id = collection[i].id;
				document.getElementById(id).addEventListener('click', function() {
					player.gender = id;
					return resolve();
				});
			}
		});
	},
	renderShip: function() {
		this.ship.object.getElementsByClassName("ship")[0].src = "images/" + this.ship.name + "1.jpg";
		this.ship.object.style.display = "block";
	},
	renderStrata: function() {
		let strata = document.getElementsByClassName("strata");
		for (let i = 0; i < strata.length; i++) {
			strata[i].src = "images/" + this.hand[i].id + ".jpg";
			strata[i].style.display = "block";
		}
		showStrata.style.display = "block";
		showStrata.onclick = strataCarousel;
	},
	shipChoice: function() {
		let text = (this.fleet.length != 1) ? "<p>Выберите корабль:<p>": "<p>У вас остался последний корабль:<p>", self = this;
		dialog.innerHTML = text;
		return new Promise(function(resolve) {
			for (let i = 0; i < player.fleet.length; i++) {
				let shipAvlbl = document.createElement("button");
				shipAvlbl.innerHTML = self.fleet[i];
				shipAvlbl.addEventListener('click', function() {
					self.ship.name = (self.fleet.length != 1) ? self.fleet.splice(i, 1)[0] : self.fleet[i];
					self.renderShip();
					game.loadArms.call(self);
					return resolve();
				});
				dialog.appendChild(shipAvlbl);
			}
		});
	},
	chooseDirection: function() {
		let Left = document.createElement("button");
		Left.innerHTML = "повернуть влево";
		Left.addEventListener('click', function() {
			game.changeCourse.call(player, true);
		});
		let Right = document.createElement("button");
		Right.innerHTML = "повернуть вправо";
		Right.addEventListener('click', function() {
			game.changeCourse.call(player, false);
		});
		let ready = document.createElement("button");
		ready.innerHTML = "разместить корабль";
		dialog.innerHTML = "<p>Выберите начальное направление корабля<p>";
		dialog.appendChild(Left);
		dialog.appendChild(Right);
		dialog.appendChild(ready);
		return new Promise(function(resolve) {
			ready.addEventListener('click', function() {
				dialog.style.display = "none";
				computer.init();
				game.loadArms.call(computer);
				game.setArms.call(computer);
				return resolve();
			});
		});
	}
},
computer = {
	gender: false,
	move: false,
	victPts: 0,
	fleet: ["Бригантина", "Фрегат", "Галеон"],
	ship: {
		object: oppShip,
		name: false,
		direction: "top",
		movePts: 0,
		evasion: 0,
		guns: {
			left: [],
			right: [],
			top: [],
			bottom: []
		},
		reloading: []
	},
	hand: [],
	init: function() {
		if (!this.gender) this.gender = random(0, 1) ? "male" : "female";
		this.ship.name = this.fleet.splice(random(0, this.fleet.length - 1))[0];
		this.render();
	},
	render: function() {
		portretOpp.src = "images/" + this.gender + ".jpg";
		portretOpp.style.display = "block";
		this.ship.object.getElementsByClassName("ship")[0].src = "images/" + this.ship.name + "2.jpg";
		this.ship.object.style.display = "block";
	}
},
game = {
	round: 0,
	roundEnd: true,
	wind: "",
	distance: true,
	PlayTheGame: function() {
		console.log("GameStart");
		let self = this, playGame = function() {
			return self.roundStart.call(self).then( self.roundPlay.bind(self) ).then(function() {
				self.clean();
				return self.PlayTheGame();
			});
		};
		if (player.victPts == 2 || computer.victPts == 2) return this.GameOver();
		this.round++;
		if (this.round == 1) return this.init().then(playGame);
		else return playGame();
	},
	GameOver: function() {
		if (player.victPts == 2) dialog.innerHTML = "Победа!!!";
		else dialog.innerHTML = "Поражение...";
	},
	clean: function() {
		console.log("cleaning");
		let cleaning = function(that) {
			let gun = that.ship.object.getElementsByTagName("div");
			that.ship.object.style.display = "none";
			that.ship.direction = "top";
			that.hand = [];
			for (let side in that.ship.guns) that.ship.guns[side] = [];
			for (let i = gun.length - 1; i >= 0; i--) that.ship.object.removeChild(gun[i]);
		}
		if (!this.distance) this.move();
		compas.style.display = "none";
		cleaning(player);
		cleaning(computer);
	},
	init: function() {
		let self = this;
		let gender = new Promise(function(resolve) {
			play.addEventListener('click', function() {
				player.init( document.getElementsByClassName("gender") ).then(function() {return resolve();});
			});
		});
		return new Promise(function(resolve) {
			gender.then( self.firstMove.bind(self) ).then(function() {return resolve();});
		});
	},
	firstMove: function() {
		dialog.innerHTML = "<p>Бросим кости и узнаем, кто ходит первый!<p>";
		for (let i = 0; i < 2; i++) {
			let dice = document.createElement("img");
			dice.className = "dices";
			dice.src = "images/dice.gif";
			dice.style.display = "block";
			dialog.appendChild(dice);
		}
		return new Promise(function(resolve) {
			let roll = document.createElement('button');
			roll.innerHTML = "Бросить!";
			roll.addEventListener('click', function() {
				if ( game.checkFirstMove.call(roll) ) return resolve();
			});
			dialog.appendChild(roll);
		});
	},
	checkFirstMove: function() {
		if (!player.move && !computer.move) {
			let numbers = game.rollDice( document.getElementsByClassName("dices") );
			if (numbers[0] != numbers[1]) {
				if (numbers[0] > numbers[1]) {
					dialog.firstChild.innerHTML = "Гром и молния! Мой ход!";
					computer.move = true;
				}
				else {
					dialog.firstChild.innerHTML = "Тысяча тухлых моллюсков!!! Твой ход!";
					player.move = true;
				}
				this.innerHTML = "Далее";
				return false;
			} else return false;
		} else return true;
	},
	rollDice: function(dices) {
		let value = [];
		for (let i = 0; i < dices.length; i++) {
			let rand = random(1, 6);
			value.push(rand);
			dices[i].src = "images/" + rand + ".png";
		}
		return value;
	},
	roundStart: function() {
		console.log("start");
		let self = this;
		this.roundEnd = false;
		this.takeStrata();
		player.renderStrata();
		return new Promise(function(resolve) {
			player.shipChoice().then(function() {
				self.setArms.call(player);
				player.chooseDirection().then(function() {
					return resolve();
				});
			});
		});
	},
	roundPlay: function() {
		let self = this, that = player.move ? player : computer;
		this.wind = this.changeWind();
		that.ship.reloading = [];
		switch(that.ship.name) {
			case "Бригантина": that.ship.movePts++;
			case "Фрегат": that.ship.movePts++;
			default: that.ship.movePts++;
		}
		if (that == computer) {
			alert("Ход искуственного интеллекта, который в данный момент без мозгов");
			that.ship.movePts = 0;
			this.changeMove();
			return self.roundPlay();
		} else return this.makeAction.call(that).then(function() {
			if (self.roundEnd) return new Promise(function(resolve) {
				console.log("checkpoint");
				return resolve();
			});
			else {
				self.changeMove();
				return self.roundPlay();
			}
		});
	},
	takeStrata: function() {
		let deck = [], playerTurn = player.move ? true : false;
		for (let i = stratagems.length - 1; i >= 0; i--) deck.push(stratagems[i]);
		deck.sort(compareRandom);
		// @todo: победивший в прошлом раунде берет 7 карт стратагем
		while(player.hand.length < 6 || computer.hand.length < 6) {
			if (playerTurn) {
				playerTurn = false;
				player.hand.push(deck.shift());
			} else {
				playerTurn = true;
				computer.hand.push(deck.shift());
			}
		}
	},
	makeAction: function() {
		let self = game, that = this, cost = self.renderControl(this.ship.movePts),
		moveOver = function() {
			if (!that.ship.movePts || self.roundEnd) {
				return new Promise(function(resolve) {
					return resolve();
				});
			} else return self.makeAction.call(that);
		},
		action = new Promise(function(resolve) {
			self.makeMove.apply(that, cost).then(function() {
				return resolve();
			});
			self.closeCombat().then(function() {
				--that.ship.movePts;
				return resolve();
			});
			self.salvo.call(that).then(function() {
				--that.ship.movePts;
				that.ship.reloading.push(that.ship.direction);
				return resolve();
			});
		});
		return action.then(function() {
			return moveOver();
		});
	},
	makeMove: function(fCost, rCost, bCost, lCost) {
		let self = game, that = this;
		return new Promise(function(resolve) {
			move.onclick = function() {
				that.ship.movePts -= fCost;
				self.deactivation();
				self.move();
				return resolve();
			};
			turnRight.onclick = function() {
				that.ship.movePts -= rCost;
				self.deactivation();
				self.changeCourse.call(that, false);
				return resolve();
			};
			turnAround.onclick = function() {
				that.ship.movePts -= bCost;
				self.deactivation();
				self.changeCourse.call(that, true);
				self.changeCourse.call(that, true);
				return resolve();
			};
			turnLeft.onclick = function() {
				that.ship.movePts -= lCost;
				self.deactivation();
				self.changeCourse.call(that, true);
				return resolve();
			};
		});
	},
	closeCombat: function() {
		let plrPower = this.getTotalCrew.call(player.ship.guns),
			oppPower = this.getTotalCrew.call(computer.ship.guns),
			self = this;
		return new Promise(function(resolve) {
			grapple.onclick = function() {
				self.roundEnd = true;
				self.deactivation();
				self.renderGrapple().then(function(result) {
					let dices = self.rollDice(result);
					for (let i = 0; i < dices.length; i++) {
						if (i < 2) oppPower += dices[i];
						else plrPower += dices[i];
					}
					// @todo атакующий получает преимущество attackPwr >= defendPwr
					plrPower >= oppPower ? player.victPts++ : computer.victPts++;
					return resolve();
				});
			};
		});
	},
	salvo: function() {
		let self = game, that = this;
		return new Promise(function(resolve) {
			fire.onclick = function() {
				self.deactivation();
				self.renderFire.call(that).then(function(result) {
					result.onclick = function() {
						dialog.style.display = "none";
						return resolve();
					};
				});
			};
		});
	},
	fireResult: function(salvo) {
		let result = document.createElement("p"), kills = 0, wounds = 0, index = 0,
		target = this == player ? computer : player, board = target.ship.direction,
		targetSide = function() {
			while ( !sumArray(target.ship.guns[board]) ) {
				target.ship.guns[board] = [];
				switch(board) {
					case "top":
						board = "right";
						break;
					case "right":
						board = "bottom";
						break;
					case "bottom":
						board = "left";
						break;
					case "left":
						board = "top";
						break;
				}
				index = 0;
			}
			return target.ship.guns[board][index];
		};
		salvo.sort(sortArray);
		// @todo реализовать критический удар и уклонение
		for (let i = 0; i < salvo.length; i++) {
			if (salvo[i] > targetSide()) {
				kills++;
				wounds += target.ship.guns[board][index];
				target.ship.guns[board][index] = 0;
				index++;
			} else if (salvo[i] == targetSide()) {
				if (targetSide() != 1) {
					wounds++;
					target.ship.guns[board][index]--;
				} else {
					kills++;
					target.ship.guns[board][index] = 0;
					index++;
				}
			}
		}
		// добавить проверку на оставшееся количество пушек, если 1, то раунд окончен
		// сортируем массив цели, рендерим. нужно ли вынести в отдельную функцию?
		target.ship.guns[board] = target.ship.guns[board].filter(function(crew) {
			return crew > 0;
		});
		target.ship.guns[board].sort(sortArray);
		game.setArms.call(target);
		result.innerHTML = "Пушек уничтожено: " + kills + "<br>Членов экипажа ранено: " + wounds;
		return result;
	},
	getTotalCrew: function() {
		let c = 0;
		for (let board in this) {
			for (let i = 0; i < this[board].length; i++) {
				c += this[board][i];
			}
		}
		return c;
	},
	move: function() {
		this.distance = this.distance ? false : true;
		// @todo проверить, можно ли рендерить движение кораблей в рендерконтрол
		player.ship.object.style.top = this.distance ? "300px" : "250px";
		computer.ship.object.style.top = this.distance ? "0px" : "50px";
		grapple.disabled = this.distance ? "disabled" : "";
	},
	changeMove: function() {
		player.move = player.move ? false : true;
		computer.move = computer.move ? false : true;
	},
	changeCourse: function(side) {
		// true при повороте налево
		let deg = 0;
		switch(this.ship.direction) {
			case "right":
				deg = 90;
				this.ship.direction = side ? "top" : "bottom";
				break;
			case "bottom":
				deg = 180;
				this.ship.direction = side ? "right" : "left";
				break;
			case "left":
				deg = -90;
				this.ship.direction = side ? "bottom" : "top";
				break;
			case "top":
				this.ship.direction = side ? "left" : "right";
				break;
		}
		deg += side ? -90 : 90;
		this.ship.object.style.transform = 'rotate(' + deg + 'deg)';
		game.setArms.call(this);
	},
	changeWind: function() {
		let wind, dice = document.getElementById("windDice");
		if (dice == null) {
			dice = document.createElement("img")
			dice.className = "dices";
			dice.id = "windDice";
			compas.appendChild(dice);
		}
		if (compas.style.display != "block") compas.style.display = "block";
		switch(this.rollDice([dice])[0]) {
			case 1:
			case 2:
				wind = "north";
				break;
			case 3:
			case 4:
				wind = "south";
				break;
			case 5:
				wind = "west";
				break;
			case 6:
				wind = "east";
		}
		return wind;
	},
	loadArms: function() {
		for (let side in this.ship.guns) {
			let notBoard = (side != "top" && side != "bottom") ? false : true;
			for (let i = 0; i < 5; i++) { // максимум 5 орудий по борту
				let crew = notBoard ? 4 : 3;
				switch(this.ship.name) {
					case "Бригантина": crew++;
					case "Фрегат": crew++;
					case "Галеон": this.ship.guns[side].push(crew);
				}
				game.createDiv.call(this.ship.object, side);
				if (this.ship.name == "Бригантина" && notBoard) break;
				else if (i == 1 && this.ship.name == "Фрегат" && notBoard) break;
				else if ( i == 2 && ( this.ship.name == "Бригантина" || (this.ship.name == "Галеон" && notBoard) ) ) break;
				else if (i == 3 && this.ship.name == "Фрегат") break;
			}
		}
		switch(this.ship.name) {
			case "Бригантина": ++this.ship.evasion;
			case "Фрегат": ++this.ship.evasion;
			case "Галеон":
				++this.ship.evasion;
				game.createDiv.call(this.ship.object, "eva");
		}
	},
	createDiv: function(name) {
		let div = document.createElement("div");
		div.className = name;
		this.appendChild(div);
	},
	setArms: function() {
		let self = game, eva = this.ship.object.getElementsByClassName("eva")[0];
		for (let side in this.ship.guns) {
			let guns = this.ship.object.getElementsByClassName(side);
			for (let i = 0; i < guns.length; i++) {
				guns[i].innerHTML = this.ship.guns[side][i] === undefined ? "X" : this.ship.guns[side][i];
				self.renderArmament.call( this, guns[i], self.getArmCoordinates.call(this, side, i) );
			}
		}
		eva.innerHTML = this.ship.evasion;
		self.renderArmament.call( this, eva, self.getArmCoordinates.call(this, "evasion") );
	},
	getArmCoordinates: function(side, id) {
		let x = 0, y = 0, arr = [];
		if (side == "evasion") {
			if (this.ship.name == "Галеон") return [68, 94];
			else return [23, 41];
		} else switch(this.ship.name) {
			case "Бригантина":
				switch(side) {
					case "top":
						x = 80;
						y = 25;
						break;
					case "right":
						x = 123;
						y = 82 + id * 25;
						break;
					case "bottom":
						x = 48;
						y = 175;
						break;
					case "left":
						x = 12;
						y = 84 + id * 25;
						break;
				}
				break;
			case "Фрегат":
				switch(side) {
					case "top":
						x = 80 + id * 25;
						y = 15;
						break;
					case "right":
						x = 123;
						y = 69 + id * 25;
						break;
					case "bottom":
						x = 35 + id * 63;
						y = 177;
						break;
					case "left":
						x = 12;
						y = 70 + id * 25;
						break;
				}
				break;
			case "Галеон":
				switch(side) {
					case "top":
						if (id != 2) {
							x = 92 + id * 22;
							y = 7;
						} else {
							x = 103;
							y = 30;
						}
						break;
					case "right":
						x = 124;
						y = 55 + id * 25;
						break;
					case "bottom":
						x = 46 + id * 23;
						y = 176;
						break;
					case "left":
						x = 13;
						y = 56 + id * 25;
						break;
				}
				break;
		}
		arr.push(x);
		arr.push(y);
		return arr;
	},
	renderArmament: function(obj, arr) {
		if (this == player) {
			obj.style.left = arr[0] + "px";
			obj.style.top = arr[1] + "px";
		} else {
			obj.style.right = arr[0] + "px";
			obj.style.bottom = arr[1] + "px";
		}
		switch(this.ship.direction) {
			case "top":
				obj.style.transform = "rotate(0deg)";
				break;
			case "right":
				obj.style.transform = "rotate(-90deg)";
				break;
			case "bottom":
				obj.style.transform = "rotate(180deg)";
				break;
			case "left":
				obj.style.transform = "rotate(90deg)";
		}
	},
	renderGrapple: function() {
		dialog.innerHTML = "Бросим кости на абордаж!";
		for (let i = 0; i < 2; i++) {
			let div = document.createElement("div"), span = document.createElement("span");
			div.innerHTML = "Боеспособный экипаж корабля: ";
			div.innerHTML += !i ? this.getTotalCrew.call(computer.ship.guns) : this.getTotalCrew.call(player.ship.guns);
			dialog.appendChild(div);
			for (let j = 0; j < 2; j++) {
				let dice = document.createElement("img");
				dice.className = "dices grappleDices";
				dice.src = "images/dice.gif";
				div.appendChild(dice);
			}
		}
		dialog.style.display = "block";
		return new Promise(function(resolve) {
			let btn = document.createElement("button");
			btn.innerHTML = "Бросить!";
			dialog.appendChild(btn);
			btn.addEventListener('click', function() {
				dialog.removeChild(btn);
				return resolve(document.getElementsByClassName("grappleDices"));
			});
		});
	},
	renderFire: function() {
		let btn = document.createElement("button"), msg = document.createElement("p"),
		self = game, that = this;
		dialog.innerHTML = "";
		dialog.style.display = "block";
		dialog.appendChild(msg);
		msg.innerHTML = "Товсь!";
		btn.innerHTML = "Пли!";
		btn.style.display = "block";
		for (let i = 0; i < this.ship.guns[this.ship.direction].length; i++) {
			let dice = document.createElement("img");
			dice.className = "dices fireDices";
			dice.src = "images/dice.gif";
			dialog.appendChild(dice);
		}
		return new Promise(function(resolve) {
			dialog.appendChild(btn);
			btn.onclick = function() {
				let dices = document.getElementsByClassName("fireDices"), result = self.rollDice(dices);
				msg.innerHTML = "Результаты залпа:";
				dialog.appendChild( self.fireResult.call(that, result) );
				btn.innerHTML = "далее";
				dialog.appendChild(btn);
				return resolve(btn);
			};
		});
	},
	renderControl: function(MP) {
		let moveCostF = 1, moveCostL = 1, moveCostR = 1, moveCostB = 2,
			that = player.ship;
		//влияние ветра на стоимость движения
		switch(that.direction) {
			case "top":
				switch(this.wind) {
					case "north":
						moveCostF = 0;
						break;
					case "east":
						moveCostR = 0;
						break;
					case "south":
						moveCostF = 2;
						moveCostB = 1;
						break;
					case "west":
						moveCostL = 0;
				}
				if (this.distance && MP >= moveCostF) move.disabled = "";
				break;
			case "right":
				switch(this.wind) {
					case "north":
						moveCostL = 0;
						break;
					case "south":
						moveCostR = 0;
						break;
					case "west":
						moveCostB = 1;
				}
				break;
			case "bottom":
				switch(this.wind) {
					case "north":
						moveCostF = 2;
						moveCostB = 1;
						break;
					case "east":
						moveCostL = 0;
						break;
					case "south":
						moveCostF = 0;
						break;
					case "west":
						moveCostR = 0;
				}
				if (!this.distance && MP >= moveCostF) move.disabled = "";
				break;
			case "left":
				switch(this.wind) {
					case "north":
						moveCostR = 0;
						break;
					case "east":
						moveCostB = 1;
						break;
					case "south":
						moveCostL = 0;
				}
		}
		if (MP >= moveCostL) turnLeft.disabled = "";
		if (MP >= moveCostR) turnRight.disabled = "";
		if (MP >= moveCostB) turnAround.disabled = "";
		if (MP) fire.disabled = that.reloading.indexOf(that.direction) == -1 ? "" : "disabled";
		move.innerHTML = "Полный вперёд! (" + moveCostF + " од)";
		turnLeft.innerHTML = "Лево руля! (" + moveCostL + " од)";
		turnRight.innerHTML = "Право руля! (" + moveCostR + " од)";
		turnAround.innerHTML = "Разворот! (" + moveCostB + " од)";
		controlPanel.style.display = "grid";
		infoPanel.innerHTML = "ОД: " + MP;
		return [moveCostF, moveCostR, moveCostB, moveCostL];
	},
	deactivation: function() {
		// @todo: перенести все стили в CSS и манипулировать классами, а не стилями
		controlPanel.style.display = "none";
		move.disabled = "disabled";
		turnLeft.disabled = "disabled";
		turnRight.disabled = "disabled";
		turnAround.disabled = "disabled";
		fire.disabled = "disabled";
	}
};

window.addEventListener('load', game.PlayTheGame());

function random(min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min);
};
function compareRandom(a, b) {
	return Math.random() - 0.5;
};
function sum(a, b) {
	return a + b;
};
let sortArray = function(a, b) {
	return b - a;
};
function sumArray(arr) {
	let result = 0;
	for (let i = 0; i < arr.length; i++) result += arr[i];
	return result;
};
var stratagems = [{
	id: 1,
},
{
	id: 2,
},
{
	id: 3,
},
{
	id: 4,
},
{
	id: 5,
},
{
	id: 6,
},
{
	id: 7,
},
{
	id: 8,
},
{
	id: 9,
},
{
	id: 10,
},
{
	id: 11,
},
{
	id: 12,
},
{
	id: 13,
},
{
	id: 14,
},
{
	id: 15,
},
{
	id: 16,
},
{
	id: 17,
},
{
	id: 18,
},
{
	id: 19,
},
{
	id: 20,
},
{
	id: 21,
},
{
	id: 22,
},
{
	id: 23,
},
{
	id: 24,
},
{
	id: 25,
},
{
	id: 26,
},
{
	id: 27,
},
{
	id: 28,
},
{
	id: 29,
},
{
	id: 30,
}];
},{}]},{},[1])