import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Image
  // Alert
  // Image
  // Keyboard,
  // LayoutAnimation,
} from 'react-native'

import {
  Actions,
} from 'react-native-router-flux'

import { connect } from 'react-redux'
// import { Actions as NavigationActions } from 'react-native-router-flux'
import SettingsActions from '../Redux/SettingsRedux'
import NotificationActions from '../Redux/NotificationRedux'

import {
  Colors,
  ApplicationStyles,
  // Metrics,
   Fonts,
   Images
} from '../Themes'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'

// I18n
// import I18n from 'react-native-i18n'

import FullButton from '../Components/FullButton'

import Logger from '../Lib/Logger'

import firebase from '../Config/FirebaseConfig'
import Styles from './Styles/EnableNotificationsViewStyle'

class EnableNotificationsView extends React.Component {

  state: {
    fob: Object,

    processing: Boolean,
  }

  constructor (props) {
    super(props)

    Logger.log({ name: 'EnableNotificationsView.constructor()', props: props })

    const { fob } = this.props
    Logger.log({ name: 'EnableNotificationsView.constructor()', fob: fob })

    this.state = {
      fob: fob,

      processing: false
    }

  }

  componentWillMount = () => {
    // Logger.log({ name: 'EnableNotificationsView.componentWillMount()' })
    Actions.refresh({title: 'Stay updated'})
    firebase.analytics().setCurrentScreen('onboard_touch_id')
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'EnableNotificationsView.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'EnableNotificationsView.componentWillReceiveProps()', newProps: newProps })
  }

  handleResponse = (enableNotifications) => {
    // Logger.log({ function: 'EnableNotificationsView.handleResponse', enableNotifications: enableNotifications })
    const notifications = {
      notificationsPrompt: false,
      notificationsEnabled: enableNotifications
    }
    this.props.pushNotificationConfig(notifications);
    this.props.updateNotifications(notifications);
  }

  handlePressEnable = () => {
    // Logger.log({ function: 'EnableNotificationsView.handlePressEnable()' })

    // request permission to send notifications
    this.props.requestPermissions()
    this.handleResponse(true)
  }

  handlePressSkip = () => {
    // Logger.log({ function: 'EnableNotificationsView.handlePressSkip()' })
    this.props.requestPermissions()
    this.handleResponse(false)
  }

  render () {
    // Logger.log({ function: 'EnableNotificationsView.render()' })

    return (
      <View style={[ ApplicationStyles.mainContainer ]}>
        <ScrollView style={ Styles.ScrollView}>

          <Image source={Images.notificationIcon} style={Styles.ImageStyle} />

          <View style={Styles.View}>
            <Text style={[ApplicationStyles.tagline, {fontFamily: Fonts.type.chivo}]}>Offerings have time constraints when ordering, enable notifications to stay updated.</Text>
            <Text style={[ApplicationStyles.tagline, {fontFamily: Fonts.type.chivo}]}>This will also enable periodic location checks when using the app to accurately deliver communications based on your time-zone.</Text>
          </View>

        </ScrollView>

        <View style={Styles.View2}>
          <View style={Styles.View3}>
            <FullButton
              ref='skipButton'
              text='No thanks'
              buttonStyle={Styles.FullButton}
              buttonTextStyle = {{ color: Colors.booger }}
              underlayColor = {Colors.white}
              onPress={this.handlePressSkip}
            />

            <FullButton
              ref='enableButton'
              text='Stay updated'
              buttonStyle={Styles.FullButton2}
              onPress={this.handlePressEnable}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fob: state.settings.fob
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestPermissions: () => dispatch(NotificationActions.requestPermissions()),
    pushNotificationConfig: (data) => dispatch(NotificationActions.pushNotificationConfig(data)),
    updateNotifications: (data) => dispatch(SettingsActions.updateNotifications(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnableNotificationsView)
