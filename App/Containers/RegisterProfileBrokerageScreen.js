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

import firebase from '../Config/FirebaseConfig'
import styles from './Styles/RegisterProfileBrokerageScreenStyle'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class RegisterProfileBrokerageScreen extends React.Component {

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
      firstName: this.props.first_name,
      lastName: this.props.last_name,
      email: this.props.email,
      password: this.props.password,
      brokerage: 'Just2Trade',
    }

    this.isProcessing = false
  }

  componentWillReceiveProps (newProps) {
    // Logger.log({ name: 'RegisterProfileBrokerageScreen.componentWillReceiveProps()', value: newProps })

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
    // Logger.log({ name: 'RegisterProfileBrokerageScreen.componentWillMount()' })

  }

  componentWillUnmount () {
    // Logger.log({ name: 'RegisterProfileBrokerageScreen.componentWillUnmount()' })
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
    if (this.isFormValid()) {
      const { email, firstName, lastName, password, brokerage } = this.state
      const data = { email: email, first_name: firstName, last_name: lastName, password: password, marketing_brokerage: brokerage }

      NavigationActions.registerTermsConditions(data)
    }
  }

  onBrokerageChange = (brokerage) => {
    this.setState({
      brokerage: brokerage
    })
  }

  render () {
    const { firstName, lastName, email, password, brokerage } = this.state
    const submitEnabled = this.isFormValid()

    // Logger.log('pin=> ' + pin)

    return (
      <ScrollView style={ApplicationStyles.mainContainer} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
            <View style={styles.Component}>
              
              <Text style={[{ ...Fonts.style.text, fontSize : Fonts.size.small, marginVertical:10, color: Colors.blueSteel, textAlign: 'center' }]}>Who is your current brokerage firm?</Text>

            </View>

            <View style={styles.ViewStyle}>

              <View style={styles.ViewStyle1}>

                <BrokerSelector onBrokerageChange={(data) => this.onBrokerageChange(data)} brokerage={brokerage} />


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

RegisterProfileBrokerageScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProfileBrokerageScreen)
