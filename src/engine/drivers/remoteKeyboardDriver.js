"use strict";

module.exports = function() {
  var RemoteKeyboardDriver = function RemoteKeyboardDriver(document) {
    var self = this;
    this.keyDownListeners = [];
    this.remoteKeyDownListeners = [];
    document.addEventListener("keydown", function (evt) {
      self.keyDown(evt);
    });
  };

  RemoteKeyboardDriver.prototype.constructor = RemoteKeyboardDriver;

  RemoteKeyboardDriver.prototype.addKeyDownListener = function (keyDownListener) {
    this.keyDownListeners.push(keyDownListener);
  };

  RemoteKeyboardDriver.prototype.addRemoteKeyDownListener = function (keyDownListener) {
    this.keyDownListeners.push(keyDownListener);
  };

  RemoteKeyboardDriver.prototype.removeKeyDownListener = function (keyDownListener) {
    this.removeListener(keyDownListener, this.keyDownListeners);
  }

  RemoteKeyboardDriver.prototype.removeRemoteKeyDownListener = function (keyDownListener) {
    this.removeListener(keyDownListener, this.remoteKeyDownListeners);
  }

  RemoteKeyboardDriver.prototype.removeListener = function (keyDownListener, list) {
    var index = list.indexOf(keyDownListener);
    if (index < 0) {
      throw "Trying to remove nonexistent keyDownListener";
    }
    list.splice(index, 1);
  };

  RemoteKeyboardDriver.prototype.getKeyDownListeners = function () {
    return this.keyDownListeners;
  };

  RemoteKeyboardDriver.prototype.keyDown = function (keyCode) {
    var self = this;
    for (var i = 0; i < this.keyDownListeners.length; i++) {
      this.keyDownListeners[i].keyDown(keyCode);
    }    
  };

  return RemoteKeyboardDriver;
}();