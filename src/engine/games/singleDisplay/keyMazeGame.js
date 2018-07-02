"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 */

var SingleDisplayMazeGame = require('./mazeGame.js');
var MazeData = require('../../mazeData.js');
var Maze = require('../../gameObjects/maze.js');
var Player = require('../../gameObjects/player.js');
var Key = require('../../gameObjects/key.js');
var Circle = require('../../drawableObjects/circle.js');


module.exports = function () {
  var KeyMazeGame = function KeyMazeGame(keyboardDriver, display, gridLength, 
      squareLength) {
    var self = this;
    SingleDisplayMazeGame.call(self, keyboardDriver, display, gridLength, squareLength);
  };

  KeyMazeGame.prototype = Object.create(SingleDisplayMazeGame.prototype);

  KeyMazeGame.prototype.clearDisplays = function () {
    this.display.clear();
    this.display.addObject(this.maze);
    this.display.addObject(this.player);
    this.display.addObject(this.goalObject);
    this.display.addObject(this.key);
    this.drawLoop();
  };

  KeyMazeGame.prototype.reset = function () {
    this.won = false;
    this.map = MazeData.generate(this.gridLength, this.gridLength);
    this.drawMap = MazeData.translate(this.map);
    this.maze = new Maze(this.drawMap, this.squareLength);
    this.player = new Player(this.gridLength, this.squareLength, this);
    var goalSquareLocation = this.gridLength * this.squareLength - this.squareLength / 2;
    this.goalObject = new Circle(goalSquareLocation, goalSquareLocation, this.squareLength / 4, "green");
    this.key = new Key(5, 5, this.squareLength, this.gridTranslator);
    this.clearDisplays();
  };

  var playerAtKey = function(player, key) {
    return !player.has(key) &&
      player.getX() === key.getX() &&
      player.getY() === key.getY() ;
  }

  var moveKeyWithPlayer = function(key, player) {
    key.setX(player.getX());
    key.setY(player.getY());
  }

  KeyMazeGame.prototype.performMove = function(move) {
    var self = this;
    var success = move();

    if (playerAtKey(this.player, this.key)) {
      this.player.addToInventory(this.key);
    }

    if (this.player.has(this.key)) {
      moveKeyWithPlayer(this.key, this.player);
    }

    if (self.winCondition()) {
      self.win();
    }

    this.continueMovement(self, move, success);
  };

  KeyMazeGame.prototype.winCondition = function () {
    return this.player.has(this.key) && 
      (this.player.x === this.gridLength - 1) && 
      (this.player.y === this.gridLength - 1);
  };

  return KeyMazeGame;
}();



