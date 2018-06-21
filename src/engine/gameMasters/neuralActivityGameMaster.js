"use strict";
var GameMaster = require("./gameMaster.js");
var Display = require('../display.js');
var MazeGame = require('../games/mazeGame.js');
var HallGame = require('../games/hallGame.js');
var SplitMazeGame = require('../games/splitMazeGame.js');
var LightningMazeGame = require('../games/lightningMazeGame.js');
var DisplayDriver = require('../drivers/displayDriver.js');
var LightningDisplay = require('../drivers/displays/lightningDisplay.js');
var ReverseLightningDisplay = require('../drivers/displays/reverseLightningDisplay.js');

/**
 * Interface GameMaster
 */
module.exports = function() {
  var NeuralActivityGameMaster = function NeuralActivityGameMaster(canvas1, canvas2, canvas3, canvas4, canvas5, canvas6, keyboardDriver, soundDriver) {
    GameMaster.call(this); // super()
    var gridLength = 10;
    var squareLength = 20;
    var hallLength = 6;

    var displaySpeed = 100;
    var display1 = new Display(new DisplayDriver(canvas1), displaySpeed);
    display1.setColor("black");
    var display2 = new Display(new DisplayDriver(canvas2), displaySpeed);
    display2.setColor("black");
    var display3 = new Display(new DisplayDriver(canvas3), displaySpeed);
    display3.setColor("black");
    var display4 = new Display(new DisplayDriver(canvas4), displaySpeed);
    display4.setColor("black");
    var display5 = new Display(new DisplayDriver(canvas5), displaySpeed);
    display5.setColor("black");
    var display6 = new Display(new DisplayDriver(canvas6), displaySpeed);
    display6.setColor("black");
    var lightningDisplay = new LightningDisplay(new DisplayDriver(canvas1), displaySpeed);
    var reverseLightningDisplay = new ReverseLightningDisplay(new DisplayDriver(canvas1), displaySpeed);

    this.addGame(new HallGame(keyboardDriver, display1, display2, gridLength, hallLength, squareLength));
    // this.addGame(new RemedialGame(keyboardDriver, display1, display2, gridLength, hallLength, squareLength));
    this.addGame(new MazeGame(keyboardDriver, display1, display3, gridLength, squareLength));
    this.addGame(new SplitMazeGame(keyboardDriver, display1, display2, display3, gridLength, squareLength));
    this.addGame(new LightningMazeGame(keyboardDriver, reverseLightningDisplay, display3, gridLength, squareLength));
    this.addGame(new LightningMazeGame(keyboardDriver, lightningDisplay, display3, gridLength, squareLength));
    // this.addGame(new ChaseMazeGame(keyboardDriver, display1, display3, gridLength, squareLength));
    this.start();
  };

  NeuralActivityGameMaster.prototype = Object.create(GameMaster.prototype);
  NeuralActivityGameMaster.prototype.constructor = NeuralActivityGameMaster;
  return NeuralActivityGameMaster;
}();