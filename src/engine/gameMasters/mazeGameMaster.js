"use strict";
var GameMaster = require("./gameMaster.js");
var Display = require('../display.js');
var MultiplayerOnlineMazeGame = require('../games/multiplayerOnlineMazeGame.js');
var DisplayDriver = require('../drivers/displayDriver.js');
var NullNetworkDriver = require('../drivers/nullNetworkDriver.js');

module.exports = function() {
  var MazeGameMaster = function MazeGameMaster(canvas1, canvas2,
      keyboardDriver) {
    GameMaster.call(this); // super()
    this.gridLength = 20;
    this.squareLength = 20;
    this.playerNumber = 0;
    this.soundDriver = null;
    this.keyboardDriver = keyboardDriver;
    this.setNetworkDriver(NullNetworkDriver);

    var displaySpeed = 100;
    this.display1 = new Display(new DisplayDriver(canvas1), displaySpeed);
    this.display1.setColor("black");
    this.display2 = new Display(new DisplayDriver(canvas2), displaySpeed);
    this.display2.setColor("black");
  };

  MazeGameMaster.prototype = Object.create(GameMaster.prototype);
  MazeGameMaster.prototype.constructor = MazeGameMaster;

  MazeGameMaster.prototype.startCurrentGame = function (data) {
    GameMaster.prototype.startCurrentGame.call(this, data);
    this.networkDriver.setGame(this.games[this.currentGameIndex]);
  };

  MazeGameMaster.prototype.setPlayerNumber = function(playerNumber) {
    this.playerNumber = playerNumber;
    return this;
  }

  MazeGameMaster.prototype.setNetworkDriver = function(networkDriver) {
    this.networkDriver = networkDriver;    
    for (var x; x < this.games.length; x++) {
      this.games[x].setNetworkDriver(networkDriver);
    }    
    return this;
  }

  MazeGameMaster.prototype.setSoundDriver = function(soundDriver) {
    this.soundDriver = soundDriver;    
    return this;
  }

  MazeGameMaster.prototype.setGridLength = function(gridLength) {
    this.gridLength = gridLength;    
    for (var x; x < this.games.length; x++) {
      this.games[x].setGridLength(gridLength);
    }
    return this;
  }

  MazeGameMaster.prototype.setSquareLength = function(squareLength) {
    this.squareLength = squareLength;    
    for (var x; x < this.games.length; x++) {
      this.games[x].setSquareLength(squareLength);
    }
    return this;
  }

  MazeGameMaster.prototype.addMultiplayerOnlineMazeGame = function() {
    this.addGame(new MultiplayerOnlineMazeGame(this.keyboardDriver, this.display1, this.display2, this.gridLength,
      this.squareLength, this.networkDriver, this.playerNumber));
    return this;    
  }

  MazeGameMaster.prototype.addHallGame = function() {
    this.addGame(new HallGame(keyboardDriver, display1, display2, gridLength, hallLength, squareLength));
    return this;
  }

  MazeGameMaster.prototype.addMazeGame = function() {
    this.addGame(new MazeGame(keyboardDriver, display1, display3, gridLength, squareLength));
    return this;
  }

  MazeGameMaster.prototype.addSplitMazeGame = function() {
    this.addGame(new SplitMazeGame(keyboardDriver, display1, display2, display3, gridLength, squareLength));
    return this;
  }

  MazeGameMaster.prototype.addLightningMazeGame = function() {
    this.addGame(new LightningMazeGame(keyboardDriver, reverseLightningDisplay, display3, gridLength, squareLength));
    return this;
  }

  MazeGameMaster.prototype.addLightningMazeGame = function() {
    this.addGame(new LightningMazeGame(keyboardDriver, lightningDisplay, display3, gridLength, squareLength));
    return this;
  }

  MazeGameMaster.prototype.addChaseMazeGame = function() {
    this.addGame(new ChaseMazeGame(keyboardDriver, display1, display3, gridLength, squareLength));
    return this;
  }

  return MazeGameMaster;
}();