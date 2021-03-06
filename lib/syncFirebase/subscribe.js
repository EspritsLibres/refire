'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = subscribe;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _dispatch = require('./dispatch');

function subscribe(localBinding, bindOptions, options) {
  var type = bindOptions.type;
  var query = bindOptions.query;
  var populate = bindOptions.populate;
  var store = options.store;
  var onCancel = options.onCancel;
  var name = options.name;

  var listeners = {};
  var populated = {};

  var cancelCallback = function cancelCallback(err) {
    (0, _dispatch.dispatchPermissionsRevoked)(store, err);
    onCancel(err);
  };

  if (type === "Array") {
    (function () {
      var initialValueReceived = false;

      var populateChild = function populateChild(key) {
        return new Promise(function (resolve) {
          var ref = _firebase2['default'].app(name).database().ref(populate(key));
          ref.once('value', function (snapshot) {
            return resolve([key, ref, snapshot.val()]);
          }, function (err) {
            cancelCallback(err);
            return resolve([key, ref, null]);
          });
        });
      };

      // only listen child_added for arrays after initial fetch is done
      var onChildAdded = function onChildAdded(snapshot, previousChildKey) {
        if (initialValueReceived) {
          if (populate) {
            (function () {
              var ref = _firebase2['default'].app(name).database().ref(populate(snapshot.key));
              ref.once('value', function (populatedSnapshot) {
                (0, _dispatch.dispatchChildAdded)(store, localBinding)(snapshot.key, populatedSnapshot.val(), previousChildKey);
                populated[snapshot.key] = {
                  ref: ref,
                  listener: ref.on('value', function (populatedSnapshot) {
                    (0, _dispatch.dispatchChildChanged)(store, localBinding)(snapshot.key, populatedSnapshot.val());
                  }, cancelCallback)
                };
              }, cancelCallback);
            })();
          } else {
            (0, _dispatch.dispatchChildAdded)(store, localBinding)(snapshot.key, snapshot.val(), previousChildKey);
          }
        }
      };

      var onceValue = function onceValue(snapshot) {
        if (populate) {
          (function () {
            var populateRefs = {};
            var refs = [];
            snapshot.forEach(function(snapshot) {
              refs.push(snapshot.key);
            });
            Promise.all(refs.map(populateChild)).then(function (resolved) {
              var result = {};
              resolved.forEach(function (arr) {
                var _arr = _slicedToArray(arr, 3);

                var key = _arr[0];
                var ref = _arr[1];
                var value = _arr[2];

                result[key] = value;
                populateRefs[key] = ref;
              });
              return result;
            }).then(function (populated) {
              (0, _dispatch.dispatchArrayUpdated)(store, localBinding)(snapshot.key, populated);
              (0, _dispatch.dispatchInitialValueReceived)(store, localBinding);
              initialValueReceived = true;

              Object.keys(populateRefs).forEach(function (key) {
                var ref = populateRefs[key];
                populated[key] = {
                  ref: ref,
                  listener: ref.on('value', function (populatedSnapshot) {
                    (0, _dispatch.dispatchChildChanged)(store, localBinding)(key, populatedSnapshot.val());
                  }, cancelCallback)
                };
              });
            });
          })();
        } else {
          (0, _dispatch.dispatchArrayUpdated)(store, localBinding)(snapshot.key, snapshot.val());
          (0, _dispatch.dispatchInitialValueReceived)(store, localBinding);
          initialValueReceived = true;
        }
      };

      var onChildChanged = function onChildChanged(snapshot) {
        (0, _dispatch.dispatchChildChanged)(store, localBinding)(snapshot.key, snapshot.val());
      };

      var onChildRemoved = function onChildRemoved(snapshot) {
        (0, _dispatch.dispatchChildRemoved)(store, localBinding)(snapshot);
        var key = snapshot.key;
        if (populated[key]) {
          populated[key].ref.off('value', populated[key].listener);
          delete populated[key];
        }
      };

      listeners.child_added = query.on('child_added', onChildAdded, cancelCallback);
      listeners.child_changed = query.on('child_changed', onChildChanged, cancelCallback);
      listeners.child_moved = query.on('child_moved', (0, _dispatch.dispatchChildMoved)(store, localBinding), cancelCallback);
      listeners.child_removed = query.on('child_removed', onChildRemoved, cancelCallback);

      // listen for array value once to prevent multiple updates on initial items
      listeners.value = query.on('value', onceValue, function (err) {
        query.off('value', listeners.value);
        (0, _dispatch.dispatchInitialValueReceived)(store, localBinding);
        cancelCallback(err);
      });
    })();
  } else {
    listeners.value = query.on('value', function (snapshot) {
      (0, _dispatch.dispatchObjectUpdated)(store, localBinding, snapshot);
      (0, _dispatch.dispatchInitialValueReceived)(store, localBinding);
    }, function (err) {
      (0, _dispatch.dispatchInitialValueReceived)(store, localBinding);
      cancelCallback(err);
    });
  }

  return {
    ref: query.ref,
    listeners: listeners,
    populated: populated
  };
}

module.exports = exports['default'];
//# sourceMappingURL=subscribe.js.map
