import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  View
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
import OfferingActions from '../Redux/OfferingRedux'

// import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Colors,
  ApplicationStyles
} from '../Themes'

import OfferingsView from './OfferingsView'

// import OrdersListView from './OrdersListView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import firebase from '../Config/FirebaseConfig'

import Logger from '../Lib/Logger'

import DefaultTabBar from '../Components/DefaultTabBar'

// I18n
// import I18n from 'react-native-i18n'

class OfferingsScreen extends React.Component {
  state: {

  }

  initialPage:0

  constructor (props) {
    super(props)

    // Logger.log({ name: 'OfferingsScreen.constructor()', props: props })

    const { navigationState } = props

    this.state = {
      navigationState
    }

    if(props.following){
      this.initialPage = 1
    }
  }

  componentWillMount () {
    firebase.analytics().setCurrentScreen('offerings')
  }

  componentWillReceiveProps (newProps) {
    //Logger.log({ name: 'OfferingsScreen.componentWillReceiveProps()', newProps: newProps })
  }

  render () {
    // const children = this.state.navigationState.children
    // want swipping? see https://github.com/jshanson7/react-native-swipeablezz
    return (
      <View style={{flex: 1}}>
        <OfferingsView {...this.props}/>
      </View>
    )
  }
}

/*
<OrdersListView tabLabel='My Orders' filters={[ { prop: 'status', value: 'conditional' } ]} />
*/

OfferingsScreen.propTypes = {
  navigationState: PropTypes.object,
  view: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferingsScreen)
