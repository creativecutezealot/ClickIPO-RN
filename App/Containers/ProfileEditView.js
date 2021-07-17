import React from 'react'
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Alert, KeyboardAvoidingView, Image, TouchableOpacity, Switch } from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Intercom from 'react-native-intercom';
import { sha3_512 } from 'js-sha3';
import { TextInputMask } from 'react-native-masked-text';
// import TouchID from 'react-native-touch-id';
// import * as Keychain from 'react-native-keychain';

import UserActions from '../Redux/UserRedux';
import { ApplicationStyles, Colors } from '../Themes';
import TextField from '../Components/TextField';
import BrokerSelector from '../Components/BrokerSelector';
import FullButton from '../Components/FullButton';
import WaitingView from '../Components/WaitingView';
import styles, { textInputMaskStyle } from './Styles/ProfileEditViewStyle';


class ProfileEditView extends React.Component {

  state: {
    firstName: String,
    lastName: String,
    email: String,
    brokerage: String,
    default_amount: Number,
    isProcessing: Boolean,
    canEmail: Number,
    pushNotification: Number
  }

  constructor(props) {
    super(props)

    const { firstName = '', lastName = '', email = '', default_amount = 0, canEmail = '', pushNotification = '' } = props
    const { isPasswordValid = null } = this.props

    this.state = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      // brokerage: brokerage,
      verifyPassword: '',
      currentPassword: '',
      isProcessing: false,
      default_amount: 0,
      displayDefaultAmount: default_amount.toFixed(2),
      isPasswordValid: null,
      saveActiveButton: false,
      saveCurrentActiveButton: false,
      showValidatedPassword: false,
      showValidatedVerifyPassword: false,
      currentPasswordValidated: false,
      isLoading: false,
      AllowEmail: false,
      AllowPushNotification: false,
      pushNotification: pushNotification,
      canEmail: canEmail,
      switchtoggle: null,
      switchToggleNotification: null
    }
  }

  componentWillReceiveProps(newProps) {

    if (newProps.canEmail === 17) {
      this.setState({
        switchtoggle: true
      }, () => { })
    }
    else {
      this.setState({
        switchtoggle: false
      }, () => { })
    }

    if (newProps.pushNotification === 17) {
      this.setState({
        switchToggleNotification: true
      }, () => { })
    }
    else {
      this.setState({
        switchToggleNotification: false
      }, () => { })
    }
    // Logger.log({ name: 'ProfileEditView.componentWillReceiveProps()', value: newProps })

    // if current password is incorrent then alert========

    if (newProps.isPasswordValid != null) {
      if (newProps.isPasswordValid.success != false) {
        this.setState({
          currentPasswordValidated: true,
          isLoading: false
        })
      } if (newProps.isPasswordValid.message == "password not correct") {
        Alert.alert(
          "Password incorrect, please try again",
          null,
          [{
            text: 'OK',
            onPress: () => { console.log("ok") }
          }]
        )
      }
    }
    const { isProcessing } = this.state
    const { error } = newProps
    if (this.isProcessing && error) {
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.setState({ isProcessing: false, isLoading: false })
          }
        }]
      )
    } else if (isProcessing) {
      this.setState({
        firstName: newProps.firstName,
        lastName: newProps.lastName,
        email: newProps.email,
        // brokerage: newProps.marketing_brokerage,
        default_amount: newProps.default_amount,
        displayDefaultAmount: newProps.default_amount,
        isProcessing: false,
      })

      NavigationActions.pop()
    }
  }

  componentWillMount() {
    if (this.props.isPasswordValid) {
      this.setState({
        currentPasswordValidated: true, isLoading: false
      })
    }
    // Logger.log({ name: 'ProfileEditView.componentWillMount()' })
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

  handleDefaultAmount = (text) => {
    const defaultAmount = this.defaultAmountField.getRawValue();
    this.setState({
      default_amount: Number(defaultAmount),
      displayDefaultAmount: text
    });
  }

  isFormValid = () => {
    if (!this.state.firstName || this.state.firstName.length < 1) {
      return false
    } else if (!this.state.lastName || this.state.lastName.length < 1) {
      return false
    } else if (!this.state.email || this.state.email.length < 1) {
      return false
    }
    return true
  }

  handlePressSubmit = () => {
    if (this.isFormValid()) {
      const { email, firstName, lastName, brokerage, canEmail, pushNotification } = this.state
      const default_amount = this.defaultAmountField.getRawValue();
      const data = { email: email, first_name: firstName, last_name: lastName, default_amount: default_amount, can_email: canEmail, push_notification: pushNotification }
      this.setState({ isProcessing: true })
      Intercom.updateUser({
        // email: data.email
        first_name: data.first_name,
        last_name: data.last_name,
        // marketing_brokerage: brokerage,
        default_amount: Number(data.default_amount),
        can_email: data.can_email,
        push_notification: data.push_notification
      })
      this.props.updateProfile(data)
      NavigationActions.pop()
    }
  }

  // onBrokerageChange = (brokerage) => {
  //   this.setState({
  //     brokerage: brokerage
  //   })
  // }

  //functions for password verify

  submitCurrentPassword = () => {
    const { currentPassword } = this.state;
    let currentPasswordEncrypted = sha3_512(currentPassword);
    const data = { 'encrypted_password': currentPasswordEncrypted }
    this.verifyCurrentPassword(data);
  }

  verifyCurrentPassword = (data) => {
    //call the redux/saga/api stuff from here.
    const response = this.props.verifyCurrentPassword(data);
    this.setState({ currentPassword: '' });
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
  isCurrentPasswordValid = () => {
    if (!this.state.currentPassword || this.state.currentPassword.length < 10) {
      return false
    }
    return true
  }
  handleChangeCurrentPassword = (text) => {
    if (text.length >= 10) {
      this.setState({ currentPassword: text, saveCurrentActiveButton: true })
    }
    else {
      this.setState({ currentPassword: text, saveCurrentActiveButton: false })
    }
  }
  isPasswordValid = () => {
    if (!this.state.password || this.state.password.length < 10) {
      return false
    }

    return true
  }
  isWaiting = () => {
    if (this.state.isLoading === false) {
      return false;
    } else {
      return true;
    }
  };

  // in which context was the button clicked
  infoBoxMessage = (context) => {
    // message is what the user will see when they click the i button
    let message = '';
    switch(context) {
      case 'changeEmail': 
        message = 'You are not allowed to modify your email.';
        break;
      case 'defaultAmt':
        message = 'Default amount you can setup for offering.';
        break;
      case 'allowEmail': 
        message = 'If you disable emails, you will not receive notices for new offerings or other opportunities, but you will still receive mandatory emails such as order confirmations and prospectus\'s';
        break;
      case 'allowPush':
        message = 'If you disable push notices, you will not receive timely notices when offerings are listed, or available to order. This is especially important given the short order window for certain IPO\'s, and overnight follow - on offerings.';
        break;
      // we should never hit the default block. If the default block is executed that means the infoBoxMessage method was not called correctly
      default: 
        message = '';
    }
    Alert.alert(
      'ClickIPO',
      message,
      [{ text: 'OK'}]
    );
  }

  emailToggle() {
    if (this.state.canEmail === 17) {
      this.setState({
        switchtoggle: false,
        canEmail: 1
      }, () => { })
    }
    else {
      this.setState({
        switchtoggle: true,
        canEmail: 17
      }, () => { })
    }
  }

  notificationToggle() {
    if (this.state.pushNotification === 17) {
      this.setState({
        switchToggleNotification: false,
        pushNotification: 1
      }, () => { })
    }
    else {
      this.setState({
        switchToggleNotification: true,
        pushNotification: 17
      }, () => { })
    }
  }

  renderAll = () => {
    const { password, verifyPassword, showValidatedPassword, showValidatedVerifyPassword, currentPasswordValidated, currentPassword } = this.state



    const submitEnabled = this.isFormValid()
    const validatedPassword = this.isPasswordValid()
    if (!currentPasswordValidated) {
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
                  isPassword={true}
                />
              </View>

              <View style={[ApplicationStyles.rowContainer, { marginTop: 36 }]}>
                <FullButton
                  ref='submit'
                  text='Submit'
                  onPress={this.submitCurrentPassword}
                  // disabled={!submitEnabled}
                  disabled={!this.state.saveCurrentActiveButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )
    }
    return (
      <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior='padding' style={styles.StyleView}>
          <View style={ApplicationStyles.contentContainer}>
            <View style={[ApplicationStyles.rowContainer, { flexDirection: 'row' }]}>
              <Text style={{ fontSize: 15 }}>Email: {this.state.email}</Text>
              <TouchableOpacity
                onPress={() => this.infoBoxMessage('changeEmail')} >
                <Image
                  style={{
                    height: 12, width: 12, marginLeft: 5, padding: 10
                  }} source={require('../Images/info.png')} />
              </TouchableOpacity>
            </View>
            <View style={[ApplicationStyles.rowContainer, { marginTop: 36, flexDirection: 'row' }]}>

              <TextField
                ref='firstName'
                iconClass={Icon}
                iconName={'ios-person'}
                value={this.state.firstName}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeFirstName}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.lastName.focus()}
                placeholder='First name'
                style={{ marginRight: 4 }} />

              <TextField
                ref='lastName'
                iconClass={Icon}
                iconName={'ios-person'}
                value={this.state.lastName}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeLastName}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.email.focus()}
                placeholder='Last name'
                style={{ marginLeft: 4 }} />

            </View>

            <View style={[ApplicationStyles.rowContainer, { flexDirection: 'row' }]}>

              <TextInputMask
                ref={(ref) => this.defaultAmountField = ref}
                type={'money'}
                options={{
                  precision: 2,
                  separator: '.',
                  delimiter: ',',
                  unit: '$'
                }}
                value={`${this.state.displayDefaultAmount}`}
                keyboardType='numeric'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleDefaultAmount}
                style={textInputMaskStyle}
              />

              <TouchableOpacity onPress={() => this.infoBoxMessage('defaultAmt')} >
                <Image
                  style={{
                    height: 20, width: 20, marginLeft: 5, marginTop: 20
                  }} source={require('../Images/info.png')} />
              </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', margin: 10, alignItems: 'center' }}>
              <Text>Allow Email</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                  onTintColor={Colors.booger}
                  ios_backgroundColor={Colors.white}
                  trackColor={Colors.white}
                  tintColor={Colors.booger}
                  onValueChange={(isSwitchOn) => this.emailToggle()}
                  value={this.state.switchtoggle}
                  />
                <TouchableOpacity onPress={() => this.infoBoxMessage('allowEmail')} >
                  <Image
                    style={{ height: 20, width: 20, marginLeft: 5 }}
                    source={require('../Images/info.png')} />
                </TouchableOpacity>
              </View>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', margin: 10, alignItems: 'center' }}>
              <Text>Allow Push Notification</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                  onTintColor={Colors.booger}
                  ios_backgroundColor={Colors.white}
                  trackColor={Colors.white}
                  tintColor={Colors.booger}
                  onValueChange={(isSwitchOn) => this.notificationToggle()}
                  value={this.state.switchToggleNotification}
                  />
                <TouchableOpacity onPress={() => this.infoBoxMessage('allowPush')} >
                  <Image
                    style={{ height: 20, width: 20, marginLeft: 5 }}
                    source={require('../Images/info.png')} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <View style={ApplicationStyles.contentContainer}>
            <View style={[ApplicationStyles.rowContainer, { marginTop: 10 }]}>
              <FullButton
                ref='submit'
                text='Save'
                onPress={this.handlePressSubmit}
                disabled={!submitEnabled} />
            </View>

          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }


  render() {
    if (this.props.error) {
      //change the text to show the error, this error happens when the backend send us an error
      return (
        <Text style={styles.DisplayMessage}> {this.props.error.displayMessage} </Text>
      )
    }

    return (
      <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
    );
  }
}

ProfileEditView.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  brokerage: PropTypes.string,
  updateProfile: PropTypes.func,
  default_amount: PropTypes.number,
  canEmail: PropTypes.number,
  pushNotification: PropTypes.number,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  if (state.user.isPasswordValid == true) {
    state.user.isPasswordValid = false
  }
  return {
    firstName: state.user.user.firstName,
    lastName: state.user.user.lastName,
    email: state.user.user.email,
    brokerage: state.user.user.marketing_brokerage,
    default_amount: state.user.user.default_amount,
    isPasswordValid: state.user.isPasswordValid,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (data) => dispatch(UserActions.updateProfile(data)),
    verifyCurrentPassword: (encryptedPass) => dispatch(UserActions.updateProfilePassword(encryptedPass))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditView)
