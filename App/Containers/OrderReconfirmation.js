import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Platform,
  AlertIOS,
  ToastAndroid,
  // AsyncStorage
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import OrderActions from '../Redux/OrderRedux';
import BrokerActions from '../Redux/BrokerRedux';

import styles from './Styles/OrderModifyScreenStyles';
import WaitingView from '../Components/WaitingView';

import Config from 'react-native-config'

import { numberWithCommas } from '../Lib/Utilities'

import { findByProp } from 'ramdasauce'

// Styles
import {
  // Metrics,
  Colors,
  Fonts,
  Images,
  ApplicationStyles
} from '../Themes'

import FullButton from '../Components/FullButton'
import LoadingView from '../Components/LoadingView'

import {
  Offering
} from '../Models'

import firebase from '../Config/FirebaseConfig'
// need to import a style component -- the style is very similar to the OrderModifyScreen

class OrderReconfirmation extends Component {
  constructor(props) {
    super(props);
    //if we have the info then just show it, else call it. maybe check this in the componentWillMount

    if(props.order) {
      this.state = {
        investmentAmount: props.order.requestedAmount,
        ableToModify: false
      }
    } else {
      //set the loading variable that indicated order is fetching and wait until you have the order object in props before setting the requestedAmount;
      this.state = {
        investmentAmount: null,
        ableToModify: false
      }
    }

    //bind methods below
    this.modifyPressed = this.modifyPressed.bind(this);
    this.deleteOrderPressed = this.deleteOrderPressed.bind(this);
    this.reconfirmPressed = this.reconfirmPressed.bind(this);
    this.handleChangeInvestmentAmount = this.handleChangeInvestmentAmount.bind(this);
    // console.log('afte all the binding stuff');
  }

  componentDidMount() {
    //call the fetchBuyingPower API call here. the modify and cancel button should be greyed out until response is recieved 
    this.props.fetchBuyingPower();
    //if order is not present then make the api call and get the order
    //this order id will get passed to to this component via props
    if (!this.props.order) {
      // console.log('this is where we are calling the api');
      this.props.fetchOrder(this.props.orderId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.oneOrder) {
      this.setState({
        investmentAmount: nextProps.oneOrder.requestedAmount
      });
    }
  }

  componentWillUnmount() {
    this.props.resetOrderError();
    this.props.clearOrderReconfirmationResponse();
  }

  modifyPressed() {
    const { order } = this.props;
    this.setState({ modifyDisabled: false });

    const { offering } = order || this.props.oneOrder;

    const modifyData = {
      ext_id: offering.id,
      verb: 'modify',
      // amount: this.state.investmentAmount
      requested_amount: this.state.investmentAmount,
      mpid: this.props.order.broker_connection.mpid,
      buying_power: this.props.buyingPower.buying_power,
      account_id: this.props.order.broker_connection.accountId,
    }

    if (parseInt(this.state.investmentAmount) <= (this.props.buyingPower.buying_power + this.props.order.requestedAmount) ) {
      if (parseInt(this.state.investmentAmount) >= parseInt(this.props.user.brokerConnection.minBuyAmt)) {
        // make the api call
        //apiCall with modifyData in it. 
        this.props.submitOrderReconfirmation(modifyData);
      } else {
        Platform.select({
          ios: () => { AlertIOS.alert("Minimum investment amount is $" + this.props.user.brokerConnection.minBuyAmt); },
          android: () => { ToastAndroid.show("Minimum investment amount is $" + this.props.user.brokerConnection.minBuyAmt); }
        })();
      }
    } else {
      Platform.select({
        ios: () => { AlertIOS.alert("You have exceeded your buying power. Please modify the amount!!") },
        android: () => { ToastAndroid.show("You have exceeded your buying power. Please modify the amount!!", ToastAndroid.SHORT) }
      })();
    }
    
  }

  deleteOrderPressed() {
    const { order } = this.props;
    this.setState({ deleteDisabled: false });

    const { offering } = order || this.props.oneOrder;

    const deleteOrderData = {
      ext_id: offering.id,
      verb: 'cancel',
      // amount: 0,
      mpid: this.props.order.broker_connection.mpid,
      account_id: this.props.order.broker_connection.accountId,
    }

     this.props.submitOrderReconfirmation(deleteOrderData);
    
  }

  reconfirmPressed() {
    const { order } = this.props;
    this.setState({ reconfimDisabled: false });

    const { offering } = order || this.props.oneOrder;

    const reconfirmOrderData = {
      ext_id: offering.id,
      verb: 'reconfirm',
      // amount: 0,
      requested_amount: this.state.investmentAmount,
      mpid: this.props.order.broker_connection.mpid,
      buying_power: this.props.buyingPower.buying_power,
      account_id: this.props.order.broker_connection.accountId,

    }
   
    this.props.submitOrderReconfirmation(reconfirmOrderData);
  }

  handleChangeInvestmentAmount(event) {
    //setting the value of the field to state to be used in the modifyPressed method
    const { requestedAmount } = this.props.order || this.props.oneOrder;
    if (requestedAmount != parseInt(event)) {
      this.setState({
        investmentAmount: event,
        ableToModify: true
      });
    } else {
      this.setState({
        investmentAmount: event,
        ableToModify: false
      });
    }
  }

  //Add by Burhan
  componentDidUpdate(){
    if (this.props.reconfirmationResponse) {
      NavigationActions.offerings();
    }
  }

  renderContent() {
    if (!this.props.oneOrder && !this.props.order) {
      //set loading true or an error message -- have to check this -- from notification
      return (
        <View>
          <Text>Unable to load order. please try again later!</Text>
        </View>
      )
    } else {
      const { order } = this.props;
      const { offering } = order || this.props.oneOrder;
      var logo = { uri: `https:${offering.logoUrl}` }
      var price = 0;
  
      //below is how we decide what price to show to the user. This will later be refactored into a helper method so we can use it in multiple different components
      if (offering.finalPrice) {
        var priceText = <Text>Final Price</Text>
        var price = '$' + offering.finalPrice.toFixed(2);
      } else if ( offering.minPrice == 0 && offering.maxPrice == 0) {
        var priceText = 
          <View>
            <Text>Anticipated</Text>
            <Text>Price Range</Text>
          </View>
        var price = 'TBD';
      } else if ( offering.minPrice != null && offering.maxPrice != null) {
        var priceText = 
          <View>
            <Text>Anticipated</Text>
            <Text>Price Range</Text>
          </View>
        var price = '$' + offering.minPrice.toFixed(2) + '-$' + offering.maxPrice.toFixed(2);
      } else {
        var priceText = <Text>Last Closing Price</Text>
        var price = '$' + offering.maxPrice.toFixed(2);
      }
      //this is the price of the offering. it may be a price range if IPO and last closing price if seconday
      if (offering.finalShares) {
        var shares = offering.finalShares
      } else {
        var shares = "TBD";
      }
      //calculating the approxShares
      const baseCalPrice = offering.finalPrice || offering.maxPrice;
      var approximateShares = (Math.floor(this.state.investmentAmount / baseCalPrice)) ? Math.floor(this.state.investmentAmount / baseCalPrice) : 0;
    }
    

    //this is where we are going to render the UI
    return (
      <ScrollView>
        <KeyboardAvoidingView behavior='position'>
          <View style={ApplicationStyles.logoContainer}>
            <Image resize="contain" style={ApplicationStyles.logo} source={logo} />
          </View>
          <View style={[ApplicationStyles.offeringDetailsContainer]}>
            <View style={styles.offeringDetailsContainerView}>
              <View style={styles.flex}>
                {priceText}
              </View>

              <View style={styles.flex}>
                <Text>IPO Shares</Text>
                <Text>Offered</Text>
              </View>
            </View>

            <View style={styles.priceViewStyle}>
              <View style={styles.flex}>
                <Text>{price}</Text>
              </View>

              <View style={styles.flex}>
                <Text>{shares}</Text>
              </View>
            </View>
          </View>

          <View style={[ApplicationStyles.orderDetailsContainer]}>
            <View style={styles.headingViewStyle}>
              {/* <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Recofirmation Page</Text> */}
              <Text style={styles.headingTextStyle}>Please <Text style={{fontWeight: 'bold'}}>reconfirm </Text>your order below. You may keep the same amount, modify, or cancel your order.</Text>
            </View>

            <View style={styles.InvestmestMainViewStyle}>
              <View style={styles.InvestmestSubViewStyle}>
                <View style={styles.InvestmestInnerViewStyle}>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Investment</Text>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Amount</Text>
                </View>

                <View style={styles.ApproximateViewStyles}>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Approximate</Text>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Shares</Text>
                </View>
              </View>

              <View style={styles.InputTextMainViewStyle}>
                <View style={styles.InputTextSubViewStyle}>
                  <View style={styles.InputTextInnerViewStyle} >
                    <TextInput
                      ref='investmentAmountTextField'
                      style={styles.InputTextStyle}
                      value={this.state.investmentAmount.toString()}
                      //value={this.state.handleChangeInvestmentAmount}
                      autoFocus={true}
                      placeholder='$0'
                      keyboardType='numeric'
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onChangeText={this.handleChangeInvestmentAmount}
                      underlineColorAndroid='transparent' />
                  </View>
                </View>

                <View style={styles.equalView}>
                  <Text style={styles.equalTextStyle}>=</Text>
                </View>

                <View style={styles.approximateSharesViewStyles}>
                  <Text style={styles.approximateSharesTextStyles}>{approximateShares}</Text>
                </View>
              </View>
            </View>

            {
              this.props.buyingPower ? 
              <View style={styles.buyingPowerViewStyle}>
                <Text style={styles.buyingPowerTextStyle}>Buying Power: {"$" + this.props.buyingPower.buying_power}</Text>
              </View> : 
              <View>
                <Text>Loading ...</Text>
              </View>
            }
            <View style={styles.InformationViewStyle}>
              <Text style={styles.InformationTextStyle}>There is no assurance that your conditional offer to buy will receive the full requested allocation or any allocation at all.  Your order is conditional on the final share price being no greater than 20% higher or lower than the anticipated price range.  Your order will be for the dollar amount calculated regardless of the final share price.</Text>
            </View>
          </View>
          <View>
            <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
              <FullButton
                ref='modify'
                buttonStyle={{ marginRight: 5 }}
                onPress={this.modifyPressed}
                text="Modify"
                disabled={!this.state.ableToModify}
              />
              <FullButton
                ref='reconfirm'
                buttonStyle={{ marginLeft: 5 }}
                onPress={this.reconfirmPressed}
                text="Reconfirm"
              />
            </View>
            <FullButton
              ref="cancel"
              buttonStyle={{ margin: 10, backgroundColor: Colors.orange }}
              onPress={this.deleteOrderPressed}
              text="Cancel Order"
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  render() {
    // Comment by burhan
    // if (this.props.reconfirmationResponse) {
    //   NavigationActions.offerings();
    // }
    if (this.props.offeringError) {
      return (
        <View>
          <Text style={[ApplicationStyles.networkError]}>{this.props.offeringError.error}</Text>
        </View>
      );
    } else if (this.props.brokerError) {
      return (
        <View>
          <Text style={[ApplicationStyles.networkError]}>{this.props.brokerError.displayMessage}</Text>
        </View>
      );
    } else if (this.props.orderError) {
      return (
        <View>
          <Text style={[ApplicationStyles.networkError]}>{this.props.orderError.error}</Text>
        </View>
      );
    } else {
      return (
        <View>
          {this.renderContent()}
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    oneOrder: state.order.oneOrder,
    offerings: state.offering.offerings,
    offeringError: state.offering.error,
    orderError: state.order.error,
    buyingPower: state.broker.buyingPower,
    fetchingBuyingPower: state.broker.fetching,
    brokerError: state.broker.error,
    fetchingOffering: state.offering.fetching,
    fetchingOrder: state.order.fetching,
    reconfirmationResponse: state.order.orderReconfirmationResponse
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrder: (data) => dispatch(OrderActions.fetchOrder(data)), // fetch an order -- this is if the user is navigated to this page via a notification
    submitOrderReconfirmation: (data) => dispatch(OrderActions.submitOrderReconfirmation(data)),
    fetchBuyingPower: () => dispatch(BrokerActions.fetchBuyingPower()),
    resetOrderError: () => dispatch(OrderActions.resetOrderError()),
    clearOrderReconfirmationResponse: () => dispatch(OrderActions.clearOrderReconfirmationResponse())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderReconfirmation);