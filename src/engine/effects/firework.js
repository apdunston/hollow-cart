"use strict";

/**
 * Interface GameObject
 * Interface DisplayObject
 */

var Ring = require('./ring.js');
var Sparkle = require('./sparkle.js');

module.exports = function() {
  var Firework = function Firework(canvasLength) {
    this.sparkleDuration = 20;
    this.frameCount = 0;
    this.maxFrameCount = 120;
    this.totalRings = 4;
    this.framesPerNewRing = 8;
    this.canvasLength = canvasLength;
    this.squareLength = canvasLength / 20 - canvasLength / 200;
    this.offset = this.squareLength + 2;

    this.x = Math.floor(Math.random() * canvasLength);
    this.y = Math.floor(Math.random() * canvasLength);

    this.sparkles = [new Sparkle(this.x, this.y, this.squareLength, this.sparkleDuration)];
    this.rings = [];
  };

  Firework.prototype.getDisplayObjects = function () {
    return [this];
  };

  Firework.prototype.draw = function (renderer) {
    var smallerLength = this.squareLength * .7;
    var i;
    this.frameCount += 1;

    for (i = 0; i < this.sparkles.length; i++) {
      this.sparkles[i].draw(renderer);
    }

    for (i = 0; i < this.rings.length; i++) {
      this.rings[i].draw(renderer);
    }

    var ringOffset = this.frameCount / this.framesPerNewRing;
    if (this.frameCount % this.framesPerNewRing == 0 && ringOffset <= this.totalRings) {
      this.rings.push(new Ring(this.x, this.y, this.offset, ringOffset, this.sparkleDuration));
    }
  };

  Firework.prototype.isDone = function () {
    // return false;
    return this.frameCount > this.maxFrameCount;
  };

  return Firework;
}();