

import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
  Image
  // Keyboard,
  // LayoutAnimation,
} from 'react-native'

import { connect } from 'react-redux'
// import { Actions as NavigationActions } from 'react-native-router-flux'
import SettingsActions from '../Redux/SettingsRedux'

import {
  Colors,
  // Metrics,
  // Fonts,
   Images,
  ApplicationStyles
} from '../Themes'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'

// I18n
// import I18n from 'react-native-i18n'

import FullButton from '../Components/FullButton'
import firebase from '../Config/FirebaseConfig'
import Styles from './Styles/EnableTouchIdViewStyle'


import {
  Token,
  // User,
  // ClickIpoError,
  Fob
} from '../Models'

import Logger from '../Lib/Logger'

class EnableTouchIdView extends React.Component {

  state: {
    fob: Fob,
    authToken: Token,

    processing: Boolean,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'EnableTouchIdView.constructor()', props: props })

    const { fob = null, authToken = null } = this.props
    // Logger.log({ name: 'EnableTouchIdView.constructor()', fob: fob, authToken: authToken })

    this.state = {
      fob: fob,
      authToken: authToken,

      processing: false
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'EnableTouchIdView.componentWillMount()' })
    firebase.analytics().setCurrentScreen('onboard_touch_id')
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'EnableTouchIdView.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'EnableTouchIdView.componentWillReceiveProps()', newProps: newProps })
  }

  promptToEnableTouchId = () => {
    // Logger.log({ function: 'EnableTouchIdView.promptToEnableTouchId' })

    Alert.alert(
     'Enable Touch ID',
     'Would you like to enable Touch ID to sign-in',
      [
        {
          text: 'No',
          onPress: () => {
            const enableTouchId = false
            this.handleResponse(enableTouchId)
          }
        },
        {
          text: 'Yes',
          onPress: () => {
            const enableTouchId = true
            this.handleResponse(enableTouchId)
          }
        }
      ],
     { cancelable: false },
    )
  }

  handleResponse = (enableTouchId) => {
    // Logger.log({ function: 'EnableTouchIdView.handleResponse', enableTouchId: enableTouchId })

    const touchId = {
      touchIdEnabled: false,
      touchIdPrompt: false,
      token: null
    }

    if (enableTouchId) {
      const { authToken } = this.state

      touchId.touchIdEnabled = true
      touchId.token = authToken
    }

    this.props.updateTouchId(touchId)
  }

  handlePressEnable = () => {
    // Logger.log({ function: 'EnableTouchIdView.handlePressEnable()' })

    this.handleResponse(true)
  }

  handlePressSkip = () => {
    // Logger.log({ function: 'EnableTouchIdView.handlePressSkip()' })

    this.handleResponse(false)
  }

  render () {
    // Logger.log({ function: 'EnableTouchIdView.render()' })

    return (
      <View style={[ ApplicationStyles.mainContainer ]}>
        <ScrollView style={Styles.ScrollView}>
          <View style={ApplicationStyles.contentContainer}>
            <Text style={ApplicationStyles.headline}>Enable Touch ID?</Text>
          </View>

          <View style={ApplicationStyles.contentContainer}>
            <Text style={ApplicationStyles.tagline}>Touch ID allows you to log in using your fingerprint at the login screen.  If you change your mind, you can turn this off at any time in My Account > Profile.</Text>
          </View>
        </ScrollView>

        <View style={Styles.View}>
          <View style={Styles.View2}>
            <FullButton
              ref='skipButton'
              text='No Thanks'
              buttonStyle={Styles.ButtonStyle}
              onPress={this.handlePressSkip}
              />

            <FullButton
              ref='enableButton'
              text='Enable Touch ID'
              buttonStyle={Styles.FullButton}
              onPress={this.handlePressEnable}
              />
          </View>
        </View>
      </View>
    )
  }
}

EnableTouchIdView.propTypes = {
  fob: PropTypes.object,
  authToken: PropTypes.object,

  touchId: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    fob: state.settings.fob,
    authToken: state.user.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTouchId: (data) => dispatch(SettingsActions.updateTouchId(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnableTouchIdView)
