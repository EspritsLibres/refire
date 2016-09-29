'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = unsubscribeAll;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _unsubscribe = require('./unsubscribe');

var _unsubscribe2 = _interopRequireDefault(_unsubscribe);

function unsubscribeAll(refs, listeners, populated) {
  Object.keys(refs).forEach(function (localBinding) {
    if (refs.hasOwnProperty(localBinding)) {
      (0, _unsubscribe2['default'])(refs[localBinding], listeners[localBinding], populated[localBinding]);
      delete refs[localBinding];
      delete listeners[localBinding];
      delete populated[localBinding];
    }
  });
}

module.exports = exports['default'];