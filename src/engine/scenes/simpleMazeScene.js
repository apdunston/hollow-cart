"use strict";

var Scene = require('./scene.js');
var MazeGame = require('../games/singleDisplay/mazeGame.js')
var TypedText = require('../drawableObjects/typedText.js');

module.exports = function() {
    class SimpleMazeScene extends Scene {
        constructor(keyboardDriver, display, gridLength, squareLength, score, playerNumber) {
            super();
            this.display = display;
            this.squareLength = squareLength;
            this.game = new MazeGame(keyboardDriver, display, gridLength, squareLength, score, playerNumber);
        }

        intro() {
            var margin = Math.ceil(this.squareLength * 0.7);
            this.showText1(margin);
        }

        showText1(margin) {
            var size = Math.ceil(this.squareLength * 0.6);
            var self = this;
            var text = new TypedText(margin, 3 * margin, "> Use arrow keys or swipe", "white", size);
            this.display.addObject(text);
            var next = function() {
                text.fadeOut();
                self.showText2(margin);
            }
            var callback = function() { setTimeout(next, 1000); };
            text.setCallback(callback);
            text.start();
        }

        showText2(margin) {
            var size = Math.ceil(this.squareLength * 0.5);
            var text = new TypedText(margin, 4 * margin, "> Move white square to green circle", "white", size);
            this.display.addObject(text);
            var next = function() {
                text.fadeOut();                
            }
            var callback = function() { setTimeout(next, 1000); };
            text.setCallback(callback);
            text.start();
        }
    }
    return SimpleMazeScene;
}();
