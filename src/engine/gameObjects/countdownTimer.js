"use strict";

var Colors = require('../enums/colors.js');
var Alpha = require('../enums/alpha.js');
var Text = require('../drawableObjects/text.js');

module.exports = function() {
  class CountdownTimer {
    constructor(timeRemaining, gridLength, squareLength, callback) {
      this.timeRemaining = timeRemaining;
      this.gridLength = gridLength;
      this.squareLength = squareLength;
      this.callback = callback;

      this.timerText = new Text(0, 0, "0", Colors.WHITE, Alpha.OPAQUE, 1);
      this.resetTimerboard();
    }

    tick() {
        var self = this;
        self.timeRemaining -= 1;
        self.resetTimerboard();

        if (self.timeRemaining === 0) {
          this.stop();
          this.callback();
          return;
        }

        if (self.timeout) {
          clearTimeout(self.timeout);
        }

        self.timeout = setTimeout(function() { self.tick(); }, 1000);
    }    

    start() {
      var self = this;
      self.timeout = setTimeout(function() { self.tick(); }, 1000);
    }

    stop() {
      clearTimeout(this.timeout);
    }

    setGridLength(value) {
      this.gridLength = value;
      this.resetTimerboard();      
    }
    
    setSquareLength(value) {
      this.squareLength = value;
      this.resetTimerboard();      
    }

    setTimeRemaining(value) {
      this.timeRemaining = value;
    }

    resetTimerboard() {
      var x = this.squareLength * 9;    
      var y = (this.gridLength + 0.5) * this.squareLength;
      var size = Math.ceil(this.squareLength / 2);
      this.timerText.setText(this.toString());
      this.timerText.setX(x);
      this.timerText.setY(y);
      this.timerText.setSize(size);
    }
    
    toString() {
      return "Timer: " + this.timeRemaining;
    }
    
    draw(renderer) {
      this.timerText.draw(renderer);
    }

    isDone() {
      return false;
    }
  }
  return CountdownTimer;
}();
