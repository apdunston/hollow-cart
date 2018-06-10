'use strict';

/**
 * Bare functions
 * 
 * https://rosettacode.org/wiki/Maze_generation#JavaScript
 * verti draws horizontal lines top row to bottom row, left to right, with true being blank and false being add a horizontal line.
 * horiz draws vertical lines top row to bottom row, left to right, with true being blank and false being add a horizontal line.
 */

module.exports = {
  generate: function (x, y) {
    var verti, here, path, unvisited, next;
    var n = x * y - 1;
    if (n < 0) {
      alert("illegal maze dimensions");return;
    }
    var horiz = [];for (var j = 0; j < x + 1; j++) {
      horiz[j] = [], verti = [];
    }for (var j = 0; j < x + 1; j++) {
      verti[j] = [], here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)], path = [here], unvisited = [];
    }for (var j = 0; j < x + 2; j++) {
      unvisited[j] = [];
      for (var k = 0; k < y + 1; k++) {
        unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
      }
    }
    while (0 < n) {
      var potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1], [here[0] - 1, here[1]], [here[0], here[1] - 1]];
      var neighbors = [];
      for (var j = 0; j < 4; j++) {
        if (unvisited[potential[j][0] + 1][potential[j][1] + 1]) neighbors.push(potential[j]);
      }if (neighbors.length) {
        n = n - 1;
        next = neighbors[Math.floor(Math.random() * neighbors.length)];
        unvisited[next[0] + 1][next[1] + 1] = false;
        if (next[0] == here[0]) horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;else verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
        path.push(here = next);
      } else here = path.pop();
    }

    return { x: x, y: y, horiz: horiz, verti: verti };
  },

  display: function (m) {
    var text = [];
    for (var j = 0; j < m.x * 2 + 1; j++) {
      var line = [];
      if (0 == j % 2) {
        for (var k = 0; k < m.y * 4 + 1; k++) {
          if (0 == k % 4) line[k] = '+';else if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 4)]) line[k] = ' ';else line[k] = '-';
        }
      } else for (var k = 0; k < m.y * 4 + 1; k++) {
        if (0 == k % 4) {
          if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1]) line[k] = ' ';else line[k] = '|';
        } else line[k] = ' ';
      }if (0 == j) line[1] = line[2] = line[3] = ' ';
      if (m.x * 2 - 1 == j) line[4 * m.y] = ' ';
      text.push(line.join('') + '\r\n');
    }
    return text.join('');
  },

  copy2x2Matrix: function (xRows, yRows, matrix) {
    var copy = [];
    for (var x = 0; x < xRows; x++) {
      copy[x] = [];
      for (var y = 0; y < yRows; y++) {
        copy[x][y] = matrix[x][y];
      }
    }
    return copy;
  },

  translate: function (maze) {
    // If you're counting every line (including outer border) horizontal gets an extra row, and vertical gets an extra column.

    // Reverse what is considered horiz and vert (since we're focused on drawing lines).
    var verticalSpaces = this.copy2x2Matrix(maze.x, maze.y, maze.horiz);
    var horizontalSpaces = this.copy2x2Matrix(maze.x, maze.y, maze.verti);

    // Add missing row (assumed row for the generate code)
    var newRow = [];
    for (var x = 0; x < maze.x; x++) {
      newRow[x] = false;
    }
    horizontalSpaces.unshift(newRow);

    // Add missing column (assumed column for the generate code)
    for (var y = 0; y < maze.y; y++) {
      verticalSpaces[y].unshift(false);
    }

    // Entrance/Exit
    horizontalSpaces[0][0] = true;
    verticalSpaces[maze.x - 1][maze.y] = true;

    return { horizontalSpaces: horizontalSpaces, verticalSpaces: verticalSpaces };
  }
};