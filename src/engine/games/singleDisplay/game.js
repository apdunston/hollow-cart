"use strict";

/**
 * Interface Game
 * Interface KeyDownListener
 *
 * Object responsibility: Communicate state changes between player, displays, keyboardDriver, 
 * and gameMaster
 * 
 * A series of meaningful choices played out across 1 display
 * using only arrow keys and swipes. 
 * 
 * Non-assumptions
 * - Not necessarily played on a grid.
 * 
 */

var Colors = require("../../enums/colors.js");
var Alpha = require("../../enums/alpha.js");
var Text = require("../../drawableObjects/text.js");

module.exports = function() {
    var SingleDisplayGame = function SingleDisplayGame() {
            var self = this;
            this.displays = [];
            this.keyboardDriver = null;
            this.gameEndListeners = [];
            this.running = false;
            this.time = 60;
    };

    SingleDisplayGame.prototype.start = function() {
        for (var i = 0; i < this.displays.length; i++) {
            this.displays[i].start();
        }

        this.keyboardDriver.addKeyDownListener(this);
        this.running = true;
    };

    SingleDisplayGame.prototype.stop = function() {
        if (!this.running) {
            return;
        }

        for (var i = 0; i < this.displays.length; i++) {
            this.displays[i].clear();
            this.displays[i].stop();
        }

        this.keyboardDriver.removeKeyDownListener(this);
        this.running = false;
    };

    SingleDisplayGame.prototype.clearDisplays = function() {
        this.displays[0].clear();
    }

    SingleDisplayGame.prototype.gameLoop = function() {
    // method stuff
    };

    SingleDisplayGame.prototype.keyDown = function() {
    // method stuff
    };

    SingleDisplayGame.prototype.addGameEndListener = function (gameEndListener) {
    this.gameEndListeners.push(gameEndListener);
    };

    SingleDisplayGame.prototype.gameEnd = function (data) {
    for (var i = 0; i < this.gameEndListeners.length; i++) {
        this.gameEndListeners[i].gameEnd(data);
    }
    };

    SingleDisplayGame.prototype.successfulMoveEvent = function() {
    // method stuff
    };

    SingleDisplayGame.prototype.validMove = function (x, y, direction) {
    return true;
    };

    return SingleDisplayGame;
}();
