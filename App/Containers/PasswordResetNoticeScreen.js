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

import Logger from '../Lib/Logger'

class PasswordResetNoticeScreen extends React.Component {
  
  state: {
    email: String,
    error: Object,
    processing: Boolean,
    emailResent: Boolean,
  }

  constructor (props) {
    super(props)

    const { email } = this.props

    this.state = {
      email: email,
      error: null,
      processing: false,
      emailResent: false,
    }

  }

  componentWillReceiveProps = (newProps) => {
   
   const { email, processing } = this.state

    if (!newProps.fetching) {
      this.setState({ processing: false, emailResent : true })
    }

  }

  handleResendEmail = () => {
    const { email } = this.props;

    if (email) {

      const data = { email: email }
      this.setState({ processing: true })
      this.props.resendPasswordResetEmail(data)
    }
  }

  handleHelpScreen = () => {
    NavigationActions.contactScreen()
  }

  renderEmailSent = () => {

    const { emailResent } = this.state

    if (!emailResent){
      return (
        <View style={[ApplicationStyles.marqueeContainer], { marginHorizontal:25}}>
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10 , color: Colors.blueSteel, textAlign: 'center' }]}>
                A password reset is required to comply with our new security policies.
              </Text>
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>
                Check your inbox and click the reset link in your email.
              </Text>

              <TouchableOpacity style={[{ marginVertical:10 }]} onPress={this.handleResendEmail}>
                <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, color: Colors.booger, textAlign: 'center' }]}>
                  Don’t see our email yet?
                </Text>
              </TouchableOpacity>
              
            </View>
      )
    }
    
  }

  renderEmailResent = () => {

    const { emailResent } = this.state

    if (emailResent){
      return (
        <View style={[ApplicationStyles.marqueeContainer], { marginHorizontal:25}}>
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10 , color: Colors.blueSteel, textAlign: 'center' }]}>
                New password reset email sent.
              </Text>
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>
                Check your inbox and click the reset link in your email.
              </Text>

              <TouchableOpacity style={[{ marginVertical:10 }]} onPress={this.handleHelpScreen}>
                <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, color: Colors.booger, textAlign: 'center' }]}>
                  Still no email? Contact us.
                </Text>
              </TouchableOpacity>
              
            </View>
      )
    }
    
  }

  render = () => {
  
    const { processing, email } = this.state


    return (
      <LoadingView style={{ flex: 1 }} isLoading={processing}>
        <ScrollView  style={[ApplicationStyles.noTopMarginContainer]} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior='padding'>
            
            { this.renderEmailSent() }

            { this.renderEmailResent() }

           
          </KeyboardAvoidingView>
        </ScrollView>
      </LoadingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.user.fetching,
    error: state.user.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resendPasswordResetEmail: (data) => dispatch(UserActions.resendPasswordResetEmail(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetNoticeScreen)
