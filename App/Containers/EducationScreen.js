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

import TermsListView from './TermsListView'
import ArticlesView from './ArticlesView'
import FaqsListView from './FaqsListView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import DefaultTabBar from '../Components/DefaultTabBar'

import firebase from '../Config/FirebaseConfig'

// I18n
// import I18n from 'react-native-i18n'


class EducationScreen extends React.Component {
  state: {

  }

  initialPage : 0
  termId : String

  constructor (props) {
    super(props)

    const { navigationState, termId } = props

    this.state = {
      navigationState
    }

    if(props.article){
      this.initialPage = 1
    } else if(props.faq){
      this.initialPage = 2
    }

    this.termId = termId

  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
  }

  componentWillMount () {
    firebase.analytics().setCurrentScreen('help')
  }

  componentWillUnmount () {

  }

  render () {
    // const children = this.state.navigationState.children
    // <ArticlesView tabLabel='Articles' />

    return (
      <ScrollableTabView initialPage={this.initialPage} style={ApplicationStyles.mainContainer} scrollWithoutAnimation renderTabBar={() => <DefaultTabBar activeColors = {[Colors.greenYellow, Colors.greenBlue]} inactiveColors = {[Colors.clear, Colors.clear]}   style={ApplicationStyles.tabs}  activeTextColor={Colors.white} inactiveTextColor={Colors.booger} tabStyle={ApplicationStyles.tab} textStyle={ApplicationStyles.tabText} underlineStyle={ApplicationStyles.tabUnderline} />} >
        <TermsListView tabLabel='GLOSSARY' termId={this.termId} />
        <FaqsListView tabLabel='FAQs' filters={[ { prop: 'category', value: 'General' } ]} />
      </ScrollableTabView>
    )
  }

}

EducationScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(EducationScreen)
