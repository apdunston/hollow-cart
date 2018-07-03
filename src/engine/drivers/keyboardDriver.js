"use strict";

module.exports = function() {
  var KeyboardDriver = function KeyboardDriver(document) {
    var self = this;
    this.keyDownListeners = [];
    document.addEventListener("keydown", function (evt) {
      self.keyDown(evt);
    });
  };

  KeyboardDriver.prototype.constructor = KeyboardDriver;

  KeyboardDriver.prototype.addKeyDownListener = function (keyDownListener) {
    this.keyDownListeners.push(keyDownListener);
  };

  KeyboardDriver.prototype.removeKeyDownListener = function (keyDownListener) {
    var index = this.keyDownListeners.indexOf(keyDownListener);
    if (index < 0) {
      throw "Trying to remove nonexistent keyDownListener";
    }
    this.keyDownListeners.splice(index, 1);
  };

  KeyboardDriver.prototype.getKeyDownListeners = function() {
    return this.keyDownListeners;
  };

  KeyboardDriver.prototype.keyDown = function (keyCode) {
    var self = this;
    for (var i = 0; i < this.keyDownListeners.length; i++) {
      this.keyDownListeners[i].keyDown(keyCode);
    }
  };

  return KeyboardDriver;
}();