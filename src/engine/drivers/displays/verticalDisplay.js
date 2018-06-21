"use strict";

var SubDisplay = require('./subDisplay.js');
module.exports = function() {

  var VerticalDisplay = function (drawMap, squareLength) {
    var self = this;
    SubDisplay.call(this, drawMap, squareLength);
    this.displayFunction = function (one, two, three) {
      self.gridTranslator.drawVerticalRow(one, two, three);
    };
    this.spacesArray = this.drawMap.verticalSpaces;
  };
  VerticalDisplay.prototype = Object.create(SubDisplay.prototype);
  VerticalDisplay.prototype.constructor = SubDisplay;
  return VerticalDisplay;
}();