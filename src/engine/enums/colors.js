"use strict";

/**
 * Bare Functions
 */

module.exports = function() {
  var Colors = {
    VIOLET: "#9400D3",
    BLUE: "#0000FF",
    GREEN: "#00FF00",
    YELLOW: "#FFFF00",
    ORANGE: "#FF7F00",
    RED: "#FF0000",
    WHITE: "#FFFFFF",
    BLACK: "#000000"
  };

  Colors.rainbow = [Colors.RED, Colors.ORANGE, Colors.YELLOW, 
    Colors.GREEN, Colors.BLUE, Colors.VIOLET];

  Colors.randomColor = function() {
    var index = Math.floor(Math.random() * 6);
    return this.rainbow[index];
  };

  return Colors;
}();