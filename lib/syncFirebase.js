'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = syncFirebase;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _lodashLangIsEqual = require('lodash/lang/isEqual');

var _lodashLangIsEqual2 = _interopRequireDefault(_lodashLangIsEqual);

var _lodashArrayDifference = require('lodash/array/difference');

var _lodashArrayDifference2 = _interopRequireDefault(_lodashArrayDifference);

var _lodashArrayIntersection = require('lodash/array/intersection');

var _lodashArrayIntersection2 = _interopRequireDefault(_lodashArrayIntersection);

var _actionsFirebase = require('./actions/firebase');

var _syncFirebaseCreateOptions = require('./syncFirebase/createOptions');

var _syncFirebaseCreateOptions2 = _interopRequireDefault(_syncFirebaseCreateOptions);

var _syncFirebaseSubscribe = require('./syncFirebase/subscribe');

var _syncFirebaseSubscribe2 = _interopRequireDefault(_syncFirebaseSubscribe);

var _syncFirebaseUnsubscribe = require('./syncFirebase/unsubscribe');

var _syncFirebaseUnsubscribe2 = _interopRequireDefault(_syncFirebaseUnsubscribe);

var _syncFirebaseUnsubscribeAll = require('./syncFirebase/unsubscribeAll');

var _syncFirebaseUnsubscribeAll2 = _interopRequireDefault(_syncFirebaseUnsubscribeAll);

function syncFirebase() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var apiKey = options.apiKey;
  var store = options.store;
  var projectId = options.projectId;
  var databaseURL = options.databaseURL;
  var serviceAccount = options.serviceAccount;
  var _options$name = options.name;
  var name = _options$name === undefined ? '[DEFAULT]' : _options$name;
  var _options$bindings = options.bindings;
  var initialBindings = _options$bindings === undefined ? {} : _options$bindings;
  var _options$onCancel = options.onCancel;
  var onCancel = _options$onCancel === undefined ? function () {} : _options$onCancel;
  var onAuth = options.onAuth;
  var pathParams = options.pathParams;

  if (typeof store === "undefined") {
    throw new Error("syncFirebase: Redux store reference not found in options");
  }

  if (typeof projectId === "undefined") {
    throw new Error("syncFirebase: projectId not found in options");
  }

  if (typeof apiKey === "undefined") {
    throw new Error("syncFirebase: apiKey not found in options");
  }

  if (typeof url !== "undefined") {
    throw new Error("syncFirebase: url is deprecated in options, use projectId & apiKey instead");
  }

  var config = {
    apiKey: apiKey,
    authDomain: projectId + '.firebaseapp.com',
    databaseURL: databaseURL ? databaseURL : 'https://' + projectId + '.firebaseio.com',
    storageBucket: projectId + '.appspot.com'
  };

  if (serviceAccount) {
    config.serviceAccount = serviceAccount;
  }

  store.dispatch((0, _actionsFirebase.updateConfig)({ name: name }));

  var app = _firebase2['default'].initializeApp(config, name);
  var rootRef = _firebase2['default'].database(app).ref();
  var firebaseRefs = {};
  var firebaseListeners = {};
  var firebasePopulated = {};

  var currentOptions = (0, _syncFirebaseCreateOptions2['default'])({
    bindings: initialBindings,
    state: store.getState(),
    projectId: projectId,
    pathParams: pathParams,
    appName: name
  });

  store.subscribe(function () {
    var previousOptions = _extends({}, currentOptions);
    var nextOptions = (0, _syncFirebaseCreateOptions2['default'])({
      bindings: initialBindings,
      state: store.getState(),
      projectId: projectId,
      pathParams: pathParams,
      appName: name
    });

    if (!(0, _lodashLangIsEqual2['default'])(currentOptions, nextOptions)) {

      var nextOptionsKeys = Object.keys(nextOptions);
      var currentOptionsKeys = Object.keys(currentOptions);

      var subscribed = (0, _lodashArrayDifference2['default'])(nextOptionsKeys, currentOptionsKeys);
      var unsubscribed = (0, _lodashArrayDifference2['default'])(currentOptionsKeys, nextOptionsKeys);
      var remaining = (0, _lodashArrayIntersection2['default'])(currentOptionsKeys, nextOptionsKeys);

      currentOptions = nextOptions;

      // unsubscribe removed bindings
      unsubscribed.forEach(function (localBinding) {
        (0, _syncFirebaseUnsubscribe2['default'])(firebaseRefs[localBinding], firebaseListeners[localBinding], firebasePopulated[localBinding]);
        delete firebaseRefs[localBinding];
        delete firebaseListeners[localBinding];
        delete firebasePopulated[localBinding];

        // reset store value to null
        store.dispatch((0, _actionsFirebase.replaceValue)(localBinding, null));
      });

      // subscribe new bindings
      subscribed.forEach(function (localBinding) {
        var _subscribe = (0, _syncFirebaseSubscribe2['default'])(localBinding, currentOptions[localBinding], {
          store: store,
          onCancel: onCancel,
          name: name
        });

        var ref = _subscribe.ref;
        var listeners = _subscribe.listeners;
        var populated = _subscribe.populated;

        firebaseRefs[localBinding] = ref;
        firebaseListeners[localBinding] = listeners;
        firebasePopulated[localBinding] = populated;
      });

      // check if subscription paths or queries have changed
      remaining.forEach(function (localBinding) {
        if (!(0, _lodashLangIsEqual2['default'])(currentOptions[localBinding].path, previousOptions[localBinding].path) || !(0, _lodashLangIsEqual2['default'])(currentOptions[localBinding].queryState, previousOptions[localBinding].queryState)) {
          // unsubscribe
          (0, _syncFirebaseUnsubscribe2['default'])(firebaseRefs[localBinding], firebaseListeners[localBinding], firebasePopulated[localBinding]);
          delete firebaseRefs[localBinding];
          delete firebaseListeners[localBinding];
          delete firebasePopulated[localBinding];

          // resubscribe with new path / query

          var _subscribe2 = (0, _syncFirebaseSubscribe2['default'])(localBinding, currentOptions[localBinding], {
            store: store,
            onCancel: onCancel,
            name: name
          });

          var ref = _subscribe2.ref;
          var listeners = _subscribe2.listeners;
          var populated = _subscribe2.populated;

          firebaseRefs[localBinding] = ref;
          firebaseListeners[localBinding] = listeners;
          firebasePopulated[localBinding] = populated;
        }
      });
    }
  });

  _firebase2['default'].database(app).ref('.info/connected').on('value', function (snapshot) {
    if (snapshot.val() === true) {
      store.dispatch((0, _actionsFirebase.connect)());
    }
  }, _actionsFirebase.revokePermissions);

  // we need to check for existence of auth as node version doesn't include it
  if (_firebase2['default'].auth(app) && typeof _firebase2['default'].auth(app).onAuthStateChanged === "function") {
    _firebase2['default'].auth(app).onAuthStateChanged(function (authData) {
      // TODO: decide proper user data format
      // current format is like this for backwards compatibility with 1.x
      var user = authData ? _extends({}, authData.providerData[0], { uid: authData.uid }) : null;
      if (user) {
        store.dispatch((0, _actionsFirebase.authenticateUser)(user));
      } else {
        store.dispatch((0, _actionsFirebase.unauthenticateUser)());
      }
      if (onAuth && typeof onAuth === "function") {
        onAuth(user, rootRef);
      }
    });
  }

  // initial subscriptions
  Object.keys(currentOptions).forEach(function (localBinding) {
    var _subscribe3 = (0, _syncFirebaseSubscribe2['default'])(localBinding, currentOptions[localBinding], {
      store: store,
      onCancel: onCancel,
      name: name
    });

    var ref = _subscribe3.ref;
    var listeners = _subscribe3.listeners;
    var populated = _subscribe3.populated;

    firebaseRefs[localBinding] = ref;
    firebaseListeners[localBinding] = listeners;
    firebasePopulated[localBinding] = populated;
  });

  var initialized = new Promise(function (resolve) {
    var unsubscribe = store.subscribe(function () {
      var _store$getState = store.getState();

      var firebase = _store$getState.firebase;

      if (firebase.connected && firebase.initialFetchDone) {
        resolve();
        unsubscribe();
      }
    });
  });

  // immediately mark initial fetch completed if we aren't initially subscribed to any stores
  if (!Object.keys(currentOptions).length) {
    store.dispatch((0, _actionsFirebase.completeInitialFetch)());
  }

  // mark initial values received for stores that don't have initial value
  (0, _lodashArrayDifference2['default'])(Object.keys(initialBindings), Object.keys(currentOptions)).forEach(function (localBinding) {
    store.dispatch((0, _actionsFirebase.receiveInitialValue)(localBinding));
  });

  return Object.defineProperties({
    unsubscribe: function unsubscribe() {
      return (0, _syncFirebaseUnsubscribeAll2['default'])(firebaseRefs, firebaseListeners, firebasePopulated);
    }
  }, {
    refs: {
      enumerable: false,
      writable: false,
      value: firebaseRefs
    },
    listeners: {
      enumerable: false,
      writable: false,
      value: firebaseListeners
    },
    populated: {
      enumerable: false,
      writable: false,
      value: firebasePopulated
    },
    initialized: {
      enumerable: false,
      writable: false,
      value: initialized
    }
  });
}

module.exports = exports['default'];