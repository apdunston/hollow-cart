"use strict";

var $ = require("jquery");
var Hammer = require("hammerjs");
require("jquery-visible");

var KeyboardDriver = require('./drivers/keyboardDriver.js');
var NullNetworkDriver = require('./drivers/nullNetworkDriver.js');
var TwoPlayerGameMaster = require('./gameMasters/twoPlayerGameMaster.js');
var TrustContentGameMaster = require('./gameMasters/trustContentGameMaster.js');
var MazeGameMaster = require('./gameMasters/mazeGameMaster.js');
var SingleDisplayGameMaster = require('./gameMasters/singleDisplayGameMaster.js');
var NeuralActivityGameMaster = require('./gameMasters/neuralActivityGameMaster.js');
var Gamespace = require('./gamespace.js');

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
      event.preventDefault();
      doSwipe(Gamespace.LEFT_CODE);
    });

    hammer.on("panright", function( event ) {
      event.preventDefault();
      doSwipe(Gamespace.RIGHT_CODE);
    });

    hammer.on("panup", function( event ) {
      event.preventDefault();
      doSwipe(Gamespace.UP_CODE);
    });

    hammer.on("pandown", function( event ) {
      event.preventDefault();
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

  HollowCart.prototype.startSingleDisplay = function(maze, networkDriver, playerNumber, 
      detectMobile) {
    var canvasLength = window.innerWidth;
    if (window.innerHeight < canvasLength) {
      canvasLength = window.innerHeight;
    }

    canvasLength = canvasLength - 75;

    var gridLength = 12;
    var canvases = [$("#canvas1")[0]];

    $('canvas').attr('height', canvasLength).attr('width', canvasLength);
    networkDriver = networkDriver || NullNetworkDriver;
    if (this.gameMaster != null) {
      this.gameMaster.stop();
    }

    $('.play-area').show();

    var soundDriver = null;

    this.gameMaster = new SingleDisplayGameMaster(canvases, this.keyboardDriver)
      .setSoundDriver(soundDriver)
      .setPlayerNumber(playerNumber)
      .setNetworkDriver(networkDriver);
    this.gameMaster
      .addMazeGame()
      .setGridLength(gridLength)
      .setSquareLength(Math.floor(canvasLength / gridLength))
      .start(maze);
  }


  HollowCart.prototype.adjustCanvas = function() {
    var canvas = $('canvas');
    console.log(canvas);

    var canvasLength = window.innerWidth;
    if (window.innerHeight < canvasLength) {
      canvasLength = window.innerHeight;
    }

    canvasLength = canvasLength - 75;
    canvas.attr('height', canvasLength).attr('width', canvasLength);
    
    while (canvasLength > 0 && !canvas.visible()) {
      canvasLength -= 5;
      canvas.attr('height', canvasLength).attr('width', canvasLength);
    }

    if (canvasLength <= 0) {
      throw "Couldn't get canvas fully onscreen.";
    }

    return canvasLength;
  }

  HollowCart.prototype.startTrustContent = function(maze, networkDriver, playerNumber) {
    var gridLength = 12;
    $('.play-area').show();

    var canvasLength = this.adjustCanvas();

    networkDriver = networkDriver || NullNetworkDriver;
    if (this.gameMaster != null) {
      this.gameMaster.stop();
    }


    var soundDriver = null;

    this.gameMaster = new TrustContentGameMaster($('canvas')[0], this.keyboardDriver)
      .setSoundDriver(soundDriver)
      .setPlayerNumber(playerNumber)
      .setNetworkDriver(networkDriver);

    this.gameMaster
      .setGridLength(gridLength)
      .setSquareLength(Math.floor(canvasLength / gridLength))
      .start(maze);
  }


  HollowCart.prototype.startMultiplayer = function(maze, networkDriver, playerNumber, detectMobile) {
    var canvasLength = window.innerWidth;
    if (window.innerHeight < canvasLength) {
      canvasLength = window.innerHeight;
    }

    canvasLength = canvasLength - 75;

    var gridLength = 12;
    var canvases = [$("#canvas1")[0], $("#canvas2")[0]];

    this.createGameMaster(canvases, maze, networkDriver, playerNumber, canvasLength, gridLength);
    // this.zoomOutMobile();

    return this.gameMaster.getCurrentGame().getMaze();
  }


  HollowCart.prototype.createGameMaster = function (canvases, maze, networkDriver, playerNumber, 
      canvasLength, gridLength) {
    $('canvas').attr('height', canvasLength).attr('width', canvasLength);
    networkDriver = networkDriver || NullNetworkDriver;
    if (this.gameMaster != null) {
      this.gameMaster.stop();
    }

    $('.play-area').show();

    var soundDriver = null;

    this.gameMaster = new MazeGameMaster(canvases, this.keyboardDriver);  
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
