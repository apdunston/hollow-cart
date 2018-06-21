"use strict";

var $ = require("jquery");
var KeyboardDriver = require('./drivers/keyboardDriver.js');
var RemoteKeyboardDriver = require('./drivers/remoteKeyboardDriver.js');
var TwoPlayerGameMaster = require('./gameMasters/twoPlayerGameMaster.js');
var MultiplayerOnlineGameMaster = require('./gameMasters/multiplayerOnlineGameMaster.js');
var NeuralActivityGameMaster = require('./gameMasters/neuralActivityGameMaster.js');

module.exports = function() {
  var HollowCart = function() {
    this.keyboardDriver = null;
    this.gameMaster = null;
  };
  
  HollowCart.prototype.constructor = HollowCart;

  HollowCart.prototype.startTwoPlayerLocal = function (maze) {
    this.keyboardDriver = new KeyboardDriver(document);
    return this.startTwoPlayer(maze);
  };

  HollowCart.prototype.startTwoPlayerRemote = function (maze, remoteKeyDownListener) {
    this.keyboardDriver = new RemoteKeyboardDriver(document);
    this.addRemoteKeyDownListener(remoteKeyDownListener);
    return this.startTwoPlayer(maze);
  };

  HollowCart.prototype.startMultiplayerMazeGame = function (maze, networkDriver, playerNumber) {
    this.keyboardDriver = new KeyboardDriver(document);
    return this.startMultiplayer(maze, networkDriver, playerNumber);
  };

  HollowCart.prototype.addRemoteKeyDownListener = function(listener) {
    this.keyboardDriver.addRemoteKeyDownListener(listener);
  }

  HollowCart.prototype.startTwoPlayer = function (maze) {
    if (this.gameMaster != null) {
      this.gameMaster.stop();
    }

    $('.play-area').show();
    var canv, display1, display2, display3, display4, mazeGame, 
      canvasLength;
    canvasLength = 400;

    $('canvas').attr('height', canvasLength).attr('width', canvasLength);

    var canvas1 = $("#canvas1")[0];
    var canvas2 = $("#canvas2")[0];

    // TODO - implement keyPushListeners
    var soundDriver = null;

    this.gameMaster = new TwoPlayerGameMaster(canvas1, canvas2, this.keyboardDriver, soundDriver);  
    this.gameMaster.start(maze);
    return this.gameMaster.getCurrentGame().getMaze();
  };

  HollowCart.prototype.startMultiplayer = function (maze, networkDriver, playerNumber) {
    if (this.gameMaster != null) {
      this.gameMaster.stop();
    }

    $('.play-area').show();
    var canv, display1, display2, display3, display4, mazeGame, 
      canvasLength;
    canvasLength = 400;

    $('canvas').attr('height', canvasLength).attr('width', canvasLength);

    var canvas1 = $("#canvas1")[0];
    var canvas2 = $("#canvas2")[0];

    // TODO - implement keyPushListeners
    var soundDriver = null;

    var networkDriver

    this.gameMaster = new MultiplayerOnlineGameMaster(canvas1, canvas2, this.keyboardDriver, 
      soundDriver, networkDriver, playerNumber);  
    this.gameMaster.start(maze);
    return this.gameMaster.getCurrentGame().getMaze();
  };

  HollowCart.prototype.startNeuralActivity = function () {
    var canv, display1, display2, display3, display4, mazeGame, 
      canvasLength, canvas1, canvas2, canvas3, canvas4, canvas5, 
      canvas6, keyboardDriver, soundDriver, gameMaster;
    canvasLength = 400;

    $('canvas').attr('height', canvasLength).attr('width', canvasLength);

    canvas1 = document.getElementById("canvas1");
    canvas2 = document.getElementById("canvas2");
    canvas3 = document.getElementById("canvas3");
    canvas4 = document.getElementById("canvas4");
    canvas5 = document.getElementById("canvas5");
    canvas6 = document.getElementById("canvas6");

    // TODO - implement keyPushListeners
    keyboardDriver = new KeyboardDriver(document);
    soundDriver = null;

    gameMaster = new NeuralActivityGameMaster(canvas1, canvas2, canvas3, canvas4, canvas5, canvas6, keyboardDriver, soundDriver);
  }


  return HollowCart;
}();
