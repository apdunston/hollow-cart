"use strict";

/**
 * Bare Functions
 */

module.exports = {
  rainbow: ["#9400D3", "#4B0082", "#0000FF", "#00FF00", "#FFFF00", "#FF7F00", "#FF0000"],
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
  D_CODE: 68,
  oppositeOf: function oppositeOf(direction) {
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
  }
};