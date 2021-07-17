import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Image, TextInput, Keyboard, KeyboardAvoidingView, Platform, AlertIOS, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { findByProp } from 'ramdasauce';
import AsyncStorage from '@react-native-community/async-storage';

import OrderActions from '../Redux/OrderRedux';
import BrokerActions from '../Redux/BrokerRedux';
import styles from './Styles/OrderModifyScreenStyles';
import WaitingView from '../Components/WaitingView';
import icoMoonConfig from '../Fonts/selection.json';
import FullButton from '../Components/FullButton';
import LoadingView from '../Components/LoadingView'
import firebase from '../Config/FirebaseConfig';
import { numberWithCommas } from '../Lib/Utilities';
import { Colors, ApplicationStyles } from '../Themes';

const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

class OrderModifyScreen extends React.Component {
  constructor (props) {
    super(props);
    const { orderId, orders } = props;
    const order = findByProp('id', orderId, orders) || props.order;
    const offering = props.offering || order.offering;

    this.state = {
      orderId: order.id,
      order: order,
      requestOrder: order,
      offering: offering,
      // buying_power: 0,
      investmentAmount: order.requestedAmount,
      availableBalance: this.props.buyingPower,
      isLoading:true,
      uiRender: false,
      showReviewModification: false,
      restrictedCheck: false,
      offeringId: '',
      setDefaultAmount: false,
    }
  }

  componentWillMount () {
    this.props.fetchBuyingPower()
    this.setState({
      isLoading:false,
      uiRender: true
    });
    firebase.analytics().setCurrentScreen('order_modify' + this.state.offering.tickerSymbol)
  }

  componentWillUnmount () {
    this.setState({
      isLoading:false,
      uiRender: false
    });
    this.props.resetOrderError();
  }

  componentWillReceiveProps = (newProps) => {
    const { order, buyingPower } = newProps
    // Comment by Burhan
    // const { orderId } = this.state
    // const order = findByProp('id', orderId, orders);
    if (order) {
      if (this.state.uiRender) {
        this.setState({
          order: order,
          offeringId: order.offering.id,
          investmentAmount: order.requestedAmount,
          isLoading:false,
          uiRender: false
        });
      }
    }

    if (buyingPower) {
      this.setState({
        availableBalance: buyingPower.buying_power.toFixed(2)
      });
    }
  }

  handleChangeInvestmentAmount = (text) => {
    this.setState({ investmentAmount: text });
  }

  handlePressCancelOrder = () => {
    const { orderId } = this.state
    NavigationActions.orderCancelConfirm({ orderId: orderId });
  }

  handlePressReivewModification = () => {
    Keyboard.dismiss();
    this.setState({ showReviewModification: true });
  }
  handlePressCheckbox = () => {
    //Logger.log({'here':'here'})
    this.setState({ restrictedCheck : !this.state.restrictedCheck },()=>{
    });
  }
  onPressRule = (rule) => {
    NavigationActions.finraView({ rule: rule });
  }

  handleSetDefaultAmount = () => {
    this.setState({ setDefaultAmount: !this.state.setDefaultAmount });
  }

  handlePressUpdateOrder = () => {
    this.setState({ disabled: true });
    if(parseInt(this.state.investmentAmount) <=  (parseInt(this.state.availableBalance) + parseInt(this.state.order.requestedAmount))) {
      if(parseInt(this.state.investmentAmount,10) >= this.props.user.brokerConnection.minBuyAmt){
      var data;
      if (this.isFormValid()) {

        firebase.analytics().setCurrentScreen('order_modify' + this.state.offering.tickerSymbol + '_submit');

        const { orderId, investmentAmount, order } = this.state

        data = {
          ext_id: this.state.offeringId,
          requested_amount: Number(investmentAmount),
          account_id: this.state.order.broker_connection.accountId,
          mpid: this.state.order.broker_connection.mpid,
          buying_power: Number(this.state.availableBalance),
          setDefaultAmount: this.state.setDefaultAmount,
        }
        let orderDataChange = this.state.requestOrder;
        orderDataChange.requestedAmount = Number(investmentAmount);

        let request = {
          request: data,
          order: orderDataChange
        }
        this.props.updateOrder(request);
      }
    } else {
      this.setState({ disabled: false });
      Platform.select({
        ios: () => { AlertIOS.alert("Minimum Investment Amount is $ "+ this.props.user.brokerConnection.minBuyAmt); },
        android: () => { ToastAndroid.show("Minimum Investment Amount is $ "+ this.props.user.brokerConnection.minBuyAmt, ToastAndroid.SHORT); }
      })();
    }
    } else {
      this.setState({ disabled: false });
      Platform.select({
        ios: () => { AlertIOS.alert('You have exceeded your buying power. Please modify the amount!!'); },
        android: () => { ToastAndroid.show('You have exceeded your buying power. Please modify the amount!!', ToastAndroid.SHORT); }
      })();
    }
  }

  isFormValid = () => {
    const { order, investmentAmount, offering, restrictedCheck } = this.state
    if (!order) {
      return false
    }
    // const { offering } = order
    if (investmentAmount < 1 || !this.state.restrictedCheck) {
      return false
    } else if (Math.floor(investmentAmount / offering.maxPrice) < 1) {
      return false
    } else if (order.requestedAmount === investmentAmount) {
      return false
    }

    return true
  }

  renderAll () {
    const { order, investmentAmount, processing, buyingPower, offering } = this.state
    const logo = { uri: 'https:' + offering.logoUrl }
    if (offering.offeringTypeName == 'IPO') {
      priceType = 'Anticipated';
      priceType2 = 'Price Range';
      //if there is final price show the final price, else show the min - max price
      price = ('$' + ((offering.finalPrice) ? offering.finalPrice.toFixed(2) : offering.minPrice.toFixed(2) + '-' + offering.maxPrice.toFixed(2)))
      var offeringTypeTextColor = Colors.booger
    } else if (offering.offeringTypeName == 'Secondary') {
      priceType = 'Last Closing';
      priceType2 = 'Price';
      //if final price exists show final price, else show max price ( which is last closing price for a secondary)
      price = ('$' + ((offering.finalPrice) ? offering.finalPrice.toFixed(2) : offering.maxPrice.toFixed(2)))
      var offeringTypeTextColor = Colors.booger
    } else if (offering.offeringTypeName == 'Follow-On Overnight') {
    // } else if (offering.offeringTypeName == 'Spot' || 'Block') {
      priceType = 'Anticipated'
      priceType2 = 'Price'
      // if final price exists show final price else show max price (which is anticipated price for spot and block offerings)
      price = ('$' + ((offering.finalPrice) ? offering.finalPrice.toFixed(2) : offering.maxPrice.toFixed(2)))
      var offeringTypeTextColor = Colors.booger
    }
    const shares = (numberWithCommas((offering.finalShares) ? offering.finalShares : offering.anticipatedShares))

    const investmentAmountFormatted = this.state.investmentAmount + ''

    const baseCalPrice = offering.finalPrice || offering.maxPrice

    const approximateShares = (Math.floor(investmentAmount / baseCalPrice)) ? Math.floor(investmentAmount / baseCalPrice) : 0
    // const approximateShares = (Math.floor(investmentAmount / offering.anticipatedPrice.maxPrice)) ? Math.floor(investmentAmount / offering.anticipatedPrice.maxPrice) : 0
    const submitEnabled = this.isFormValid() && !this.state.disabled;

    return (
      <LoadingView style={[ ApplicationStyles.mainContainer ]} isLoading={processing}>
        <ScrollView style={styles.scrollViewStyle} keyboardShouldPersistTaps='handled'>
          <KeyboardAvoidingView behavior='position'>
            <View style={ApplicationStyles.logoContainer}>
              <Image resizeMode='contain' style={ApplicationStyles.logo} source={logo} />
            </View>

            <View style={[ ApplicationStyles.offeringDetailsContainer ]}>
              <View style={styles.offeringDetailsContainerView}>
                <View style={styles.flex}>
                  <Text style={[ApplicationStyles.offeringDetailsLabel, {color: 'black'}]}>{priceType}</Text>
                  <Text style={[ApplicationStyles.offeringDetailsLabel, {color: 'black'}]}>{priceType2}</Text>
                </View>

                <View style={styles.flex}>
                  <Text style={[ApplicationStyles.offeringDetailsLabel, {color: 'black'}]}>IPO Shares</Text>
                  <Text style={[ApplicationStyles.offeringDetailsLabel, {color: 'black'}]}>Offered</Text>
                </View>
              </View>

              <View style={styles.priceViewStyle}>
                <View style={styles.flex}>
                  <Text style={[ApplicationStyles.offeringDetailsText, , {color: 'black'}]}>{ price }</Text>
                </View>

                <View style={styles.flex}>
                  <Text style={[ApplicationStyles.offeringDetailsText, {color: 'black'}]}>{ shares }</Text>
                </View>
              </View>
            </View>

            <View style={[ ApplicationStyles.orderDetailsContainer ]}>
              <View style={styles.InvestmestMainViewStyle}>
                <View style={styles.InvestmestSubViewStyle}>
                  <View style={styles.InvestmestInnerViewStyle}>
                    <Text style={[ApplicationStyles.orderDetailsLabel]}>Investment</Text>
                    <Text style={[ApplicationStyles.orderDetailsLabel]}>Amount</Text>
                  </View>

                  {/* <View style={[{ flex: 2, marginTop: 12 }]}>
                    <Text style={[ApplicationStyles.orderDetailsLabel]} />
                  </View> */}

                  <View style={styles.ApproximateViewStyles}>
                    <Text style={[ApplicationStyles.orderDetailsLabel]}>Approximate</Text>
                    <Text style={[ApplicationStyles.orderDetailsLabel]}>Shares</Text>
                  </View>
                </View>

                <View style={styles.InputTextMainViewStyle}>
                  <View style={styles.InputTextSubViewStyle}>
                    <View style={styles.InputTextInnerViewStyle} >
                      {/* <TextInput
                        ref='investmentAmountTextField'
                        style={[ApplicationStyles.textInput,{color:Colors.black}]}
                        value={investmentAmountFormatted}
                        placeholder='$0'
                        keyboardType='numeric'
                        returnKeyType='done'
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={this.handleChangeInvestmentAmount}
                        underlineColorAndroid='transparent' /> */}

                         {/* add by Burhan */}
                        <TextInput
                            ref='investmentAmountTextField'
                            style={styles.InputTextStyle}
                            // value={this.state.investmentAmount}
                            value={`${this.state.investmentAmount}`}
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
                    <Text style={styles.approximateSharesTextStyles}>{ approximateShares }</Text>
                  </View>
                </View>
              </View>

              <View style={styles.buyingPowerViewStyle}>
                <Text style={styles.buyingPowerTextStyle}>Buying Power: {"$ "+this.state.availableBalance }</Text>
              </View>

              {/* only show this block if the requested amount is different than default amount */}
              {this.state.investmentAmount != this.props.user.default_amount &&
                <View style={{ flexDirection: 'row', margin: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                  <ClickIcon style={{ fontSize: 18, color: offeringTypeTextColor }} name={(this.state.setDefaultAmount) ? 'icon-box-checked' : 'icon-box'} onPress={this.handleSetDefaultAmount} />
                  <Text style={{ fontSize: 18 }}>Make as new default amount</Text>
                </View>
              }

              <View>
                <View style={styles.ViewStyle2}>
                  <View style={styles.ViewStyle3}>
                    <ClickIcon style={[{fontSize:18, color:offeringTypeTextColor}]} name={(this.state.restrictedCheck) ? 'icon-box-checked' : 'icon-box'} onPress={this.handlePressCheckbox} />
                  </View>
                  <View style={{flex: 7}}>
                    <Text style={styles.TEXTStyle}>I attest that I am not a “restricted person” pursuant to <Text style={{color: Colors.tealishLite, textDecorationLine: 'underline'}} onPress={() => this.onPressRule(5130)}>Rule 5130</Text> and <Text style={{color: Colors.tealishLite, textDecorationLine: 'underline'}} onPress={() => this.onPressRule(5131)}>Rule 5131</Text>.</Text>
                  </View>
                </View>
              </View>

              {!this.state.showReviewModification ? 
                <FullButton
                  ref='update'
                  text='Review modification'
                  onPress={this.handlePressReivewModification}
                  disabled={!submitEnabled}
                /> :
                null }

              {this.state.showReviewModification ?
                <View>
                  <View style={styles.InformationViewStyle}>
                    <Text style={styles.InformationTextStyle}>There is no assurance that your conditional offer to buy will receive full allocation or any allocation at all. Your order is conditional on the final share price being no greater than 20% above the high end of the price range.</Text>
                  </View> 
                  <FullButton
                    ref='update'
                    text='Submit order'
                    onPress={this.handlePressUpdateOrder}
                    disabled={!submitEnabled}
                  />
                </View> :
                <View style={styles.InformationViewStyle}>
                  <Text style={[styles.InformationTextStyle, { color: 'white' }]}>There is no assurance that your conditional offer to buy will receive full allocation or any allocation at all. Your order is conditional on the final share price being no greater than 20% above the high end of the price range.</Text>
                </View> }
              {/* <View style={[{ flex: 1, marginVertical: 12, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[ { fontFamily: Fonts.type.light, fontSize: 18, color: Colors.greyishBrown, textAlign: 'center' } ]}>This will positively affect your Investor Score</Text>
              </View>
              <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                <Image source={Images.raiseScore} style={[{ height: 100 }]} resizeMode='contain' />
              </View> */}

              {/*
              <View style={[{ flex: 1, marginVertical: 12, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[ { fontFamily: Fonts.type.light, fontSize: 17, color: Colors.greyishBrown, textAlign: 'center' } ]}>Raising your investment amount can increase future allocations by raising your ClickIPO Investor Score.</Text>
              </View>
              */}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
{/* TEST AND REMOVE THIS -- THIS IS NO LONGER NEEDED IN THE NEW MODIFY FLOW - 12/14/18
  ALSO REMOVE THE handlePressCancelOrder FUNCTION
            <FullButton
              ref='cancel'
              text='Cancel Order'
              buttonStyle={styles.cancelButtonStyle}
              onPress={this.handlePressCancelOrder}
              />
*/}
      </LoadingView>
    )
  }

  isWaiting = () => {
    if (this.props.fetchingBuyingPower === false) {
      return false;
    } else {
      return true;
    }
  }

  render = () => {

    if (this.props.orderError) {
      return (
        <Text style={[ApplicationStyles.networkError]}>{this.props.orderError.displayMessage}</Text>
      )
    } else if (this.props.brokerError) {
      return (
        <Text style={[ApplicationStyles.networkError]}>{this.props.brokerError.displayMessage}</Text>
      )
    }
    if (this.props.buyingPower) {
      if (this.props.fetchingBuyingPower === false && this.props.buyingPower.status == null) {
        return (
          <Text style={[ApplicationStyles.networkError]}>Your internet connection has failed</Text>
        );
      }
    }
    return (
      <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
    );
  }
}
OrderModifyScreen.propTypes = {
  user: PropTypes.object,
  orderId: PropTypes.string,
  order: PropTypes.object,
  updateOrder: PropTypes.func,
  fetching: PropTypes.bool,
  error: PropTypes.object
}
const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    orders: state.order.orders,
    accounts: state.broker.accounts,
    fetching: state.offering.fetching,
    error: state.offering.error,
    buyingPower: state.broker.buyingPower,
    fetchingBuyingPower: state.broker.fetching,
    orderError: state.order.error,
    brokerError: state.broker.error,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateOrder: (data) => dispatch(OrderActions.updateOrder(data)),
    fetchBuyingPower: () => dispatch(BrokerActions.fetchBuyingPower()),
    resetOrderError: () => dispatch(OrderActions.resetOrderError())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderModifyScreen)