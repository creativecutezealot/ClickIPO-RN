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
import { Actions as NavigationActions } from 'react-native-router-flux'
import OrderActions from '../Redux/OrderRedux'

// import { findByProp } from 'ramdasauce'

import { numberWithCommas } from '../Lib/Utilities'

import {
  Colors,
  ApplicationStyles,
  Fonts,
  Images
} from '../Themes'
import styles from './Styles/OrderCanceledScreenStyle'

import FullButton from '../Components/FullButton'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class OrderCanceledScreen extends React.Component {

  state: {
    // orderId: String,
    order: Object,

    // processing: Boolean,
  }

  isProcessing: Boolean

  constructor (props) {
    super(props)

    // const { orderId, orders } = props
    // Logger.log({ name: 'OrderCanceledScreen.constructor()', orderId: orderId, orders: orders })

    // const order = findByProp('id', orderId, orders)
    // Logger.log({ name: 'OrderCanceledScreen.constructor()', order: order })

    const { order } = props

    this.state = {
      // orderId: orderId,
      order: order

      // processing: false,
    }
  }

  componentWillReceiveProps (newProps) {
    // Logger.log({ name: 'OrderCanceledScreen.componentWillReceiveProps()', value: newProps })

    const { error } = newProps

    if (this.isProcessing && error) {
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.isProcessing = false
          }
        }]
      )
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'OrderCanceledScreen.componentWillMount()' })
  }

  componentWillUnmount () {
    // Logger.log({ name: 'OrderCanceledScreen.componentWillUnmount()' })
  }

  handlePressMyOrders = () => {
    NavigationActions.offerings()
  }

  render () {
    const { order } = this.state
    const { offering } = order

    const orderAmount = '$' + numberWithCommas(order.requestedAmount)
    const cancelOrderDescription = 'Canceling your order for ' + orderAmount + ' of ' + offering.name + ' will have a negative effect on future share allocations.'

    return (
      <View style={[ styles.mainContainer ]}>
        <ScrollView style={styles.ScrollView}>
          <View style={styles.contentContainer}>
            <Text style={styles.headline}>Order Canceled</Text>

            <View style={styles.Component}>
              <Text style={[ { fontFamily: Fonts.type.light, fontSize: 17, color: Colors.greyishBrown, textAlign: 'center' } ]}>{ cancelOrderDescription }</Text>
            </View>

            <Text style={styles.tagline}>Investor Score lowered</Text>

            <View style={styles.ViewStyle}>
              <Image source={Images.lowerScore} style={[{ height: 100 }]} resizeMode='contain' />
            </View>

            <Text style={styles.tagline}>Raise your Investor Score by placing orders, completing purchases and holding shares for more IPOs</Text>
          </View>
        </ScrollView>

        <View style={styles.ViewStyle1}>
          <View style={styles.ViewStyle2}>
            <FullButton
              ref='myOrdersButton'
              text='My Orders'
              buttonStyle={{ backgroundColor: Colors.lightGreyGreen }}
              onPress={this.handlePressMyOrders} />

            <FullButton
              ref='doneButton'
              text='Done'
              onPress={this.handlePressMyOrders} />
          </View>
        </View>
      </View>
    )
  }
}

OrderCanceledScreen.propTypes = {
  orderId: PropTypes.string,
  order: PropTypes.object,

  cancelOrder: PropTypes.func,

  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,

    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelOrder: (data) => dispatch(OrderActions.cancelOrder(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCanceledScreen)
