"use strict";

var GridTranslator = require('../../gridTranslator.js');

module.exports = function() {
  var SubDisplay = function (drawMap, squareLength) {
    this.drawMap = drawMap;
    this.squareLength = squareLength;
    this.gridTranslator = new GridTranslator(0, 0, squareLength);
  };

  SubDisplay.prototype.constructor = SubDisplay;

  SubDisplay.prototype.draw = function (renderer) {
    for (var i = 0; i < this.spacesArray.length; i += 1) {
      this.displayFunction(i, this.spacesArray[i], renderer, this.squareLength);
    }
  };

  SubDisplay.prototype.isDone = function() {
    return false;
  };

  return SubDisplay;
}();
