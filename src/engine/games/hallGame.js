"use strict";

var Alpha = require('../enums/alpha.js');
var Game = require('./game.js');
var Player = require('../gameObjects/player.js');
var Hall = require('../gameObjects/hall.js');
var GridTranslator = require('../gridTranslator.js');
var Gamespace = require('../gamespace.js');
var DisplayConstants = require('../enums/displayConstants.js');
var BlinkingCursor = require('../drawableObjects/blinkingCursor.js')
var Text = require("../drawableObjects/text.js");
var Circle = require("../drawableObjects/circle.js");
var TypedText = require("../drawableObjects/typedText.js");

module.exports = function() {
  var HallGameStates = {
    BEGINNING: 1,
    MIDDLE: 2,
    END: 3
  };

  var HallGame = function HallGame(keyboardDriver, mazeDisplay, statusDisplay, gridLength, hallLength, squareLength) {
    var self = this;
    Game.call(self);
    this.statusDisplay = statusDisplay;
    this.gridLength = gridLength;
    this.hallLength = hallLength;
    this.squareLength = squareLength;
    this.mazeDisplay = mazeDisplay;
    this.gameLoopsPerSecond = 8;
    this.keyboardDriver = keyboardDriver;
    this.displays = [mazeDisplay, statusDisplay];
    var xOffset = this.gridLength * this.squareLength / 2 - this.hallLength * this.squareLength / 2;
    var yOffset = this.gridLength * this.squareLength / 2 - this.squareLength / 2;
    this.gridTranslator = new GridTranslator(xOffset, yOffset, squareLength);
  };

  HallGame.prototype = Object.create(Game.prototype);
  HallGame.prototype.constructor = HallGame;

  HallGame.prototype.start = function() {
    Game.prototype.start.call(this);
    this.state = HallGameStates.BEGINNING;
    var margin = DisplayConstants.TEXT_MARGIN;
    var textSize = DisplayConstants.TEXT_SIZE;
    this.blinkingCursor = new BlinkingCursor(margin * 2 + 12 * textSize, margin * 1.3, "white");
    this.statusDisplay.addObject(new Text(margin, 2 * margin, "> Press the arrow keys", "white"));
    this.statusDisplay.addObject(this.blinkingCursor);
  };

  HallGame.prototype.proceedToMiddle = function() {
    var self = this;
    this.state = HallGameStates.MIDDLE;
    this.blinkingCursor.setIsDone(true);
    this.player = new Player(this.hallLength, this.squareLength, this, this.gridTranslator);
    this.player.setPosition(0, 0);
    this.mazeDisplay.clear();
    this.mazeDisplay.addObject(this.player);
    setTimeout(function() {
      self.proceedToEnd();
    }, 500);
  };

  HallGame.prototype.proceedToEnd = function() {
    var self = this;
    var margin = DisplayConstants.TEXT_MARGIN;
    var textSize = DisplayConstants.TEXT_SIZE;
    var text = new TypedText(margin, 3 * margin, "> Move white square to green circle", "white");
    text.start();
    this.statusDisplay.addObject(text);
    this.state = HallGameStates.END;
    this.maze = new Hall(this.squareLength, this.hallLength, this.gridTranslator);
    this.maze.setAlpha(Alpha.INVISIBLE);
    this.mazeDisplay.addObject(this.maze);
    this.maze.fadeIn();

    this.placeGoalObject();
    setTimeout(function() {
      self.goalObject.fadeIn();
    }, 500);
  };

  HallGame.prototype.placeGoalObject = function() {
    var x = this.gridTranslator.xInPixels(this.hallLength) - this.squareLength / 2;
    var y = this.gridTranslator.yInPixels(1) - this.squareLength / 2;
    this.goalObject = new Circle(x, y, this.squareLength / 4, "green");
    this.goalObject.setAlpha(Alpha.INVISIBLE);
    this.mazeDisplay.addObject(this.goalObject);
  };

  HallGame.prototype.keyDown = function (evt) {
    if (this.state === HallGameStates.END) {
      return this.keyDownEndState(evt);
    }

    switch (evt.keyCode) {
      case Gamespace.LEFT_CODE:
      case Gamespace.UP_CODE:
      case Gamespace.RIGHT_CODE:
      case Gamespace.DOWN_CODE:
        this.advanceState();
    }
  };

  HallGame.prototype.advanceState = function() {
    if (this.state === HallGameStates.BEGINNING) {
      this.proceedToMiddle();
      return;
    }

    if (this.state === HallGameStates.MIDDLE) {
      this.proceedToEnd();
    }
  };

  HallGame.prototype.keyDownEndState = function (evt) {
    switch (evt.keyCode) {
      case Gamespace.LEFT_CODE:
        if (this.player.getX() !== 0) {
          this.player.left();
        }
        break;
      case Gamespace.UP_CODE:
        // this.player.up();
        break;
      case Gamespace.RIGHT_CODE:
        this.player.right();
        break;
      case Gamespace.DOWN_CODE:
        // this.player.down();
        break;
    }

    if (this.winCondition()) {
      this.win();
    }
  };

  HallGame.prototype.winCondition = function() {
    return this.player.getX() === this.hallLength - 1;
  };

  HallGame.prototype.win = function() {
    var self = this;
    this.won = true;
    this.mazeDisplay.flash("blue", 500, function() {
      self.gameEnd({ won: true });
    });
  };

  return HallGame;
}();