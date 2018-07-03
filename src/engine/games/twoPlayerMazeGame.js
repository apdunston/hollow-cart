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

module.exports = function() {
  var TwoPlayerMazeGame = function TwoPlayerMazeGame(keyboardDriver, mazeDisplay, neuralDisplay, 
      gridLength, squareLength) {
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

  TwoPlayerMazeGame.prototype = Object.create(MazeGame.prototype);

  TwoPlayerMazeGame.prototype.start = function (maze) {
    var self = this;
    Game.prototype.start.call(self);
    this.reset(maze);
  };

  TwoPlayerMazeGame.prototype.drawLoop = function() {
    this.mazeDisplay.render();
  };

  TwoPlayerMazeGame.prototype.clearDisplays = function() {
    this.mazeDisplay.clear();
    this.mazeDisplay.addObject(this.maze);
    this.mazeDisplay.addObject(this.player);
    this.mazeDisplay.addObject(this.player2);
    this.mazeDisplay.addObject(this.goalObject);
    this.drawLoop();
  };

  TwoPlayerMazeGame.prototype.reset = function (maze) {
    this.won = false;

    if (maze == null) {
      var map = MazeData.generate(this.gridLength, this.gridLength);
      var drawMap = MazeData.translate(map);
      this.maze = new Maze(drawMap, this.squareLength);
    } else {
      this.maze = new Maze(maze.drawMap, this.squareLength);
    }
    
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

  TwoPlayerMazeGame.prototype.getPlayer = function() {
    return this.player;
  };

  TwoPlayerMazeGame.prototype.getMaze = function() {
    return this.maze;
  }

  TwoPlayerMazeGame.prototype.getMoveForEvent = function(evt) {
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
      case Gamespace.A_CODE:
        return function() {return self.player2.left()};
      case Gamespace.W_CODE:
        return function() {return self.player2.up()};
      case Gamespace.D_CODE:
        return function() {return self.player2.right()};
      case Gamespace.S_CODE:
        return function() {return self.player2.down()};
    }

    return function() {};
  }

  TwoPlayerMazeGame.prototype.winCondition = function() {
    return this.player.x === this.gridLength - 1 && this.player.y === this.gridLength - 1 || this.player2.x === this.gridLength - 1 && this.player2.y === this.gridLength - 1;
  };

  TwoPlayerMazeGame.prototype.win = function() {
    var self = this;
    this.won = true;
    this.mazeDisplay.flash("blue", 500, function() {
      self.gameEnd({ won: true });
    });
  };

  TwoPlayerMazeGame.prototype.successfulMoveEvent = function() {
    if (this.neuralDisplay === null) {
      return;
    }
    this.neuralDisplay.addObject(new Firework(this.neuralDisplay.getLength()));
  };

  return TwoPlayerMazeGame;
}();