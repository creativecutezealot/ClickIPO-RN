import React from 'react'
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  ScrollView,
  Text,
  // TextInput,
  TouchableOpacity,
  Image,
  // Keyboard,
  // LayoutAnimation,
  KeyboardAvoidingView
} from 'react-native'

import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import UserActions from '../Redux/UserRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Images,
  Colors,
  Metrics,
  Fonts,
  ApplicationStyles
} from '../Themes'

import TextField from '../Components/TextField'
import Checkbox from '../Components/Checkbox'
import FullButton from '../Components/FullButton'
import LoadingView from '../Components/LoadingView'

// external libs
import Icon from 'react-native-vector-icons/Ionicons'

import LinearGradient from 'react-native-linear-gradient'

import {
  // Token,
  // User,
  // ClickIpoError,
  Fob
} from '../Models'

// I18n
import I18n from 'react-native-i18n'

import firebase from '../Config/FirebaseConfig'
import Styles from './Styles/LoginContinueScreenStyle'

import Logger from '../Lib/Logger'

class LoginContinueScreen extends React.Component {
  state: {
    email: String,
    password: String,
    rememberMe: Boolean,

    touchIdSupported: Boolean,
    fob: Fob,

    isLogout: Boolean,

    error: Object,
    processing: Boolean,
    showValidatedPassword: Boolean,

  }

  constructor (props) {
    super(props)

    const {  touchIdSupported = false, isLogout = false, fob = null } = this.props

    var email = ''
    var rememberMe = true

    if (this.props.navigationState && this.props.navigationState.email ){
      email = this.props.navigationState.email
    }

    if (this.props.navigationState && this.props.navigationState.rememberMe ){
      rememberMe = this.props.navigationState.rememberMe
    }

    this.state = {
      email: email,
      password: '',
      rememberMe: rememberMe,

      fob: fob,
      touchIdSupported: touchIdSupported,
      promptTouchId: !(isLogout || (fob && fob.token)),

      isLogout: isLogout,
      error: null,
      processing: false,
      showValidatedPassword: false,

    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'LoginContinueScreen.componentWillMount()' })

    const { email, fob } = this.state

    // Checking the token in the FOB is useless since we have the session timedout from the backend and a every reqyest
    // it checks and if the session times out then we get a 401, Unauthorize error. In response to that we force the user
    // to login hence no reason for the token to be checked anymore

/***
    if (fob && fob.token) {
      this.setState({ processing: true, promptTouchId: false })
      this.props.signinAuto()
    } else if (email && email.length > 0) {
      this.props.challengeFob(email)
    }
***/

    if (email && email.length > 0) {
      this.props.challengeFob(email)
    }

  }

  componentDidMount () {
    // Logger.log({ name: 'LoginContinueScreen.componentDidMount()', state: this.state })
    firebase.analytics().setCurrentScreen('account_log_in')

  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'LoginContinueScreen.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'LoginContinueScreen.componentWillReceiveProps()', newProps: newProps })

    const { fob = null, touchIdSupported = false, error = null } = newProps
    this.setState({ fob: fob, touchIdSupported: touchIdSupported, error: error })

    const { processing, promptTouchId } = this.state

    if (!processing) {
      if (promptTouchId && touchIdSupported && fob && fob.touchIdEnabled ) {
       this.setState({ promptTouchId: false })

       this.props.signinTouchId()
      }
    } else {
      if (error && error.displayMessage) {
        if (error.displayMessage === 'FORCE_PASSWORD_RESET'){
          this.setState({ processing: false, password: '' })
          NavigationActions.passwordResetNotice()
        } else {
          Alert.alert(
            error.displayMessage,
            null,
            [{
              text: 'OK',
              onPress: () => {
                this.setState({ processing: false, password: '' })
              }
            }]
          )
        }

      }
    }
  }


  handleChangeEmail = (email) => {
    this.setState({ email: email })

    this.props.challengeFob(email)
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  handleEndEditingPassword = () => {
    this.setState({ showValidatedPassword: true })
  }

  isFormValid = () => {

    if (!this.isPasswordValid()) {
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


  handlePressSignInTouchId = () => {
    const { fob } = this.state

    if (fob && fob.touchIdEnabled) {
      this.props.signinTouchId()
    }
  }

  handlePressLogin = () => {

    const { email, password, rememberMe } = this.state

    if (this.isFormValid()) {
      // attempt a login - a saga is listening to pick it up from here.
      const data = { email: email, password: password, rememberMe: rememberMe }
      this.setState({ processing: true })
      this.props.signin(data)
    }


  }

  handlePressRegister = () => {
    NavigationActions.register()
  }

  handleForgotPassword = () => {
    const { email = '' } = this.state

    NavigationActions.forgotPassword({ email: email })
  }

  renderSignInTouchId = () => {
    // Logger.log({ name: 'LoginContinueScreen.renderSignInTouchId()', state: this.state })

    const { touchIdSupported, fob } = this.state

    if (touchIdSupported && fob && fob.touchIdEnabled) {
      return (
        <View style={Styles.Component}>
          <TouchableOpacity style={[{  }]} onPress={this.handlePressSignInTouchId}>
            <Text style={[{ ...Fonts.style.light, fontSize: 12, color: Colors.tealish, textAlign: 'center' }]}>Sign in with Touch ID</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render = () => {
    // Logger.log({ name: 'LoginContinueScreen.render()', state: this.state })

    const { email, password, rememberMe, processing, showValidatedPassword } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const validatedPassword = this.isPasswordValid()
    const submitEnabled = this.isFormValid()
    // const textInputStyle = editable ? ApplicationStyles.textInput : ApplicationStyles.textInputReadonly

    return (
      <LoadingView style={{ flex: 1 }} isLoading={processing}>
        <ScrollView  style={[ApplicationStyles.noTopMarginContainer]} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior='padding'>
            <View >

              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>Log in by entering your password</Text>

            </View>

            <View style={Styles.ViewStyle}>

              <View style={Styles.ViewStyle1}>
                <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.tiny,  color: Colors.blueSteel }]}>Password</Text>

                <TextField
                  ref='password'
                  value={password}
                  editable={editable}
                  keyboardType='default'
                  returnKeyType='done'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={this.handleChangePassword}
                  onEndEditing={this.handleEndEditingPassword}
                  validated={validatedPassword}
                  showValidated={showValidatedPassword}
                  underlineColorAndroid='transparent'
                  onSubmitEditing={this.handlePressLogin}
                  placeholder='Password'
                  isPassword = {true} />

                {this.renderSignInTouchId()}
              </View>



              <View style={[{flex: 1, flexDirection: 'row', marginTop: 25}, { marginTop: Metrics.doubleBaseMargin }]}>
                <FullButton
                  ref='signIn'
                  text='Log in'
                  onPress={this.handlePressLogin}
                  disabled={!submitEnabled}
                  />
              </View>

              <View style={[{flex: 1, flexDirection: 'row', marginTop: 25}, { justifyContent: 'center' }]}>

                <TouchableOpacity style={[{ flex: 1 }]} onPress={this.handleForgotPassword}>
                  <View style={Styles.ViewStyle2}>
                    <Text style={[{ ...Fonts.style.bold, fontSize: 14, color: Colors.booger, textAlign: 'center' }]}>Forgot Password?</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </KeyboardAvoidingView>
        </ScrollView>
      </LoadingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.settings.rememberMeEmail,

    fob: state.settings.fob,
    touchIdSupported: state.settings.touchIdSupported,

    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    challengeFob: (data) => dispatch(SettingsActions.challengeFob(data)),
    signin: (data) => dispatch(UserActions.signin(data)),
    signinAuto: () => dispatch(UserActions.signinAuto()),
    signinTouchId: () => dispatch(UserActions.signinTouchId())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContinueScreen)
