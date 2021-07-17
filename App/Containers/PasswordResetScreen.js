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
import styles from './Styles/PasswordResetScreenStyle'

import Logger from '../Lib/Logger'

class PasswordResetScreen extends React.Component {
  state: {
    reset_password_token: String,
    error: Object,
    processing: Boolean,
    password: String,
    showValidatedPassword: Boolean,
  }

  constructor (props) {
    super(props)

    var reset_password_token  = this.props.reset_password_token

    
    if (this.props.navigationState && this.props.navigationState.reset_password_token ){
      reset_password_token = this.props.navigationState.reset_password_token 
    }

    this.state = {
      reset_password_token: reset_password_token,
      error: null,
      processing: false,
      password : '',
      showValidatedPassword: false,
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'PasswordResetScreen.componentWillMount()' })

    
  }

  componentDidMount () {
    
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'PasswordResetScreen.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'PasswordResetScreen.componentWillReceiveProps()', newProps: newProps })

    const { error = null } = newProps
    this.setState({ error: error })

    const { processing } = this.state

    if (!processing) {

      const action = { data : {exists:null,password_reset:null} }
      
      this.props.checkUserExistsSuccess(action);

      NavigationActions.login()
    } else {
      if (error && error.displayMessage) {
        
          Alert.alert(
            error.displayMessage,
            null,
            [{
              text: 'OK',
              onPress: () => {
                this.setState({ processing: false })
              }
            }]
          )

      }
    }
  }


  

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  handleEndEditingPassword = () => {
    this.setState({ showValidatedPassword: true })
  }

 
  handlePressLogin = () => {
    const { reset_password_token, password } = this.state

    const data = { reset_password_token: reset_password_token, password: password }
    this.setState({ processing: true })
    this.props.resetPassword(data)
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
  
  render = () => {
    // Logger.log({ name: 'PasswordResetScreen.render()', state: this.state })

    const { email, password, rememberMe, processing, showValidatedPassword } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const validatedPassword = this.isPasswordValid()
    const submitEnabled = this.isFormValid()
    // const textInputStyle = editable ? ApplicationStyles.textInput : ApplicationStyles.textInputReadonly

    return (
      <LoadingView style={styles.LoadingView} isLoading={processing}>
        <ScrollView  style={[ApplicationStyles.noTopMarginContainer]} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior='padding'>
            <View >
              
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>Enter a new password with at least 10 characters</Text>

            </View>

            <View style={styles.StyleView}>

              <View style={styles.StyleView1}>
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
                  underlineColorAndroid='transparent'
                  onSubmitEditing={this.handlePressLogin}
                  placeholder='Password'
                  validated={validatedPassword}
                  showValidated={showValidatedPassword}
                  isPassword = {true} />

              </View>

              <View style={[{flex: 1, flexDirection: 'row', marginTop: 25}, { marginTop: Metrics.doubleBaseMargin }]}>
                <FullButton
                  ref='signIn'
                  text='Change password'
                  onPress={this.handlePressLogin}
                  disabled={!submitEnabled}
                  />
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

    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (data) => dispatch(UserActions.resetPassword(data)),
    checkUserExistsSuccess: (data) => dispatch(UserActions.checkUserExistsSuccess(data)),
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetScreen)
