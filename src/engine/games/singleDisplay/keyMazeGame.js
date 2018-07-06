"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 */

var SingleDisplayMazeGame = require('./mazeGame.js');
var MazeData = require('../../mazeData.js');
var Maze = require('../../gameObjects/maze.js');
var Player = require('../../gameObjects/player.js');
var Item = require('../../gameObjects/item.js');
var Circle = require('../../drawableObjects/circle.js');

module.exports = function() {
  var KeyMazeGame = function KeyMazeGame(keyboardDriver, display, gridLength, 
      squareLength, score) {
    var self = this;
    SingleDisplayMazeGame.call(self, keyboardDriver, display, gridLength, 
      squareLength, score);
  };

  KeyMazeGame.prototype = Object.create(SingleDisplayMazeGame.prototype);
  KeyMazeGame.prototype.constructor = KeyMazeGame;

  KeyMazeGame.prototype.start = function() {
    SingleDisplayMazeGame.prototype.start.call(this);
  }

  KeyMazeGame.prototype.clearDisplays = function() {
    SingleDisplayMazeGame.prototype.clearDisplays.call(this);
    this.display.addObject(this.key);
  };

  var upTo = function(num) {
    return Math.floor(Math.random() * (num));
  };

  var placeKey = function(self) {
    var x = upTo(self.gridLength);
    var y = upTo(self.gridLength);

    // Don't put key on door.
    if (x == self.gridLength && y == self.gridLength) {
      return placeKey(self);
    }

    self.key = new Item(x, y, self.squareLength, self.gridTranslator);
  }

  KeyMazeGame.prototype.reset = function() {
    placeKey(this);
    SingleDisplayMazeGame.prototype.reset.call(this);
  };

  var playerAtKey = function(player, key) {
    return !player.has(key) &&
      player.getX() === key.getX() &&
      player.getY() === key.getY() ;
  }

  KeyMazeGame.prototype.performMove = function(move) {
    var self = this;
    SingleDisplayMazeGame.prototype.performMove.call(self, move);

    if (self.winCondition()) {
      return;
    }

    if (playerAtKey(this.player, this.key)) {
      this.player.addToInventory(this.key);
    }
  };

  KeyMazeGame.prototype.winCondition = function() {
    return this.player.has(this.key) && 
      (this.player.x === this.gridLength - 1) && 
      (this.player.y === this.gridLength - 1);
  };

  return KeyMazeGame;
}();



