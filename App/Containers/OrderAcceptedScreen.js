import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  // AsyncStorage
  // Alert,
  // Image,
  // Keyboard,
  // LayoutAnimation,
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import OrderActions from '../Redux/OrderRedux'

import { findByProp } from 'ramdasauce'

import { numberWithCommas } from '../Lib/Utilities'

import {
  Colors,
  ApplicationStyles,
  // Metrics,
  Fonts
  // Images,
} from '../Themes'

import FullButton from '../Components/FullButton'
import styles from './Styles/OrderAcceptedScreenStyle'

// external libs
import Icon from 'react-native-vector-icons/FontAwesome'

// I18n
// import I18n from 'react-native-i18n'
import firebase from '../Config/FirebaseConfig'

import Logger from '../Lib/Logger'

class OrderAcceptedScreen extends React.Component {

  state: {
    orderId: String,
    order: Object,
    brokerConnection: Object,
    processing: Boolean,
  }

  isProcessing: Boolean

  constructor (props) {
    super(props)

    const { orderId, orders, brokerConnection, offeringData, orderPlaceAmount } = props

    const order = findByProp('id', orderId, orders)

    this.state = {
      orderId: orderId,
      order: order,
      offeringData: offeringData,
      brokerConnection : brokerConnection,
      orderPlaceAmount: orderPlaceAmount,
      processing: false
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'OrderAcceptedScreen.componentWillMount()' })
    firebase.analytics().setCurrentScreen('order_' + this.state.offeringData.tickerSymbol + '_congratulations')

  }


  handlePressDone = () => {
   NavigationActions.offerings();
  }

  handlePressMyOrders = () => {
    NavigationActions.offerings({tabId:"1"});
  }

  render () {
    const { order, brokerConnection, orderPlaceAmount, offeringData } = this.state

    const brokerDealerName = brokerConnection.brokerDealerName
    const orderAmount = '$' + numberWithCommas(orderPlaceAmount.requested_amount)

    const baseCalPrice = offeringData.finalPrice || offeringData.maxPrice

    const approximateShares = (Math.floor(orderPlaceAmount.requested_amount / baseCalPrice)) ? Math.floor(orderPlaceAmount.requested_amount / baseCalPrice) : 0
    //const approximateShares = (Math.floor(order.requestedAmount / offering.anticipatedPrice.maxPrice)) ? Math.floor(order.requestedAmount / offering.anticipatedPrice.maxPrice) : 0

    // Logger.log({ name: 'OrderAcceptedScreen.render()', brokerDealerName: brokerDealerName, orderAmount: orderAmount, approximateShares: approximateShares })

    const orderStatusDescription = brokerDealerName + ' has accepted your conditional offer to buy for'
    const orderDescription1 = 'Up to ' + orderAmount + ' worth of ' + offeringData.name
    const orderDescription2 = '(approximately ' + approximateShares + ' shares)'
    // Logger.log({ name: 'OrderAcceptedScreen.render()', orderStatusDescription: orderStatusDescription, orderDescription1: orderDescription1, orderDescription2: orderDescription2 })

    return (
      <View style={[ ApplicationStyles.mainContainer ]}>
        <ScrollView style={styles.Container}>
          <View style={ApplicationStyles.contentContainer}>
            <Text style={ApplicationStyles.headline}>Congratulations!</Text>

            <View style={styles.ViewStyle}>
              <Text style={[ { fontFamily: Fonts.type.base, fontSize: 16, color: Colors.greyishBrown, textAlign: 'center' } ]}>{ orderStatusDescription }</Text>
            </View>

            <View style={styles.ViewStyle}>
              <Text style={[ { fontFamily: Fonts.type.light, fontSize: 32, color: Colors.greyishBrown, textAlign: 'center' } ]}>{ orderDescription1 }</Text>
            </View>

            <View style={styles.ViewStyle}>
              <Text style={[ { fontFamily: Fonts.type.light, fontSize: 16, color: Colors.greyishBrown, textAlign: 'center' } ]}>{ orderDescription2 }</Text>
            </View>

            <View style={styles.ViewStyle}>
              <Text style={[ { fontFamily: Fonts.type.base, fontSize: 13, color: Colors.greyishBrown, textAlign: 'center' } ]}>We will notify you if there are material changes to the offering, when the offering is effective and priced, and of your final share allocation.</Text>
            </View>
          </View>

        </ScrollView>

        <View style={styles.ViewStyle1}>
          <View style={styles.ViewStyle2}>
            <FullButton
              ref='myOrdersButton'
              text='My Orders'
              buttonStyle={{ marginRight:10 }}
              onPress={this.handlePressMyOrders} />

            <FullButton
              ref='doneButton'
              text='Done'
              onPress={this.handlePressDone} />
          </View>
        </View>
      </View>

    )
  }
}

OrderAcceptedScreen.propTypes = {
  orderId: PropTypes.string,
  order: PropTypes.object,

  cancelOrder: PropTypes.func,

  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    brokerConnection: state.user.user.brokerConnection,
    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelOrder: (data) => dispatch(OrderActions.cancelOrder(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderAcceptedScreen)
