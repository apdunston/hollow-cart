"use strict";

/**
 * Interface DisplayObject
 */

var Square = require('../drawableObjects/square.js');
var Gamespace = require('../gamespace.js');

module.exports = function() {
  var Sparkle = function Sparkle(x, y, squareLength, duration, colorIndex) {
    this.x = x;
    this.y = y;
    this.squareLength = squareLength;

    this.drawable = new Square(this.x, this.y, this.squareLength, Gamespace.rainbow[0]);
    this.maxFrameCount = duration !== undefined ? duration : 15;
    this.frameCount = 0;
    this.framesPerColorChange = 5;
    this.startColor = colorIndex ? colorIndex : 0;
  };

  Sparkle.prototype.colorForFramecount = function (count) {
    // return Gamespace.rainbow[0];
    return Gamespace.rainbow[Math.floor(count / this.framesPerColorChange) + this.startColor % Gamespace.rainbow.length];
  };

  Sparkle.prototype.isHalfDone = function () {
    return this.frameCount > this.maxFrameCount / 2;
  };

  Sparkle.prototype.isDone = function () {
    return this.frameCount > this.maxFrameCount;
  };

  Sparkle.prototype.draw = function (renderer) {
    var xPlus, newColor;

    if (this.frameCount <= this.maxFrameCount) {
      this.frameCount += 1;
      this.drawable.draw(renderer);
      xPlus = this.isHalfDone() ? -1 : 1;
      this.drawable.addY(xPlus);
      newColor = this.colorForFramecount(this.frameCount);
      this.drawable.setColor(newColor);
    }
  };

  Sparkle.prototype.getFrameCount = function () {
    return this.frameCount;
  };

  return Sparkle;
}();