import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
  TouchableHighlight,
  // TouchableOpacity,
  Image,
  TextInput,
  // KeyboardAvoidingView,
  Keyboard,
  // LayoutAnimation
  KeyboardAvoidingView
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import styles from '../Components/Styles/OfferingListItemStyle'
// import OfferingActions from '../Redux/OfferingRedux'
import OrderActions from '../Redux/OrderRedux'

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
import LoadingView from '../Components/LoadingView'
import Checkbox from '../Components/Checkbox'
import Styles from './Styles/FakeOrderCreateScreenStyle'

import {
  Offering
} from '../Models'

// I18n
// import I18n from 'react-native-i18n'

// import Logger from '../Lib/Logger'

class FakeOrderCreateScreen extends React.Component {
  state: {
    user: User,
    offeringId: String,
    offering: Offering,
    investmentAmount: Number,
    error: Object,
    processing: Boolean,
    reviewed: Boolean
  }

  constructor (props) {
    // Logger.log({ name: 'OrderCreateScreen.constructor()', props: props })
    super(props)

    const offering = findByProp('id', props.id, props.offerings)
    // Logger.log({ name: 'OrderCreateScreen.constructor()', offering: offering })

    this.state = {
      user: props.user,
      offering: offering,
      reviewed: false,
      investmentAmount: '',
      error: null,
      processing: false,
      restrictedCheck: false
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'OrderCreateScreen.handlePressSave()', offering: offering })
  }

  componentWillUnmount () {

  }

  componentDidMount () {
    this.refs.investmentAmountTextField.focus()
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'OrderCreateScreen.componentWillReceiveProps()', newProps: newProps })

    const { offerings } = newProps
    const { offeringId } = this.state

    const offering = findByProp('id', offeringId, offerings)
    // Logger.log({ name: 'OrderCreateScreen.componentWillReceiveProps()', offering: offering })

    this.setState({
      offering: offering
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
    if(this.state.reviewed === true){
      this.setState({
        reviewed: false
      })
    }
  }

  handlePressSubmitOrder = () => {
    // Logger.log({ name: 'OrderCreateScreen.handlePressSubmitOrder()' })
    return null
  }

  handlePressCheckbox = () => {
    this.setState({
      restrictedCheck : !this.state.restrictedCheck
    })
  }

  measureView = (event) => {
    this.setState({
      imageWidth: event.nativeEvent.layout.width
    })
  }

  onPressRule = (rule) => {
    NavigationActions.finraView({ rule: rule })
  }

  isFormValid = () => {
    const { offering, investmentAmount } = this.state

    if (investmentAmount < 1 || !this.state.restrictedCheck || !this.state.user.brokerConnection)  {
      return false
    } else if (Math.floor(investmentAmount / offering.maxPrice) < 1  || !this.state.restrictedCheck || !this.state.user.brokerConnection) {
      return false
    }

    return true
  }

  handlePressReview = () => {
    this.setState({
      reviewed: true
    })
    Keyboard.dismiss()
  }

  renderBottom = (copyBottom, orderType) => {
    const submitEnabled = this.isFormValid()
    const waitlistInfoLink = this.props.status === 1 ? null : <View><Text style={Styles.Component} onPress={() => NavigationActions.detailViewModal({content: 'waitlist'})}>Why can't I order?</Text></View>
    if(this.state.investmentAmount === ''){
      return null
    } else if (this.state.investmentAmount !== '' && this.state.reviewed === false) {
      return(
        <View style={Styles.ViewStyle}>
              <FullButton
              ref='review'
              text='Review Order'
              buttonStyle={{ height: 40 }}
              onPress={this.handlePressReview}
              disabled={false} />
        </View>
      )
    } else {
      return(
        <View>
          <View style={Styles.ViewStyle1}>
            <Text style={Styles.ThisOrderText}>This order will be placed through your broker account.</Text>
            <Text style={Styles.CopyButtonText}>{copyBottom}</Text>
          </View>
          <View style={Styles.ViewStyle2}>
              <View style={Styles.ViewStyle3}>
                <View style={Styles.ViewStyle4}>
                  <Checkbox ref='agreeCheckbox' label='' checked={this.state.restrictedCheck} onChange={this.handlePressCheckbox} />
                </View>
                <View style={Styles.ViewStyle5}>
                  <Text style={Styles.IAttestText}>I attest that I am not a “restricted person” pursuant to <Text style={{color: Colors.tealish, textDecorationLine: 'underline'}} onPress={() => this.onPressRule(5130)}>Rule 5130</Text> and <Text style={{color: Colors.tealish, textDecorationLine: 'underline'}} onPress={() => this.onPressRule(5131)}>Rule 5131</Text>.</Text>
                </View>
              </View>
              <View style={Styles.ViewStyle6}>
              <FullButton
                ref='submit'
                text={orderType === 'offer to buy' ? 'Submit Conditional Offer to Buy' : 'Submit Conditional Purchase Order'}
                buttonStyle={{ height: 40 }}
                onPress={this.handlePressSubmitOrder}
                disabled={!submitEnabled} />
                </View>
                {waitlistInfoLink}
          </View>
          <View style={Styles.ViewStyle7}>
            <Text style={Styles.ViewStyle8}>This will positively affect your Investor Score</Text>
          </View>
          <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={Images.raiseScore} style={[{ height: 100 }]} resizeMode='contain' />
          </View>

          <View style={Styles.ViewStyle7}>
            <Text style={Styles.ViewStyle8}>We use a scoring system to determine future allocations. Holding shares for 30 days or longer is one way to increase your ClickIPO Investor Score.</Text>
          </View>
        </View>
      )
    }
  }

  render () {
    const { offering, investmentAmount, processing } = this.state

    // const id = offering.id
    const name = offering.name
    const logo = { uri: 'https:' + offering.logoUrl }

    const investmentAmountFormatted = investmentAmount + ''
    const approximateShares = (this.state.investmentAmount > 1 || Math.floor(investmentAmount / offering.maxPrice) > 1) ? Math.floor(investmentAmount / offering.maxPrice) : 0


    const offeringType = offering.offeringTypeName
    if (offeringType === 'IPO') {
      var orderType = 'offer to buy';
      var copyBottom = 'There is no assurance that conditional offers to buy will receive the full requested allocation or any allocation at all. Your offer to buy is conditional on the final share price being between $' + offering.minPrice.toFixed(2) + ' - $' + offering.maxPrice.toFixed(2) + ' (learn more). Your offer to buy will be for the dollar amount calculated regardless of the final share price.'
    } else if(offeringType === 'Secondary'){
      var copyBottom = 'There is no assurance that conditional offers to buy will receive the full requested allocation or any allocation at all. Your offer to buy will be for the dollar amount calculated regardless of the final share price.'
    } else if (offeringType === 'Spot Offering') {
      var orderType = 'order';
      var copyBottom = "There is no assurance that purchase orders will receive the full requested allocation or any allocation at all. Your purchase order will be for the dollar amount calculated regardless of the final share price."
    }

    if(offering.finalShares === 0 || offering.anticipatedShares === 0) {
      var shares = 'TBD'
    } else {
      var shares = (numberWithCommas((offering.finalShares) ? offering.finalShares : offering.anticipatedShares))
    }

    var priceType = 'Price range'
    if(offeringType === 'IPO'){
      var shareCopy = 'Price Range'
      var offeringTypeTextColor = Colors.booger
      var shareCopy2 = ''
      var price = ('$' + ((offering.finalPrice) ? offering.finalPrice.toFixed(2) : offering.minPrice.toFixed(2) + '-' + offering.maxPrice.toFixed(2)))
    } else if(offeringType === 'Secondary' || 'Spot Offering'){
      priceType = 'Price'
      var offeringTypeTextColor = Colors.tealish
      var shareCopy = 'Price: TBD'
      var shareCopy2 = 'Last Trade:'
      var price = ('($' + (offering.maxPrice.toFixed(2) + ')'))
    }

    return (
      <LoadingView style={Styles.LoadingViewStyle } isLoading={processing}>

        <ScrollView keyboardShouldPersistTaps="handled" style={[ApplicationStyles.mainContainer]}>
          <View behavior='position'>
          <View style={{ opacity: 1 }} underlayColor={Colors.pinkishGrey}>
            <View style={[styles.rowContainer]}>

              <View style={styles.row}>
                <View style={styles.logoContainer}>
                  {offeringIllustration()}
                </View>

                <View style={[styles.descriptionContainer, { backgroundColor: Colors.white }]}>
                  <View style={[styles.row, { marginBottom: 3 }]}>
                    <Text style={styles.companyLabel} onPress={this.onLongPress}>{ offering.name }</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={[styles.label, { ...Fonts.style.bold, color: offeringTypeTextColor }]}>{ offering.offeringTypeName }</Text>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.label}>Price Range: { price }</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Shares offered: { shares }</Text>
                  </View>
                </View>

                <View style={Styles.ViewStyle9} />
              </View>
            </View>
          </View>

            <View style={[ ApplicationStyles.orderDetailsContainer ]}>

              <View style={ Styles.ViewStyle10}>
                <View style={ Styles.ViewStyle11}>

                </View>

                <View style={ Styles.ViewStyle10}>
                  <View style={Styles.ViewStyle13}>
                    <View style={Styles.ViewStyle12}>
                      <View style={Styles.ViewStyle13}>
                        <Text style={Styles.InvesterAmount}>Investment Amount</Text>
                      </View>
                      <View style={Styles.ViewStyle14}>
                        <Text style={[ApplicationStyles.orderDetailsText, {lineHeight: 40, textAlign: 'right', flex: 1, paddingRight: 10, fontSize: 24, color: Colors.booger,  fontWeight: 'normal'}]}>$</Text>
                        <View style={[ApplicationStyles.textInputContainer, { height: 40, flex: 5}]} >
                          <TextInput
                            ref='investmentAmountTextField'
                            style={[ApplicationStyles.textInput,{textAlign: 'right', fontSize: 24, color: Colors.booger, fontWeight: 'normal'}]}
                            value={investmentAmountFormatted}
                            placeholder=''
                            keyboardType='numeric'
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            onChangeText={this.handleChangeInvestmentAmount}
                            underlineColorAndroid='transparent' />
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={Styles.ViewStyle15}>
                        <View style={Styles.ViewStyle16}>
                          <Text style={Styles.ApproximateShear}>Approximate Shares</Text>
                        </View>
                        <View style={Styles.ViewStyle17}>
                          <Text style={[ApplicationStyles.orderDetailsText, {lineHeight: 40, textAlign: 'right', fontSize: 24}]}>{ approximateShares }</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {this.renderBottom(copyBottom, orderType)}

            </View>
          </View>
        </ScrollView>
      </LoadingView>
    )
  }

}

FakeOrderCreateScreen.propTypes = {
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
    status: state.user.waitListStatus,
    fetching: state.offering.fetching,
    error: state.offering.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitOrder: (data) => dispatch(OrderActions.submitOrder(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FakeOrderCreateScreen)
