"use strict";

/**
 * Interface DisplayObject
 */

var Square = require('../drawableObjects/square.js');

module.exports = function() {
  var Spark = function Spark(display, x, y, squareLength, duration, colorIndex) {
    this.x = x;
    this.y = y;
    this.squareLength = squareLength;

    this.duration = duration;
    this.maxFrameCount = duration !== undefined ? duration : 15;
    this.frameCount = 0;
    this.framesPerColorChange = 5;
    this.colorIndex = colorIndex;
    this.drawable = new Square(this.x, this.y, this.squareLength, colorIndex);
    this.display = display;
    this.display.addObject(this);
  };

  Spark.prototype.isHalfDone = function() {
    return this.frameCount > this.maxFrameCount / 2;
  };

  Spark.prototype.isDone = function() {
    return this.frameCount > this.maxFrameCount;
  };

  Spark.prototype.draw = function (renderer) {
    if (this.frameCount <= this.maxFrameCount) {
      this.frameCount += 1;
      this.drawable.draw(renderer);
      
      // Shrink to 99.5%
      var percentageToShrink = 1 - (1 / this.duration);
      var newLength = Math.ceil(this.squareLength * Math.pow(percentageToShrink, this.frameCount));

      // Shift so that it shrinks from the middle
      var halfDifference = Math.floor((this.drawable.getLength() - newLength) / 2);
      this.squareLength = newLength;
      this.drawable.setLength(newLength);
      this.drawable.addX(halfDifference);
      this.drawable.addY(halfDifference);
      this.x += halfDifference;
      this.y += halfDifference;

    } else {
        this.display.removeObject(this);
    }
  };

  Spark.prototype.getFrameCount = function() {
    return this.frameCount;
  };

  return Spark;
}();