"use strict";
var GameMaster = require("./gameMaster.js");
var Display = require('../display.js');
var MultiplayerOnlineMazeGame = require('../games/multiplayerOnlineMazeGame.js');
var DisplayDriver = require('../drivers/displayDriver.js');

module.exports = function() {
  var MultiplayerOnlineGameMaster = function MultiplayerOnlineGameMaster(canvas1, canvas2,
      keyboardDriver, soundDriver, networkDriver, playerNumber) {
    GameMaster.call(this); // super()
    var gridLength = 12;
    var squareLength = 33;

    var displaySpeed = 100;
    var display1 = new Display(new DisplayDriver(canvas1), displaySpeed);
    display1.setColor("black");
    var display2 = new Display(new DisplayDriver(canvas2), displaySpeed);
    display2.setColor("black");
    this.networkDriver = networkDriver;
    this.addGame(new MultiplayerOnlineMazeGame(keyboardDriver, display1, display2, gridLength,
      squareLength, networkDriver, playerNumber));
  }; 

  /**
    * Interface GameMaster
    */

  MultiplayerOnlineGameMaster.prototype = Object.create(GameMaster.prototype);
  MultiplayerOnlineGameMaster.prototype.constructor = MultiplayerOnlineGameMaster;

  return MultiplayerOnlineGameMaster;
}();