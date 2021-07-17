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
import Styles from './Styles/LoginScreen_Style'

import {
  // Token,
  // User,
  // ClickIpoError,
  Fob
} from '../Models'

// I18n
import I18n from 'react-native-i18n'

import firebase from '../Config/FirebaseConfig'

import Logger from '../Lib/Logger'

class LoginScreen extends React.Component {
  state: {
    email: String,
    password: String,
    rememberMe: Boolean,

    touchIdSupported: Boolean,
    fob: Fob,

    isLogout: Boolean,

    error: Object,
    processing: Boolean,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'LoginScreen.constructor()', props: props })

    const { email = '', touchIdSupported = false, isLogout = false, fob = null } = this.props

    this.state = {
      email: email,
      password: '',
      rememberMe: true,

      fob: fob,
      touchIdSupported: touchIdSupported,
      promptTouchId: !(isLogout || (fob && fob.token)),

      isLogout: isLogout,
      error: null,
      processing: false,
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'LoginScreen.componentWillMount()' })

    const { email, fob } = this.state

    if (fob && fob.token) {
      this.setState({ processing: true, promptTouchId: false })
      this.props.signinAuto()
    } else if (email && email.length > 0) {
      this.props.challengeFob(email)
    }
  }

  componentDidMount () {
    // Logger.log({ name: 'LoginScreen.componentDidMount()', state: this.state })
    firebase.analytics().setCurrentScreen('account_log_in')

  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'LoginScreen.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'LoginScreen.componentWillReceiveProps()', newProps: newProps })

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


  handleChangeEmail = (email) => {
    this.setState({ email: email })

    this.props.challengeFob(email)
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  handlePressSignInTouchId = () => {
    const { fob } = this.state

    if (fob && fob.touchIdEnabled) {
      this.props.signinTouchId()
    }
  }

  handlePressLogin = () => {
    const { email, password, rememberMe } = this.state

    // attempt a login - a saga is listening to pick it up from here.
    const data = { email: email, password: password, rememberMe: rememberMe }
    this.setState({ processing: true })
    this.props.signin(data)
  }

  handlePressRememberMe = () => {
    const { rememberMe } = this.state

    this.setState({ rememberMe: !rememberMe })
  }

  handlePressRegister = () => {
    NavigationActions.register()
  }

  handleForgotPassword = () => {
    const { email = '' } = this.state

    NavigationActions.forgotPassword({ email: email })
  }

  renderSignInTouchId = () => {
    // Logger.log({ name: 'LoginScreen.renderSignInTouchId()', state: this.state })

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
    // Logger.log({ name: 'LoginScreen.render()', state: this.state })

    const { email, password, rememberMe, processing } = this.state
    const { fetching } = this.props
    const editable = !fetching
    // const textInputStyle = editable ? ApplicationStyles.textInput : ApplicationStyles.textInputReadonly

    return (
      <LoadingView style={{ flex: 1 }} isLoading={processing}>
        <ScrollView  style={[ApplicationStyles.noTopMarginContainer]} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior='padding'>
            <View style={[ApplicationStyles.marqueeContainer]}>
              
              <Image source={Images.logoTop} style={Styles.ImagesStyle} />
              
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>Log in to ClickIPO</Text>

            </View>

            <View style={Styles.ViewStyle}>

              <View style={Styles.ViewStyle1}>
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
                  placeholder='Email' />
              </View>

              <View style={Styles.ViewStyle2}>
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
                  underlineColorAndroid='transparent'
                  onSubmitEditing={this.handlePressLogin}
                  placeholder='Password'
                  isPassword = {true} />

                {this.renderSignInTouchId()}
              </View>

              <View style={Styles.ViewStyle3}>
                <View style={[{ flex: 1 }]}>
                  <Checkbox labelStyle = {{color: Colors.booger, fontWeight: 'bold'}} ref='rememberMe' label='Remember Me' checked={rememberMe} onChange={this.handlePressRememberMe} />
                </View>
              </View>

              <View style={[{flex: 1, flexDirection: 'row', marginTop: 25}, { marginTop: Metrics.doubleBaseMargin }]}>
                <FullButton
                  ref='signIn'
                  text='Log in'
                  onPress={this.handlePressLogin}
                  />
              </View>

              <View style={[{flex: 1, flexDirection: 'row', marginTop: 25}, { justifyContent: 'center' }]}>

                <TouchableOpacity style={[{ flex: 1 }]} onPress={this.handlePressRegister}>
                  <View style={Styles.ViewStyle4}>
                    <Text style={[{ ...Fonts.style.bold, fontSize: 14, color: Colors.booger, textAlign: 'center' }]}>Create an Account</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[{ flex: 1 }]} onPress={this.handleForgotPassword}>
                  <View style={Styles.ViewStyle4}>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
