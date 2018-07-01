"use strict";

/**
 * Interface DisplayObject
 */

var Square = require('../drawableObjects/square.js');
var Gamespace = require('../gamespace.js');

module.exports = function() {
  var Spark = function Spark(display, x, y, squareLength, duration, colorIndex) {
    this.x = x;
    this.y = y;
    this.squareLength = squareLength;

    this.maxFrameCount = duration !== undefined ? duration : 15;
    this.frameCount = 0;
    this.framesPerColorChange = 5;
    this.colorIndex = colorIndex;
    this.drawable = new Square(this.x, this.y, this.squareLength, colorIndex);
    this.display = display;
    this.display.addObject(this);
  };

  Spark.prototype.isHalfDone = function () {
    return this.frameCount > this.maxFrameCount / 2;
  };

  Spark.prototype.isDone = function () {
    return this.frameCount > this.maxFrameCount;
  };

  Spark.prototype.draw = function (renderer) {
    var xPlus, newColor;
    // console.log("MaxFrameCount: " + this.maxFrameCount + " FrameCount: " + this.frameCount);

    if (this.frameCount <= this.maxFrameCount) {
      this.frameCount += 1;
      this.drawable.draw(renderer);
      
      // Shrink to 90%
      this.drawable.setLength(Math.ceil(this.squareLength * Math.pow(0.9, this.frameCount)));
    //   xPlus = this.isHalfDone() ? -1 : 1;
    //   this.drawable.addY(xPlus);
    //   newColor = this.colorForFramecount(this.frameCount);
    //   this.drawable.setColor(newColor);
    } else {
        this.display.removeObject(this);
    }
  };

  Spark.prototype.getFrameCount = function () {
    return this.frameCount;
  };

  return Spark;
}();