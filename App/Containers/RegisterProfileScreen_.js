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
// import UserActions from '../Redux/UserRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  // Colors,
  Metrics,
  ApplicationStyles
  // Fonts
  // Images
} from '../Themes'

import TextField from '../Components/TextField'
import BrokerSelector from '../Components/BrokerSelector'
// import Checkbox from '../Components/Checkbox'
import FullButton from '../Components/FullButton'
import Styles from './Styles/RegisterProfileScreen_Style'

// external libs
import Icon from 'react-native-vector-icons/Ionicons'
// import Animatable from 'react-native-animatable'

import firebase from '../Config/FirebaseConfig'

// I18n
// import I18n from 'react-native-i18n'

// import Logger from '../Lib/Logger'

class RegisterProfileScreen extends React.Component {

  state: {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    verifyPassword: String,
    pin: String,

    showValidatedPassword: Boolean,
    showValidatedVerifyPassword: Boolean,
    showValidatedEmail: Boolean
  }

  isProcessing: Boolean

  constructor (props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      verifyPassword: '',
      pin: '',
      verifyPin: '',
      brokerage: 'Just2Trade',

      showValidatedPassword: false,
      showValidatedVerifyPassword: false,
      showValidatedEmail: false
    }

    this.isProcessing = false
  }

  componentWillReceiveProps (newProps) {
    // Logger.log({ name: 'RegisterProfileScreen.componentWillReceiveProps()', value: newProps })

    // this.forceUpdate()

    const { error } = newProps

    if (this.isProcessing && error) {
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.isProcessing = false
          }
        }]
      )
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'RegisterProfileScreen.componentWillMount()' })
    firebase.analytics().setCurrentScreen('account_create')

  }

  componentWillUnmount () {
    // Logger.log({ name: 'RegisterProfileScreen.componentWillUnmount()' })
  }

  handleChangeFirstName = (text) => {
    this.setState({ firstName: text })
  }

  handleChangeLastName = (text) => {
    this.setState({ lastName: text })
  }

  handleChangeEmail = (text) => {
    this.setState({ email: text })
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  handleEndEditingPassword = () => {
    this.setState({ showValidatedPassword: true })
  }

  handleEndEditingEmail = () => {
    this.setState({ showValidatedEmail: true })
  }

  handleChangeVerifyPassword = (text) => {
    this.setState({ verifyPassword: text })

    if (text === this.state.password) {
      this.handleEndEditingVerifyPassword()
    }
  }

  handleEndEditingVerifyPassword = () => {
    this.setState({ showValidatedVerifyPassword: true })
  }

  handleChangePin = (text) => {
    this.setState({ pin: text })
  }

  isFormValid = () => {
    if (!this.state.firstName || this.state.firstName.length < 1) {
      return false
    } else if (!this.state.lastName || this.state.lastName.length < 1) {
      return false
    } else if (!this.isEmailValid()) {
      return false
    } else if (!this.isPasswordValid()) {
      return false
    } else if (!this.isVerifyPasswordValid()) {
      return false
    }

    return true
  }

  isEmailValid = () => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.state.email)) {
      return false
    }
    return true
  }

  isPasswordValid = () => {
    if (!this.state.password || this.state.password.length < 8) {
      return false
    }
    if(!/[0-9]/.test(this.state.password)) {
      return false
    }
    if(!/[a-z]/.test(this.state.password) && !/[A-Z]/.test(this.state.password)) {
      return false
    }
    var casePassword = this.state.password.slice();
    casePassword = casePassword.toLowerCase();

    var firstName = this.state.firstName.slice();
    firstName = firstName.toLowerCase();
    firstName = new RegExp(firstName);

    var lastName = this.state.lastName.slice();
    lastName = lastName.toLowerCase();
    lastName = new RegExp(lastName);
    if(this.state.firstName && (firstName.test(casePassword) || lastName.test(casePassword))) {
      return false
    }
    var email = this.state.email.slice();
    email = email.toLowerCase();
    emailExp = new RegExp(email);

    var username = email.split("@")[0];
    username = username.toLowerCase();
    username = new RegExp(username);
    if(this.state.email && (emailExp.test(casePassword) || username.test(casePassword))) {
      return false
    }

    return true
  }

  isVerifyPasswordValid = () => {
    if (!this.state.verifyPassword || !this.isPasswordValid()) {
      return false
    } else if (this.state.password !== this.state.verifyPassword) {
      return false
    }

    return true
  }

  handlePressNext = () => {
    if (this.isFormValid()) {
      const { email, firstName, lastName, password, verifyPassword, brokerage } = this.state
      const data = {data: { email: email, first_name: firstName, last_name: lastName, password: password, password_confirmation: verifyPassword, marketing_brokerage: brokerage }}

      NavigationActions.registerTermsConditions(data)
    }
  }

  onBrokerageChange = (brokerage) => {
    this.setState({
      brokerage: brokerage
    })
  }

  render () {
    const { firstName, lastName, email, password, verifyPassword, showValidatedPassword, showValidatedVerifyPassword, showValidatedEmail, brokerage } = this.state
    const validatedPassword = this.isPasswordValid()
    const validatedVerifyPassword = this.isVerifyPasswordValid()
    const validatedEmail = this.isEmailValid()
    const submitEnabled = this.isFormValid()

    // Logger.log('pin=> ' + pin)

    return (
      <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior='padding' style={Styles.Component}>
          <View style={ApplicationStyles.contentContainer}>
            <Text style={ApplicationStyles.tagline}>Get access to IPO and secondary offering information.</Text>

            <View style={[ApplicationStyles.rowContainer, { marginTop: Metrics.doubleBaseMargin, flexDirection: 'row' }]}>
              <TextField
                ref='firstName'
                iconClass={Icon}
                iconName={'ios-person'}
                value={firstName}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeFirstName}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.lastName.focus()}
                placeholder='First name'
                style = {Styles.TextStyle} />

                <TextField
                ref='lastName'
                iconClass={Icon}
                iconName={'ios-person'}
                value={lastName}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeLastName}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.email.focus()}
                placeholder='Last name'
                style = {Styles.TextStyle1} />
            </View>

            

            <View style={ApplicationStyles.rowContainer}>
              <TextField
                ref='email'
                iconClass={Icon}
                iconName={'ios-mail'}
                value={email}
                keyboardType='email-address'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeEmail}
                onEndEditing={this.handleEndEditingEmail}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password.focus()}
                validated={validatedEmail}
                showValidated={showValidatedEmail}
                placeholder='Email' />
            </View>

            <View>
              <Text style={Styles.TeXt}>Password must contain at least 8 characters with at least 1 number, and cannot include your first name, last name, or email username.</Text>
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <TextField
                ref='password'
                iconClass={Icon}
                iconName={'ios-lock'}
                value={password}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
                onChangeText={this.handleChangePassword}
                onEndEditing={this.handleEndEditingPassword}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.verifyPassword.focus()}
                placeholder='Password'
                validated={validatedPassword}
                showValidated={showValidatedPassword}
                isPassword={true}
                  />
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <TextField
                ref='verifyPassword'
                iconClass={Icon}
                iconName={'ios-lock'}
                value={verifyPassword}
                keyboardType='default'
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
                onChangeText={this.handleChangeVerifyPassword}
                onEndEditing={this.handleEndEditingVerifyPassword}
                underlineColorAndroid='transparent'
                onSubmitEditing={this.handlePressNext}
                placeholder='Verify Password'
                validated={validatedVerifyPassword}
                showValidated={showValidatedVerifyPassword}
                isPassword={true}
                  />
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <BrokerSelector onBrokerageChange={(data) => this.onBrokerageChange(data)} brokerage={brokerage} />

            </View>


            <View style={ApplicationStyles.rowContainer}>
              <FullButton
                ref='submit'
                text='Next'
                onPress={this.handlePressNext}
                disabled={!submitEnabled}
                  />
            </View>

          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  /*
  <View style={ApplicationStyles.inputContainer}>
    <TextField
      ref='pin'
      iconClass={Icon}
      iconName={'lock'}
      value={pin}
      keyboardType='default'
      returnKeyType='next'
      autoCapitalize='none'
      autoCorrect={false}
      secureTextEntry
      onChangeText={this.handleChangePin}
      underlineColorAndroid='transparent'
      onSubmitEditing={() => this.refs.next.focus()}
      placeholder='Pin (4 Numerals)' />
  </View>

  <Text style={ApplicationStyles.note}>What's this?</Text>

  <View style={ApplicationStyles.inputContainer}>
    <Checkbox
      label='Enable Apple Touch ID for confirming purchases'
      labelStyle={ApplicationStyles.toggleLabel}
      checked={true}
      onChange={(checked) => Logger.log('I am checked', checked)}
    />
  </View>
  */
}

RegisterProfileScreen.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProfileScreen)
