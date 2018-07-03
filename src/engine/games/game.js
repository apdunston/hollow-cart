"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 *
 * Object responsibility: Communicate state changes between player, displays, keyboardDriver, 
 * and gameMaster
 * 
 * A series of meaningful choices played out across 1 or more displays
 * using only arrow keys. 
 * 
 * Non-assumptions
 * - Not necessarily played on a grid.
 * 
 */

var Game = function Game() {
  var self = this;
  this.displays = [];
  this.keyboardDriver = null;
  this.gameEndListeners = [];
  this.running = false;
};

Game.prototype.start = function() {
  for (var i = 0; i < this.displays.length; i++) {
    this.displays[i].start();
  }

  this.keyboardDriver.addKeyDownListener(this);
  this.running = true;
};

Game.prototype.stop = function() {
  if (!this.running) {
    return;
  }

  for (var i = 0; i < this.displays.length; i++) {
    this.displays[i].clear();
    this.displays[i].stop();
  }

  this.keyboardDriver.removeKeyDownListener(this);
  this.running = false;
};

Game.prototype.gameLoop = function() {
  // method stuff
};

Game.prototype.keyDown = function() {
  // method stuff
};

Game.prototype.addGameEndListener = function (gameEndListener) {
  this.gameEndListeners.push(gameEndListener);
};

Game.prototype.gameEnd = function (data) {
  for (var i = 0; i < this.gameEndListeners.length; i++) {
    this.gameEndListeners[i].gameEnd(data);
  }
};

Game.prototype.successfulMoveEvent = function() {
  // method stuff
};

Game.prototype.validMove = function (x, y, direction) {
  return true;
};

module.exports = Game;