"use strict";

var Square = require("./square.js");
var DisplayConstants = require('../enums/displayConstants.js');
var Alpha = require('../enums/alpha.js');

module.exports = function() {

  var BlinkingCursor = function BlinkingCursor(x, y, color, blinkFrame) {
    Square.call(this, x, y, DisplayConstants.TEXT_SIZE, color);
    this.frame = 0;
    this.blinkFrame = blinkFrame || 50;
    this.alpha = Alpha.INVISIBLE;
  };

  BlinkingCursor.prototype = Object.create(Square.prototype);
  BlinkingCursor.prototype.constructor = BlinkingCursor;

  BlinkingCursor.prototype.draw = function (renderer) {
    this.frame += 1;
    if (this.frame >= this.blinkFrame) {
      this.frame = 0;
      this.alpha = this.alpha == Alpha.OPAQUE ? Alpha.INVISIBLE : Alpha.OPAQUE;
    }

    Square.prototype.draw.call(this, renderer);
  };

  return BlinkingCursor;
}();