"use strict";

var DrawableObjectState = require('./drawableObjectState.js');
var Alpha = require('../enums/alpha.js');
var Colors = require('../enums/colors.js');

module.exports = function() {
  var DrawableObject = function DrawableObject() {
    this.alpha = Alpha.OPAQUE;
    this.isDoneValue = false;
    this.state = DrawableObjectState.STATIC;
    this.fadeDelta = 0.02;
    this.color = Colors.WHITE;
    this.callback = function() {};
  };

  DrawableObject.prototype.constructor = DrawableObject;

  DrawableObject.prototype.isDone = function() {
    return this.isDoneValue;
  };

  DrawableObject.prototype.setAlpha = function (value) {
    this.alpha = value;
  };

  DrawableObject.prototype.setIsDone = function (value) {
    this.isDoneValue = value;
  };

  DrawableObject.prototype.fadeIn = function() {
    this.state = DrawableObjectState.FADING_IN;
  };

  DrawableObject.prototype.fadeOut = function() {
    this.state = DrawableObjectState.FADING_OUT;
  };

  DrawableObject.prototype.draw = function() {
    if (this.state === DrawableObjectState.FADING_IN) {
      this.fadeInStep();
    }

    if (this.state === DrawableObjectState.FADING_OUT) {
      this.fadeOutStep();
    }
  };

  DrawableObject.prototype.fadeInStep = function() {
    if (this.alpha >= Alpha.OPAQUE) {
      this.state = DrawableObjectState.STATIC;
      this.alpha = Alpha.OPAQUE;
      return;
    }

    this.alpha += this.fadeDelta;
  };

  DrawableObject.prototype.fadeOutStep = function() {
    if (this.alpha <= this.fadeDelta) {
      this.alpha = Alpha.INVISIBLE;
      this.state = DrawableObjectState.STATIC;
      return;
    }

    this.alpha -= this.fadeDelta;
  };

  DrawableObject.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  };

  return DrawableObject;
}();