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
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  AlertIOS
} from 'react-native'

import { connect } from 'react-redux'
// import UserActions from '../Redux/UserRedux'
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

// external libs
import Icon from 'react-native-vector-icons/Ionicons'
// import Animatable from 'react-native-animatable'
import styles from './Styles/RegisterProfileIdentityScreenStyle'

import firebase from '../Config/FirebaseConfig'

// I18n
// import I18n from 'react-native-i18n'

// import Logger from '../Lib/Logger'

class RegisterProfileIdentityScreen extends React.Component {

  state: {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  
  }

  isProcessing: Boolean

  constructor (props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: this.props.email,
      password: this.props.password,
    }

    this.isProcessing = false
  }

  componentWillReceiveProps (newProps) {
    // Logger.log({ name: 'RegisterProfileIdentityScreen.componentWillReceiveProps()', value: newProps })

    // this.forceUpdate()

  }

  componentWillMount () {
    // Logger.log({ name: 'RegisterProfileIdentityScreen.componentWillMount()' })

  }

  componentWillUnmount () {
    // Logger.log({ name: 'RegisterProfileIdentityScreen.componentWillUnmount()' })
  }

  handleChangeFirstName = (text) => {
    this.setState({ firstName: text })
  }

  handleChangeLastName = (text) => {
    this.setState({ lastName: text })
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
    var reg = /[^\x00-\x7F]/g;
    if(reg.test(this.state.firstName)){
      Platform.select({
        ios: () => { AlertIOS.alert('Name can only contain characters A - Z or 0 - 9'); },
        android: () => { ToastAndroid.show('Name can only contain characters A - Z or 0 - 9', ToastAndroid.SHORT); }
      })();
      return false;
    }
    if(reg.test(this.state.lastName)){
      Platform.select({
        ios: () => { AlertIOS.alert('Name can only contain characters A - Z or 0 - 9 )'); },
        android: () => { ToastAndroid.show('Name can only contain characters A - Z or 0 - 9 )', ToastAndroid.SHORT); }
      })();
      return false;
    }
    if (this.isFormValid()) {
      const { email, firstName, lastName, password } = this.state
      const data = { email: email, firstName: firstName, lastName: lastName, password: password }
      NavigationActions.registerProfileBrokerage(data)
    }
  }

 
  render () {
    const { firstName, lastName, email, password } = this.state
    const submitEnabled = this.isFormValid()

    // Logger.log('pin=> ' + pin)

    return (
      <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
         
            <View style={styles.Component}>
              
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>Enter your legal name</Text>

            </View>

            <View style={styles.ViewStyle}>

              <View style={styles.ViewStyle1}>
                <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.tiny,  color: Colors.blueSteel }]}>First name</Text>

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
                placeholder='First name' />

              </View>

              <View style={styles.ViewStyle2}>
                <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.tiny,  color: Colors.blueSteel }]}>Last name</Text>

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
                onSubmitEditing={this.handlePressNext}
                placeholder='Last name' />

              </View>

              <View style={[{flex: 1, flexDirection: 'row', marginTop: 25}, { marginTop: Metrics.doubleBaseMargin }]}>
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
    )
  }

}

RegisterProfileIdentityScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProfileIdentityScreen)
