"use strict";
// A scene is a game, an intro function, and a boolean to show whether or not the intro has played.
// It also functions as a decorator for its game.

module.exports = function() {
    class Scene {
        constructor() {
            this.introHasPlayed = false;
            this.game = null;
        }

        start(data) {
            this.game.start(data);

            if (!this.introHasPlayed) {
                this.intro();
                this.introHasPlayed = true;
            }
        }

        stop() {
            this.game.stop();
        }

        intro() {
            // Override this method
        }

        setNetworkDriver(networkDriver) {
            this.networkDriver = networkDriver;
            this.game.setNetworkDriver(networkDriver);
        }

        setSquareLength(squareLength) {
            this.squareLength = squareLength;
            this.game.setSquareLength(squareLength);
        }

        setGridLength(gridLength) {
            this.gridLength = gridLength;
            this.game.setGridLength(gridLength);
        }

        addGameEndListener(listener) {
            this.game.addGameEndListener(listener);
        }

        win() {
            this.game.win();
        }

        getMaze() {
            return this.game.getMaze();            
        }

        setMaze(maze) {
            this.game.setMaze(maze);
        }

        setTimeRemaining(time) {
            this.game.setTimeRemaining(time);
        }

        setPositions(data) {
            this.game.setPositions(data);
        }

        setPlayerNumber(playerNumber) {
            this.game.setPlayerNumber(playerNumber);
        }
    }

    return Scene;
}();
