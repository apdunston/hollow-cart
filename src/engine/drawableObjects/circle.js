"use strict";

var DrawableObject = require('./drawableObject.js');

module.exports = function() {
  // Constructor calls super
  var Circle = function Circle(x, y, radius, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  Circle.prototype = Object.create(DrawableObject.prototype);

  Circle.prototype.constructor = Circle;
  // Explicit Inheritance
  // Instance Method
  Circle.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawCircle(this.x, this.y, this.radius, this.color, this.alpha);
  };

  Circle.prototype.addX = function (value) {
    this.x += value;
  };

  Circle.prototype.addY = function (value) {
    this.y += value;
  };

  Circle.prototype.setX = function (value) {
    this.x = value;
  };

  Circle.prototype.setY = function (value) {
    this.y = value;
  };

  Circle.prototype.setColor = function (value) {
    this.color = value;
  };

  return Circle;
}();