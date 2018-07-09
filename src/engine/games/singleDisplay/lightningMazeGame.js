"use strict";

// Constructor calls super
var SingleDisplayMazeGame = require('./mazeGame.js');
var Game = require('../game.js');


module.exports = function() {

  var SingleDisplayLightningMazeGame = function (keyboardDriver, display, 
        gridLength, squareLength, score, playerNumber) {
    var self = this;
    SingleDisplayMazeGame.call(self, keyboardDriver, display, 
      gridLength, squareLength, score, playerNumber);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.display = display;
    this.displays = [display];
    this.keyboardDriver = keyboardDriver;
  };

  // Explicit Inheritance
  SingleDisplayLightningMazeGame.prototype = Object.create(SingleDisplayMazeGame.prototype);
  SingleDisplayLightningMazeGame.prototype.constructor = SingleDisplayLightningMazeGame;

  SingleDisplayLightningMazeGame.prototype.clearDisplays = function() {
    this.clearDisplaysCommon();
    this.display.addLightningObject(this.maze);
  };

  return SingleDisplayLightningMazeGame;
}();