"use strict";

var Colors = require('../enums/colors.js');
var Alpha = require('../enums/alpha.js');
var Text = require('../drawableObjects/text.js');

module.exports = function() {
  class Score {
    constructor(number, gridLength, squareLength) {
      this.number = number;
      this.gridLength = gridLength;
      this.squareLength = squareLength;

      if (!this.number) {
        number = 0;
      }

      this.scoreboard = new Text(50, 50, "Score: 000000", Colors.WHITE, Alpha.OPAQUE, 1);
      this.resetScoreboard();
    }

    setGridLength(value) {
      this.gridLength = value;
      this.resetScoreboard();      
    }
    
    setSquareLength(value) {
      this.squareLength = value;
      this.resetScoreboard();      
    }

    resetScoreboard() {
      var y = (this.gridLength + 0.5) * this.squareLength;
      var size = Math.ceil(this.squareLength / 2);
      this.scoreboard.setX(50);
      this.scoreboard.setY(y);
      this.scoreboard.setSize(size);
    }
    
    toString() {
      var desiredLength = 6;
      var length = (this.number + "").length;
      return "Score: " + ("0".repeat(desiredLength - length) + this.number);
    }
    
    add(value) {
      this.number += value;
      this.scoreboard.setText(this.toString());
    }

    setNumber(value) {
      this.number = value;
      this.scoreboard.setText(this.toString());
    }
    
    draw(renderer) {
      this.scoreboard.draw(renderer);
    }

    isDone() {
      return false;
    }


  }
  return Score;
}();
