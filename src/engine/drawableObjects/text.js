"use strict";

var DrawableObject = require('./drawableObject.js');
var Font = require('./font.js');
var DisplayConstants = require('../enums/displayConstants.js');

module.exports = function() {
  // Constructor calls super
  var Text = function Text(x, y, text, color, alpha, size) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = alpha;
    this.size = size;
    if (!this.size) {
      DisplayConstants.TEXT_SIZE;
    }
  };

  // Explicit Inheritance
  Text.prototype = Object.create(DrawableObject.prototype);
  Text.prototype.constructor = Text;

  // Instance Method
  Text.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawText(this.x, this.y, this.text, this.color, this.size, Font.COURIER_NEW, this.alpha);
  };

  Text.prototype.setText = function(value) {
    this.text = value;
  }

  Text.prototype.setX = function(value) {
    this.x = value;
  }

  Text.prototype.setY = function(value) {
    this.y = value;
  }

  Text.prototype.setSize = function(value) {
    this.size = value;
  }

  return Text;
}();
