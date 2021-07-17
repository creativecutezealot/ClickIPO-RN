import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  KeyboardAvoidingView
} from 'react-native'

import { connect } from 'react-redux'
import UserActions from '../Redux/UserRedux'
// import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  ApplicationStyles
  // Colors,
  // Metrics
  // Fonts
  // Images
} from '../Themes'

import TextField from '../Components/TextField'
// import Checkbox from '../Components/Checkbox'
import FullButton from '../Components/FullButton'

// external libs
import Icon from 'react-native-vector-icons/Ionicons'
// import Animatable from 'react-native-animatable'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class ForgotPasswordView extends React.Component {

  state: {
    email: String,

    isProcessing: Boolean,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'ForgotPasswordView.constructor()', props: props })

    const { email = '' } = this.props

    this.state = {
      email: email,

      isProcessing: false
    }
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'ForgotPasswordView.componentWillReceiveProps()', value: newProps })

    const { isProcessing } = this.state
    const { error } = newProps

    if (isProcessing && error) {
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.setState({ isProcessing: false })
          }
        }]
      )
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'ForgotPasswordView.componentWillMount()' })
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'ForgotPasswordView.componentWillUnmount()' })
  }

  handleChangeEmail = (text) => {
    this.setState({ email: text })
  }

  isFormValid = () => {
    if (!this.state.email || this.state.email.length < 1) {
      return false
    }

    return true
  }

  handleSubmit = () => {
    if (this.isFormValid()) {
      const { email } = this.state
      const data = { email: email }

      this.setState({ isProcessing: true })

      this.props.forgotPassword(data)
    }
  }

  render () {
    const { email } = this.state
    const submitEnabled = this.isFormValid()

    // Logger.log('pin=> ' + pin)

    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={ApplicationStyles.mainContainer}>
        <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
          <View style={ApplicationStyles.contentContainer}>
            <Text style={ApplicationStyles.headline}>Forgot Password?</Text>
            <Text style={ApplicationStyles.tagline}>Submit your email and we'll send you a link to reset it.</Text>

            <View style={ApplicationStyles.rowContainer}>
              <TextField
                ref='email'
                iconClass={Icon}
                iconName={'ios-person'}
                value={email}
                keyboardType='email-address'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeEmail}
                underlineColorAndroid='transparent'
                onSubmitEditing={this.handleSubmit}
                placeholder='Email' />
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <FullButton
                ref='submit'
                text='Next'
                onPress={this.handleSubmit}
                disabled={!submitEnabled} />
            </View>

          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}

ForgotPasswordView.propTypes = {
  forgotPassword: PropTypes.func,

  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: (data) => dispatch(UserActions.forgotPassword(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordView)
