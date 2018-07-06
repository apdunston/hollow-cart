"use strict";

var DrawableObject = require('../drawableObjects/drawableObject.js');
var Alpha = require('../enums/alpha.js');
var GridTranslator = require('../gridTranslator.js');
var Colors = require('../enums/colors.js');
var Rectangle = require("../drawableObjects/rectangle.js");

module.exports = function() {
  class Item {
    constructor(x, y, squareLength, gridTranslator) {
      this.squareLength = squareLength;
      this.alpha = Alpha.OPAQUE;
      this.gridTranslator = gridTranslator || new GridTranslator(0, 0, squareLength);
      this.beingCarried = false;
  
      var length = Math.ceil(squareLength * 2 / 3);
      var width = Math.ceil(squareLength / 5);
      this.rectangle = new Rectangle(0, 0, length, width, Colors.GREEN);
  
      this.setX(x);
      this.setY(y);  
    }

    setX(value) {
      this.x = value;
      var xInPixels = this.gridTranslator.xInPixels(value);
      xInPixels += Math.ceil(this.squareLength / 6);

      if (this.beingCarried) {
        xInPixels += Math.ceil(this.squareLength / 3);
      }

      this.rectangle.setX(xInPixels);
    }
    
    setY(value) {
      this.y = value;
      var yInPixels = this.gridTranslator.yInPixels(value);
      yInPixels += Math.ceil(this.squareLength / 2.5);
      this.rectangle.setY(yInPixels);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    isDone() {
      return false;
    }

    getDisplayObjects() {
      return [this];
    }

    draw (renderer) {
      DrawableObject.prototype.draw.call(this);

      this.rectangle.draw(renderer);
    }

    pickUp() {
      this.beingCarried = true;
    }
  } 

  return Item;
}();