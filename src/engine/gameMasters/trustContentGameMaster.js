"use strict";

var GameMaster = require("./gameMaster.js");
var MazeGameMaster = require('./mazeGameMaster.js');
var Display = require('../display.js');
var DisplayDriver = require('../drivers/displayDriver.js');
var NullNetworkDriver = require('../drivers/nullNetworkDriver.js');
var SingleDisplayMazeGame = require('../games/singleDisplay/mazeGame.js');
var SimpleMazeScene = require('../scenes/simpleMazeScene.js');

module.exports = function() {
  var TrustContentGameMaster = function TrustContentGameMaster(canvas, keyboardDriver) {
    GameMaster.call(this); // super()
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
    this.addGame(new SimpleMazeScene(this.keyboardDriver, this.display, this.gridLength, this.squareLength));
  };

  TrustContentGameMaster.prototype = Object.create(MazeGameMaster.prototype);
  TrustContentGameMaster.prototype.constructor = TrustContentGameMaster;
  
  return TrustContentGameMaster;
}();
