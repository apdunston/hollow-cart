"use strict";

var DrawableObject = require('./drawableObject.js');

module.exports = function() {
  // Constructor calls super
  var Square = function Square(x, y, length, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  Square.prototype = Object.create(DrawableObject.prototype);

  Square.prototype.constructor = Square;

  // Instance Method
  Square.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawSquare(this.x, this.y, this.length, this.color, this.alpha);
  };

  Square.prototype.setColor = function (value) {
    this.color += value;
  };

  Square.prototype.addX = function (value) {
    this.x += value;
  };

  Square.prototype.addY = function (value) {
    this.y += value;
  };

  Square.prototype.setX = function (value) {
    this.x = value;
  };

  Square.prototype.setY = function (value) {
    this.y = value;
  };

  Square.prototype.setColor = function (value) {
    this.color = value;
  };

  Square.prototype.setLength = function(value) {
    this.length = value;
  }

  Square.prototype.getLength = function() {
    return this.length;
  }

  return Square;
}();