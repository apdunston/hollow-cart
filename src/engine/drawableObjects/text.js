"use strict";

var DrawableObject = require('./drawableObject.js');

module.exports = function() {
  // Constructor calls super
  var Text = function Text(x, y, text, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  Text.prototype = Object.create(DrawableObject.prototype);
  Text.prototype.constructor = Text;

  // Instance Method
  Text.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawText(this.x, this.y, this.text, this.color, DisplayConstants.TEXT_SIZE, Font.COURIER_NEW, this.alpha);
  };
  return Text;
}();
