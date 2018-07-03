"use strict";

/**
 * Interface GameObject
 * Interface DisplayObject
 */

var DrawableObject = require('../drawableObjects/drawableObject.js');
var Alpha = require('../enums/alpha.js');
var GridTranslator = require('../gridTranslator.js');
var Gamespace = require('../gamespace.js');

module.exports = function() {
  var Maze = function Maze(drawMap, squareLength, gridTranslator) {
    DrawableObject.call(this);
    this.drawMap = drawMap;
    this.squareLength = squareLength;
    this.gridLength = this.drawMap.horizontalSpaces.length - 1;
    this.alpha = Alpha.OPAQUE;
    this.gridTranslator = gridTranslator || new GridTranslator(0, 0, squareLength);
  };

  // Explicit Inheritance
  Maze.prototype = Object.create(DrawableObject.prototype);
  Maze.prototype.constructor = Maze;

  Maze.prototype.isDone = function() {
    return false;
  };

  Maze.prototype.getDisplayObjects = function() {
    return [this];
  };

  Maze.prototype.setAlpha = function (value) {
    this.alpha = value;
  };

  Maze.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);

    for (var i = 0; i < this.drawMap.horizontalSpaces.length; i += 1) {
      this.gridTranslator.drawHorizontalRow(i, this.drawMap.horizontalSpaces[i], renderer, this.alpha);
    }

    for (var i = 0; i < this.drawMap.verticalSpaces.length; i += 1) {
      this.gridTranslator.drawVerticalRow(i, this.drawMap.verticalSpaces[i], renderer, this.alpha);
    }
  };

  /**
   * Note that we're converting drawMap player location to drawMap spaces. This reverses x and y.
   */
  Maze.prototype.validMove = function (x, y, direction) {
    switch (direction) {
      case Gamespace.UP:
        return this.drawMap.horizontalSpaces[y][x];
      case Gamespace.DOWN:
        return this.drawMap.horizontalSpaces[y + 1][x];
      case Gamespace.LEFT:
        return this.drawMap.verticalSpaces[y][x];
      case Gamespace.RIGHT:
        return this.drawMap.verticalSpaces[y][x + 1];
    }
    return false;
  };

  return Maze;
}();