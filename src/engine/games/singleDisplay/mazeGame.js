"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 */

var SingleDisplayGame = require('./game.js');
var MazeData = require('../../mazeData.js');
var Gamespace = require('../../gamespace.js');
var Colors = require('../../enums/colors.js');
var GridTranslator = require('../../gridTranslator.js');
var Maze = require('../../gameObjects/maze.js');
var Player = require('../../gameObjects/player.js');
var CountdownTimer = require('../../gameObjects/countdownTimer.js');
var Circle = require('../../drawableObjects/circle.js');
var Spark = require('../../effects/spark.js');

var defaultTimeRemaining = 60;

module.exports = function() {
  var SingleDisplayMazeGame = function SingleDisplayMazeGame(keyboardDriver, display, gridLength, 
      squareLength, score, playerNumber) {
    var self = this;

    SingleDisplayGame.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.display = display;
    this.displays = [display];
    this.gameLoopsPerSecond = 8;
    this.keyboardDriver = keyboardDriver;
    this.networkDriver = null;
    this.gridTranslator = new GridTranslator(0, 0, this.squareLength * 3.5);

    this.score = score;
    this.timeRemaining = defaultTimeRemaining;
    this.countdownTimer = new CountdownTimer(this.timeRemaining, this.gridLength, this.squarelength, function() {self.lose();});

    this.playerNumber = playerNumber;
  };

  SingleDisplayMazeGame.prototype = Object.create(SingleDisplayGame.prototype);

  //!!ADRIAN - Move this to its own effect class
  SingleDisplayMazeGame.prototype.showerOfSparks = function(xMultiplier, yMultiplier) {
    var self = this;
    var position = this.translatedPlayerPosition();
    var sparkLength = Math.ceil(this.squareLength / 3);
    var x = position[0] + xMultiplier * this.squareLength;
    var y = position[1] + yMultiplier * this.squareLength;
    var numSparks = 5;
    var spread = Math.ceil(this.squareLength * 0.75);
    var framesDuration = 80;

    var oneSpark = function() {
      var sparkX = x - Math.floor(Math.random() * spread);
      var sparkY = y + Math.floor(Math.random() * spread);
      var distance = Math.sqrt(Math.pow(x - sparkX, 2) + Math.pow(y - sparkY, 2));
      var distanceInSquares = distance/self.squareLength;
      var length = sparkLength * distanceInSquares;
      
      new Spark(self.display, sparkX, sparkY, length, framesDuration, Colors.randomColor())
    }

    for (var i = 0; i < numSparks; i++) {
      var time = Math.floor(Math.random() * 150);
      setTimeout(oneSpark, time);
    }
  }

  // positions come in as a list of objects:
  // {number: 1, x: 8, y: 5}
  // Wipe out all players but the primary.
  // Add players one by one.
  // Reset the display to draw the new state of affairs.
  SingleDisplayGame.prototype.setPositions = function(positions) {
    this.players = [this.players[0]];
    for (var x = 0; x < positions.length; x++) {
      if (positions[x].number == this.playerNumber) {
        continue;
      }

      this.addPlayer(positions[x].x, positions[x].y);
      this.clearDisplays();
    }
  }

  SingleDisplayMazeGame.prototype.setGridLength = function(gridLength) {
    this.gridLength = gridLength;   
    this.countdownTimer.setGridLength(gridLength);
    return this;
  }

  SingleDisplayMazeGame.prototype.setTimeRemaining = function(time) {
    this.timeRemaining = time;
    this.countdownTimer.setTimeRemaining(time);
  }

  SingleDisplayMazeGame.prototype.setPlayerNumber = function(playerNumber) {
    this.playerNumber = playerNumber;
    return this;
  }

  SingleDisplayMazeGame.prototype.setSquareLength = function(squareLength) {
    this.squareLength = squareLength;    
    this.gridTranslator = new GridTranslator(0, 0, this.squareLength);
    this.countdownTimer.setSquareLength(squareLength);
    return this;
  }

  SingleDisplayMazeGame.prototype.setNetworkDriver = function(networkDriver) {
    this.networkDriver = networkDriver;    
    return this;
  }

  SingleDisplayMazeGame.prototype.getMaze = function() {
    return this.maze;
  }

  SingleDisplayMazeGame.prototype.setMaze = function(maze) {
    this.stop();
    SingleDisplayGame.prototype.start.call(this);
    this.reset(maze);
  };

  SingleDisplayMazeGame.prototype.start = function() {
    var self = this;

    if (this.playerNumber == null) {
      throw("Player number cannot be null");
    }

    SingleDisplayGame.prototype.start.call(self);

    this.reset();
  };

  SingleDisplayMazeGame.prototype.drawLoop = function() {
    this.display.render();
  };

  SingleDisplayMazeGame.prototype.clearDisplaysCommon = function() {
    SingleDisplayGame.prototype.clearDisplays.call(this);
    this.display.addObject(this.player);
    this.display.addObject(this.goalObject);
    this.display.addObject(this.countdownTimer);

    if (this.score) {
      this.display.addObject(this.score);
    }

    for (var x = 0; x < this.players.length; x++) {
      this.display.addObject(this.players[x]);
    }
  }

  SingleDisplayMazeGame.prototype.addPlayer = function (x, y) {
    var player = new Player(this.gridLength, this.squareLength, this);
    player.setPosition(x || 0, y || 0);
    
    if (this.players.length == 0) {
      this.player = player;
    } else {
      player.setColor("#555555");
    }

    this.players.push(player);
  }

  SingleDisplayMazeGame.prototype.clearDisplays = function() {
    this.clearDisplaysCommon();
    this.display.addObject(this.maze);
    this.drawLoop();
  };

  SingleDisplayMazeGame.prototype.reset = function(maze) {
    this.players = [];
    this.addPlayer();
    this.countdownTimer.stop();
    this.countdownTimer.setTimeRemaining(this.timeRemaining);
    this.countdownTimer.start();
    this.won = false;

    if (maze == null || maze.drawMap == null) {
      var map = MazeData.generate(this.gridLength, this.gridLength);
      var drawMap = MazeData.translate(map);
      this.maze = new Maze(drawMap, this.squareLength);
    } else {
      this.maze = new Maze(maze.drawMap, this.squareLength);
    }
    
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

  SingleDisplayMazeGame.prototype.getPlayer = function() {
    return this.player;
  };

  SingleDisplayMazeGame.prototype.getMoveForEvent = function(evt) {
    var self = this;

    switch (evt.keyCode) {
      case Gamespace.LEFT_CODE:
        return function() {
          var success = self.player.left();          
          success && self.showerOfSparks(2, 0);
          return success;
        };
      case Gamespace.UP_CODE:
        return function() {
          var success = self.player.up()
          success && self.showerOfSparks(1, 1);
          return success;
        };
      case Gamespace.RIGHT_CODE:
        return function() {
          var success = self.player.right()
          success && self.showerOfSparks(0, 0);
          return success;
        };
      case Gamespace.DOWN_CODE:
        return function() {
          var success = self.player.down()
          success && self.showerOfSparks(1, -0.75);
          return success;
        };
    }

    return function() {};
  }

  SingleDisplayMazeGame.prototype.continueMovement = function(move, success) {
    var self = this;
    var validMoves = self.validMoves(self.player.getX(), self.player.getY());

    if (success && validMoves.length === 2) {
      if (self.movementTimeout != null) {
        clearTimeout(self.movementTimeout)
      }

      self.movementTimeout = setTimeout(function() {self.performMove(move);}, 20);
    } else {
      return success;
    }
  };

  SingleDisplayMazeGame.prototype.performMove = function(move) {
    var self = this;
    var success = move();

    if (self.winCondition()) {
      self.win();
      return;
    }

    this.continueMovement(move, success);
  };

  SingleDisplayMazeGame.prototype.keyDown = function (evt) {
    if (!this.running) {
      return;
    }
    var move = this.getMoveForEvent(evt);
    this.performMove(move);
  };

  SingleDisplayMazeGame.prototype.winCondition = function() {
    return this.player.x === this.gridLength - 1 && this.player.y === this.gridLength - 1;
  };

  SingleDisplayMazeGame.prototype.win = function() {
    var self = this;

    if (self.movementTimeout != null) {
      clearTimeout(self.movementTimeout)
    }

    this.stop();
    this.countdownTimer.stop();
    this.won = true;
    this.networkDriver.sendWin(this.playerNumber);
    
    this.display.flash("blue", 500, function() {
      self.gameEnd({ won: true });
    });
  };

  SingleDisplayGame.prototype.lose = function() {
    var self = this;
    this.countdownTimer.stop();
    this.running = false;
    self.gameEnd({won: false});
  }

  SingleDisplayMazeGame.prototype.successfulMoveEvent = function() {
    var self = this;
    if (this.display === null) {
      return;
    }

    this.networkDriver.send({
      x: this.player.x,
      y: this.player.y,
      playerNumber: this.playerNumber
    });
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