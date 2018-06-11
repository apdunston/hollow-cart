"use strict";

/**
 * Interface Renderer
 */

module.exports = function() {
  var GridTranslator = function GridTranslator(xOffset, yOffset, squareLength) {

    // Overload - if you pass in gridtranslator data, initialize off that data
    if (typeof(xOffset) == "object") {
      this.xOffSet = xOffset.xOffset;
      this.yOffset = xOffset.yOffset;
      this.squareLength = xOffset.squareLength;
    } else {
      this.xOffset = xOffset;
      this.yOffset = yOffset;
      this.squareLength = squareLength;
    }
  };

  GridTranslator.prototype.constructor = GridTranslator;

  GridTranslator.prototype.drawLine = function (renderer, x, y, xAddend, yAddend, alpha) {
    x = x * this.squareLength + this.xOffset;
    y = y * this.squareLength + this.yOffset;
    renderer.drawLine(x, y, x + xAddend, y + yAddend, "blue", 2, alpha);
  };

  GridTranslator.prototype.drawHorizontalLine = function (x, y, renderer, alpha) {
    this.drawLine(renderer, x, y, this.squareLength, 0, alpha);
  };

  GridTranslator.prototype.drawVerticalLine = function (x, y, renderer, alpha) {
    this.drawLine(renderer, x, y, 0, this.squareLength, alpha);
  };

  GridTranslator.prototype.drawHorizontalRow = function (y, row, renderer, alpha) {
    for (var x = 0; x < row.length; x += 1) {
      if (!row[x]) {
        this.drawHorizontalLine(x, y, renderer, alpha);
      }
    }
  };

  GridTranslator.prototype.drawVerticalRow = function (y, row, renderer, alpha) {
    for (var x = 0; x < row.length; x += 1) {
      if (!row[x]) {
        this.drawVerticalLine(x, y, renderer, alpha);
      }
    }
  };

  GridTranslator.prototype.xInPixels = function (value) {
    return value * this.squareLength + this.xOffset;
  };

  GridTranslator.prototype.yInPixels = function (value) {
    return value * this.squareLength + this.yOffset;
  };
  
  return GridTranslator;
}();