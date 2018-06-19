"use strict";

var $ = require("jquery");
var KeyboardDriver = require('./drivers/keyboardDriver.js');
var RemoteKeyboardDriver = require('./drivers/remoteKeyboardDriver.js');
var TwoPlayerGameMaster = require('./gameMasters/twoPlayerGameMaster.js');
var MultiplayerOnlineGameMaster = require('./gameMasters/multiplayerOnlineGameMaster.js');

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

  HollowCart.prototype.startMultiplayerMazeGame = function (maze, networkListener) {
    this.keyboardDriver = new KeyboardDriver(document);
    return this.startMultiplayer(maze, networkListener);
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

  HollowCart.prototype.startMultiplayer = function (maze, networkListener) {
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

    this.gameMaster = new MultiplayerOnlineGameMaster(canvas1, canvas2, this.keyboardDriver, soundDriver, networkListener);  
    this.gameMaster.start(maze);
    return this.gameMaster.getCurrentGame().getMaze();
  };

  return HollowCart;
}();
