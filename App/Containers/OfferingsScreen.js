import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  View,
  // AsyncStorage,
  // ScrollView,
   Text,
  // TextInput,
  // TouchableOpacity,
  // Image,
  // Keyboard,
  // LayoutAnimation
} from 'react-native'

import { connect } from 'react-redux'
// import OfferingActions from '../Redux/OfferingRedux'
import OfferingActions from '../Redux/OfferingRedux'
import WaitingView from '../Components/WaitingView';

// import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Colors,
  ApplicationStyles
} from '../Themes'
import OrderActions from '../Redux/OrderRedux'
import OfferingsView from './OfferingsView'
import OrdersListView from './OrdersListView';

// import OrdersListView from './OrdersListView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import firebase from '../Config/FirebaseConfig'

import Logger from '../Lib/Logger'

import DefaultTabBar from '../Components/DefaultTabBar'

// I18n
// import I18n from 'react-native-i18n'
var initialPage =0;
class OfferingsScreen extends React.Component {
  state: {
    orders: Array<Order>,
  }

  constructor (props) {
    super(props)
      const { orders = [], filters = [] } = props
      const tabId = this.props.tabId;
      if(tabId == 1){
        initialPage = 1
      }else{
        initialPage = 0
      };
      // Logger.log({ name: 'OfferingsScreen.constructor()', props: props })
      const { navigationState } = props

      this.state = {
        orders: orders,
        navigationState,
        initialPage:initialPage,
        //isLoading:true
      }

    if(props.following){
      this.state.initialPage = 1
    }
  }

  componentWillMount (){
    this.fetchOrders();
    firebase.analytics().setCurrentScreen('offerings')
  }

 fetchOrders = () => {
    this.setState({ isProcessing: true })
    const filter = {}
    this.props.fetchOrders(filter)
    this.setState({ isLoading: false })
  }
  componentWillReceiveProps (newProps) {
    //Logger.log({ name: 'OfferingsScreen.componentWillReceiveProps()', newProps: newProps })
  }
  // isWaiting = () => {
  //   if (this.state.isLoading === false) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  // renderAll = () => {
    render () {
    return (
      <View style={{flex: 1}}>
        {/* <ScrollableTabView initialPage={this.state.initialPage} style={ApplicationStyles.mainContainer} locked scrollWithoutAnimation renderTabBar={() => <DefaultTabBar isTabsHidden= {this.props.isTabsHidden} activeColors = {[Colors.greenYellow, Colors.greenBlue]} inactiveColors = {[Colors.clear, Colors.clear]}   style={ApplicationStyles.tabs}  activeTextColor={Colors.white} inactiveTextColor={Colors.booger} tabStyle={ApplicationStyles.tab} textStyle={ApplicationStyles.tabText} underlineStyle={ApplicationStyles.tabUnderline} />} > */}
          <OfferingsView {...this.props} isMyOffering={false} tabLabel='ALL OFFERINGS' />
          <OrdersListView
            {...this.props}
            tabLabel='MY ORDERS'
          />
       {/*  </ScrollableTabView> */}
      </View>
    )
  }
}
//   render () {
//     // const children = this.state.navigationState.children
//     // want swipping? see https://github.com/jshanson7/react-native-swipeablezz'
//     console.log(this.props.error)
//     if(this.props.error) {
//       //change the text to show the error, this error happens when the backend send us an error
//       console.log(this.props.error.displayMessage)
//       return (
//         <Text style={{ padding: 20 }}> {this.props.error.displayMessage}</Text>
//       )
//     }
//     console.log('waiting: ', this.isWaiting())
//    return (
//       <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
//     );
//   }
// }


/*
<OrdersListView tabLabel='My Orders' filters={[ { prop: 'status', value: 'conditional' } ]} />
*/

OfferingsScreen.propTypes = {
  navigationState: PropTypes.object,
  view: PropTypes.string,
  fetchOrders: PropTypes.func,
  orders: PropTypes.array,
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    fetching: state.order.fetching,
    error: state.order.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      fetchOrders: (data) => dispatch(OrderActions.fetchOrders(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferingsScreen)
