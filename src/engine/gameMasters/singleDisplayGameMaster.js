"use strict";

var GameMaster = require("./gameMaster.js");
var MazeGameMaster = require('./mazeGameMaster.js');
var Display = require('../display.js');
var MultiplayerOnlineMazeGame = require('../games/multiplayerOnlineMazeGame.js');
var DisplayDriver = require('../drivers/displayDriver.js');
var NullNetworkDriver = require('../drivers/nullNetworkDriver.js');
var SingleDisplayMazeGame = require('../games/singleDisplay/mazeGame.js');

module.exports = function() {
  var SingleDisplayGameMaster = function SingleDisplayGameMaster(canvases, keyboardDriver) {
    GameMaster.call(this); // super()
    var canvas = canvases[0];
    this.gridLength = 20;
    this.squareLength = 20;
    this.playerNumber = 0;
    this.soundDriver = null;
    this.keyboardDriver = keyboardDriver;
    this.setNetworkDriver(NullNetworkDriver);

    var displaySpeed = 100;
    this.display = new Display(new DisplayDriver(canvas), displaySpeed);
    this.display.setColor("black");
    this.displays = [this.display];
  };

  SingleDisplayGameMaster.prototype = Object.create(MazeGameMaster.prototype);
  SingleDisplayGameMaster.prototype.constructor = SingleDisplayGameMaster;
  

  SingleDisplayGameMaster.prototype.addMazeGame = function() {
    this.addGame(new SingleDisplayMazeGame(this.keyboardDriver, this.display, this.gridLength, this.squareLength));
    return this;
  }

  return SingleDisplayGameMaster;
}();
