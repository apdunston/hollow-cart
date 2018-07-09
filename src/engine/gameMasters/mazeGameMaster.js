"use strict";
var GameMaster = require("./gameMaster");
var Display = require('../display');
var MultiplayerOnlineMazeGame = require('../games/multiplayerOnlineMazeGame');
var DisplayDriver = require('../drivers/displayDriver');
var NullNetworkDriver = require('../drivers/nullNetworkDriver');
var MazeGame = require('../games/mazeGame');
var Score = require("../gameObjects/score");

module.exports = function() {
  var MazeGameMaster = function MazeGameMaster(canvases, keyboardDriver) {
    GameMaster.call(this); // super()
    var canvas1 = canvases[0];
    var canvas2 = canvases[1];
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
    this.score = new Score(0, this.gridLength, this.squareLength);  
  };

  MazeGameMaster.prototype = Object.create(GameMaster.prototype);
  MazeGameMaster.prototype.constructor = MazeGameMaster;

  MazeGameMaster.prototype.startCurrentGame = function (data) {
    GameMaster.prototype.startCurrentGame.call(this, data);
    this.networkDriver.setGame(this.games[this.currentGameIndex]);
  };

  MazeGameMaster.prototype.setPlayerNumber = function(playerNumber) {
    this.playerNumber = playerNumber;
    for(var i = 0; i < this.games.length; i++) {
      this.games[i].setPlayerNumber(playerNumber);
    }
    return this;
  }

  MazeGameMaster.prototype.setNetworkDriver = function(networkDriver) {
    this.networkDriver = networkDriver;    
    for (var x = 0; x < this.games.length; x++) {
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
    for (var x = 0; x < this.games.length; x++) {
      this.games[x].setGridLength(gridLength);
    }
    this.score.setGridLength(gridLength);
    return this;
  }

  MazeGameMaster.prototype.setSquareLength = function(squareLength) {
    this.squareLength = squareLength;    
    for (var x = 0; x < this.games.length; x++) {
      this.games[x].setSquareLength(squareLength);
    }
    this.score.setSquareLength(squareLength);
    return this;
  }

  MazeGameMaster.prototype.addMultiplayerOnlineMazeGame = function() {
    this.addGame(new MultiplayerOnlineMazeGame(this.keyboardDriver, this.display1, this.display2, this.gridLength,
      this.squareLength, this.networkDriver, this.playerNumber));
    return this;    
  }

  MazeGameMaster.prototype.addHallGame = function() {
    this.addGame(new HallGame(this.keyboardDriver, this.display1, this.display2, this.gridLength, this.hallLength, this.squareLength));
    return this;
  }

  MazeGameMaster.prototype.addMazeGame = function() {
    this.addGame(new MazeGame(this.keyboardDriver, this.display1, this.display3, this.gridLength, this.squareLength));
    return this;
  }

  MazeGameMaster.prototype.addSplitMazeGame = function() {
    this.addGame(new SplitMazeGame(this.keyboardDriver, this.display1, this.display2, this.display3, this.gridLength, this.squareLength));
    return this;
  }

  MazeGameMaster.prototype.addLightningMazeGame = function() {
    this.addGame(new LightningMazeGame(this.keyboardDriver, this.reverseLightningDisplay, this.display3, this.gridLength, this.squareLength));
    return this;
  }

  MazeGameMaster.prototype.addLightningMazeGame = function() {
    this.addGame(new LightningMazeGame(this.keyboardDriver, this.lightningDisplay, this.display3, this.gridLength, this.squareLength));
    return this;
  }

  MazeGameMaster.prototype.addChaseMazeGame = function() {
    this.addGame(new ChaseMazeGame(this.keyboardDriver, this.display1, this.display3, this.gridLength, this.squareLength));
    return this;
  }

  return MazeGameMaster;
}();