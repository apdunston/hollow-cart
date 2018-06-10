"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 */
var Game = require('./game.js');
var MazeData = require('../mazeData.js');
var Maze = require('../gameObjects/maze.js');
var MazeGame = require('../games/mazeGame.js');
var Player = require('../gameObjects/player.js');
var Circle = require('../drawableObjects/circle.js');
var Gamespace = require('../gamespace.js');
var Firework = require('../effects/firework.js');

module.exports = function () {
  var TwoPlayerMazeGame = function TwoPlayerMazeGame(keyboardDriver, mazeDisplay, neuralDisplay, gridLength, squareLength) {
    var self = this;
    Game.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.mazeDisplay = mazeDisplay;
    this.neuralDisplay = neuralDisplay;
    this.gameLoopsPerSecond = 8;
    this.displays = [mazeDisplay, neuralDisplay];
    this.keyboardDriver = keyboardDriver;
  };

  TwoPlayerMazeGame.prototype = Object.create(Game.prototype);

  TwoPlayerMazeGame.prototype.start = function () {
    var self = this;
    Game.prototype.start.call(self);
    this.reset();
  };

  TwoPlayerMazeGame.prototype.drawLoop = function () {
    this.mazeDisplay.render();
  };

  TwoPlayerMazeGame.prototype.clearDisplays = function () {
    this.mazeDisplay.clear();
    this.mazeDisplay.addObject(this.maze);
    this.mazeDisplay.addObject(this.player);
    this.mazeDisplay.addObject(this.player2);
    this.mazeDisplay.addObject(this.goalObject);
    this.drawLoop();
  };

  TwoPlayerMazeGame.prototype.reset = function () {
    this.won = false;
    this.map = MazeData.generate(this.gridLength, this.gridLength);
    this.drawMap = MazeData.translate(this.map);
    this.maze = new Maze(this.drawMap, this.squareLength);
    this.player = new Player(this.gridLength, this.squareLength, this);
    this.player2 = new Player(this.gridLength, this.squareLength, this);
    this.player2.setColor("#555555");
    var goalSquareLocation = this.gridLength * this.squareLength - this.squareLength / 2;
    this.goalObject = new Circle(goalSquareLocation, goalSquareLocation, this.squareLength / 4, "green");
    this.clearDisplays();
  };

  TwoPlayerMazeGame.prototype.validMove = function (x, y, direction) {
    if (x === 0 && y === 0 && direction === Gamespace.UP) {
      return false;
    }

    if (x === this.gridLength - 1 && y === this.gridLength - 1 && direction === Gamespace.RIGHT) {
      return false;
    }

    return this.maze.validMove(x, y, direction);
  };

  TwoPlayerMazeGame.prototype.getPlayer = function () {
    return this.player;
  };

  TwoPlayerMazeGame.prototype.keyDown = function (evt) {
    switch (evt.keyCode) {
      case Gamespace.LEFT_CODE:
        this.player.left();
        break;
      case Gamespace.UP_CODE:
        this.player.up();
        break;
      case Gamespace.RIGHT_CODE:
        this.player.right();
        break;
      case Gamespace.DOWN_CODE:
        this.player.down();
        break;
      case Gamespace.A_CODE:
        this.player2.left();
        break;
      case Gamespace.W_CODE:
        this.player2.up();
        break;
      case Gamespace.D_CODE:
        this.player2.right();
        break;
      case Gamespace.S_CODE:
        this.player2.down();
        break;
    }

    this.drawLoop();

    if (this.winCondition()) {
      this.win();
    }
  };

  TwoPlayerMazeGame.prototype.winCondition = function () {
    return this.player.x === this.gridLength - 1 && this.player.y === this.gridLength - 1 || this.player2.x === this.gridLength - 1 && this.player2.y === this.gridLength - 1;
  };

  TwoPlayerMazeGame.prototype.win = function () {
    var self = this;
    this.won = true;
    this.mazeDisplay.flash("blue", 500, function () {
      self.gameEnd({ won: true });
    });
  };

  TwoPlayerMazeGame.prototype.successfulMoveEvent = function () {
    if (this.neuralDisplay === null) {
      return;
    }
    this.neuralDisplay.addObject(new Firework(this.neuralDisplay.getLength()));
  };

  TwoPlayerMazeGame.prototype.validMoves = function (x, y) {
    moves = [Gamespace.UP, Gamespace.DOWN, Gamespace.LEFT, Gamespace.RIGHT];
    validMoves = [];

    for (var i = 0; i < moves.length; i++) {
      if (this.validMove(x, y, moves[i])) {
        validMoves.push(moves[i]);
      }
    }

    return validMoves;
  };

  return TwoPlayerMazeGame;
}();