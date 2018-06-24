"use strict";

var $ = require("jquery");
var Hammer = require("hammerjs");

var KeyboardDriver = require('./drivers/keyboardDriver.js');
var NullNetworkDriver = require('./drivers/nullNetworkDriver.js');
var TwoPlayerGameMaster = require('./gameMasters/twoPlayerGameMaster.js');
var MultiplayerOnlineGameMaster = require('./gameMasters/multiplayerOnlineGameMaster.js');
var MazeGameMaster = require('./gameMasters/mazeGameMaster.js');
var NeuralActivityGameMaster = require('./gameMasters/neuralActivityGameMaster.js');
var Gamespace = require('./gamespace.js');
var MobileDetect = require('mobile-detect');

module.exports = function() {
  var HollowCart = function() {
    var self = this;
    this.keyboardDriver = new KeyboardDriver(document);
    this.gameMaster = null;
    self.pauseSwipe = false;

    var myElement = $('body')[0];
    var hammer = new Hammer(myElement);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    var doSwipe = function(code) {
      if (!self.pauseSwipe) {
        self.keyboardDriver.keyDown({keyCode: code});
        self.pauseSwipe = true;
        setTimeout(function() {self.pauseSwipe = false}, 100);
      }
    }

    hammer.on("panleft", function( event ) {
      doSwipe(Gamespace.LEFT_CODE);
    });

    hammer.on("panright", function( event ) {
      doSwipe(Gamespace.RIGHT_CODE);
    });

    hammer.on("panup", function( event ) {
      doSwipe(Gamespace.UP_CODE);
    });

    hammer.on("pandown", function( event ) {
      doSwipe(Gamespace.DOWN_CODE);
    });


  };
  
  HollowCart.prototype.constructor = HollowCart;

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

  HollowCart.prototype.zoomOutMobile = function() {
    const viewport = document.querySelector('meta[name="viewport"]');

    if ( viewport ) {
      viewport.content = 'initial-scale=1';
      viewport.content = 'width=device-width';
    }
  }

  HollowCart.prototype.startMultiplayer = function(maze, networkDriver, playerNumber, detectMobile) {
    // var md = new MobileDetect(window.navigator.userAgent);
    // var canvasLength = detectMobile && md.mobile() ? 900 : 400;
    var canvasLength = window.innerWidth;
    if (window.innerHeight < canvasLength) {
      canvasLength = window.innerHeight;
    }

    canvasLength = canvasLength - 5;

    var gridLength = 12;

    this.createGameMaster(maze, networkDriver, playerNumber, canvasLength, gridLength);
    // this.zoomOutMobile();

    return this.gameMaster.getCurrentGame().getMaze();
  }


  HollowCart.prototype.createGameMaster = function (maze, networkDriver, playerNumber, 
      canvasLength, gridLength) {
    $('canvas').attr('height', canvasLength).attr('width', canvasLength);
    networkDriver = networkDriver || NullNetworkDriver;
    if (this.gameMaster != null) {
      this.gameMaster.stop();
    }

    $('.play-area').show();
    var canv, display1, display2, display3, display4, mazeGame;
    var canvas1 = $("#canvas1")[0];
    var canvas2 = $("#canvas2")[0];

    var soundDriver = null;

    this.gameMaster = new MazeGameMaster(canvas1, canvas2, this.keyboardDriver);  
    this.gameMaster
      .setSoundDriver(soundDriver)
      .setPlayerNumber(playerNumber)
      .setNetworkDriver(networkDriver)
      .addMultiplayerOnlineMazeGame()
      .setGridLength(gridLength)
      .setSquareLength(Math.floor(canvasLength / gridLength))
      .start(maze);
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

    this.gameMaster = new NeuralActivityGameMaster(canvas1, canvas2, canvas3, canvas4, canvas5, canvas6, keyboardDriver, soundDriver);
  }

  HollowCart.prototype.next = function () {
    this.gameMaster.next();
  }

  HollowCart.prototype.previous = function () {
    this.gameMaster.previous();
  }

  HollowCart.prototype.getCurrentGame = function () {
    return this.gameMaster.getCurrentGame();
  }

  return HollowCart;
}();
