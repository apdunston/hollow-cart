"use strict";

/**
 * Interface GameObject
 * 
 * A square moving on a grid.
 */

var GridTranslator = require('../gridTranslator.js');
var Square = require('../drawableObjects/square.js');
var Gamespace = require('../gamespace.js');

module.exports = function() {

  // Private
  var _wrapPosition = function _wrapPosition(self) {
    if (self.x < 0) {
      self.x = self.gridLength - 1;
    }
    if (self.x > self.gridLength - 1) {
      self.x = 0;
    }
    if (self.y < 0) {
      self.y = self.gridLength - 1;
    }
    if (self.y > self.gridLength - 1) {
      self.y = 0;
    }
  };

  // Public
  var Entity = function Entity(gridLength, squareLength, game, color, gridTranslator) {
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.gridLength = gridLength;
    this.game = game;
    this.squareLength = squareLength;
    var shrinkage = Math.floor(this.squareLength/3);
    var size = squareLength - shrinkage;
    this.bump = Math.floor(shrinkage / 2);
    this.gridTranslator = gridTranslator || new GridTranslator(0, 0, squareLength);
    this.square = new Square(0, 0, size, this.color);
    this.positionDrawableObject();
  };

  Entity.prototype.positionDrawableObject = function() {
    var xPixels = this.gridTranslator.xInPixels(this.x) + this.bump;
    var yPixels = this.gridTranslator.yInPixels(this.y) + this.bump;
    this.square.setPosition(xPixels, yPixels);
  };

  Entity.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
    this.positionDrawableObject();
  };

  Entity.prototype.setColor = function (color) {
    this.color = color;
    this.square.setColor(color);
  };

  Entity.prototype.move = function (direction) {
    if (this.game.validMove(this.x, this.y, direction)) {
      switch (direction) {
        case Gamespace.UP:
          this.y = this.y - 1;break;
        case Gamespace.DOWN:
          this.y = this.y + 1;break;
        case Gamespace.LEFT:
          this.x = this.x - 1;break;
        case Gamespace.RIGHT:
          this.x = this.x + 1;break;
      }

      _wrapPosition(this);
      this.positionDrawableObject();
      return true;
    } else {
      return false;
    }
  };

  Entity.prototype.collidesWith = function (entity) {
    return this.x === entity.getX() && this.y === entity.getY();
  };

  Entity.prototype.getX = function() {
    return this.x;
  };
  Entity.prototype.getY = function() {
    return this.y;
  };
  Entity.prototype.up = function() {
    return this.move(Gamespace.UP);
  };
  Entity.prototype.down = function() {
    return this.move(Gamespace.DOWN);
  };
  Entity.prototype.left = function() {
    return this.move(Gamespace.LEFT);
  };
  Entity.prototype.right = function() {
    return this.move(Gamespace.RIGHT);
  };
  Entity.prototype.isDone = function() {
    return false;
  };
  Entity.prototype.draw = function (renderer) {
    this.square.draw(renderer);
  };
  Entity.prototype.getDisplayObjects = function() {
    return [this.square];
  };
  return Entity;
}();