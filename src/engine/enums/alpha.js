"use strict";

/**
 * Interface Enum
 */

module.exports = {
  OPAQUE: 1.0,
  TRANSLUCENT: 0.4,
  INVISIBLE: 0.0,
  
  values: function() {
    return Object.keys(Alpha).map(function (key) {
      return Alpha[key];
    })
  },
  
  isValid: function (value) {
    return Alpha.values().includes(value);
  }
};