"use strict";

/**
 * Interface Display
 */

var Rectangle = require('./drawableObjects/rectangle.js');
var Square = require('./drawableObjects/square.js');

module.exports = function() {
  var Display = function Display(renderer, framesPerSecond) {
    this.color = "black";
    this.renderer = renderer;
    this.framesPerSecond = framesPerSecond;
    this.objects = [];
    this.backgroundOnly = false;
    this.width = renderer.getWidth();
    this.height = renderer.getHeight();
    this.backgroundObject = new Rectangle(0, 0, this.width, this.height, this.color);
    this.addObject(this.backgroundObject);
    this.drawInterval = null;
  };

  Display.prototype.constructor = Display;

  Display.prototype.setColor = function (value) {
    this.color = value;
    this.objects[0] = new Rectangle(0, 0, this.width, this.height, this.color);
    this.render();
  };

  Display.prototype.flash = function (color, time, callback) {
    var self = this;
    time = time ? time : 200;
    var flashObject = new Square(0, 0, this.width, color);
    this.objects.push(flashObject);
    setTimeout(function() {
      self.objects.pop();
      if (callback) {
        callback();
      }
    }, time);
  };

  Display.prototype.render = function() {
    if (this.backgroundOnly) {
      return;
    }

    for (var x = 0; x < this.objects.length; x++) {
      this.objects[x].draw(this.renderer);
      if (this.objects[x].isDone()) {
        this.objects.splice(x, 1);
      }
    }

    if (this.objects.length == 1) {
      this.backgroundOnly = true;
    }
  };

  Display.prototype.start = function() {
    if (this.drawInterval !== null) {
      throw "Cannot start a running display";
    }

    if (this.framesPerSecond === 0) {
      return;
    }

    var milliseconds = 1000 / this.framesPerSecond;
    var self = this;
    this.drawInterval = setInterval(function() {
      self.render();
    }, milliseconds);
  };

  Display.prototype.stop = function() {
    if (this.drawInterval === null) {
      throw "Cannot stop a stopped display";
    }

    if (this.framesPerSecond === 0) {
      return;
    }
    clearInterval(this.drawInterval);
    this.drawInterval = null;
  };

  Display.prototype.clear = function() {
    this.objects = [];
    this.addObject(this.backgroundObject);
    this.render();
  };

  Display.prototype.addObject = function (object) {
    this.objects.push(object);
    this.backgroundOnly = false;
  };

  Display.prototype.removeObject = function(object) {
    var index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  Display.prototype.getLength = function() {
    return this.width;
  };

  return Display;
}();