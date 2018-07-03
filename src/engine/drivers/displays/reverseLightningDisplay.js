"use strict";
var Alpha = require('../../enums/alpha.js');
var LightningDisplay = require('./lightningDisplay.js');

module.exports = function() {
    
  var ReverseLightningDisplay = function ReverseLightningDisplay(renderer, framesPerSecond) {
    LightningDisplay.call(this, renderer, framesPerSecond);
    this.startingAlpha = Alpha.INVISIBLE;
    this.endingAlpha = Alpha.OPAQUE;
    this.currentAlpha = this.endingAlpha;
  };

  ReverseLightningDisplay.prototype = Object.create(LightningDisplay.prototype);
  ReverseLightningDisplay.prototype.constructor = ReverseLightningDisplay;

  ReverseLightningDisplay.prototype.applyDelta = function() {
    this.currentAlpha += this.delta;
  };

  ReverseLightningDisplay.prototype.lightningDoneCondition = function() {
    this.currentAlpha >= this.endingAlpha;
  };

  return ReverseLightningDisplay;
}();