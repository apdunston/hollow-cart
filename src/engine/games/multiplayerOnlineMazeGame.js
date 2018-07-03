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
  var MultiplayerOnlineMazeGame = function MultiplayerOnlineMazeGame(keyboardDriver, mazeDisplay, 
      neuralDisplay, gridLength, squareLength, networkDriver, playerNumber) {
    var self = this;
    Game.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.mazeDisplay = mazeDisplay;
    this.neuralDisplay = neuralDisplay;
    this.gameLoopsPerSecond = 8;
    this.displays = [mazeDisplay, neuralDisplay];
    this.keyboardDriver = keyboardDriver;
    this.networkDriver = networkDriver;
    networkDriver.setGame(this);
    this.playerNumber = playerNumber;

    if (playerNumber == null) {
      throw("Player number cannot be null");
    }
  };

  MultiplayerOnlineMazeGame.prototype = Object.create(MazeGame.prototype);

  MultiplayerOnlineMazeGame.prototype.start = function (maze) {
    Game.prototype.start.call(this);
    this.reset(maze);
    this.networkDriver.sendMaze(this.maze);
  };

  MultiplayerOnlineMazeGame.prototype.setMaze = function(maze) {
    this.stop();
    Game.prototype.start.call(this);
    this.reset(maze);
  };

  MultiplayerOnlineMazeGame.prototype.drawLoop = function() {
    this.mazeDisplay.render();
  };

  MultiplayerOnlineMazeGame.prototype.clearDisplays = function() {
    this.mazeDisplay.clear();
    this.mazeDisplay.addObject(this.maze);
    for (var x = 0; x < this.players.length; x++) {
      this.mazeDisplay.addObject(this.players[x]);
    }
    this.mazeDisplay.addObject(this.goalObject);
    this.drawLoop();
  };

  MultiplayerOnlineMazeGame.prototype.addPlayer = function (x, y) {
    var player = new Player(this.gridLength, this.squareLength, this);
    player.setPosition(x || 0, y || 0);
    
    if (this.players.length == 0) {
      this.player = player;
    } else {
      player.setColor("#555555");
    }

    this.players.push(player);
  }

  MultiplayerOnlineMazeGame.prototype.reset = function (maze) {
    this.players = [];
    this.won = false;

    if (maze == null) {
      var map = MazeData.generate(this.gridLength, this.gridLength);
      var drawMap = MazeData.translate(map);
      this.maze = new Maze(drawMap, this.squareLength);
    } else {
      this.maze = new Maze(maze.drawMap, this.squareLength);
    }
    
    this.addPlayer();
    var goalSquareLocation = this.gridLength * this.squareLength - this.squareLength / 2;
    this.goalObject = new Circle(goalSquareLocation, goalSquareLocation, this.squareLength / 4, "green");
    this.clearDisplays();
  };

  MultiplayerOnlineMazeGame.prototype.validMove = function (x, y, direction) {
    if (x === 0 && y === 0 && direction === Gamespace.UP) {
      return false;
    }

    if (x === this.gridLength - 1 && y === this.gridLength - 1 && direction === Gamespace.RIGHT) {
      return false;
    }

    return this.maze.validMove(x, y, direction);
  };

  MultiplayerOnlineMazeGame.prototype.getPlayer = function() {
    return this.player;
  };

  MultiplayerOnlineMazeGame.prototype.getMaze = function() {
    return this.maze;
  }

  MultiplayerOnlineMazeGame.prototype.winCondition = function() {
    return this.player.x === this.gridLength - 1 && this.player.y === this.gridLength - 1;
  };

  MultiplayerOnlineMazeGame.prototype.win = function() {
    var self = this;
    this.won = true;
    this.networkDriver.sendWin(this.playerNumber);
    this.mazeDisplay.flash("blue", 500, function() {
      self.gameEnd({ won: true });
    });
  };

  MultiplayerOnlineMazeGame.prototype.successfulMoveEvent = function() {
    this.networkDriver.send({
      x: this.player.x,
      y: this.player.y,
      playerNumber: this.playerNumber
    });

    if (this.neuralDisplay != null) {
      this.neuralDisplay.addObject(new Firework(this.neuralDisplay.getLength()));
    }
  };

  // positions come in as a list of objects:
  // {number: 1, x: 8, y: 5}
  // Wipe out all players but the primary.
  // Add players one by one.
  // Reset the display to draw the new state of affairs.
  MultiplayerOnlineMazeGame.prototype.setPositions = function(positions) {
    this.players = [this.players[0]];
    for (var x = 0; x < positions.length; x++) {
      if (positions[x].number == this.playerNumber) {
        continue;
      }

      this.addPlayer(positions[x].x, positions[x].y);
      this.clearDisplays();
    }
  }

  return MultiplayerOnlineMazeGame;
}();