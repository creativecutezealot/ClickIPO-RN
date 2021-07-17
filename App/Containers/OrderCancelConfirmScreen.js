import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  // Alert,
  Image
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
  Fonts,
  Images
} from '../Themes'
import styles from './Styles/OrderCancelConfirmScreenStyle'

import FullButton from '../Components/FullButton'
import LoadingView from '../Components/LoadingView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'

// I18n
// import I18n from 'react-native-i18n'

// import Logger from '../Lib/Logger'

class OrderCancelConfirmScreen extends React.Component {
    constructor (props) {
    super(props)

    const { orderId, orders } = props;
    const order = findByProp('id', orderId, orders) || props.order;

    this.state = {
      orderId: orderId,
      order: order,
      disabled: false,
      processing: false
    }
  }

  handlePressCancelOrder = () => {
    this.setState({ disabled: false });
    const { orderId } = this.state
    const { order } = this.state
    const data = {
      ext_id: orderId,
      mpid: order.broker_connection.mpid,
      account_id: order.broker_connection.accountId,
    }
    this.props.cancelOrder(data)
    // NavigationActions.offerings();
  }

  handlePressCancel = () => {
    NavigationActions.offerings({tabId:'1'});
  }

  render () {
    const { order, processing } = this.state
    const { offering } = order;
    const orderAmount = '$' + numberWithCommas(order.requestedAmount);
    const cancelOrderDescription = 'Canceling your order for ' + orderAmount + ' of ' + offering.name;

    if (this.props.orderError) {
      return (
        <Text style={[ApplicationStyles.networkError]}>{this.props.orderError.displayMessage}</Text>
      )
    } else {
      return (
        <LoadingView style={[ ApplicationStyles.mainContainer ]} isLoading={processing}>
          <ScrollView style={styles.Container}>
            <View style={ApplicationStyles.contentContainer}>
              <Text style={ApplicationStyles.headline}>Are you sure?</Text>
  
  
              <View style={styles.ViewStyle}>
                <Text style={styles.CancilOrder}>{ cancelOrderDescription }</Text>
              </View>
  
              <View style={[ApplicationStyles.rowContainer, {marginTop: 10, marginBottom: 20}]}>
                <FullButton
                  ref='submitCancelOrder'
                  text="I'm Sure, Cancel Order"
                  onPress={this.handlePressCancelOrder}
                  disabled={this.state.disabled}
                  />
              </View>
  
              <View style={ApplicationStyles.rowContainer}>
                <FullButton
                  ref='submitCancel'
                  text="Don't Cancel"
                  onPress={this.handlePressCancel} />
              </View>
  
            </View>
          </ScrollView>
        </LoadingView>
      )
    }
  }
}

OrderCancelConfirmScreen.propTypes = {
  orderId: PropTypes.string,
  order: PropTypes.object,

  cancelOrder: PropTypes.func,

  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    orderError: state.order.error,
    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelOrder: (data) => dispatch(OrderActions.cancelOrder(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancelConfirmScreen);
