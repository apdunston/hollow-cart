(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var DisplayDriver = require('./engine/displayDriver.js');
var Display = require('./engine/display.js');

window.onload=function() {
  var canv = $("#canvas1");
  console.log(canv);
  $('#canvas1').getContext("2d");
  var driver = new DisplayDriver(canv);
  var display1 = new Display(driver, 0);
  display1.setColor("black");

  var displaySpeed = 100;
  canv = $("#canvas2");
  driver = new DisplayDriver(canv);
  display2 = new Display(driver, displaySpeed);
  display2.setColor("black");

  var squareLength, gridLength;
  squareLength = gridLength = 20;
  mazeGame = new MazeGame(document, display1, display2, gridLength, squareLength);
}

},{"./engine/display.js":2,"./engine/displayDriver.js":3}],2:[function(require,module,exports){
"use strict";

/**
 * Interface Display
 */

var Square = require('./drawableObjects/square.js');

module.exports = function() {
  var Display = function Display(renderer, framesPerSecond) {
    this.color = "black";
    this.renderer = renderer;
    this.framesPerSecond = framesPerSecond;
    this.objects = [];
    this.backgroundOnly = false;
    this.width = renderer.getWidth();
    this.backgroundObject = new Square(0, 0, this.width, this.color);
    this.addObject(this.backgroundObject);
    this.drawInterval = null;
  };

  Display.prototype.constructor = Display;

  Display.prototype.setColor = function (value) {
    this.color = value;
    this.objects[0] = new Square(0, 0, this.width, this.color);
    this.render();
  };

  Display.prototype.flash = function (color, time, callback) {
    var self = this;
    time = time ? time : 200;
    var flashObject = new Square(0, 0, this.width, color);
    this.objects.push(flashObject);
    setTimeout(function () {
      self.objects.pop();
      if (callback) {
        callback();
      }
    }, time);
  };

  Display.prototype.render = function () {
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

  Display.prototype.start = function () {
    if (this.drawInterval !== null) {
      throw "Cannot start a running display";
    }

    if (this.framesPerSecond === 0) {
      return;
    }

    var milliseconds = 1000 / this.framesPerSecond;
    var self = this;
    this.drawInterval = setInterval(function () {
      self.render();
    }, milliseconds);
  };

  Display.prototype.stop = function () {
    if (this.drawInterval === null) {
      throw "Cannot stop a stopped display";
    }

    if (this.framesPerSecond === 0) {
      return;
    }
    clearInterval(this.drawInterval);
    this.drawInterval = null;
  };

  Display.prototype.clear = function () {
    this.objects = [];
    this.addObject(this.backgroundObject);
    this.render();
  };

  Display.prototype.addObject = function (object) {
    this.objects.push(object);
    this.backgroundOnly = false;
  };

  Display.prototype.getLength = function () {
    return this.width;
  };

  return Display;
}();
},{"./drawableObjects/square.js":6}],3:[function(require,module,exports){
"use strict";

module.exports = function () {

  var _alphaWrap = function _alphaWrap(self, alpha, fn) {
    if (alpha !== undefined) {
      self.context.globalAlpha = alpha;
    }

    fn(self);

    self.context.globalAlpha = 1.0;
  };

  var DisplayDriver = function DisplayDriver(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  };

  DisplayDriver.prototype.constructor = DisplayDriver;

  DisplayDriver.prototype.getWidth = function () {
    return this.canvas.width;
  };

  DisplayDriver.prototype.drawRectangle = function (x, y, xLength, yWidth, color, alpha) {
    _alphaWrap(this, alpha, function (self) {
      self.context.fillStyle = color;
      self.context.fillRect(x, y, xLength, yWidth);
    });
  };

  DisplayDriver.prototype.drawSquare = function (x, y, length, color, alpha) {
    this.drawRectangle(x, y, length, length, color, alpha);
  };

  DisplayDriver.prototype.drawCircle = function (x, y, radius, color, alpha) {
    _alphaWrap(this, alpha, function (self) {
      self.context.fillStyle = color;
      self.context.beginPath();
      self.context.arc(x, y, radius, 0, 2 * Math.PI);
      self.context.fill();
    });
  };

  DisplayDriver.prototype.drawText = function (x, y, text, color, size, font, alpha) {
    font = font || "Courier New";
    if (!Font.isValid(font)) {
      throw font + " is an invalid font.";
    }

    _alphaWrap(this, alpha, function (self) {
      self.context.font = size + "px " + font;
      self.context.fillStyle = color;
      self.context.fillText(text, x, y);
    });
  };

  DisplayDriver.prototype.drawLine = function (x1, y1, x2, y2, color, width, alpha) {
    width = width || 2;

    _alphaWrap(this, alpha, function (self) {
      self.context.strokeStyle = color;
      self.context.lineWidth = width;
      self.context.beginPath();
      self.context.moveTo(x1, y1);
      self.context.lineTo(x2, y2);
      self.context.stroke();
    });
  };

  return DisplayDriver;
}();
},{}],4:[function(require,module,exports){
"use strict";

var DrawableObjectState = require('./drawableObjectState.js');
var Alpha = require('../enums/alpha.js');

module.exports = function() {
  var DrawableObject = function DrawableObject() {
    this.alpha = Alpha.OPAQUE;
    this.isDoneValue = false;
    this.state = DrawableObjectState.STATIC;
    this.fadeDelta = 0.02;
  };

  DrawableObject.prototype.constructor = DrawableObject;

  DrawableObject.prototype.isDone = function () {
    return this.isDoneValue;
  };

  DrawableObject.prototype.setAlpha = function (value) {
    this.alpha = value;
  };

  DrawableObject.prototype.setIsDone = function (value) {
    this.isDoneValue = value;
  };

  DrawableObject.prototype.fadeIn = function () {
    this.state = DrawableObjectState.FADING_IN;
  };

  DrawableObject.prototype.fadeOut = function () {
    this.state = DrawableObjectState.FADING_IN;
  };

  DrawableObject.prototype.draw = function () {
    if (this.state === DrawableObjectState.FADING_IN) {
      this.fadeInStep();
    }

    if (this.state === DrawableObjectState.FADING_OUT) {
      this.fadeOutStep();
    }
  };

  DrawableObject.prototype.fadeInStep = function () {
    if (this.alpha >= Alpha.OPAQUE) {
      this.state = DrawableObjectState.STATIC;
      this.alpha = Alpha.OPAQUE;
      return;
    }

    this.alpha += this.fadeDelta;
  };

  DrawableObject.prototype.fadeOutStep = function () {
    if (this.alpha <= Alpha.INVISIBLE) {
      this.state = DrawableObjectState.STATIC;
      this.alpha = Alpha.INVISIBLE;
      return;
    }

    this.alpha -= this.fadeDelta;
  };

  DrawableObject.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  };

  return DrawableObject;
}();
},{"../enums/alpha.js":7,"./drawableObjectState.js":5}],5:[function(require,module,exports){
"use strict";

module.exports = {
  STATIC: 0,
  FADING_IN: 1,
  FADING_OUT: 2
};
},{}],6:[function(require,module,exports){
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
},{"./drawableObject.js":4}],7:[function(require,module,exports){
"use strict";

/**
 * Interface Enum
 */

module.exports = {
  OPAQUE: 1.0,
  TRANSLUCENT: 0.4,
  INVISIBLE: 0.0,
  
  values: function () {
    return Object.keys(Alpha).map(function (key) {
      return Alpha[key];
    })
  },
  
  isValid: function (value) {
    return Alpha.values().includes(value);
  }
};
},{}],8:[function(require,module,exports){
var TwoPlayer = require('./2player.js');
},{"./2player.js":1}]},{},[8]);
