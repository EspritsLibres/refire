import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { firebaseToProps } from '../index'
import { resetPassword, clearResetPasswordError } from '../actions/firebase'

const defaultValidator = input => {
  return !!input
}

export default function(options = {}) {

  const { validator = defaultValidator } = options

  return WrappedComponent => {

    @connect(firebaseToProps(["_status"]))
    class FirebaseResetPassword extends Component {

      static propTypes = {
        dispatch: PropTypes.func,
        _status: PropTypes.object
      }

      constructor(props) {
        super(props)
        this.state = {
          email: null
        }
        this.submit = this.submit.bind(this)
        this.updateEmail = this.updateEmail.bind(this)
      }

      submit(event) {
        event.preventDefault()
        this.props.dispatch(
          resetPassword(this.state.email)
        )
      }

      updateEmail(event) {
        const { errors: { resetPassword: error } } = this.props._status
        if (error) {
          this.props.dispatch(clearResetPasswordError())
        }
        this.setState({ email: event.target.value })
      }

      render() {
        const {
          errors: { resetPassword: error },
          processing: { resetPassword: processing },
          completed: { resetPassword: completed }
        } = this.props._status

        const extraProps = {
          email: this.state.email,
          submit: this.submit,
          updateEmail: this.updateEmail,
          validInput: validator(this.state.email),
          error: error,
          processing: processing,
          completed: completed
        }

        return <WrappedComponent { ...this.props } { ...extraProps } />
      }

    }

    return FirebaseResetPassword
  }
}
