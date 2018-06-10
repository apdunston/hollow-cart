"use strict";

var $ = require("jquery");
var KeyboardDriver = require('./engine/drivers/keyboardDriver.js');
var TwoPlayerGameMaster = require('./engine/gameMasters/twoPlayerGameMaster.js');

// window.onload=function() {
//   var canv = $("#canvas1")[0];
//   var driver = new DisplayDriver(canv);
//   var display1 = new Display(driver, 0);
//   display1.setColor("black");

//   var displaySpeed = 100;
//   canv = $("#canvas2")[0];
//   driver = new DisplayDriver(canv);
//   var display2 = new Display(driver, displaySpeed);
//   display2.setColor("black");

//   var squareLength, gridLength;
//   squareLength = gridLength = 20;
//   var mazeGame = new MazeGame(document, display1, display2, gridLength, squareLength);
// }

window.onload=function() {
  var canv, display1, display2, display3, display4, mazeGame, 
    canvasLength;
  canvasLength = 400;

  $('canvas').attr('height', canvasLength).attr('width', canvasLength);

  var canvas1 = $("#canvas1")[0];
  var canvas2 = $("#canvas2")[0];

  // TODO - implement keyPushListeners
  var keyboardDriver = new KeyboardDriver(document);
  var soundDriver = null;

  var gameMaster = new TwoPlayerGameMaster(canvas1, canvas2, keyboardDriver, soundDriver);
}

