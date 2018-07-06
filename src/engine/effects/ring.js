"use strict";

/**
 * Interface DisplayObject
 */

var Sparkle = require('./sparkle.js');
var Colors = require('../enums/colors.js');

module.exports = function() {

  var Ring = function Ring(x, y, squareLength, offset, sparkleDuration) {
    var i, sparkleSize, pixelsSmaller, colorIndex;
    this.x = x;
    this.y = y;
    this.squareLength = squareLength;
    this.offset = offset;
    this.sparkles = [];
    this.isDoneValue = false;
    colorIndex = Math.floor(Math.random() * Colors.rainbow.length);
    switch (offset) {
      case 1:
        pixelsSmaller = 8;break;
      case 2:
        pixelsSmaller = 10;break;
      default:
        pixelsSmaller = 10 + 2 * (offset - 1);break;
    }

    sparkleSize = squareLength - pixelsSmaller;
    sparkleSize = sparkleSize < squareLength ? sparkleSize : 2;

    var applyOffset = function applyOffset(value, iteration) {
      return value - squareLength * offset + squareLength * iteration + pixelsSmaller / 2;
    };

    var moveToOneSide = function moveToOneSide(value) {
      return value - offset * squareLength + pixelsSmaller / 2;
    };

    var moveToOtherSide = function moveToOtherSide(value) {
      return value + offset * squareLength + pixelsSmaller / 2;
    };

    for (i = 0; i < offset * 2 + 1; i += 1) {
      // top
      this.sparkles.push(new Sparkle(applyOffset(x, i), moveToOneSide(y), sparkleSize, sparkleDuration, colorIndex));

      // bottom
      this.sparkles.push(new Sparkle(applyOffset(x, i), moveToOtherSide(y), sparkleSize, sparkleDuration, colorIndex));

      if (i > 0 && i <= offset * 2 - 1) {
        var newY = applyOffset(y, i) - 1;
        // left
        this.sparkles.push(new Sparkle(moveToOneSide(x), applyOffset(y, i), sparkleSize, sparkleDuration, colorIndex));

        // right
        this.sparkles.push(new Sparkle(moveToOtherSide(x), applyOffset(y, i), sparkleSize, sparkleDuration, colorIndex));
      }
    }
  };

  Ring.prototype.draw = function (renderer) {
    this.isDoneValue = true;
    for (var i = 0; i < this.sparkles.length; i += 1) {
      if (!this.sparkles[i].isDone()) {
        this.sparkles[i].draw(renderer);
        this.isDoneValue = false;
      }
    }
  };

  Ring.prototype.isDone = function() {
    return this.isDoneValue;
  };

  return Ring;
}();