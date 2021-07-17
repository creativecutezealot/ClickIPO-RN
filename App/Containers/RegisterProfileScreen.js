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
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Colors,
  Metrics,
  ApplicationStyles,
  Fonts,
  Images
} from '../Themes'

import TextField from '../Components/TextField'
import BrokerSelector from '../Components/BrokerSelector'
// import Checkbox from '../Components/Checkbox'
import FullButton from '../Components/FullButton'
import Styles from './Styles/RegisterProfileScreenStyle'

// external libs
import Icon from 'react-native-vector-icons/Ionicons'
// import Animatable from 'react-native-animatable'

import firebase from '../Config/FirebaseConfig'

// I18n
// import I18n from 'react-native-i18n'

// import Logger from '../Lib/Logger'

class RegisterProfileScreen extends React.Component {

  state: {
    email: String,
    password: String,
    showValidatedPassword: Boolean,
  }

  isProcessing: Boolean

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      showValidatedPassword: false,
      showValidatedEmail: false,
    }

    this.isProcessing = false
  }

  componentWillMount() {

    firebase.analytics().setCurrentScreen('account_create');
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      // set the error here
    }
    if (this.props.checkUserExists !== prevProps.checkUserExists) {

    }
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  handleEndEditingPassword = () => {
    this.setState({ showValidatedPassword: true })
  }

  handleChangeEmail = (email) => {
    this.setState({ email: email })
  }

  handleEndEditingEmail = () => {
    this.setState({ showValidatedEmail: true });
    //make the checkUser api call here
  }

  handleChangeFirstName = (text) => {
    this.setState({ firstName: text });
  }

  handleChangeLastName = (text) => {
    this.setState({ lastName: text });
  }

  isNameValid = () => {
    if (!this.state.firstName || this.state.firstName.length < 1) {
      return false
    } else if (!this.state.lastName || this.state.lastName.length < 1) {
      return false
    } else {
      return true
    }
  }


  isFormValid = () => {
    if (!this.isEmailValid()) {
      return false
    } else if (!this.isPasswordValid()) {
      return false
    } else if (!this.isNameValid()) {
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
    if (!this.state.password || this.state.password.length < 10) {
      return false
    }
    return true
  }

  handlePressNext = () => {
    if (this.isFormValid()) {
      const { email, password, firstName, lastName } = this.state
      const data = { email: email.toLowerCase(), first_name: firstName, last_name: lastName, password: password }
      this.props.checkUserExists(data);
    }
  }

  // onBrokerageChange = (brokerage) => {
  //   this.setState({
  //     brokerage: brokerage
  //   })
  // }

  render() {
    const { email, password, showValidatedPassword, showValidatedEmail, firstName, lastName } = this.state;
    const validatedPassword = this.isPasswordValid()
    const validatedEmail = this.isEmailValid()
    const submitEnabled = this.isFormValid()
    const { fetching } = this.props
    const editable = !fetching

    return (
      <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior='padding' style={Styles.Component}>
          <View style={Styles.ViewStyle}>
            <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.small, marginVertical: 10, color: Colors.blueSteel, textAlign: 'center' }]}>Please complete the form below to sign up</Text>
            {this.props.userExistsStatus ? <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.small, marginVertical: 10, color: Colors.invalid, textAlign: 'center' }]}>This email already exists. Please sign in or reset your password</Text> : null}
          </View>
          <View style={Styles.ViewStyle1}>
            <View style={Styles.ViewStyle2}>
              <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.tiny, color: Colors.blueSteel }]}>Sign up</Text>
              <TextField
                ref='email'
                value={email}
                editable={editable}
                keyboardType='email-address'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeEmail}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password.focus()}
                placeholder='Email'
                validated={validatedEmail}
                showValidated={showValidatedEmail}
                onEndEditing={this.handleEndEditingEmail}
              />
              <View style={Styles.ViewStyle}>
                <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.small, marginVertical: 10, color: Colors.blueSteel, textAlign: 'center' }]}>Create a password with at least 10 characters</Text>
              </View>
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
                onSubmitEditing={() => this.refs.firstName.focus()}
                placeholder='Password'
                validated={validatedPassword}
                showValidated={showValidatedPassword}
                isPassword={true}
              />
            </View>
            <View style={Styles.ViewStyle}>
              <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.small, marginVertical: 10, color: Colors.blueSteel, textAlign: 'center' }]}>Enter legal name</Text>
            </View>
            <TextField
              ref='firstName'
              iconClass={Icon}
              iconName={'ios-person'}
              value={firstName}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='words'
              // autoCorrect={false}
              onChangeText={this.handleChangeFirstName}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.lastName.focus()}
              placeholder='First name'
            />
            <TextField
              ref='lastName'
              iconClass={Icon}
              iconName={'ios-person'}
              value={lastName}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='words'
              // autoCorrect={false}
              onChangeText={this.handleChangeLastName}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handlePressNext}
              placeholder='Last name'
            />
            {/* <View style={styles.ViewStyle1}>
              <View style={Styles.ViewStyle}>
                <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.small, marginVertical: 10, color: Colors.blueSteel, textAlign: 'center' }]}>Who is your current brokerage firm?</Text>
              </View>
              <BrokerSelector onBrokerageChange={(data) => this.onBrokerageChange(data)} brokerage={brokerage} />
            </View> */}
            <View style={[{ flex: 1, flexDirection: 'row', marginTop: 25, marginBottom: 20 }, { marginTop: Metrics.doubleBaseMargin }]}>
              <FullButton
                ref='submit'
                text='Continue'
                onPress={this.handlePressNext}
                disabled={!submitEnabled}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.user.fetching,
    error: state.user.error,
    userExistsStatus: state.user.userExistsStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkUserExists: (data) => dispatch(UserActions.checkUserExists(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProfileScreen)
