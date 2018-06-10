"use strict";

var $ = require("jquery");
var KeyboardDriver = require('./engine/drivers/keyboardDriver.js');
var TwoPlayerGameMaster = require('./engine/gameMasters/twoPlayerGameMaster.js');

// global.$ = $;
global.gameMaster = null;
global.startGame = function(maze) {
  if (gameMaster != null) {
    gameMaster.stop();
  }

  $('.play-area').show();
  var canv, display1, display2, display3, display4, mazeGame, 
    canvasLength;
  canvasLength = 400;

  $('canvas').attr('height', canvasLength).attr('width', canvasLength);

  var canvas1 = $("#canvas1")[0];
  var canvas2 = $("#canvas2")[0];

  // TODO - implement keyPushListeners
  var keyboardDriver = new KeyboardDriver(document);
  var soundDriver = null;

  gameMaster = new TwoPlayerGameMaster(canvas1, canvas2, keyboardDriver, soundDriver);  
  gameMaster.start(maze);
  return gameMaster.getCurrentGame().getMaze();
}

