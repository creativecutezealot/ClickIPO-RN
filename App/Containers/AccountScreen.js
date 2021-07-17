


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
} from 'react-native'

import { connect } from 'react-redux'
// import OfferingActions from '../Redux/OfferingRedux'

import {
  Colors,
  ApplicationStyles,
} from '../Themes'

import InvestorScoreView from './InvestorScoreView'
import BrokerView from './BrokerView'
import ProfileSocialView from './ProfileSocialView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import firebase from '../Config/FirebaseConfig'

// Styles

// I18n
// import I18n from 'react-native-i18n'

class AccountScreen extends React.Component {
  state: {

  }

  constructor (props) {
    super(props)

    const { navigationState } = props

    this.state = {
      navigationState
    }
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
  }

  componentWillMount () {
    firebase.analytics().setCurrentScreen('account')
  }

  componentWillUnmount () {

  }

  render () {
    // const children = this.state.navigationState.children

    return (
      <ScrollableTabView style={ApplicationStyles.mainContainer} scrollWithoutAnimation renderTabBar={() => <DefaultTabBar style={ApplicationStyles.tabs} activeTextColor={Colors.greyishBrown} inactiveTextColor={Colors.greyishBrown} tabStyle={ApplicationStyles.tab} textStyle={ApplicationStyles.tabText} underlineStyle={ApplicationStyles.tabUnderline} />} >
        <InvestorScoreView tabLabel='Investor Score' />
        {/*<BrokerView tabLabel='Brokerage Firm' />*/}
        <ProfileSocialView tabLabel='Social Media' />
      </ScrollableTabView>
    )
  }

}

AccountScreen.propTypes = {
  navigationState: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen)
