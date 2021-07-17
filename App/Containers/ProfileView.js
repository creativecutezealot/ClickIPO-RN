import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Switch,
  TouchableHighlight,
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import SettingsActions from '../Redux/SettingsRedux'
import BrokerActions from '../Redux/BrokerRedux'

import {
  User,
  Fob
} from '../Models'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import {
  Colors,
  Metrics,
  Fonts,
  ApplicationStyles
  // Images
} from '../Themes'

import Logger from '../Lib/Logger'

import firebase from '../Config/FirebaseConfig'

import FeatureSetConfig from '../Config/FeatureSetConfig'
import styles from './Styles/ProfileViewStyle'


class ProfileView extends React.Component {
  state: {
    user: User,
    fob: Fob,
  }

  constructor (props) {
    super(props)

    const { user, fob } = props

    this.state = {
      user: user,
      fob: fob
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'ProfileView.componentWillMount()' })
    firebase.analytics().setCurrentScreen('account_profile')
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'ProfileView.componentWillUnmount()' })

  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'ProfileView.componentWillReceiveProps()', newProps: newProps })
    
    const { user, fob } = newProps
    
    this.setState({
      user: user,
      fob: fob
    })
  }

  handlePressToggleTouchId = () => {
    // Logger.log({ name: 'ProfileView.handlePressToggleTouchId()' })

    this.props.toggleTouchId()
  }

  handlePressEditProfile = () => {
    // Logger.log({ name: 'ProfileView.handlePressToggleTouchId()' })
    NavigationActions.profileEditView({firstName : this.state.user.firstName, lastName : this.state.user.lastName, email : this.state.user.email, brokerage: this.state.user.marketing_brokerage, canEmail: this.state.user.canEmail, pushNotification: this.state.user.pushNotification});
  }

  handlePressChangePassword = () => {
    // Logger.log({ name: 'ProfileView.handlePressToggleTouchId()' })
    NavigationActions.profileChangePasswordView()
  }

  handlePressBrokerageFirms = () => {
    // Logger.log({ name: 'ProfileView.handlePressBrokerageFirms()' })
    //data has to contain user.BrokeConnection and deleteBrokerConnection to send to navigation router
    // console.log('this.props.user.brokerConnection', this.props.user.brokerConnection)
    const data = {
      brokerConnection: this.props.user.brokerConnection,
      deleteBrokerConnection: this.props.deleteBrokerConnection
    }
    NavigationActions.brokerView(data)
  }

  handlePressSocialMedia = () => {
    // Logger.log({ name: 'ProfileView.handlePressSocialMedia()' })
    NavigationActions.profileSocialView()
  }


  renderTouchId = () => {
    // if(this.props.touchIdSupported === true) {
    //   return(
    //     <View style={[ ApplicationStyles.borderBottom ]}>
    //       <View underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer}>
    //         <View style={[ApplicationStyles.highlightInner, {marginLeft:0}]}>
    //           <View style={ApplicationStyles.textContainer}>
    //             <Text style={ApplicationStyles.text}>Touch ID</Text>
    //           </View>
    //           <View style={ApplicationStyles.rightContainer}>
    //               <Switch
    //                 onValueChange={this.handlePressToggleTouchId}
    //                 value={this.state.fob.touchIdEnabled} />
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   )
    // }
  }

  //if user is not restricted show the Brokerage Firm
  renderBroker = () => {
    if(this.props.restrictedPerson === 0) {
      return(
        <View style={[ ApplicationStyles.borderBottom ]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={this.handlePressBrokerageFirms}>
            <View style={[ApplicationStyles.highlightInner, {marginLeft:0}]}>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>Brokerage firms</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                <ClickIcon name='icon-chevron-right' style={ApplicationStyles.chevron} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  renderSocialSharing = () => {
    if(FeatureSetConfig.social.sharingEnabled) {
      return(
        <View style={[ ApplicationStyles.borderBottom ]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={this.handlePressSocialMedia}>
            <View style={[ApplicationStyles.highlightInner, {marginLeft:0}]}>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>Social media</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                <ClickIcon name='icon-chevron-right' style={ApplicationStyles.chevron} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }


  render () {

    const name = this.state.user.firstName + ' ' + this.state.user.lastName

    return (
      <ScrollView style={ApplicationStyles.container}>
        <View style={styles.Component}>
          <Text style={[{ ...Fonts.style.heading, color: Colors.drawerBlue, alignSelf: 'center' }]}>{name}</Text>
        </View>
        <View style={[{ marginLeft:25}]}>

        {/* {this.renderTouchId()} */}

        {this.renderBroker()}

        <View style={[ ApplicationStyles.borderBottom]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={this.handlePressChangePassword}>
            <View style={[ApplicationStyles.highlightInner, {marginLeft:0}]}>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>Password</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                <ClickIcon name='icon-chevron-right' style={ApplicationStyles.chevron} />
              </View>
            </View>
          </TouchableHighlight>
        </View>

        {this.renderSocialSharing()}

        <View style={[ApplicationStyles.borderBottom]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={this.handlePressEditProfile}>
            <View style={[ApplicationStyles.highlightInner, {marginLeft:0}]}>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>Edit Profile</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                <ClickIcon name='icon-chevron-right' style={ApplicationStyles.chevron} />
              </View>
            </View>
          </TouchableHighlight>
        </View>

        </View>

      </ScrollView>
    )
  }
}

ProfileView.propTypes = {
  user: PropTypes.object,
  fob: PropTypes.object,
  restrictedPerson: PropTypes.number
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    fob: state.settings.fob,
    touchIdSupported: state.settings.touchIdSupported,
    restrictedPerson: state.user.restrictedPerson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleTouchId: () => dispatch(SettingsActions.toggleTouchId()),
    deleteBrokerConnection: (brokerConnection) => dispatch(BrokerActions.deleteBrokerConnection(brokerConnection))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
