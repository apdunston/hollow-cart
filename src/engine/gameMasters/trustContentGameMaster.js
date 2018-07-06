"use strict";

var GameMaster = require("./gameMaster");
var MazeGameMaster = require('./mazeGameMaster');
var Display = require('../display');
var DisplayDriver = require('../drivers/displayDriver');
var NullNetworkDriver = require('../drivers/nullNetworkDriver');
var SimpleMazeScene = require('../scenes/simpleMazeScene');
var KeyMazeScene = require('../scenes/keyMazeScene');
var ReverseLightningDisplay = require('../drivers/displays/reverseLightningDisplay');
var LightningDisplay = require('../drivers/displays/lightningDisplay');
var SingleDisplayLightningMazeGame = require('../games/singleDisplay/lightningMazeGame');
var Score = require("../gameObjects/score");
var GameOver = require("../gameObjects/gameOver");

module.exports = function() {
  var TrustContentGameMaster = function TrustContentGameMaster(canvas, keyboardDriver) {
    var self = this;
    GameMaster.call(this); // super()
    this.gridLength = 20;
    this.squareLength = 20;
    this.playerNumber = 0;
    this.soundDriver = null;
    this.keyboardDriver = keyboardDriver;
    this.setNetworkDriver(NullNetworkDriver);
    this.timeRemaining = 60;


    var displaySpeed = 100;
    this.display = new Display(new DisplayDriver(canvas), displaySpeed);
    this.display.setColor("black");
    this.reverseLightningDisplay = new ReverseLightningDisplay(new DisplayDriver(canvas1), displaySpeed);
    this.lightningDisplay = new LightningDisplay(new DisplayDriver(canvas1), displaySpeed);

    this.displays = [this.display];
    this.score = new Score(0, this.gridLength, this.squareLength);  
    
    this.addGame(new SimpleMazeScene(this.keyboardDriver, this.display, this.gridLength, this.squareLength, this.score));
    this.addGame(new KeyMazeScene(this.keyboardDriver, this.display, this.gridLength, this.squareLength, this.score));
    this.addGame(new SingleDisplayLightningMazeGame(this.keyboardDriver, this.reverseLightningDisplay, this.gridLength, this.squareLength, this.score));
    this.addGame(new SingleDisplayLightningMazeGame(this.keyboardDriver, this.lightningDisplay, this.gridLength, this.squareLength, this.score));
    // this.addGame(new ChaseMazeGame(keyboardDriver, display1, display3, gridLength, squareLength, this.score));
  };

  TrustContentGameMaster.prototype = Object.create(MazeGameMaster.prototype);
  TrustContentGameMaster.prototype.constructor = TrustContentGameMaster;

  TrustContentGameMaster.prototype.gameEnd = function (data) {
    if (data.won !== true) {
      this.display.addObject(new GameOver(this.gridLength, this.squareLength));
      return;
    }

    this.score.add(100);
    
    if (this.onLastGame()) {
      this.score.add(200);
      // Make it harder
      this.timeRemaining = Math.ceil(this.timeRemaining * 0.6);
    }

    this.next();
  };

  TrustContentGameMaster.prototype.next = function() {
    var maze = this.getCurrentGame().getMaze();
    MazeGameMaster.prototype.next.call(this);
    if (!this.onFirstGame()) {
      this.getCurrentGame().setMaze(maze);
    }
    this.getCurrentGame().setTimeRemaining(this.timeRemaining);
  }
  
  return TrustContentGameMaster;
}();
