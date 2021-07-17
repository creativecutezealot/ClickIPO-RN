import React from 'react'
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import { sha3_512 } from 'js-sha3';
import _ from 'lodash';

import UserActions from '../Redux/UserRedux';
import TextField from '../Components/TextField';
import Checkbox from '../Components/Checkbox';
import FullButton from '../Components/FullButton';
import WaitingView from '../Components/WaitingView';
import LoadingView from '../Components/LoadingView';
import firebase from '../Config/FirebaseConfig';
import Styles from './Styles/LoginScreenStyle';
import { Images, Colors, Fonts, ApplicationStyles } from '../Themes';


class LoginScreen extends React.Component {
  constructor (props) {
    super(props);

    const { email = '', rememberMe = true } = this.props

    this.state = {
      email: email,
      password: '',
      error: null,
      processing: false,
      rememberMe: rememberMe,
      showValidatedEmail: false,
      showValidatedPassword: false,
      disabled: false,
      showTouchIDCheckBox: false,
      storeTouchID: false
    }
  }

  componentDidMount () {
    firebase.analytics().setCurrentScreen('account_log_in')
  }

  //if there is an error with the api call reset the password for better UX
  componentDidUpdate(prevProps) {

    //if we have finished fetching and there are no errors and fetching is completed then set processing to true. this will trigger the loading screen 
    // 
    if (this.props.fetching !== prevProps.fetching) {
      if (!this.props.error && !this.props.fetching) {
        this.setState({ processing: true });
      }
    }


    if (this.props.error !== prevProps.error) {
      if (this.props.error && this.props.error.error === 'Invalid Email or Password') {
        this.setState({ password: '' });
      }
    }
  }


  handlePressRememberMe = () => {
    const { rememberMe } = this.state
    this.setState({ rememberMe: !rememberMe });
  }

  handlePressEnableTouchID = () => {
    const { storeTouchID } = this.state;
    this.setState({ storeTouchID: !storeTouchID });
  }

  handleChangeEmail = (email) => {
    this.setState({ email: email });
  }

  handlePressLogin = () => {

    const { email, password, rememberMe } = this.state;
    // have to encrypt the password here to save to keychain
    if (this.isFormValid()) {
      //previously encrypted the password in API.js file but now encrypting here so that we can save encrypted passowrd to keychain
      let encryptedPassword = sha3_512(password);
      // attempt a login - a saga is listening to pick it up from here.
      const data = { email: email, encrypted_password: encryptedPassword, rememberMe: rememberMe }
      this.props.signin(data);

      //check if touchID is checked, encrypt the password and save the encrypted password and email
      // Keychain.resetGenericPassword();
      if ( this.state.storeTouchID ) {
        Keychain.setGenericPassword(email, encryptedPassword);
      }
    }

  }

  isFormValid = () => {
    if (!this.isEmailValid()) {
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

  handleEndEditingEmail = () => {
    this.setState({ showValidatedEmail: true });
  }

  handleChangePassword = (text) => {
    this.setState({ password: text });
  }

  handleEndEditingPassword = () => {
    this.setState({ showValidatedPassword: true });
  }

  isPasswordValid = () => {
    if (!this.state.password || this.state.password.length < 10) {
      return false
    }
    return true
  }

  handleForgotPassword = () => {
    const { email } = this.state;
    NavigationActions.forgotPassword({ email: email });
  }

  handleSignup = () => {
    const { email } = this.state;
    NavigationActions.register({ email: email });
  }

  handleTouchIDSignIn = () => {
    //1) check if touchID is supported
    //2) authenticate the user using touchID/faceID
    //3) access keychain to get the email and password
    TouchID.isSupported()
      .then(biometryType => {

        if (biometryType) {
          TouchID.authenticate(`Please authenticate with FaceID/TouchID`)
            .then(success => {
              Keychain.getGenericPassword()
                .then(credentials => {
                  // add a condition here to check if the credentials exists in the keychain. 

                  //there is a bug in this library that on a fresh install in some instances the credentials username returns an empty {}
                  //the second condition in the if statement is workaround of this issue
                  if (credentials && !_.isEmpty(credentials.username)) {
                    //the username is actually the email, the keychain library saves the email in this key
                    const { username, password } = credentials;
  
                    const data = { email: username, encrypted_password: password, rememberMe: this.state.rememberMe }
                    this.props.signin(data);
                  } else {
                    //inside of this else statement we need to add the touchID checkbox
                    this.setState({ showTouchIDCheckBox: true, storeTouchID: true });
                    Alert.alert(
                      'ClickIPO',
                      `Unable to find your log in credentials, please sign in to setup FaceID/TouchID`,
                      [
                        { text: 'OK' },
                      ],
                      { cancelable: false }
                    )
                  }
                })
                .catch(err => {
                  Alert.alert(
                    'ClickIPO',
                    `Failed to get your credentials, please try signing in with your email and password. If issue persists please contact the ClickIPO customer support`,
                    [
                      { text: 'OK' },
                    ],
                    { cancelable: false }
                  )
                }) //catch of Keychain
            })
            .catch(err => {
              //if unable to authenticate the user due to finger print or face id not matching reset the credentials
              //we do not reset the password if the user cancels biometrics authentication
              if (err.name === "LAErrorUserFallback") {
                Keychain.resetGenericPassword();
              }
              //if the device has not registered to use the biometrics the following error alert is displayed
              if (err.name === "RCTTouchIDNotSupported") {
                Alert.alert(
                  'ClickIPO',
                  'This devices does not support biometrics, please sign in with your email and password.',
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false }
                )
              }
            }) //touchID catch
        } else {
          Alert.alert(
            'ClickIPO',
            'This devices does not support biometrics, please sign in with your email and password.',
            [
              { text: 'OK'},
            ],
            { cancelable: false }
          )
        }
      })
      .catch(err => {
        Alert.alert(
          'ClickIPO',
          'Unable to access the biometrics of your device, please sign in using email and password',
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        )
      }) //catch of isSupported
  }


  render = () => {
    if (this.props.fetching === false && this.props.existsStatus === null ) {
      return (
        <Text style={[ApplicationStyles.networkError]}>Due to network error, unable to sign in.</Text>
      )
    }

    const { email, rememberMe, showValidatedEmail, password, showValidatedPassword, storeTouchID } = this.state
    const { fetching } = this.props
    const editable = !fetching

    const validatedEmail = this.isEmailValid()
    const validatedPassword = this.isPasswordValid();
    const validatedForm = this.isFormValid() && this.props.fetching;
    // const textInputStyle = editable ? ApplicationStyles.textInput : ApplicationStyles.textInputReadonly

    return (
      <LoadingView style={{ flex: 1 }} isLoading={this.props.fetching}>
        <WaitingView style={{ flex: 1 }} isWaiting={this.props.fetching}>
          <ScrollView  style={[ApplicationStyles.noTopMarginContainer]} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
              <View style={[ApplicationStyles.marqueeContainer]}>

                <Image source={Images.logoTop} style={Styles.ImageStyle} />

                <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginTop:10, color: Colors.blueSteel, textAlign: 'center' }]}>Enter your email to get started</Text>
                {this.props.error ? <Text style={[{ ...Fonts.style.text, fontSize: Fonts.size.small, marginTop: 10, color: Colors.invalid, textAlign: 'center' }]}>{this.props.error.error}</Text> : null}

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
                    placeholder='Email'
                    validated={validatedEmail}
                    showValidated={showValidatedEmail}
                    onEndEditing={this.handleEndEditingEmail}
                    />
                    
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
                    // showValidated={showValidatedPassword}
                    underlineColorAndroid='transparent'
                    onSubmitEditing={this.handlePressLogin}
                    placeholder='Password'
                    isPassword={true} />
                </View>

                <View style={[Styles.ViewStyle2, {flexDirection: 'column'}]}>
                  <View style={[{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }]}>
                    <Checkbox labelStyle = {{color: Colors.booger, fontWeight: 'bold'}} ref='rememberMe' label='Remember Me' checked={rememberMe} onChange={this.handlePressRememberMe} />
                    <TouchableOpacity onPress={this.handleTouchIDSignIn}>
                      <Text style={[{ ...Fonts.style.bold, fontSize: 14, color: Colors.booger }]}>Sign in with TouchID</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 10, justifyContent: 'center', flexDirection: 'row' }}>
                    {this.state.showTouchIDCheckBox ? <Checkbox labelStyle={{ color: Colors.booger }} ref='storeTouchID' label='Enable TouchID/FaceID' checked={storeTouchID} onChange={this.handlePressEnableTouchID} /> : null}
                  </View>
                </View>
              
                <View style={Styles.ViewStyle3}>
                  <FullButton
                    ref='signIn'
                    text='Log in'
                    onPress={this.handlePressLogin}
                    disabled={validatedForm}
                    />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
                  <TouchableOpacity style={[{ flex: 1 }]} onPress={this.handleForgotPassword}>
                    <View style={{margin: 10}}>
                      <Text style={[{ fontSize: 18, color: Colors.black, textAlign: 'center' }]}>Forgot Password?</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[{ flex: 1 }]} onPress={this.handleSignup}>
                    <View>
                      <Text style={[{ ...Fonts.style.bold, fontSize: 20, color: Colors.blueCoral, textAlign: 'center' }]}>Sign up</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </WaitingView>
      </LoadingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.settings.rememberMeEmail,
    existsStatus: state.user.userExistsStatus,
    exists: state.user.exists,
    password_reset: state.user.password_reset,
    fetching: state.user.fetching,
    error: state.user.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signin: (data) => dispatch(UserActions.signin(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
