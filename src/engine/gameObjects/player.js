"use strict";

/**
 * Interface GameObject via Entity
 */

var Entity = require('./entity.js');

module.exports = function () {

  var Player = function Player(gridLength, squareLength, game, gridTranslator) {
    Entity.call(this, gridLength, squareLength, game, "white", gridTranslator);
  };

  // Explicit Inheritance
  Player.prototype = Object.create(Entity.prototype);

  Player.prototype.constructor = Player;

  Player.prototype.move = function (direction) {
    var success = Entity.prototype.move.call(this, direction);
    success && this.game.successfulMoveEvent();
    return success;
  };

  Player.prototype.setColor = function (color) {
    Entity.prototype.setColor.call(this, color);
  };

  return Player;
}();