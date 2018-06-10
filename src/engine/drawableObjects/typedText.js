"use strict";

var DrawableObject = require('./drawableObject.js');

module.exports = function() {
  var TypedTextState = {
    INVISIBLE: 0,
    TYPING: 1,
    TYPED: 2
  };

  // Constructor calls super
  var TypedText = function TypedText(x, y, text, color) {
    DrawableObject.call(this);
    this.x = x;
    this.y = y;
    this.text = "";
    this.fullText = text;
    this.color = color;
    this.typingState = TypedTextState.INVISIBLE;
    this.typingFrame = 0;
    this.framesPerLetter = 5;
  };

  // Explicit Inheritance
  TypedText.prototype = Object.create(DrawableObject.prototype);
  TypedText.prototype.constructor = TypedText;

  TypedText.prototype.type = function (fn) {
    this.typingState = TypedTextState.TYPING;
    this.fn = fn;
  };

  // Instance Method
  TypedText.prototype.draw = function (renderer) {
    if (this.typingState === TypedTextState.INVISIBLE) {
      return;
    }

    if (this.typingState === TypedTextState.TYPING) {
      this.advanceTypingFrame();
    }

    if (this.text !== "") {
      DrawableObject.prototype.draw.call(this);
      renderer.drawText(this.x, this.y, this.text, this.color, DisplayConstants.TEXT_SIZE, Font.COURIER_NEW, this.alpha);
    }
  };

  TypedText.prototype.advanceTypingFrame = function () {
    if (this.typingFrame === this.framesPerLetter) {
      this.typingFrame = 0;
      this.addLetter();
      return;
    }

    this.typingFrame += 1;
  };

  TypedText.prototype.addLetter = function () {
    this.text += this.fullText.substr(this.text.length, 1);
    if (this.text.length === this.fullText.length) {
      this.typingState = TypedTextState.TYPED;
      this.fn && this.fn();
    }
  };

  return TypedText;
}();