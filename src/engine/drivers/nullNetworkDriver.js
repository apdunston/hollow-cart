"use strict";

/**
 * An empty network driver. Goes nowhere, does nothing.
 */
module.exports = function() {
  var NullNetworkDriver = {
    origin: "Hollow Cart Client (NullNetworkDriver)",
    send: function(event) {},
    receive: function(event) {},
    setGame: function(game) { this.game = game; },
    sendMaze: function(maze) {},
    sendWin: function(playerNumber) {}
  };
  return NullNetworkDriver;
}();