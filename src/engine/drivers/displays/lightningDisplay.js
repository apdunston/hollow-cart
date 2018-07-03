"use strict";

/**
 * Interface Display
 * The first object added (not the background) is only drawn as lightning flashes.
 */

var Display = require('../../display.js');
var Alpha = require('../../enums/alpha.js');

module.exports = function() {

  var LightningDisplay = function LightningDisplay(renderer, framesPerSecond) {
    Display.call(this, renderer, framesPerSecond);
    this.flashProgressions = [[190], [110, 160, 175], [50, 75, 160, 210, 260], [100, 150, 165, 215, 225]];
    this.stopFrame = 300;
    this.framesPerSecond = framesPerSecond;
    this.lightningObjects = [];
    this.startingAlpha = Alpha.OPAQUE;
    this.endingAlpha = Alpha.INVISIBLE;
    this.currentAlpha = this.endingAlpha;
    this.delta = 0.009;
    this.resetLightning();
  };

  // Explicit Inheritance
  LightningDisplay.prototype = Object.create(Display.prototype);
  LightningDisplay.prototype.constructor = LightningDisplay;

  LightningDisplay.prototype.applyDelta = function() {
    this.currentAlpha -= this.delta;
  };

  LightningDisplay.prototype.clear = function() {
    this.lightningObjects = [];
    this.objects = [];
    this.addObject(this.backgroundObject);
  };

  LightningDisplay.prototype.render = function() {
    Display.prototype.render.call(this);

    if (this.lightningObjects.length > 0 && this.flashing) {
      this.advanceLightning();
    } else {
      if (Math.floor(Math.random() * 200) === 1) {
        this.goLightning();
      }
    }
    this.drawLightning();
  };

  LightningDisplay.prototype.advanceLightning = function() {
    this.currentFlashFrame += 1;

    if (this.flashFrames.includes(this.currentFlashFrame)) {
      this.currentAlpha = Alpha.TRANSLUCENT;
    }

    if (this.currentFlashFrame >= this.stopFrame) {
      this.currentAlpha = this.endingAlpha;
      this.resetLightning();
      return;
    }

    this.applyDelta();
  };

  LightningDisplay.prototype.grabFlashFrames = function() {
    var index = Math.floor(Math.random() * this.flashProgressions.length);
    this.flashFrames = this.flashProgressions[index];
  };

  LightningDisplay.prototype.lightningDoneCondition = function() {
    this.currentAlpha <= this.endingAlpha;
  };

  LightningDisplay.prototype.drawLightning = function() {
    if (this.lightningDoneCondition()) {
      this.currentAlpha = this.endingAlpha;
    }

    for (var x = 0; x < this.lightningObjects.length; x += 1) {
      this.lightningObjects[x].setAlpha(this.currentAlpha);
      this.lightningObjects[x].draw(this.renderer);
      if (this.lightningObjects[x].isDone()) {
        this.lightningObjects.splice(x, 1);
      }
    }
  };

  LightningDisplay.prototype.resetLightning = function() {
    this.flashing = false;
    this.currentFlashFrame = 0;
  };

  LightningDisplay.prototype.goLightning = function() {
    var self = this;
    this.grabFlashFrames();
    this.currentAlpha = this.startingAlpha;
    this.flashing = true;
  };

  LightningDisplay.prototype.addLightningObject = function (object) {
    this.lightningObjects.push(object);
  };

  return LightningDisplay;
}();