"use strict";

var SubDisplay = require('./subDisplay.js');

module.exports = function() {
  var HorizontalDisplay = function (drawMap, squareLength) {
    var self = this;
    SubDisplay.call(this, drawMap, squareLength);
    this.displayFunction = function (one, two, three) {
      self.gridTranslator.drawHorizontalRow(one, two, three);
    };
    this.spacesArray = this.drawMap.horizontalSpaces;
  };
  HorizontalDisplay.prototype = Object.create(SubDisplay.prototype);
  HorizontalDisplay.prototype.constructor = SubDisplay;

  return HorizontalDisplay;
}();