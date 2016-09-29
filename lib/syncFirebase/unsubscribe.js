'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = unsubscribe;

function unsubscribe(ref, listeners, populated) {
  Object.keys(listeners).forEach(function (event) {
    if (listeners.hasOwnProperty(event)) {
      ref.off(event, listeners[event]);
    }
  });

  // cancel change listeners for populated refs
  Object.keys(populated).forEach(function (key) {
    populated[key].ref.off('value', populated[key].listener);
  });
}

module.exports = exports['default'];