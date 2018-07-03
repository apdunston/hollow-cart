"use strict";

var MazeGame = require('../games/mazeGame.js');
var Game = require('./game.js');
var HorizontalDisplay = require('../drivers/displays/horizontalDisplay.js');
var VerticalDisplay = require('../drivers/displays/verticalDisplay.js');

module.exports = function() {
  var SplitMazeGame = function (keyboardDriver, mazeXDisplay, mazeYDisplay, neuralDisplay, gridLength, squareLength) {
    var self = this;
    Game.call(self);
    this.gridLength = gridLength;
    this.squareLength = squareLength;
    this.mazeXDisplay = mazeXDisplay;
    this.mazeYDisplay = mazeYDisplay;
    this.neuralDisplay = neuralDisplay;
    this.displays = [mazeXDisplay, mazeYDisplay, neuralDisplay];
    this.keyboardDriver = keyboardDriver;
  };

  // Explicit Inheritance
  SplitMazeGame.prototype = Object.create(MazeGame.prototype);
  SplitMazeGame.prototype.constructor = SplitMazeGame;

  SplitMazeGame.prototype.clearDisplays = function() {
    this.horizontalDisplay = new HorizontalDisplay(this.drawMap, this.squareLength);
    this.verticalDisplay = new VerticalDisplay(this.drawMap, this.squareLength);

    this.mazeXDisplay.clear();
    this.mazeYDisplay.clear();
    this.mazeXDisplay.addObject(this.horizontalDisplay);
    this.mazeYDisplay.addObject(this.verticalDisplay);
    this.mazeXDisplay.addObject(this.player);
    this.mazeXDisplay.addObject(this.goalObject);
    this.mazeYDisplay.addObject(this.player);
    this.mazeYDisplay.addObject(this.goalObject);
    this.drawLoop();
  };

  SplitMazeGame.prototype.drawLoop = function() {
    this.mazeXDisplay.render();
    this.mazeYDisplay.render();
  };

  SplitMazeGame.prototype.win = function() {
    var self = this;
    var secondFlashDuration = 500;
    var secondFlashDelay = 75;
    var firstFlashDuration = secondFlashDelay + secondFlashDuration;
    this.mazeXDisplay.flash("blue", firstFlashDuration, function() {});
    setTimeout(function() {
      self.mazeYDisplay.flash("blue", secondFlashDuration, function() {
        self.gameEnd({ won: true });
      });
    }, secondFlashDelay);
  };

  return SplitMazeGame;
}();