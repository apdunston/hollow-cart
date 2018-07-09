"use strict";

/**
 * Interface GameObject via Entity
 */

var Entity = require('./entity.js');

module.exports = function() {

  var Player = function Player(gridLength, squareLength, game, gridTranslator) {
    Entity.call(this, gridLength, squareLength, game, "white", gridTranslator);
    this.inventory = [];
  };

  // Explicit Inheritance
  Player.prototype = Object.create(Entity.prototype);

  Player.prototype.constructor = Player;

  var carryInventory = function(self) {
    for (var i = 0; i < self.inventory.length; i++) {
      self.inventory[i].setX(self.x);
      self.inventory[i].setY(self.y);
    }
  }

  Player.prototype.move = function (direction) {
    var success = Entity.prototype.move.call(this, direction);
    success && this.game.successfulMoveEvent();
    carryInventory(this);
    return success;
  };

  Player.prototype.setColor = function (color) {
    Entity.prototype.setColor.call(this, color);
  };

  Player.prototype.getInventory = function() {
    return this.inventory;
  }

  Player.prototype.addToInventory = function(item) {
    this.inventory.push(item);
    item.pickUp();
  }

  Player.prototype.removeFromInventory = function(item) {
    var index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
  }

  Player.prototype.has = function(item) {
    return this.inventory.indexOf(item) > -1;
  }

  return Player;
}();