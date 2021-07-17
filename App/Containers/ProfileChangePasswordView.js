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
  // Colors,
  // Metrics
  // Fonts
  ApplicationStyles
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
import firebase from '../Config/FirebaseConfig'
import styles from './Styles/ProfileChangePasswordViewStyle'

import { sha3_512 } from 'js-sha3';
import WaitingView from '../Components/WaitingView';

class ProfileChangePasswordView extends React.Component {

  constructor (props) {
    super(props)

    // Logger.log({ name: 'ProfileChangePasswordView.constructor()', props: props })

    const { email = '', isPasswordValid = null } = this.props

    this.state = {
      password: '',
      verifyPassword: '',
      saveActiveButton: false,
      saveCurrentActiveButton: false,
      showValidatedPassword: false,
      showValidatedVerifyPassword: false,
      currentPasswordValidated: false,
      currentPassword: '',
      isProcessing: false,
      isPasswordValid: null,
      isLoading:false
    }
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'ProfileChangePasswordView.componentWillReceiveProps()', value: newProps })

    // if current password is incorrent then alert========
    if(newProps.isPasswordValid != null){
      if(newProps.isPasswordValid.success != false ) {
        this.setState({
          currentPasswordValidated: true, isLoading:false
        })
      }if(newProps.isPasswordValid.message == "password not correct" ) {
        Alert.alert(
        "Password incorrect, please try again",
        null,
          [{
            text: 'OK',
            onPress: () => {console.log("ok")}
          }]
        )
      }
    }

    const { isProcessing } = this.state
    const { error } = newProps

    if (isProcessing && error) {
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.setState({ isProcessing: false, isLoading:false })
          }
        }]
      )
    } else if (isProcessing) {
      this.setState({ isProcessing: false , isLoading:false })
      NavigationActions.pop()
    }
  }

  componentWillMount = () => {
    if(this.props.isPasswordValid) {
      this.setState({
        currentPasswordValidated: true ,isLoading:false
      })
    }
    // Logger.log({ name: 'ProfileChangePasswordView.componentWillMount()' })
    firebase.analytics().setCurrentScreen('account_password')

  }

  isPasswordValid = () => {
    if (!this.state.password || this.state.password.length < 10) {
      return false
    }

    return true
  }

  isCurrentPasswordValid = () => {
    if (!this.state.currentPassword || this.state.currentPassword.length < 10) {
      return false
    }
    return true
  }

  handleChangePassword = (text) => {

    if (text.length >= 10) {
      this.setState({ password: text, saveActiveButton: true })
    } 
    else {
      this.setState({ password: text, saveActiveButton: false })
    } 
  }

  handleEndEditingPassword = () => {
    this.setState({ showValidatedPassword: true })
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

  isFormValid = () => {
    if (!this.isPasswordValid()) {
      return false
    }

    return true
  }

  handlePressSubmit = () => {
    if (this.isFormValid()) {
      const { password, verifyPassword } = this.state
      let enc_password = sha3_512(this.state.password)

      const data = { 'encrypted_password': enc_password }

      this.setState({ isProcessing: true })

      this.updatePassword(data)
    }
  }

  updatePassword = (data) => {
      this.props.updatePassword(data)
      this.setState({
        password: '',
        verifyPassword: ''
      });
  }

  submitCurrentPassword = () => {
    const { currentPassword } = this.state;
    let currentPasswordEncrypted = sha3_512(currentPassword);

    const data = { 'encrypted_password': currentPasswordEncrypted }
    this.verifyCurrentPassword(data);
  }

  verifyCurrentPassword = (data) => {

    //call the redux/saga/api stuff from here.
    const response = this.props.verifyCurrentPassword(data);
    this.setState({currentPassword: ''});

  }

  handleChangeCurrentPassword = (text) => {
    if (text.length >= 10) {
      this.setState({ currentPassword: text, saveCurrentActiveButton: true })
    } 
    else {
      this.setState({ currentPassword: text, saveCurrentActiveButton: false })
    }
  }

  handleEndEditingCurrentPassword() {

  }

  isWaiting = () => {
    if (this.state.isLoading === false) {
      return false;
    } else {
      return true;
    }
  };

renderAll = () => {
      const { password, verifyPassword, showValidatedPassword, showValidatedVerifyPassword, currentPasswordValidated, currentPassword } = this.state
      const validatedPassword = this.isPasswordValid()
      const submitEnabled = this.isFormValid()
    if(!currentPasswordValidated) {
      return (
        <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
            <View style={[ApplicationStyles.contentContainer]}>
              <View>
                <Text style={styles.PleaseEnter}>Please Enter Current Password</Text>
              </View>

              <View style={[ApplicationStyles.rowContainer, { marginTop: 36 }]}>
                <TextField
                  ref='currentPassword'
                  iconClass={Icon}
                  iconName={'ios-lock'}
                  value={currentPassword}
                  keyboardType='default'
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={this.handleChangeCurrentPassword}
                  // onEndEditing={this.handleEndEditingCurrentPassword}
                  underlineColorAndroid='transparent'
                  // onSubmitEditing={() => this.refs.verifyPassword.focus()}
                  placeholder='Current Password'
                  validated={validatedPassword}
                  // showValidated={showValidatedPassword}
                  isPassword = {true}
                    />
              </View>

              <View style={[ApplicationStyles.rowContainer, { marginTop: 36 }]}>
                <FullButton
                  ref='submit'
                  text='Submit'
                  onPress={this.submitCurrentPassword}
                  // disabled={!submitEnabled}
                  disabled = {!this.state.saveCurrentActiveButton}
                    />
              </View>

            </View>
          </KeyboardAvoidingView>
        </ScrollView> 
      )
    }
      return (
        <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
            <View style={[ApplicationStyles.contentContainer]}>
              <View>
                <Text style={styles.TextStyle}>Please enter your new password</Text>
                <Text style={styles.TextStyle}>Password must contain at least 10 characters.</Text>
              </View>

              <View style={[ApplicationStyles.rowContainer, { marginTop: 36 }]}>
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
                  // onSubmitEditing={() => this.refs.verifyPassword.focus()}
                  placeholder='New Password'
                  validated={validatedPassword}
                  showValidated={showValidatedPassword}
                  isPassword = {true}
                    />
              </View>

              <View style={[ApplicationStyles.rowContainer, { marginTop: 36 }]}>
                <FullButton
                  ref='submit'
                  text='Save'
                  onPress={this.handlePressSubmit}
                  //disabled={!submitEnabled}
                  disabled = {!this.state.saveActiveButton}
                    />
              </View>

            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )
    }
  render () {
      if(this.props.error) {
        //change the text to show the error, this error happens when the backend send us an error
        return (
          <Text style={{ padding: 20 }}> {this.props.error.displayMessage} </Text>
        )
      }

    return (
        <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
      );
    }
  }

ProfileChangePasswordView.propTypes = {
  updatePassword: PropTypes.func,

  error: PropTypes.object
}

const mapStateToProps = (state) => {
  // console.log('state profile: ', state)
  return {
    user: state.user.user,
    error: state.user.error,
    isPasswordValid: state.user.isPasswordValid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePassword: (data) => dispatch(UserActions.updateProfile(data)),
    verifyCurrentPassword: (encryptedPass) => dispatch(UserActions.updateProfilePassword(encryptedPass))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileChangePasswordView)
