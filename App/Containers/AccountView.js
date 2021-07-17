


import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  // View,
  // ScrollView,
  // Text,
  // TextInput,
  // TouchableOpacity,
  // Image,
  // Keyboard,
  // LayoutAnimation
  //
} from 'react-native'

import { connect } from 'react-redux'
// import OfferingActions from '../Redux/OfferingRedux'

import {
  Colors,
  ApplicationStyles
} from '../Themes'

// import ProfileView from './ProfileView'
import ProfileView from './ProfileView'
import BrokerView from './BrokerView'
import ProfileSocialView from './ProfileSocialView'

import UserActions from '../Redux/UserRedux'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import FeatureSetConfig from '../Config/FeatureSetConfig'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class AccountView extends React.Component {
  state: {

  }

  social:false
  brokerages:false
  initialPage:0

  constructor (props) {
    super(props)

    const { navigationState } = props

    this.state = {
      navigationState
    }

    if(props.brokerages){
      this.brokerages = true
    }

    if(props.social){
      this.social = true
    }

    if(this.social && FeatureSetConfig.social.sharingEnabled){
      if (this.props.restrictedPerson === 0){
        this.initialPage = 2
      } else {
        this.initialPage = 1
      }
    }

    if(this.brokerages && this.props.restrictedPerson === 0){
      this.initialPage = 1    
    }

  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    
  }

  componentWillUnmount () {
    //comment
  }

  render () {
    // const children = this.state.navigationState.children

    // <ProfileView tabLabel='Profile' />
    return (
      <ScrollableTabView initialPage={this.initialPage} style={ApplicationStyles.mainContainer} locked scrollWithoutAnimation renderTabBar={() => <DefaultTabBar style={ApplicationStyles.tabs} activeTextColor={Colors.greyishBrown} inactiveTextColor={Colors.greyishBrown} tabStyle={ApplicationStyles.tab} textStyle={ApplicationStyles.tabText} underlineStyle={ApplicationStyles.tabUnderline} />} >
        <ProfileView {...this.props} tabLabel='Profile' />

        {this.renderBroker()}

        { this.renderSocialSharing() }
      </ScrollableTabView>
    )
  }

  renderBroker = () => {
    if (this.props.restrictedPerson === 0) {
      return (
        <BrokerView {...this.props} tabLabel='Brokerage Firm' />
      )
    } else {
      return (
        null
      )
    }
  }

  renderSocialSharing = () => {
    if (FeatureSetConfig.social.sharingEnabled) {
      return (
        <ProfileSocialView {...this.props} tabLabel='Social Media' />
      )
    } else {
      return (
        null
      )
    }
  }

}

AccountView.propTypes = {
  navigationState: PropTypes.object,
  restrictedPerson: PropTypes.number
}

const mapStateToProps = (state) => {
  return {
    restrictedPerson: state.user.restrictedPerson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountView)
