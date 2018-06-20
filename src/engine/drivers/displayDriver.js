"use strict";

var Font = require('../drawableObjects/font.js');

module.exports = function () {
  var _alphaWrap = function _alphaWrap(self, alpha, fn) {
    if (alpha !== undefined) {
      self.context.globalAlpha = alpha;
    }

    fn(self);

    self.context.globalAlpha = 1.0;
  };

  var DisplayDriver = function DisplayDriver(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  };

  DisplayDriver.prototype.constructor = DisplayDriver;

  DisplayDriver.prototype.getWidth = function () {
    return this.canvas.width;
  };

  DisplayDriver.prototype.drawRectangle = function (x, y, xLength, yWidth, color, alpha) {
    _alphaWrap(this, alpha, function (self) {
      self.context.fillStyle = color;
      self.context.fillRect(x, y, xLength, yWidth);
    });
  };

  DisplayDriver.prototype.drawSquare = function (x, y, length, color, alpha) {
    this.drawRectangle(x, y, length, length, color, alpha);
  };

  DisplayDriver.prototype.drawCircle = function (x, y, radius, color, alpha) {
    _alphaWrap(this, alpha, function (self) {
      self.context.fillStyle = color;
      self.context.beginPath();
      self.context.arc(x, y, radius, 0, 2 * Math.PI);
      self.context.fill();
    });
  };

  DisplayDriver.prototype.drawText = function (x, y, text, color, size, font, alpha) {
    font = font || "Courier New";
    if (!Font.isValid(font)) {
      throw font + " is an invalid font.";
    }

    _alphaWrap(this, alpha, function (self) {
      self.context.font = size + "px " + font;
      self.context.fillStyle = color;
      self.context.fillText(text, x, y);
    });
  };

  DisplayDriver.prototype.drawLine = function (x1, y1, x2, y2, color, width, alpha) {
    width = width || 2;

    _alphaWrap(this, alpha, function (self) {
      self.context.strokeStyle = color;
      self.context.lineWidth = width;
      self.context.beginPath();
      self.context.moveTo(x1, y1);
      self.context.lineTo(x2, y2);
      self.context.stroke();
    });
  };

  return DisplayDriver;
}();