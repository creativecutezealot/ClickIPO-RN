import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  AlertIOS,
  ToastAndroid,
  // KeyboardAvoidingView,
  Keyboard,
  // LayoutAnimation
  KeyboardAvoidingView,
  Modal
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import styles from '../Components/Styles/OfferingListItemStyle'
import GenericModal from '../Containers/GenericModal';
// import OfferingActions from '../Redux/OfferingRedux'
import OrderActions from '../Redux/OrderRedux'
import TermActions from '../Redux/TermRedux'
import BrokerActions from '../Redux/BrokerRedux';
import WaitingView from '../Components/WaitingView';

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'

import { numberWithCommas } from '../Lib/Utilities'
import Logger from '../Lib/Logger'


// import Moment from 'moment'

import { findByProp } from 'ramdasauce'

import LinearGradient from 'react-native-linear-gradient'

// Styles
import {
  // Metrics,
  Colors,
  Fonts,
  Images,
  ApplicationStyles,
} from '../Themes'

import FullButton from '../Components/FullButton'
import FullButtonCustom from '../Components/FullButtonCustom'
import LoadingView from '../Components/LoadingView'
import Checkbox from '../Components/Checkbox'

import {
  Offering,
  Term
} from '../Models'

import firebase from '../Config/FirebaseConfig'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

// I18n
// import I18n from 'react-native-i18n'

// import Logger from '../Lib/Logger'

class OrderCreateScreen extends React.Component {
  state: {
    user: User,
    offeringId: String,
    offering: Offering,
    investmentAmount: Number,
    error: Object,
    processing: Boolean,
    reviewed: Boolean,
    terms: Object,
    learnMoreHeight : Number,
  }

  constructor (props) {
    super(props);

    const offering = findByProp('id', props.id, props.offerings)

    this.state = {
      user: props.user,
      offering: offering,
      reviewed: false,
      investmentAmount: this.props.user.default_amount,
      error: null,
      processing: false,
      restrictedCheck: false,
      terms : null,
      learnMoreHeight : 0,
      requestedMoreThanBuyingPower: false,
      availableBalance: this.props.buyingPower,
      showView:false,
      disabled: false,
      setDefaultAmount: false, // flag that checks if the user has selected to set this default amount
    }
  }

  componentWillMount () {
    //call the redux/saga fetchBuyingPower
    this.props.fetchBuyingPower();
  }

  componentDidMount () {
    this.props.fetchTerms()

    // this.refs.investmentAmountTextField.focus()
    firebase.analytics().setCurrentScreen('order_' + this.state.offering.tickerSymbol)

  }

  componentWillReceiveProps = (newProps) => {

    const { buyingPower } = newProps;

    if ( buyingPower ) {
      this.setState({
        availableBalance: buyingPower.buying_power.toFixed(2)
      })
    }

    const { offerings, terms } = newProps

    const offering = findByProp('id', this.state.offering.id, offerings)

    const term =  terms.find(term => {
                    return term.term == 'Conditional offer to Buy (COB) Price range.'
                  })

    if (term){
      this.setState({
        learnMoreHeight : 18
      })
    }

    this.setState({
        offering: offering,
        term: term
    })

    const { error } = newProps

    if (this.state.processing && error) {
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.setState({ processing: false })
          }
        }]
      )
    }
  }

  handleChangeInvestmentAmount = (text) => {
    this.setState({ investmentAmount: text })
  //  if(parseInt(text , 10) >= this.props.user.brokerConnection.minBuyAmt){
      if(this.state.reviewed === true){
        this.setState({
          reviewed: false,
          requestedMoreThanBuyingPower: false
        })
    //  }
   // }else{
    //   this.setState({
    //     reviewed:true,
    //     showView:false
    //   })
    }
  }

  handlePressSubmitOrder = () => {
    //setting this variable outside of the if statement because we want to prevent the user from double tapping the submit order button
    this.setState({ disabled: true });
    if(this.props.restrictedPerson === 0 && this.state.user.brokerConnection) {
      firebase.analytics().setCurrentScreen('order_' + this.state.offering.tickerSymbol + '_submit');
      const { offering, investmentAmount } = this.state;
      const data = {
        requested_amount: parseInt(investmentAmount),
        mpid: this.state.user.brokerConnection.mpid,
        buying_power: Number(this.state.availableBalance),
        attestation_to_rules_5130_and_5131: 1,
        account_id: this.state.user.brokerConnection.accountId,
        ext_id: offering.id,
        setDefaultAmount: this.state.setDefaultAmount
      }
      this.setState({ processing: true });
      let tempOrder = {
        id: offering.ext_id,
        requestedAmount: parseInt(investmentAmount),
        // allocatedShares: (this.state.investmentAmount > 1 || Math.floor(investmentAmount / baseCalPrice) > 1) ? Math.floor(investmentAmount / baseCalPrice) : 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        cancelledAt: null,
        systemCancel: false,
        offering: Offering,
        buyingPower: Number(this.state.availableBalance)
      }
      let request = {
        request: data,
        offering: this.state.offering,
        orderSubmit: tempOrder
      }
      this.props.submitOrder(request);
    } else {
      NavigationActions.detailViewModal({content:'waitlist', title: 'Wait List Explanation'})
    }
  }

  handlePressCheckbox = () => {
    this.setState({ restrictedCheck : !this.state.restrictedCheck });
  }

  handleSetDefaultAmount = () => {
    this.setState({ setDefaultAmount: !this.state.setDefaultAmount });
  }

  measureView = (event) => {
    this.setState({ imageWidth: event.nativeEvent.layout.width });
  }

  onPressRule = (rule) => {
    NavigationActions.finraView({ rule: rule });
  }

  isFormValid = () => {
    const { offering, investmentAmount } = this.state
    // Logger.log({state: this.state, props: this.props})
    if (investmentAmount < 1 || !this.state.restrictedCheck || !this.state.user.brokerConnection || this.props.restrictedPerson === 1) {
      return false
    } else if (Math.floor(investmentAmount / offering.maxPrice) < 1) {
      return false
    }

    return true
  }

  handlePressReview = () => {

    const { investmentAmount } = this.state;
    const { availableBalance } = this.state
    // if(Number(investmentAmount) >= Number(this.props.user.brokerConnection.minBuyAmt)){
    //   if (Number(investmentAmount) > Number(availableBalance) ) {
    if(parseInt(investmentAmount , 10) >= this.props.user.brokerConnection.minBuyAmt){
      if (parseInt(investmentAmount) > availableBalance ) {
        this.setState({requestedMoreThanBuyingPower: true})
      }

      firebase.analytics().setCurrentScreen('order_' + this.state.offering.tickerSymbol + '_review')

      this.setState({
        reviewed: true,
        showView:true
      })
      Keyboard.dismiss()
    }else{
      Platform.select({
        ios: () => { AlertIOS.alert("Minimum Investment Amount is $ "+ this.props.user.brokerConnection.minBuyAmt); },
        android: () => { ToastAndroid.show("Minimum Investment Amount is $ "+ this.props.user.brokerConnection.minBuyAmt, ToastAndroid.SHORT); }
      })();
    }
  }


  handlePressLearnMore = () => {
    NavigationActions.termDetails({ term: this.state.term, termId: this.state.term.id })
  }
  renderCopyBottom = (copyBottom1, copyBottom2) => {
    if(copyBottom2 === ''){
      return (
        <View>
          <Text style={styles.COPYButton}>{copyBottom1}</Text>
        </View>
      )
    } else {
      return(
          <View>
            <Text style={[{  fontFamily: Fonts.type.base, fontSize: 12, color: Colors.greyishBrown, textAlign: 'center', lineHeight: 18 }]}>{copyBottom1} {copyBottom2}</Text>
            <TouchableHighlight style = {[{height: this.state.learnMoreHeight}]} underlayColor={Colors.white} onPress={this.handlePressLearnMore.bind(this)}><Text style={[{ fontFamily: Fonts.type.base, fontSize: 12, color: Colors.booger, textAlign: 'center', lineHeight: 18 , textDecorationLine : 'underline', fontWeight: 'bold' }]}>Learn more</Text></TouchableHighlight>
          </View>
      )
    }
  }

  // setModalVisible(visible) {
  //   this.setState({modalVisible: visible});
  // }

  renderBottom = (copyBottom1, copyBottom2, orderType, offeringType) => {
    if(offeringType === 'IPO'){
      var buttonType = 'ipo'
      var offeringTypeTextColor = Colors.booger
    } else if ((offeringType === 'Secondary') || (offeringType === 'Follow-On Overnight')) {
    // } else if ((offeringType === 'Secondary') || (offeringType === 'Spot') || (offeringType === 'Block')){
      var buttonType = 'secondary'
      var offeringTypeTextColor = Colors.tealishLite
    }

    const submitEnabled = this.isFormValid() && !this.state.disabled
    const waitlistInfoLink = this.props.restrictedPerson === 0 ? null : <View><Text style={{color: Colors.lightBlue, fontFamily: Fonts.type.base, fontSize: 12, marginTop: 16, textDecorationLine: 'underline'}} onPress={() => NavigationActions.detailViewModal({content:'waitlist'})}>Why can't I order?</Text></View>
    const brokerageName = this.state.user.brokerConnection !== null ? this.state.user.brokerConnection.brokerDealerName : 'brokerage'

    if (this.state.requestedMoreThanBuyingPower) {
      return (
        Platform.select({
          ios: () => { AlertIOS.alert('You have exceeded your buying power. Please modify the amount!!'); },
          android : () => {
            ToastAndroid.show('You have exceeded your buying power. Please modify the amount!!', ToastAndroid.SHORT);
          }
        })()
      )
    }


    if(this.state.investmentAmount === ''){
      return null
    } else if (this.state.investmentAmount !== '' && this.state.reviewed === false) {
      return(
        <View style={styles.ViewStyle}>
              <FullButton
              ref='review'
              text='Review Order'
              buttonStyle={{ height: 40 }}
              buttonType={buttonType}
              onPress={this.handlePressReview}
              disabled={false} />
        </View>
      )
    }
    if(this.state.showView == true){
      return(
        <View>
          <View style={styles.ViewStyle1}>
            <Text style={[{ fontFamily: Fonts.type.base, fontSize: 14, color: Colors.greyishBrown, textAlign: 'center', lineHeight: 18, marginBottom:8 }]}>This order will be placed through your { brokerageName } account.</Text>
            {this.renderCopyBottom(copyBottom1,copyBottom2)}
          </View>
          <View style={styles.ViewStyle1}>
              <View style={styles.ViewStyle2}>
                <View style={styles.ViewStyle3}>

                  <ClickIcon style={[{fontSize:18, color:offeringTypeTextColor}]} name={(this.state.restrictedCheck) ? 'icon-box-checked' : 'icon-box'} onPress={this.handlePressCheckbox} />

                </View>
                <View style={{flex: 7}}>
                  <Text style={styles.TEXTStyle}>I attest that I am not a “restricted person” pursuant to <Text style={{color: Colors.tealishLite, textDecorationLine: 'underline'}} onPress={() => this.onPressRule(5130)}>Rule 5130</Text> and <Text style={{color: Colors.tealishLite, textDecorationLine: 'underline'}} onPress={() => this.onPressRule(5131)}>Rule 5131</Text>.</Text>
                </View>
              </View>
              <View style={styles.ViewStyle4}>
              <FullButton
                ref='submit'
                text={orderType === 'offer to buy' ? 'Submit Conditional Offer to Buy' : 'Submit Order'}
                buttonStyle={{ height: 40 }}
                onPress={this.handlePressSubmitOrder}
                buttonType={buttonType}
                disabled={!submitEnabled} />
                </View>
                {waitlistInfoLink}
          </View>
          {/**
          <View style={[{ flex: 1, marginVertical: 12, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[ { fontFamily: Fonts.type.base, fontSize: 12, color: Colors.greyishBrown, textAlign: 'center' } ]}>This will positively affect your Investor Score</Text>
          </View>
          <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={Images.raiseScore} style={[{ height: 100 }]} resizeMode='contain' />
          </View>

          <View style={[{ flex: 1, marginVertical: 12, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[ { fontFamily: Fonts.type.base, fontSize: 12, color: Colors.greyishBrown, textAlign: 'center' } ]}>We use a scoring system to determine future allocations. Holding shares for 30 days or longer is one way to increase your ClickIPO Investor Score.</Text>
          </View>
          **/}
        </View>
      )
    }
  }

  renderAll () {
    const { availableBalance } = this.state

    const buyingPower = '$ ' + availableBalance;

    const { offering, investmentAmount, processing } = this.state

    // const id = offering.id
    const name = offering.name
    const logo = { uri: 'https:' + offering.logoUrl }

    const investmentAmountFormatted = investmentAmount + ''

    const baseCalPrice = offering.finalPrice || offering.maxPrice

    const approximateShares = (this.state.investmentAmount > 1 || Math.floor(investmentAmount / baseCalPrice) > 1) ? Math.floor(investmentAmount / baseCalPrice) : 0


    const offeringType = offering.offeringTypeName
    if (offeringType === 'IPO') {
      var orderType = 'offer to buy';
      var copyBottom1 = 'There is no assurance that your conditional offer to buy will receive full allocation or any allocation at all. Your order is conditional on the final share price being no greater than 20% above the high end of the price range.'
      var copyBottom2 = ''
    } else if ((offeringType === 'Secondary') || (offeringType === 'Follow-On Overnight')) {
    // } else if ((offeringType === 'Secondary') || (offeringType === 'Spot') || (offeringType === 'Block')){
      var orderType = 'offer to buy';
      var copyBottom1 = 'There is no assurance that conditional offers to buy will receive the full requested allocation or any allocation at all. Your conditional offer to buy will be for the dollar amount calculated regardless of the final share price.'
      var copyBottom2 = ''
    } 
    // else if (offeringType === 'Spot Offering') {
    //   var orderType = 'order';
    //   var copyBottom1 = "There is no assurance that purchase orders will receive the full requested allocation or any allocation at all. Your purchase order will be for the dollar amount calculated regardless of the final share price."
    //   var copyBottom2 = ''
    // }
    if(offering.finalShares === 0 || offering.anticipatedShares === 0) {
      var shares = 'TBD'
    } else {
      var shares = (numberWithCommas((offering.finalShares) ? offering.finalShares : offering.anticipatedShares))
    }

    var priceType = 'Price range'
    if(offeringType === 'IPO'){
      var shareCopy = 'Price Range: '
      var offeringTypeTextColor = Colors.booger
      var shareCopy2 = ''
      var price = ('$' + ((offering.finalPrice) ? offering.finalPrice.toFixed(2) : offering.minPrice.toFixed(2) + '-' + offering.maxPrice.toFixed(2)))
    } else if ((offeringType === 'Secondary')){
      priceType = 'Price'
      var offeringTypeTextColor = Colors.tealishLite
      var shareCopy = 'Last Closing Price: '
      var shareCopy2 = 'Last Trade:'
      var price = ('$' + (offering.maxPrice.toFixed(2)))
    } else if ((offeringType === 'Follow-On Overnight')) {
    // } else if ((offeringType === 'Spot') || (offeringType === 'Block')) {
      priceType = 'Price'
      var offeringTypeTextColor = Colors.tealishLite
      var shareCopy = 'Last Closing Price: '
      var shareCopy2 = 'Last Trade:'
      var price = ('$' + (offering.minPrice.toFixed(2)))
    }

    return (
      <LoadingView style={[ { flex: 1 } ]} isLoading={processing}>

        <ScrollView keyboardShouldPersistTaps="handled" style={[ApplicationStyles.mainContainer]}>
          <View behavior='position'>
          <View style={{ opacity: 1 }} underlayColor={Colors.pinkishGrey}>
            <View style={[styles.row]}>

              <View style={styles.row}>

                <View style={styles.ViewStyle5}>

                  <View style={styles.row}>
                      <Text style={[styles.label, {color:Colors.blueSteel}]}>{shareCopy}{ price }</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={[styles.label, {color:Colors.blueSteel}]}>Shares offered: { shares }</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={[styles.label, {color:Colors.blueSteel}, {fontWeight: 'bold'}, {paddingTop: 20} ]}>Buying Power: { buyingPower }</Text>
                  </View>

                </View>

                <View style={styles.ViewStyle6} />
              </View>
            </View>
          </View>

            <View style={[ ApplicationStyles.orderDetailsContainer ]}>

              <View style={styles.ViewStyle7}>
                <View style={styles.ViewStyle8}>

                </View>

                <View style={styles.ViewStyle7}>
                  <View style={{flex: 1}}>
                    <View style={styles.ViewStyle9}>
                      <View style={[{ flex: 1}]}>
                        <Text style={{ color: Colors.twilightBlue}}>Investment Amount</Text>
                        {/* <Text style={{ color: Colors.twilightBlue, fontSize:10}}>Minimum Investment Amount is $  {this.props.user.brokerConnection.minBuyAmt}</Text> */}
                      </View>
                      <View style={styles.ViewStyle10}>
                        <Text style={[ApplicationStyles.orderDetailsText, {textAlign: 'right', flex: 1, paddingRight: 10, fontSize: 24, color: offeringTypeTextColor, fontWeight: 'normal'}]}>$</Text>
                        <View style={[ApplicationStyles.textInputContainer, { height: 40, flex: 5}]} >
                          <TextInput
                            ref='investmentAmountTextField'
                            style={[ApplicationStyles.textInput,{textAlign: 'right', fontSize: 24, color: offeringTypeTextColor,  fontWeight: 'normal'}]}
                            value={investmentAmountFormatted}
                            placeholder=''
                            keyboardType='numeric'
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoFocus={true}
                            onChangeText={this.handleChangeInvestmentAmount}
                            underlineColorAndroid='transparent' />
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={styles.ViewStyle11}>
                        <View style={styles.ViewStyle13}>
                          <Text style={{color: Colors.twilightBlue}}>Approximate Shares</Text>
                        </View>
                        <View style={styles.ViewStyle12}>
                          <Text style={[ApplicationStyles.orderDetailsText, {textAlign: 'right', fontSize: 24}]}>{ approximateShares }</Text>
                        </View>
                      </View>
                      {/* only show this block if the requested amount is different than default amount */}
                      {this.state.investmentAmount != this.props.user.default_amount &&
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ color: Colors.twilightBlue }}>Make as new default amount</Text>
                          <ClickIcon style={{ fontSize: 24, color: offeringTypeTextColor }} name={(this.state.setDefaultAmount) ? 'icon-box-checked' : 'icon-box'} onPress={this.handleSetDefaultAmount} />
                        </View>
                      }
                    </View>
                  </View>
                </View>
              </View>

              {this.renderBottom(copyBottom1,copyBottom2, orderType, offeringType)}

            </View>
          </View>
        </ScrollView>
      </LoadingView>
    )
  }

  isWaiting = () => {
    if (this.props.fetchingBuyingPower === false ) {
      return false;
    } else {
      return true;
    }
  }

  render = () => {
    if(this.props.order) {
      if(this.props.order.error) {
        return (
          <Text style={[ApplicationStyles.networkError]}> {this.props.order.error.displayMessage}</Text>
        )
      }
    }

    if (this.props.brokerError) {
      return (
        <Text style={[ApplicationStyles.networkError]}> {this.props.brokerError.displayMessage}</Text>
      );
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

OrderCreateScreen.propTypes = {
  user: PropTypes.object,
  offeringId: PropTypes.string,
  offering: PropTypes.object,
  submitOrder: PropTypes.func,
  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    offerings: state.offering.offerings,
    restrictedPerson: state.user.restrictedPerson,
    fetching: state.offering.fetching,
    error: state.offering.error,
    terms: state.term.terms,
    buyingPower: state.broker.buyingPower,
    fetchingBuyingPower: state.broker.fetching,
    order: state.order,
    brokerError: state.broker.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitOrder: (data) => dispatch(OrderActions.submitOrder(data)),
    fetchTerms: (data) => dispatch(TermActions.fetchTerms(data)),
    fetchBuyingPower: () => dispatch(BrokerActions.fetchBuyingPower())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreateScreen)
