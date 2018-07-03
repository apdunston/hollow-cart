"use strict";

// Constructor calls super
var MazeGame = require('./mazeGame.js');
var Game = require('./game.js');


module.exports = function() {

  var LightningMazeGame = function (keyboardDriver, mazeDisplay, neuralDisplay, gridLength, squareLength) {
    var self = this;
    Game.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.mazeDisplay = mazeDisplay;
    this.neuralDisplay = neuralDisplay;
    this.displays = [mazeDisplay, neuralDisplay];
    this.keyboardDriver = keyboardDriver;
  };

  // Explicit Inheritance
  LightningMazeGame.prototype = Object.create(MazeGame.prototype);
  LightningMazeGame.prototype.constructor = LightningMazeGame;

  LightningMazeGame.prototype.clearDisplays = function() {
    this.mazeDisplay.clear();
    this.mazeDisplay.addLightningObject(this.maze);
    this.mazeDisplay.addObject(this.player);
    this.mazeDisplay.addObject(this.goalObject);
    this.drawLoop();
  };

  return LightningMazeGame;
}();