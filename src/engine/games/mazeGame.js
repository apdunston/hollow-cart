"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 */

var Game = require('./game.js');
var MazeData = require('../mazeData.js');
var Gamespace = require('../gamespace.js');
var Maze = require('../gameObjects/maze.js');
var Player = require('../gameObjects/player.js');
var Circle = require('../drawableObjects/circle.js');
var Firework = require('../effects/firework.js');

module.exports = function() {
  var MazeGame = function MazeGame(keyboardDriver, mazeDisplay, neuralDisplay, gridLength, 
      squareLength) {
    var self = this;
    Game.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.mazeDisplay = mazeDisplay;
    this.neuralDisplay = neuralDisplay;
    this.gameLoopsPerSecond = 8;
    this.displays = [mazeDisplay, neuralDisplay];
    this.keyboardDriver = keyboardDriver;
    this.networkDriver = null;
  };

  MazeGame.prototype = Object.create(Game.prototype);

  MazeGame.prototype.setGridLength = function(gridLength) {
    this.gridLength = gridLength;    
    return this;
  }

  MazeGame.prototype.setSquareLength = function(squareLength) {
    this.squareLength = squareLength;    
    return this;
  }

  MazeGame.prototype.setNetworkDriver = function(networkDriver) {
    this.networkDriver = networkDriver;    
    return this;
  }

  MazeGame.prototype.getMaze = function() {
    return this.maze;
  }

  MazeGame.prototype.start = function() {
    var self = this;
    Game.prototype.start.call(self);
    this.reset();
  };

  MazeGame.prototype.drawLoop = function() {
    this.mazeDisplay.render();
  };

  MazeGame.prototype.clearDisplays = function() {
    this.mazeDisplay.clear();
    this.mazeDisplay.addObject(this.maze);
    this.mazeDisplay.addObject(this.player);
    this.mazeDisplay.addObject(this.goalObject);
    this.drawLoop();
  };

  MazeGame.prototype.reset = function() {
    this.won = false;
    this.map = MazeData.generate(this.gridLength, this.gridLength);
    this.drawMap = MazeData.translate(this.map);
    this.maze = new Maze(this.drawMap, this.squareLength);
    this.player = new Player(this.gridLength, this.squareLength, this);
    var goalSquareLocation = this.gridLength * this.squareLength - this.squareLength / 2;
    this.goalObject = new Circle(goalSquareLocation, goalSquareLocation, this.squareLength / 4, "green");
    this.clearDisplays();
  };

  MazeGame.prototype.validMove = function (x, y, direction) {
    if (x === 0 && y === 0 && direction === Gamespace.UP) {
      return false;
    }

    if (x === this.gridLength - 1 && y === this.gridLength - 1 && direction === Gamespace.RIGHT) {
      return false;
    }

    return this.maze.validMove(x, y, direction);
  };

  MazeGame.prototype.getPlayer = function() {
    return this.player;
  };

  MazeGame.prototype.getMoveForEvent = function(evt) {
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

  MazeGame.prototype.performMove = function(move) {
    var self = this;
    var success = move();
    self.drawLoop();
    if (self.winCondition()) {
      self.win();
    }

    continueMovement(self, move, success);
  };

  MazeGame.prototype.keyDown = function (evt) {
    var move = this.getMoveForEvent(evt);
    var success = this.performMove(move);
  };

  MazeGame.prototype.winCondition = function() {
    return this.player.x === this.gridLength - 1 && this.player.y === this.gridLength - 1;
  };

  MazeGame.prototype.win = function() {
    var self = this;
    this.won = true;
    this.mazeDisplay.flash("blue", 500, function() {
      self.gameEnd({ won: true });
    });    
  };

  MazeGame.prototype.successfulMoveEvent = function() {
    if (this.neuralDisplay === null) {
      return;
    }
    this.neuralDisplay.addObject(new Firework(this.neuralDisplay.getLength()));
  };

  MazeGame.prototype.validMoves = function (x, y) {
    var moves = [Gamespace.UP, Gamespace.DOWN, Gamespace.LEFT, Gamespace.RIGHT];
    var validMoves = [];

    for (var i = 0; i < moves.length; i++) {
      if (this.validMove(x, y, moves[i])) {
        validMoves.push(moves[i]);
      }
    }

    return validMoves;
  };

  return MazeGame;
}();