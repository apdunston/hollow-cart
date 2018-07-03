"use strict";

/**
 * Interface Enum
 */

module.exports = {
  ARIAL: "Arial",
  VERDANA: "Verdana",
  TIMES_NEW_ROMAN: "Times New Roman",
  COURIER_NEW: "Courier New",
  SERIF: "serif",
  SANS_SERIF: "sans-serif",
  values: function() {
    var self = this;
    return Object.keys(self).map(
      function (key) {
        return self[key];
      })
  },
  isValid: function (value) {
    var self = this;
    return self.values().includes(value);
  }
};
