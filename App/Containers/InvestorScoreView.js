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
  ApplicationStyles
} from '../Themes'

import InvestorScoreOverviewView from './InvestorScoreOverviewView'
import FaqsListView from './FaqsListView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import DefaultTabBar from '../Components/DefaultTabBar'


import firebase from '../Config/FirebaseConfig'
// I18n
// import I18n from 'react-native-i18n'

class InvestorScoreView extends React.Component {
  state: {

  }

  initialPage:0

  constructor (props) {
    super(props)

    const { navigationState } = props

    this.state = {
      navigationState
    }

    if(props.faq){
      this.initialPage = 1
    }
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
  }

  componentWillMount () {
    firebase.analytics().setCurrentScreen('investor_score')
  }

  componentWillUnmount () {

  }

  render () {
    // const children = this.state.navigationState.children

    return (
      <ScrollableTabView initialPage={this.initialPage} style={ApplicationStyles.mainContainer} scrollWithoutAnimation renderTabBar={() => <DefaultTabBar activeColors = {[Colors.greenYellow, Colors.greenBlue]} inactiveColors = {[Colors.clear, Colors.clear]}   style={ApplicationStyles.tabs}  activeTextColor={Colors.white} inactiveTextColor={Colors.booger} tabStyle={ApplicationStyles.tab} textStyle={ApplicationStyles.tabText} underlineStyle={ApplicationStyles.tabUnderline} />} >
        <InvestorScoreOverviewView tabLabel='HOW IT WORKS' />
        <FaqsListView tabLabel='FAQs' filters={[ { prop: 'category', value: 'Investor Score' } ]} />
      </ScrollableTabView>
    )
  }

}

InvestorScoreView.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(InvestorScoreView)
