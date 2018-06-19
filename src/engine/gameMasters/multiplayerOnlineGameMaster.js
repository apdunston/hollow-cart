"use strict";
var GameMaster = require("./gameMaster.js");
var Display = require('../display.js');
var MultiplayerOnlineMazeGame = require('../games/multiplayerOnlineMazeGame.js');
var DisplayDriver = require('../drivers/displayDriver.js');

module.exports = function() {
  var MultiplayerOnlineGameMaster = function MultiplayerOnlineGameMaster(canvas1, canvas2, keyboardDriver, soundDriver, networkListener) {
    GameMaster.call(this); // super()
    var gridLength = 10;
    var squareLength = 20;
    var hallLength = 6;

    var displaySpeed = 100;
    var display1 = new Display(new DisplayDriver(canvas1), displaySpeed);
    display1.setColor("black");
    var display2 = new Display(new DisplayDriver(canvas2), displaySpeed);
    display2.setColor("black");
    this.networkListener = networkListener;
    this.addGame(new MultiplayerOnlineMazeGame(keyboardDriver, display1, display2, gridLength, squareLength, networkListener));
  }; 

  /**
    * Interface GameMaster
    */

  MultiplayerOnlineGameMaster.prototype = Object.create(GameMaster.prototype);
  MultiplayerOnlineGameMaster.prototype.constructor = MultiplayerOnlineGameMaster;

  MultiplayerOnlineGameMaster.prototype.next = function () {
    this.stopCurrentGame();
    this.startCurrentGame();
  };

  MultiplayerOnlineGameMaster.prototype.start = function (maze) {
    this.stopCurrentGame();
    this.currentGameIndex = 0;
    this.startCurrentGame(maze);
  };

  MultiplayerOnlineGameMaster.prototype.startCurrentGame = function (maze) {
    if (this.currentGameIndex !== null) {
      this.games[this.currentGameIndex].start(maze);
    }
  };


  return MultiplayerOnlineGameMaster;
}();