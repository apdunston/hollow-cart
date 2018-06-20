"use strict";

module.exports = function() {
  /**
   * Interface GameMaster
   * Interface GameEndListener
   */
  var GameMaster = function() {
    this.games = [];
    this.currentGameIndex = null;
  };

  GameMaster.prototype.constructor = GameMaster;

  GameMaster.prototype.addGame = function (game) {
    this.games.push(game);
    game.addGameEndListener(this);
  };

  GameMaster.prototype.start = function () {
    this.stopCurrentGame();
    this.currentGameIndex = 0;
    this.startCurrentGame();
  };

  GameMaster.prototype.stop = function () {
    this.stopCurrentGame();
    this.currentGameIndex = null;
  };

  GameMaster.prototype.next = function () {
    this.stopCurrentGame();

    if (this.onLastGame()) {
      this.currentGameIndex = -1;
      // this.stop();
      // return;
    }

    this.currentGameIndex += 1;
    this.startCurrentGame();
  };

  GameMaster.prototype.previous = function () {
    this.stopCurrentGame();

    if (this.onFirstGame()) {
      this.currentGameIndex = this.games.length;
      // this.stop();
      // return;
    }

    this.currentGameIndex -= 1;
    this.startCurrentGame();
  };

  GameMaster.prototype.stopCurrentGame = function () {
    if (this.currentGameIndex !== null) {
      this.games[this.currentGameIndex].stop();
    }
  };

  GameMaster.prototype.startCurrentGame = function () {
    if (this.currentGameIndex !== null) {
      this.games[this.currentGameIndex].start();
    }
  };

  GameMaster.prototype.onLastGame = function () {
    return this.currentGameIndex == this.games.length - 1;
  };

  GameMaster.prototype.onFirstGame = function () {
    return this.currentGameIndex == 0;
  };

  GameMaster.prototype.gameEnd = function (data) {
    this.next();
  };

  GameMaster.prototype.getCurrentGame = function() {
    return this.games[this.currentGameIndex];
  }

  return GameMaster;
}();