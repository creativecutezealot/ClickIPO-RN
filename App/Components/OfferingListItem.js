
import React from 'react'
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  // ScrollView,
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  // Keyboard,
  // LayoutAnimation,
  Clipboard,
  RefreshControl,
  Platform
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux';
import OfferingActions from '../Redux/OfferingRedux';
import UserActions from '../Redux/UserRedux';
import OrderActions from '../Redux/OrderRedux';
import { dateFormat } from '../Lib/Utilities';

import {
  User,
  Offering,
  Order
} from '../Models'

// import Moment from 'moment'

import Swipeable from 'react-native-swipeable'

import Icon from 'react-native-vector-icons/FontAwesome';

// Styles
import {
  Colors,
  Fonts,
  Images,
  Metrics
} from '../Themes'

import styles from './Styles/OfferingListItemStyle'
import OfferingIllustration from './OfferingIllustration'

import Logger from '../Lib/Logger'

class OfferingListItem extends React.Component {

  constructor(props) {
    super(props)

    const { order = [] } = props

    this.state = {
      order: order,
      isProcessing: false,
      activeOrder: {}
    }

    this.onPress = this.onPress.bind(this)
  }

  componentWillMount() {
    this.setState({ order: this.props.order })
    // Logger.log({ name: 'OfferingListItem.componentWillMount()' })
  }

  componentWillUnmount() {
    // Logger.log({ name: 'OfferingListItem.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.offering) {
      this.setState({
        hasOrder: newProps.offering.hasOrder
      })
    }
    if (newProps.order) {
      const { order } = newProps
      this.setState({
        order: order,
        isProcessing: false,
      })
    }

  }

  toggleSave = () => {
    // Logger.log({ name: 'OfferingListItem.toggleSave()'})

    this.props.toggleSaved()
    // this.swipeable.recenter()
  }

  placeOrder = () => {
    // Logger.log({ name: 'OfferingListItem.placeOrder()'})

    // this.swipeable.recenter()
    NavigationActions.orderCreate({ id: this.props.offering.id })
  }

  onSwipeStart = () => {
    // Logger.log({ name: 'OfferingListItem.onSwipeStart()'})
  }

  onPress = () => {
    // Add by burhan
    if (this.state.hasOrder === true) {
      this.setState({ isProcessing: true })
      this.props.fetchActiveOrder(this.props.offering.id)
      // this.setState({ activeOrder: this.props.fetchActiveOrder(this.props.offering.id) })
      // NavigationActions.orderModify({ offering: this.props.offering, order: this.state.activeOrder })
      NavigationActions.offeringDetails({ id: this.props.offering.id, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })
    } else {
      this.setState({ isProcessing: true })
      this.props.fetchActiveOrder(this.props.offering.id)
      NavigationActions.offeringDetails({ id: this.props.offering.id, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })
    }

    // Logger.log({ name: 'OfferingListItem.onPress()'})

    //TODO: This is the place to check for active_orders,
    //if order is active then take to modify screen
    //if no active order with that product id theb take them to offeringDetails page.


    //I have to get the offerings id on click
    //then I make the api call to /offerings/{id}/active_orders
    //if order_id is null then take them to offeringDetails screen,
    //else take them to modifyScreen page
    // NavigationActions.orderModify({ orderId: orderId })
   
    // Comment by Burhan
    // this.setState({ isProcessing: true })


     // Comment by Burhan
    // this.props.fetchActiveOrder(this.props.offering.id)


    // const active_order = this.props.fetchActiveOrderSuccess()
    // if user has active order take them to modify order
    // if (!orderId) {

    //   console.log('going to orderModify')
    //   NavigationActions.orderModify({ orderId: orderId })
    // } else {
    // // if user has no active orders then take them to offeringDetails screen to allow to order
    //   NavigationActions.offeringDetails({id: this.props.offering.id, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })  
    // }
    // setTimeout(() => {
    //   console.log(this.state.order[0].order_id)
    //   if (this.state.order.length === 0) {
    //     NavigationActions.offeringDetails({id: this.props.offering.id, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })
    //   }
    //   const orderId = this.state.order[0].order_id
    //   NavigationActions.orderDetails({ id: orderId })
    // }, 2000)

    // Comment by Burhan
    // NavigationActions.offeringDetails({ id: this.props.offering.id, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })

    // if (this.state.order.length === 0) {
    //   console.log('no id yet')
    // }
    // this.swipeable.recenter()
    // NavigationActions.offeringDetails({id: this.props.offering.id, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })
  }

  // Add by burhan 
  onPressModify = () => {
    this.setState({ isProcessing: true })
    this.props.fetchActiveOrder(this.props.offering.id)
    this.setState({ activeOrder: this.props.fetchActiveOrder(this.props.offering.id) }, () => {
      NavigationActions.orderModify({ orderId: this.state.activeOrder.data })
    })
  }

  onLongPress = () => {
    // Logger.log({ name: 'OfferingListItem.onLongPress()'})

    // this.swipeable.recenter()
  }

  //this button shows up when an order is active
  //user will press button and be redirected to offering details screen
  showPlaceOrderButton(offeringTypeTextColor) {
    return (
      <TouchableOpacity style={{ width: 64, height: 24, borderRadius: 2, justifyContent: 'center', alignItems: 'center' }} onPress={this.onPress}>
        <LinearGradient colors={['#4f4f4f', '#4f4f4f']} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }} style={{ borderColor: offeringTypeTextColor, borderWidth: 1, flex: 1, position: 'absolute', width: 64, height: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.white, fontSize: 11, fontWeight: 'bold', fontFamily: Fonts.type.chivo }}>Order Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  showmModifyOrderButton(offeringTypeTextColor) {
    return (
      <TouchableOpacity style={{ width: 64, height: 24, borderRadius: 2, justifyContent: 'center', alignItems: 'center' }} onPress={this.onPressModify}>
        <LinearGradient colors={['#4f4f4f', '#4f4f4f']} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }} style={{ borderColor: offeringTypeTextColor, borderWidth: 1, flex: 1, position: 'absolute', width: 64, height: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.white, fontSize: 11, fontWeight: 'bold', fontFamily: Fonts.type.chivo }}>Modify</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  followButton = (offeringTypeTextColor, isSaved) => {
    if (offeringTypeTextColor === 'rgba(76,199,63,1)') {
      var secondaryColor = 'rgba(183,255,67,1)'
    } else {
      var secondaryColor = 'rgba(68,210,182,1)'
    }
    if (isSaved) {
      return (
        <TouchableOpacity style={{ width: 80, height: 24, borderRadius: 1, justifyContent: 'center', alignItems: 'center' }} onPress={this.toggleSave}>
          <LinearGradient colors={[offeringTypeTextColor, offeringTypeTextColor]} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }} style={{ flex: 1, position: 'absolute', width: 80, height: 24, borderRadius: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontFamily: Fonts.type.chivo, textAlign: 'center' }}><Icon name="check" color="#ffffff" /> Interested</Text>
          </LinearGradient>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={{ borderColor: offeringTypeTextColor, borderWidth: 1, width: 80, height: 24, borderRadius: 2, justifyContent: 'center', alignItems: 'center' }} onPress={this.toggleSave}>
          <Text style={{ color: offeringTypeTextColor, fontSize: 12, fontFamily: Fonts.type.chivo }}>Interested?</Text>
        </TouchableOpacity>
      )
    }
  }

  // the block of JSX that renders the price based on the offering type ie IPOs will see price range, secondary will see last closing price
  priceBlock = (offering) => {
    const offeringTitleWeight_ = offering.read ? 'normal' : '400';

    // for ipo show price range with the price (TBD or the minPrice and maxPrice)
    // for secondary and follow-on overnight show last closing price (maxPrice)
    switch (offering.offeringTypeName) {
      case 'IPO':
        var priceLabel = 'Price Range: ';
        // var price = (offering.anticipatedPrice.minPrice === 0 && offering.anticipatedPrice.maxPrice === 0) ? 'TBD' : '$' + offering.anticipatedPrice.minPrice.toFixed(2) + ' - $' + offering.anticipatedPrice.maxPrice.toFixed(2);
        var price = (!offering.minPrice && !offering.maxPrice) ? 'TBD' : '$' + offering.minPrice.toFixed(2) + ' - $' + offering.maxPrice.toFixed(2);
        break
      case 'Secondary':
      case 'Follow-On Overnight':
        var priceLabel = 'Last Closing Price:';
        var price = `$${offering.maxPrice.toFixed(2)}`;
        // var price = `$${offering.anticipatedPrice.maxPrice.toFixed(2)}`;
        break
      default:
    }

    return (
      <View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontFamily: Fonts.type.chivo, color: Colors.blueSteel, fontSize: 14, lineHeight: 20, fontWeight: offeringTitleWeight_ }}>{priceLabel}</Text>
          <Text style={{ fontFamily: Fonts.type.chivo, color: Colors.twilightBlue, fontSize: 14, lineHeight: 20, fontWeight: offeringTitleWeight_, alignItems: 'flex-end' }}>{price}</Text>
        </View>
        {/* for follow-on overnight show the extra row of data (priceRange) */}
        {(offering.offeringTypeName === 'Follow-On Overnight' ?
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={{ color: Colors.blueSteel, fontSize: 14, lineHeight: 20, fontWeight: 'bold' }}>Anticipated Price Range:</Text>
            <Text style={{ color: Colors.twilightBlue, fontSize: 14, lineHeight: 20, fontWeight: 'bold', alignItems: 'flex-end' }}>{offering.priceRange}</Text>
          </View>
          : null)}
      </View>
    );
  }

  render = () => {
    // Logger.log({ name: 'OfferingListItem.render()', props: this.props })

    const { offering } = this.props
    // if (offering.finalPrice) {
    //   var price = offering.finalPrice.toFixed(2)
    //   var priceLabel = 'Final price $'
    // } else if (offering.anticipatedPrice.minPrice === 0 && offering.anticipatedPrice.maxPrice === 0) {
    //   var price = 'TBD'
    //   var priceLabel = 'Price Range:'
    // } else if (offering.anticipatedPrice.minPrice !== 0 && offering.anticipatedPrice.maxPrice !== 0) {
    //   var price = '$' + offering.anticipatedPrice.minPrice.toFixed(2) + '-$' + offering.anticipatedPrice.maxPrice.toFixed(2)
    //   var priceLabel = 'Price Range:'
    // } else {
    //   var price = '$' + offering.anticipatedPrice.maxPrice.toFixed(2)
    //   var priceLabel = 'Last Closing Price:'
    // }

    // Add by Burhan
    // const date = ((offering.tradeDate) ? (Moment.utc(offering.tradeDate).format('MMM D')) : 'TBD');
    const date = ((offering.tradeDate) ? (dateFormat(offering.tradeDate)) : 'TBD');
    
    var offeringTypeTextColor = Colors.smoke
    var offeringTypeColor = Colors.smoke
    switch (offering.offeringTypeName) {
      case 'IPO':
        offeringTypeTextColor = Colors.booger
        offeringTypeColor = Colors.boogerTint

        break
      case 'Secondary':
        offeringTypeTextColor = Colors.tealishLite
        offeringTypeColor = Colors.tealishTint

        break
      // we have decided to show Follow-On Overnight as the same color as Secondary 
      case 'Follow-On Overnight':
        offeringTypeTextColor = Colors.tealishLite
        offeringTypeColor = Colors.tealishTint

        break
      // case 'Spot':
      //   offeringTypeTextColor = Colors.tealishLite
      //   offeringTypeColor = Colors.tealishTint

      //   break
      // case 'Block':
      //   offeringTypeTextColor = Colors.tealishLite
      //   offeringTypeColor = Colors.tealishTint

      //   break
      default:
      // NA
    }

    const rightBorderColor = (this.props.placeOrderEnabled) ? Colors.booger : offeringTypeColor
    const rightButtons = [this.renderPlaceOrderButton(offering)]
    const offeringTitleWeight = offering.read ? 'normal' : 'bold'

    const offeringTitleWeight_ = offering.read ? 'normal' : '400'

    const industry = offering.industries ? offering.industries : ''

    // <Swipeable style={[{ backgroundColor: Colors.white }]} onRef={(ref) => this.swipeable = ref} leftButtons={rightButtons} leftButtonWidth={100} onSwipeStart={this.onSwipeStart}>

    return (
      <View style={[{ backgroundColor: Colors.white }]}>
        <TouchableHighlight underlayColor={Colors.pinkishGrey} onPress={this.onPress}>
          <View style={[styles.rowContainer]}>
            <View style={{ flexDirection: 'column', alignItems: 'center', paddingRight: 16 }}>
              <OfferingIllustration offeringTitleWeight={offeringTitleWeight} offeringTypeTextColor={offeringTypeTextColor} logoUrl={offering.logoUrl} name={offering.name} />
              <Text style={{ fontFamily: Fonts.type.chivo, fontSize: 14, lineHeight: 16, marginTop: 8, fontWeight: 'bold', color: Colors.drawerBlue, fontWeight: offeringTitleWeight_ }}>{offering.tickerSymbol}</Text>
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingBottom: 16, paddingRight: 24 }}>
              <View style={styles.row}>
                <View style={[styles.descriptionContainer]}>
                  <View>
                    <Text style={[styles.companyLabel, { fontWeight: offeringTitleWeight }]}>{offering.name}</Text>
                  </View>
                </View>
                <View style={{ marginLeft: 16 }}>

                  {offering.acceptingOrders && offering.maxPrice != 0 ? (offering.hasOrder == false ? this.showPlaceOrderButton(offeringTypeTextColor) : this.showmModifyOrderButton(offeringTypeTextColor)) : this.followButton(offeringTypeTextColor, offering.save)}


                  {/* {offering.acceptingOrders && offering.anticipatedPrice.maxPrice != 0 ? this.showPlaceOrderButton(offeringTypeTextColor) :  this.followButton(offeringTypeTextColor, offering.save)} */}
                  {/* {this.followButton(offeringTypeTextColor, offering.save)} */}
                </View>
              </View>

              <View style={[styles.row, { marginVertical: 4 }]}>
                <View style={[styles.descriptionContainer]}>
                  <View style={[styles.row, { flexDirection: 'row', flex: 1, justifyContent: 'space-between' }]}>
                    <Text style={[{ fontFamily: Fonts.type.chivo, fontWeight: offeringTitleWeight_, color: offeringTypeTextColor, lineHeight: 20 }]}>{offering.offeringTypeName}</Text>
                    <Text style={[{ fontFamily: Fonts.type.chivo, fontWeight: offeringTitleWeight_, color: offeringTypeTextColor, lineHeight: 20 }]}>{industry}</Text>
                  </View>
                </View>
              </View>

              <View>
                <View>
                  {/* Date row */}
                  <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={{ fontFamily: Fonts.type.chivo, color: Colors.blueSteel, fontSize: 14, lineHeight: 20, fontWeight: offeringTitleWeight_ }}>Anticipated Date:</Text>
                    <Text style={{ fontFamily: Fonts.type.chivo, color: Colors.twilightBlue, fontSize: 14, lineHeight: 20, fontWeight: offeringTitleWeight_, alignItems: 'flex-end' }}>{date}</Text>
                  </View>
                  {/* price row */}
                  {this.priceBlock(offering)}
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderSaveIcon = (isSaved) => {
    if (isSaved) {
      return (
        <View style={[styles.savedContainer]}>
          <View style={[styles.saved]}>
            <Image source={Images.saved} resizeMode='contain' style={[{ height: 20, width: 33, padding: 0, margin: 0, alignSelf: 'flex-end' }]} />
          </View>
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  renderPlaceOrderButton = (offering) => {
    // Logger.log({ name: 'OfferingListItem.renderPlaceOrderButton()'})

    return (
      <TouchableHighlight style={[styles.swipeableButtonContainer, { backgroundColor: Colors.booger }]} underlayColor={Colors.lightGreyGreen} onPress={this.placeOrder}>
        <View>
          <Text>
            Archive
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderSaveButton = (offering) => {

    const buttonText = (offering.save)
      ? <View style={{}}><Text style={{ color: Colors.white }}>Remove</Text><Text style={{ color: Colors.white }}>From</Text><Text style={{ color: Colors.white }}>Follow</Text></View>
      : <View style={{}}><Text style={{ color: Colors.white }}>Follow</Text></View>

    return (
      <TouchableHighlight style={[styles.swipeableButtonContainer, { backgroundColor: (offering.save) ? Colors.orange : Colors.tealish }]} onPress={this.toggleSave}>
        <View style={[styles.swipeableButton]}>{buttonText}</View>
      </TouchableHighlight>
    )
  }
}

// Prop type warnings
OfferingListItem.propTypes = {
  user: PropTypes.object,
  offering: PropTypes.object.isRequired,
  placeOrderEnabled: PropTypes.bool.isRequired,
  toggleSaved: PropTypes.func.isRequired,
  order: PropTypes.any,
  fetchActiveOrder: PropTypes.func,
  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    order: state.order.order,
    fetching: state.order.fetching,
    error: state.order.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchActiveOrder: (order) => dispatch(OrderActions.fetchActiveOrder(order))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(
  OfferingListItem
);