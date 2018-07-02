"use strict";

var DrawableObject = require('./drawableObject.js');

module.exports = function() {
  // Constructor calls super
  var Rectangle = function Rectangle(x, y, length, width, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  Rectangle.prototype = Object.create(DrawableObject.prototype);

  Rectangle.prototype.constructor = Rectangle;

  // Instance Method
  Rectangle.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawRectangle(this.x, this.y, this.length, this.width, this.color, this.alpha);
  };

  Rectangle.prototype.setColor = function (value) {
    this.color += value;
  };

  Rectangle.prototype.addX = function (value) {
    this.x += value;
  };

  Rectangle.prototype.addY = function (value) {
    this.y += value;
  };

  Rectangle.prototype.setX = function (value) {
    this.x = value;
  };

  Rectangle.prototype.setY = function (value) {
    this.y = value;
  };

  Rectangle.prototype.setColor = function (value) {
    this.color = value;
  };

  Rectangle.prototype.setLength = function(value) {
    this.length = value;
  }

  Rectangle.prototype.setWidth = function(value) {
    this.width = value;
  }

  return Rectangle;
}();