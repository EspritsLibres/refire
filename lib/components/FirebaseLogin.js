'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _index = require('../index');

var _actionsFirebase = require('../actions/firebase');

var defaultValidator = function defaultValidator(state) {
  return Object.keys(state).every(function (field) {
    return !!state[field];
  });
};

exports['default'] = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _options$validator = options.validator;
  var validator = _options$validator === undefined ? defaultValidator : _options$validator;

  return function (WrappedComponent) {
    var FirebaseLogin = (function (_Component) {
      _inherits(FirebaseLogin, _Component);

      _createClass(FirebaseLogin, null, [{
        key: 'propTypes',
        value: {
          dispatch: _react.PropTypes.func,
          _status: _react.PropTypes.object
        },
        enumerable: true
      }]);

      function FirebaseLogin(props) {
        _classCallCheck(this, _FirebaseLogin);

        _get(Object.getPrototypeOf(_FirebaseLogin.prototype), 'constructor', this).call(this, props);
        this.state = {
          email: null,
          password: null
        };
        this.submit = this.submit.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
      }

      _createClass(FirebaseLogin, [{
        key: 'submit',
        value: function submit(event) {
          event.preventDefault();
          this.props.dispatch((0, _actionsFirebase.passwordLogin)(this.state.email, this.state.password))['catch'](function () {});
        }
      }, {
        key: 'updateEmail',
        value: function updateEmail(event) {
          var error = this.props._status.errors.login;

          if (error) {
            this.props.dispatch((0, _actionsFirebase.clearLoginError)());
          }
          this.setState({ email: event.target.value });
        }
      }, {
        key: 'updatePassword',
        value: function updatePassword(event) {
          var error = this.props._status.errors.login;

          if (error) {
            this.props.dispatch((0, _actionsFirebase.clearLoginError)());
          }
          this.setState({ password: event.target.value });
        }
      }, {
        key: 'render',
        value: function render() {
          var _props$_status = this.props._status;
          var error = _props$_status.errors.login;
          var processing = _props$_status.processing.login;
          var completed = _props$_status.completed.login;

          var extraProps = {
            email: this.state.email,
            password: this.state.password,
            submit: this.submit,
            updateEmail: this.updateEmail,
            updatePassword: this.updatePassword,
            validInput: validator(this.state),
            error: error,
            processing: processing,
            completed: completed
          };

          return _react2['default'].createElement(WrappedComponent, _extends({}, this.props, extraProps));
        }
      }]);

      var _FirebaseLogin = FirebaseLogin;
      FirebaseLogin = (0, _reactRedux.connect)((0, _index.firebaseToProps)(["_status"]))(FirebaseLogin) || FirebaseLogin;
      return FirebaseLogin;
    })(_react.Component);

    return FirebaseLogin;
  };
};

module.exports = exports['default'];