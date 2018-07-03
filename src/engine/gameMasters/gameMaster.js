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
    return this;
  };

  GameMaster.prototype.start = function (data) {
    if (this.games.length == 0) {
      throw "Start called on an empty GameMaster.";
    }
    this.stopCurrentGame();
    this.currentGameIndex = 0;
    this.startCurrentGame(data);
  };

  GameMaster.prototype.stop = function() {
    this.stopCurrentGame();
    this.currentGameIndex = null;
  };

  GameMaster.prototype.next = function (data) {
    this.stopCurrentGame();

    if (this.onLastGame()) {
      this.currentGameIndex = -1;
    }

    this.currentGameIndex += 1;
    this.startCurrentGame(data);
  };

  GameMaster.prototype.previous = function (data) {
    this.stopCurrentGame();

    if (this.onFirstGame()) {
      this.currentGameIndex = this.games.length;
    }

    this.currentGameIndex -= 1;
    this.startCurrentGame(data);
  };

  GameMaster.prototype.stopCurrentGame = function() {
    if (this.currentGameIndex !== null) {
      this.games[this.currentGameIndex].stop();
    }
  };

  GameMaster.prototype.startCurrentGame = function (data) {
    if (this.currentGameIndex !== null) {
      this.games[this.currentGameIndex].start(data);
    }
  };

  GameMaster.prototype.onLastGame = function() {
    return this.currentGameIndex == this.games.length - 1;
  };

  GameMaster.prototype.onFirstGame = function() {
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