"use strict";

var DrawableObject = require('../drawableObjects/drawableObject.js');
var Alpha = require('../enums/alpha.js');
var GridTranslator = require('../gridTranslator.js');
var Gamespace = require('../gamespace.js');
var Rectangle = require("../drawableObjects/rectangle.js");

module.exports = function() {
  var Key = function Key(x, y, squareLength, gridTranslator) {
    DrawableObject.call(this);
    this.squareLength = squareLength;
    this.alpha = Alpha.OPAQUE;
    this.gridTranslator = gridTranslator || new GridTranslator(0, 0, squareLength);

    var length = Math.ceil(squareLength * 2 / 3);
    var width = Math.ceil(squareLength / 5);
    this.rectangle = new Rectangle(0, 0, length, width, Gamespace.GREEN);

    this.setX(x);
    this.setY(y);
  };

  // Explicit Inheritance
  Key.prototype = Object.create(DrawableObject.prototype);
  Key.prototype.constructor = Key;

  Key.prototype.setX = function(value) {
    this.x = value;
    var xInPixels = this.gridTranslator.xInPixels(value);
    xInPixels += Math.ceil(this.squareLength / 6);
    this.rectangle.setX(xInPixels);
  }
  
  Key.prototype.setY = function(value) {
    this.y = value;
    var yInPixels = this.gridTranslator.yInPixels(value);
    yInPixels += Math.ceil(this.squareLength / 2.5);
    this.rectangle.setY(yInPixels);
  }

  Key.prototype.getX = function() {
      return this.x;
  }

  Key.prototype.getY = function() {
      return this.y;
  }

  Key.prototype.isDone = function() {
    return false;
  };

  Key.prototype.getDisplayObjects = function() {
    return [this];
  };

  Key.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);

    this.rectangle.draw(renderer);
  };

  /**
   * Note that we're converting drawMap player location to drawMap spaces. This reverses x and y.
   */
  Key.prototype.validMove = function (x, y, direction) {
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

  return Key;
}();