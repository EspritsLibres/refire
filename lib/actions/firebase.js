'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.updateConfig = updateConfig;
exports.addArrayChild = addArrayChild;
exports.changeArrayChild = changeArrayChild;
exports.moveArrayChild = moveArrayChild;
exports.removeArrayChild = removeArrayChild;
exports.updateArray = updateArray;
exports.updateObject = updateObject;
exports.replaceValue = replaceValue;
exports.completeInitialFetch = completeInitialFetch;
exports.receiveInitialValue = receiveInitialValue;
exports.connect = connect;
exports.authenticateUser = authenticateUser;
exports.unauthenticateUser = unauthenticateUser;
exports.passwordLogin = passwordLogin;
exports.oAuthLogin = oAuthLogin;
exports.logout = logout;
exports.createUser = createUser;
exports.resetPassword = resetPassword;
exports.write = write;
exports.clearLoginError = clearLoginError;
exports.clearRegistrationError = clearRegistrationError;
exports.clearResetPasswordError = clearResetPasswordError;
exports.clearWriteErrors = clearWriteErrors;
exports.revokePermissions = revokePermissions;
exports.clearPermissionsError = clearPermissionsError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _lodashArrayUniq = require('lodash/array/uniq');

var _lodashArrayUniq2 = _interopRequireDefault(_lodashArrayUniq);

var ARRAY_CHILD_ADDED = "ARRAY_CHILD_ADDED";
exports.ARRAY_CHILD_ADDED = ARRAY_CHILD_ADDED;
var ARRAY_CHILD_CHANGED = "ARRAY_CHILD_CHANGED";
exports.ARRAY_CHILD_CHANGED = ARRAY_CHILD_CHANGED;
var ARRAY_CHILD_MOVED = "ARRAY_CHILD_MOVED";
exports.ARRAY_CHILD_MOVED = ARRAY_CHILD_MOVED;
var ARRAY_CHILD_REMOVED = "ARRAY_CHILD_REMOVED";
exports.ARRAY_CHILD_REMOVED = ARRAY_CHILD_REMOVED;
var ARRAY_UPDATED = "ARRAY_UPDATED";
exports.ARRAY_UPDATED = ARRAY_UPDATED;
var OBJECT_UPDATED = "OBJECT_UPDATED";
exports.OBJECT_UPDATED = OBJECT_UPDATED;
var VALUE_REPLACED = "VALUE_REPLACED";
exports.VALUE_REPLACED = VALUE_REPLACED;
var INITIAL_VALUE_RECEIVED = "INITIAL_VALUE_RECEIVED";
exports.INITIAL_VALUE_RECEIVED = INITIAL_VALUE_RECEIVED;
var INITIAL_FETCH_DONE = "INITIAL_FETCH_DONE";
exports.INITIAL_FETCH_DONE = INITIAL_FETCH_DONE;
var CONNECTED = "CONNECTED";
exports.CONNECTED = CONNECTED;
var USER_AUTHENTICATED = "USER_AUTHENTICATED";
exports.USER_AUTHENTICATED = USER_AUTHENTICATED;
var USER_UNAUTHENTICATED = "USER_UNAUTHENTICATED";
exports.USER_UNAUTHENTICATED = USER_UNAUTHENTICATED;
var CONFIG_UPDATED = "CONFIG_UPDATED";
exports.CONFIG_UPDATED = CONFIG_UPDATED;
var ERROR_UPDATED = "ERROR_UPDATED";
exports.ERROR_UPDATED = ERROR_UPDATED;
var PROCESSING_UPDATED = "PROCESSING_UPDATED";
exports.PROCESSING_UPDATED = PROCESSING_UPDATED;
var COMPLETED_UPDATED = "COMPLETED_UPDATED";
exports.COMPLETED_UPDATED = COMPLETED_UPDATED;
var WRITE_PROCESSING_UPDATED = "WRITE_PROCESSING_UPDATED";
exports.WRITE_PROCESSING_UPDATED = WRITE_PROCESSING_UPDATED;
var WRITE_ERRORS_UPDATED = "WRITE_ERRORS_UPDATED";

exports.WRITE_ERRORS_UPDATED = WRITE_ERRORS_UPDATED;
var authProviders = {
  facebook: "FacebookAuthProvider",
  github: "GithubAuthProvider",
  google: "GoogleAuthProvider",
  twitter: "TwitterAuthProvider"
};

var authFlows = {
  popup: "signInWithPopup",
  redirect: "signInWithRedirect"
};

// generated UUIDs are only used for internal request tracking
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    var rand = Math.random() * 16 | 0;
    var value = char === 'x' ? rand : rand & 0x3 | 0x8;
    return value.toString(16);
  });
}

var createUserErrors = {
  "EMAIL_TAKEN": "The new user account cannot be created because the email is already in use.",
  "INVALID_EMAIL": "The specified email is not a valid email."
};

var resetPasswordErrors = {
  "INVALID_USER": "The specified user account does not exist."
};

function createRecord(key, value) {
  return {
    key: key,
    value: value
  };
}

function updateProcessing(field, value) {
  return {
    type: PROCESSING_UPDATED,
    payload: {
      field: field,
      value: value
    }
  };
}

function updateWriteProcessing() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var path = options.path;
  var id = options.id;
  var value = options.value;

  return {
    type: WRITE_PROCESSING_UPDATED,
    payload: {
      path: path,
      id: id,
      value: value
    }
  };
}

function updateError(field, error) {
  return {
    type: ERROR_UPDATED,
    payload: {
      field: field,
      error: error
    }
  };
}

function updateWriteErrors(path, error) {
  return {
    type: WRITE_ERRORS_UPDATED,
    payload: {
      path: path,
      error: error
    }
  };
}

function updateCompleted(field, value) {
  return {
    type: COMPLETED_UPDATED,
    payload: {
      field: field,
      value: value
    }
  };
}

function updateConfig(options) {
  return {
    type: CONFIG_UPDATED,
    payload: options
  };
}

function addArrayChild(path, key, value, previousChildKey) {
  return {
    type: ARRAY_CHILD_ADDED,
    payload: {
      path: path,
      key: key,
      value: createRecord(key, value),
      previousChildKey: previousChildKey
    }
  };
}

function changeArrayChild(path, key, value) {
  return {
    type: ARRAY_CHILD_CHANGED,
    payload: {
      path: path,
      key: key,
      value: createRecord(key, value)
    }
  };
}

function moveArrayChild(path, snapshot, previousChildKey) {
  return {
    type: ARRAY_CHILD_MOVED,
    payload: {
      path: path,
      key: snapshot.key,
      previousChildKey: previousChildKey
    }
  };
}

function removeArrayChild(path, snapshot) {
  return {
    type: ARRAY_CHILD_REMOVED,
    payload: {
      path: path,
      key: snapshot.key
    }
  };
}

function updateArray(path, key, value) {
  var recordsArray = Object.keys(value || []).reduce(function (arr, recordKey) {
    arr.push(createRecord(recordKey, value[recordKey]));
    return arr;
  }, []);

  return {
    type: ARRAY_UPDATED,
    payload: {
      path: path,
      value: createRecord(key, recordsArray)
    }
  };
}

function updateObject(path, snapshot) {
  return {
    type: OBJECT_UPDATED,
    payload: {
      path: path,
      value: createRecord(snapshot.key, snapshot.val())
    }
  };
}

function replaceValue(path, value) {
  return {
    type: VALUE_REPLACED,
    payload: {
      path: path,
      value: value
    }
  };
}

function completeInitialFetch() {
  return {
    type: INITIAL_FETCH_DONE
  };
}

function receiveInitialValue(path) {
  return function (dispatch, getState) {
    var _getState = getState();

    var initialFetchDone = _getState.firebase.initialFetchDone;

    if (!initialFetchDone) {

      dispatch({
        type: INITIAL_VALUE_RECEIVED,
        payload: {
          path: path
        }
      });

      var _getState2 = getState();

      var _getState2$firebase = _getState2.firebase;
      var initialValuesReceived = _getState2$firebase.initialValuesReceived;
      var stores = _getState2$firebase.stores;

      if ((0, _lodashArrayUniq2['default'])(initialValuesReceived).length === Object.keys(stores).length) {
        dispatch(completeInitialFetch());
      }
    }
  };
}

function connect() {
  return { type: CONNECTED };
}

function authenticateUser(authData) {
  return {
    type: USER_AUTHENTICATED,
    payload: authData
  };
}

function unauthenticateUser() {
  return {
    type: USER_UNAUTHENTICATED
  };
}

function passwordLogin(email, password) {
  return function (dispatch, getState) {
    return new Promise(function (resolve, reject) {
      dispatch(updateProcessing("login", true));

      var _getState3 = getState();

      var name = _getState3.firebase.name;

      _firebase2['default'].app(name).auth().signInWithEmailAndPassword(email, password).then(function () {
        dispatch(updateProcessing("login", false));
        dispatch(updateCompleted("login", true));
        return resolve();
      })['catch'](function (error) {
        dispatch(updateError("login", error));
        dispatch(updateProcessing("login", false));
        return reject();
      });
    });
  };
}

function oAuthLogin(flowCode, providerCode) {
  var scopes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  return function (dispatch, getState) {
    return new Promise(function (resolve, reject) {
      dispatch(updateProcessing("login", true));

      var provider = new _firebase2['default'].auth[authProviders[providerCode]]();
      scopes.forEach(function (scope) {
        provider.addScope(scope);
      });
      var flow = authFlows[flowCode];

      var _getState4 = getState();

      var name = _getState4.firebase.name;

      _firebase2['default'].app(name).auth()[flow](provider).then(function () {
        dispatch(updateProcessing("login", false));
        dispatch(updateCompleted("login", true));
        return resolve();
      })['catch'](function (error) {
        dispatch(updateError("login", error));
        dispatch(updateProcessing("login", false));
        return reject();
      });
    });
  };
}

function logout() {
  return function () {
    _firebase2['default'].auth().signOut();
  };
}

function createUser(email, password) {
  return function (dispatch, getState) {
    return new Promise(function (resolve, reject) {
      dispatch(updateProcessing("createUser", true));

      var _getState5 = getState();

      var name = _getState5.firebase.name;

      _firebase2['default'].app(name).auth().createUserWithEmailAndPassword(email, password).then(function (userData) {
        dispatch(updateProcessing("createUser", false));
        dispatch(updateCompleted("createUser", true));
        return resolve(userData);
      })['catch'](function (error) {
        dispatch(updateError("createUser", error));
        dispatch(updateProcessing("createUser", false));
        return reject();
      });
    });
  };
}

function resetPassword(email) {
  return function (dispatch, getState) {
    dispatch(updateProcessing("resetPassword", true));

    var _getState6 = getState();

    var name = _getState6.firebase.name;

    _firebase2['default'].app(name).auth().sendPasswordResetEmail(email).then(function () {
      dispatch(updateProcessing("resetPassword", false));
      dispatch(updateCompleted("resetPassword", true));
    })['catch'](function (error) {
      dispatch(updateError("resetPassword", error));
      dispatch(updateProcessing("resetPassword", false));
    });
  };
}

function write(_ref) {
  var method = _ref.method;
  var _ref$path = _ref.path;
  var path = _ref$path === undefined ? "" : _ref$path;
  var value = _ref.value;
  var ownProps = _ref.ownProps;

  return function (dispatch, getState) {
    return new Promise(function (resolve, reject) {

      var id = createUUID();
      var finalPath = typeof path === "function" ? path(getState(), ownProps) : path ? path : "/";

      var _getState7 = getState();

      var name = _getState7.firebase.name;

      dispatch(updateWriteProcessing({
        path: finalPath,
        id: id,
        value: true
      }));

      var ref = _firebase2['default'].app(name).database().ref(finalPath);
      ref[method](value, function (error) {
        if (error) {
          dispatch(updateWriteErrors(finalPath, error));
          return reject();
        }
        dispatch(updateWriteProcessing({
          path: finalPath,
          id: id,
          value: false
        }));
        return resolve();
      });
    });
  };
}

function clearLoginError() {
  return updateError("login", null);
}

function clearRegistrationError() {
  return updateError("createUser", null);
}

function clearResetPasswordError() {
  return updateError("resetPassword", null);
}

function clearWriteErrors(path) {
  return updateWriteErrors(path, null);
}

function revokePermissions(error) {
  return updateError("permissions", error.toString());
}

function clearPermissionsError() {
  return updateError("permissions", null);
}
//# sourceMappingURL=firebase.js.map