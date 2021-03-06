'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.dispatchChildAdded = dispatchChildAdded;
exports.dispatchChildChanged = dispatchChildChanged;
exports.dispatchChildMoved = dispatchChildMoved;
exports.dispatchChildRemoved = dispatchChildRemoved;
exports.dispatchArrayUpdated = dispatchArrayUpdated;
exports.dispatchObjectUpdated = dispatchObjectUpdated;
exports.dispatchInitialValueReceived = dispatchInitialValueReceived;
exports.dispatchPermissionsRevoked = dispatchPermissionsRevoked;

var _actionsFirebase = require('../actions/firebase');

function dispatchChildAdded(store, localBinding) {
  return function (key, value, previousChildKey) {
    return store.dispatch((0, _actionsFirebase.addArrayChild)(localBinding, key, value, previousChildKey));
  };
}

function dispatchChildChanged(store, localBinding) {
  return function (key, value) {
    return store.dispatch((0, _actionsFirebase.changeArrayChild)(localBinding, key, value));
  };
}

function dispatchChildMoved(store, localBinding) {
  return function (snapshot, previousChildKey) {
    return store.dispatch((0, _actionsFirebase.moveArrayChild)(localBinding, snapshot, previousChildKey));
  };
}

function dispatchChildRemoved(store, localBinding) {
  return function (snapshot) {
    return store.dispatch((0, _actionsFirebase.removeArrayChild)(localBinding, snapshot));
  };
}

function dispatchArrayUpdated(store, localBinding) {
  return function (key, value) {
    return store.dispatch((0, _actionsFirebase.updateArray)(localBinding, key, value));
  };
}

function dispatchObjectUpdated(store, localBinding, snapshot) {
  return store.dispatch((0, _actionsFirebase.updateObject)(localBinding, snapshot));
}

function dispatchInitialValueReceived(store, localBinding) {
  return store.dispatch((0, _actionsFirebase.receiveInitialValue)(localBinding));
}

function dispatchPermissionsRevoked(store, error) {
  return store.dispatch((0, _actionsFirebase.revokePermissions)(error));
}
//# sourceMappingURL=dispatch.js.map