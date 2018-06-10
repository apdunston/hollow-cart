"use strict";

var DrawableObject = require('./drawableObject.js');

module.exports = function() {
  // Constructor calls super
  var Square = function Square(x, y, length, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  Square.prototype = Object.create(DrawableObject.prototype);

  Square.prototype.constructor = Square;

  // Instance Method
  Square.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawSquare(this.x, this.y, this.length, this.color, this.alpha);
  };

  Square.prototype.setColor = function (value) {
    this.color += value;
  };

  Square.prototype.addX = function (value) {
    this.x += value;
  };

  Square.prototype.addY = function (value) {
    this.y += value;
  };

  Square.prototype.setX = function (value) {
    this.x = value;
  };

  Square.prototype.setY = function (value) {
    this.y = value;
  };

  Square.prototype.setColor = function (value) {
    this.color = value;
  };

  // Constructor calls super
  var DrawableCircle = function DrawableCircle(x, y, radius, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  DrawableCircle.prototype = Object.create(DrawableObject.prototype);

  DrawableCircle.prototype.constructor = DrawableCircle;
  // Explicit Inheritance
  // Instance Method
  DrawableCircle.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawCircle(this.x, this.y, this.radius, this.color, this.alpha);
  };

  DrawableCircle.prototype.addX = function (value) {
    this.x += value;
  };

  DrawableCircle.prototype.addY = function (value) {
    this.y += value;
  };

  DrawableCircle.prototype.setX = function (value) {
    this.x = value;
  };

  DrawableCircle.prototype.setY = function (value) {
    this.y = value;
  };

  DrawableCircle.prototype.setColor = function (value) {
    this.color = value;
  };

  // Constructor calls super
  var DrawableText = function DrawableText(x, y, text, color, alpha) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = alpha;
  };

  // Explicit Inheritance
  DrawableText.prototype = Object.create(DrawableObject.prototype);
  DrawableText.prototype.constructor = DrawableText;

  // Instance Method
  DrawableText.prototype.draw = function (renderer) {
    DrawableObject.prototype.draw.call(this);
    renderer.drawText(this.x, this.y, this.text, this.color, DisplayConstants.TEXT_SIZE, Font.COURIER_NEW, this.alpha);
  };

  var DrawableTypedTextState = {
    INVISIBLE: 0,
    TYPING: 1,
    TYPED: 2
  };

  // Constructor calls super
  var DrawableTypedText = function DrawableTypedText(x, y, text, color) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.text = "";
    this.fullText = text;
    this.color = color;
    this.typingState = DrawableTypedTextState.INVISIBLE;
    this.typingFrame = 0;
    this.framesPerLetter = 5;
  };

  // Explicit Inheritance
  DrawableTypedText.prototype = Object.create(DrawableObject.prototype);
  DrawableTypedText.prototype.constructor = DrawableTypedText;

  DrawableTypedText.prototype.type = function (fn) {
    this.typingState = DrawableTypedTextState.TYPING;
    this.fn = fn;
  };

  // Instance Method
  DrawableTypedText.prototype.draw = function (renderer) {
    if (this.typingState === DrawableTypedTextState.INVISIBLE) {
      return;
    }

    if (this.typingState === DrawableTypedTextState.TYPING) {
      this.advanceTypingFrame();
    }

    if (this.text !== "") {
      DrawableObject.prototype.draw.call(this);
      renderer.drawText(this.x, this.y, this.text, this.color, DisplayConstants.TEXT_SIZE, Font.COURIER_NEW, this.alpha);
    }
  };

  DrawableTypedText.prototype.advanceTypingFrame = function () {
    if (this.typingFrame === this.framesPerLetter) {
      this.typingFrame = 0;
      this.addLetter();
      return;
    }

    this.typingFrame += 1;
  };

  DrawableTypedText.prototype.addLetter = function () {
    this.text += this.fullText.substr(this.text.length, 1);
    if (this.text.length === this.fullText.length) {
      this.typingState = DrawableTypedTextState.TYPED;
      this.fn && this.fn();
    }
  };

  return Square;
}();