'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actionsFirebase = require('../actions/firebase');

var validMethods = {
  push: true,
  set: true,
  transaction: true,
  update: true
};

exports['default'] = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _options$path = options.path;
  var path = _options$path === undefined ? "" : _options$path;
  var method = options.method;

  if (typeof path !== "function" && typeof path !== "string") {
    throw new Error("options.path must be a function or string");
  }

  if (typeof method !== "string" || !validMethods[method]) {
    throw new Error('options.method must be one of: ' + Object.keys(validMethods).join(", "));
  }

  return function (WrappedComponent) {
    var FirebaseWrite = (function (_Component) {
      _inherits(FirebaseWrite, _Component);

      _createClass(FirebaseWrite, null, [{
        key: 'propTypes',
        value: {
          dispatch: _react.PropTypes.func,
          processing: _react.PropTypes.array,
          errors: _react.PropTypes.array
        },
        enumerable: true
      }]);

      function FirebaseWrite(props) {
        _classCallCheck(this, _FirebaseWrite);

        _get(Object.getPrototypeOf(_FirebaseWrite.prototype), 'constructor', this).call(this, props);
        this.clearErrors = this.clearErrors.bind(this);
        this.submit = this.submit.bind(this);
      }

      _createClass(FirebaseWrite, [{
        key: 'submit',
        value: function submit(value) {
          var _props = this.props;
          var dispatch = _props.dispatch;
          var processing = _props.processing;
          var errors = _props.errors;

          var ownProps = _objectWithoutProperties(_props, ['dispatch', 'processing', 'errors']);

          return dispatch((0, _actionsFirebase.write)({ method: method, path: path, value: value, ownProps: ownProps }));
        }
      }, {
        key: 'clearErrors',
        value: function clearErrors() {
          this.props.dispatch((0, _actionsFirebase.clearWriteErrors)(path));
        }
      }, {
        key: 'render',
        value: function render() {
          var processing = this.props.processing && !!this.props.processing.length;
          var errors = this.props.errors || [];

          var extraProps = {
            submit: this.submit,
            clearErrors: this.clearErrors,
            errors: errors,
            processing: processing
          };

          return _react2['default'].createElement(WrappedComponent, _extends({}, this.props, extraProps));
        }
      }]);

      var _FirebaseWrite = FirebaseWrite;
      FirebaseWrite = (0, _reactRedux.connect)(function (state, ownProps) {
        var processing = state.firebase.writes.processing;
        var errors = state.firebase.writes.errors;
        var firebasePath = typeof path === "function" ? path(state, ownProps) : path;

        return {
          processing: processing[firebasePath],
          errors: errors[firebasePath]
        };
      })(FirebaseWrite) || FirebaseWrite;
      return FirebaseWrite;
    })(_react.Component);

    return FirebaseWrite;
  };
};

module.exports = exports['default'];