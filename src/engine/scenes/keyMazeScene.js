"use strict";

var Scene = require('./scene.js');
var KeyMazeGame = require('../games/singleDisplay/keyMazeGame.js')
var TypedText = require('../drawableObjects/typedText.js');

module.exports = function() {
    class KeyMazeScene extends Scene {
        constructor(keyboardDriver, display, gridLength, squareLength) {
            super();
            this.display = display;
            this.squareLength = squareLength;
            this.game = new KeyMazeGame(keyboardDriver, display, gridLength, squareLength);
        }

        intro() {
            var margin = Math.ceil(this.squareLength * 0.7);
            this.showText1(margin);
        }

        showText1(margin) {
            var size = Math.ceil(this.squareLength * 0.6);
            var self = this;
            var text = new TypedText(margin, 3 * margin, "Touch green key to take it.", "white", size);
            this.display.addObject(text);
            var next = function() {
                text.fadeOut();
                // self.showText2(margin);
            }
            var callback = () => setTimeout(next, 1000);
            text.setCallback(callback);
            text.type();
        }

        // showText2(margin) {
        //     var size = Math.ceil(this.squareLength * 0.5);
        //     var text = new TypedText(margin, 4 * margin, "Move white square to green circle", "white", size);
        //     this.display.addObject(text);
        //     var next = function() {
        //         text.fadeOut();                
        //     }
        //     var callback = () => setTimeout(next, 1000);
        //     text.setCallback(callback);
        //     text.type();
        // }
    }
    return KeyMazeScene;
}();
