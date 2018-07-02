"use strict";

/**
 * Bare Functions
 */

module.exports = function() {
  var Gamespace = {
    VIOLET: "#9400D3",
    BLUE: "#0000FF",
    GREEN: "#00FF00",
    YELLOW: "#FFFF00",
    ORANGE: "#FF7F00",
    RED: "#FF0000",

    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",

    UP_CODE: 38,
    DOWN_CODE: 40,
    LEFT_CODE: 37,
    RIGHT_CODE: 39,

    W_CODE: 87,
    A_CODE: 65,
    S_CODE: 83,
    D_CODE: 68
  };

  Gamespace.rainbow = [Gamespace.RED, Gamespace.ORANGE, Gamespace.YELLOW, 
    Gamespace.GREEN, Gamespace.BLUE, Gamespace.VIOLET];

  Gamespace.oppositeOf = function oppositeOf(direction) {
    switch (direction) {
      case Gamespace.UP:
        return Gamespace.DOWN;
      case Gamespace.DOWN:
        return Gamespace.UP;
      case Gamespace.LEFT:
        return Gamespace.RIGHT;
      case Gamespace.RIGHT:
        return Gamespace.LEFT;
    }
    };

  Gamespace.randomColor = function() {
    var index = Math.floor(Math.random() * 6);
    return this.rainbow[index];
  };

  return Gamespace;
}();