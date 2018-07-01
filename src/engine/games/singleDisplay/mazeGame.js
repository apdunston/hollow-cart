"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 */

var Game = require('../game.js');
var MazeData = require('../../mazeData.js');
var Gamespace = require('../../gamespace.js');
var GridTranslator = require('../../gridTranslator.js');
var Maze = require('../../gameObjects/maze.js');
var Player = require('../../gameObjects/player.js');
var Circle = require('../../drawableObjects/circle.js');
var Firework = require('../../effects/firework.js');
var Sparkle = require('../../effects/sparkle.js');

module.exports = function () {
  var SingleDisplayMazeGame = function SingleDisplayMazeGame(keyboardDriver, display, gridLength, 
      squareLength) {
    var self = this;
    Game.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.display = display;
    this.displays = [display];
    this.gameLoopsPerSecond = 8;
    this.keyboardDriver = keyboardDriver;
    this.networkDriver = null;
    this.gridTranslator = new GridTranslator(0, 0, this.squareLength * 3.5);
  };

  SingleDisplayMazeGame.prototype = Object.create(Game.prototype);

  SingleDisplayMazeGame.prototype.setGridLength = function(gridLength) {
    this.gridLength = gridLength;    
    return this;
  }

  SingleDisplayMazeGame.prototype.setSquareLength = function(squareLength) {
    this.squareLength = squareLength;    
    return this;
  }

  SingleDisplayMazeGame.prototype.setNetworkDriver = function(networkDriver) {
    this.networkDriver = networkDriver;    
    return this;
  }

  SingleDisplayMazeGame.prototype.getMaze = function() {
    return this.maze;
  }

  SingleDisplayMazeGame.prototype.start = function () {
    var self = this;
    Game.prototype.start.call(self);
    this.reset();
  };

  SingleDisplayMazeGame.prototype.drawLoop = function () {
    this.display.render();
  };

  SingleDisplayMazeGame.prototype.clearDisplays = function () {
    this.display.clear();
    this.display.addObject(this.maze);
    this.display.addObject(this.player);
    this.display.addObject(this.goalObject);
    this.drawLoop();
  };

  SingleDisplayMazeGame.prototype.reset = function () {
    this.won = false;
    this.map = MazeData.generate(this.gridLength, this.gridLength);
    this.drawMap = MazeData.translate(this.map);
    this.maze = new Maze(this.drawMap, this.squareLength);
    this.player = new Player(this.gridLength, this.squareLength, this);
    var goalSquareLocation = this.gridLength * this.squareLength - this.squareLength / 2;
    this.goalObject = new Circle(goalSquareLocation, goalSquareLocation, this.squareLength / 4, "green");
    this.clearDisplays();
  };

  SingleDisplayMazeGame.prototype.validMove = function (x, y, direction) {
    if (x === 0 && y === 0 && direction === Gamespace.UP) {
      return false;
    }

    if (x === this.gridLength - 1 && y === this.gridLength - 1 && direction === Gamespace.RIGHT) {
      return false;
    }

    return this.maze.validMove(x, y, direction);
  };

  SingleDisplayMazeGame.prototype.getPlayer = function () {
    return this.player;
  };

  SingleDisplayMazeGame.prototype.getMoveForEvent = function(evt) {
    var self = this;
    switch (evt.keyCode) {
      case Gamespace.LEFT_CODE:
        return function() {return self.player.left()};
      case Gamespace.UP_CODE:
        return function() {return self.player.up()};
      case Gamespace.RIGHT_CODE:
        return function() {return self.player.right()};
      case Gamespace.DOWN_CODE:
        return function() {return self.player.down()};
    }

    return function() {};
  }

  var continueMovement = function(self, move, success) {
    var validMoves = self.validMoves(self.player.getX(), self.player.getY());

    if (success && validMoves.length === 2) {
      if (self.timeout != null) {
        clearTimeout(self.timeout)
      }

      self.timeout = setTimeout(function() {self.performMove(move);}, 20);
    } else {
      return success;
    }
  };

  SingleDisplayMazeGame.prototype.performMove = function(move) {
    var self = this;
    var success = move();
    self.drawLoop();
    if (self.winCondition()) {
      self.win();
    }

    continueMovement(self, move, success);
  };

  SingleDisplayMazeGame.prototype.keyDown = function (evt) {
    var move = this.getMoveForEvent(evt);
    var success = this.performMove(move);
  };

  SingleDisplayMazeGame.prototype.winCondition = function () {
    return this.player.x === this.gridLength - 1 && this.player.y === this.gridLength - 1;
  };

  SingleDisplayMazeGame.prototype.win = function () {
    var self = this;
    this.won = true;
    this.display.flash("blue", 500, function () {
      self.gameEnd({ won: true });
    });    
  };

  SingleDisplayMazeGame.prototype.successfulMoveEvent = function () {
    var self = this;
    if (this.display === null) {
      return;
    }
    var position = this.translatedPlayerPosition();
    // this.display.addObject(new Sparkle(position[0], position[1], this.squareLength/4, 50));
    // this.display.addObject(new Firework(self.display.getLength(), self.player.x, self.player.y));
  };

  SingleDisplayMazeGame.prototype.translatedPlayerPosition = function() {
    return [
      this.gridTranslator.xInPixels(this.player.getX()),
      this.gridTranslator.yInPixels(this.player.getY())
    ]
  };

  SingleDisplayMazeGame.prototype.validMoves = function (x, y) {
    var moves = [Gamespace.UP, Gamespace.DOWN, Gamespace.LEFT, Gamespace.RIGHT];
    var validMoves = [];

    for (var i = 0; i < moves.length; i++) {
      if (this.validMove(x, y, moves[i])) {
        validMoves.push(moves[i]);
      }
    }

    return validMoves;
  };

  return SingleDisplayMazeGame;
}();