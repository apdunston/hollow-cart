"use strict";

var Alpha = require("../enums/alpha");
var TypedText = require('../drawableObjects/typedText');
var Rectangle = require('../drawableObjects/rectangle');
var Colors = require("../enums/colors");

module.exports = function() {
  class GameOver {
    constructor(gridLength, squareLength) {
      var self = this;

      this.gridLength = gridLength;
      this.squareLength = squareLength;
      var x = Math.ceil((this.squareLength * this.gridLength / 2) - (2.5 * this.squareLength));
      var y = Math.ceil(x * 1.5);
      var size = this.squareLength;
      var length = this.squareLength * 5.5;
      var width = Math.ceil(this.squareLength * 1.5);
      self.rectangle = new Rectangle(x, y - this.squareLength, length, width, Colors.BLACK, Alpha.OPAQUE);
      self.text = new TypedText(x, y, "GAME OVER", Colors.RED, size);
      self.text.start();  
    }

    isDone() {
      return false;
    }

    draw(renderer) {
      var self = this;
      self.rectangle.draw(renderer);
      self.text.draw(renderer);
    }
  }
    
  return GameOver;
}();
  