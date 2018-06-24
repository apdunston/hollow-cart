"use strict";
var GameMaster = require("./gameMaster.js");
var Display = require('../display.js');
var TwoPlayerMazeGame = require('../games/twoPlayerMazeGame.js');
var DisplayDriver = require('../drivers/displayDriver.js');

module.exports = function() {
  var TwoPlayerGameMaster = function TwoPlayerGameMaster(canvas1, canvas2, keyboardDriver, 
      soundDriver) {
    GameMaster.call(this); // super()
    var gridLength = 10;
    var squareLength = 20;

    var displaySpeed = 100;
    var display1 = new Display(new DisplayDriver(canvas1), displaySpeed);
    display1.setColor("black");
    var display2 = new Display(new DisplayDriver(canvas2), displaySpeed);
    display2.setColor("black");
    this.addGame(new TwoPlayerMazeGame(keyboardDriver, display1, display2, gridLength, 
        squareLength));
  }; 

  /**
    * Interface GameMaster
    */

  TwoPlayerGameMaster.prototype = Object.create(GameMaster.prototype);
  TwoPlayerGameMaster.prototype.constructor = TwoPlayerGameMaster;

  return TwoPlayerGameMaster;
}();