import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  View,
  // ScrollView,
  // ListView,
  Text,
  // TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image
  // Keyboard,
  // LayoutAnimation,
  // Clipboard,
  // RefreshControl
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import OfferingActions from '../Redux/OfferingRedux'

import {
  Offering
} from '../Models'

import {
  // Container,
  DeckSwiper,
  Card
  // CardItem
} from 'native-base'

import LinearGradient from 'react-native-linear-gradient'

import { numberWithCommas } from '../Lib/Utilities'

import Moment from 'moment'

import Icon from 'react-native-vector-icons/FontAwesome'

import AlertMessage from '../Components/AlertMessage'
import Styles from './Styles/OfferingsCardViewStyle'

// Styles
import {
  Colors,
  Fonts
} from '../Themes'
// import styles from './Styles/OfferingsCardViewStyle'

// import Logger from '../Lib/Logger'

class OfferingsCardView extends React.Component {

  state: {
    offerings: Array<Offering>,

    deck: DeckSwiper,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'OfferingsCardView.constructor()', props: props })

    const { view = 'All', offerings = [] } = props
    // Logger.log({ name: 'OfferingsCardView.constructor()', view: view })

    const filteredOfferings = (offerings && (view === 'Active' || view === 'Upcoming')) ? this.filterViewedOfferings(offerings) : offerings

    this.state = {
      view: view,
      offerings: filteredOfferings,

      deck: null
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'OfferingsCardView.componentWillMount()' })

  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'OfferingsCardView.componentWillUnmount()' })

  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'OfferingsCardView.componentWillReceiveProps()', newProps: newProps })

    if (newProps.offerings) {
      const { offerings } = newProps

      this.updateOfferings(offerings)
    }
  }

  updateOfferings = (offerings) => {
    // Logger.log({ name: 'OfferingsCardView.updateOfferings()', offerings: offerings })

    const { view } = this.state

    const filteredOfferings = (offerings && offerings.length > 0 && (view === 'Active' || view === 'Upcoming')) ? this.filterViewedOfferings(offerings) : offerings
    // Logger.log({ name: 'OfferingsCardView.updateOfferings()', filteredOfferings: filteredOfferings })

    this.setState({
      offerings: filteredOfferings
    })
  }

  filterViewedOfferings = (offerings) => {
    var retval = offerings

    retval = retval.filter((el) => { return !(el['viewedAt'] && el['viewedAt'] != null) })

    return retval
  }

  setDeckRef = (ref) => {
    // Logger.log({ name: 'OfferingsCardView.setDeckRef()' })

    this.setState({deck: ref})
  }

  handlePressOffering = (offeringId) => {
    // Logger.log({ name: 'OfferingsCardView.handlePressOffering()', offeringId: offeringId })

    // offer details
    NavigationActions.offeringDetails({ offeringId: offeringId })
  }

  handlePressPlaceOrder = (offeringId) => {
    // Logger.log({ name: 'OfferingsCardView.handlePressPlaceOrder()', offeringId: offeringId })

    // offer details
    NavigationActions.orderCreate({ id: offeringId })
  }

  handleSwipeRight = () => {
    // Logger.log({ name: 'OfferingsCardView.handleSwipeRight()' })

    const { deck } = this.state

    const thisOffering = deck.state.selectedItem
    // Logger.log({ name: 'OfferingsCardView.handleSwipeRight()', thisOffering: thisOffering })

    this.props.updateViewedAt(thisOffering.id)
    this.props.toggleSaved(thisOffering.id)
  }

  handleSwipeLeft = () => {
    // Logger.log({ name: 'OfferingsCardView.handleSwipeLeft()' })

    const { deck } = this.state

    const thisOffering = deck.state.selectedItem
    // Logger.log({ name: 'OfferingsCardView.handleSwipeLeft()', thisOffering: thisOffering })

    this.props.updateViewedAt(thisOffering.id)
  }

  render = () => {
    // Logger.log({ name: 'OfferingsCardView.render()' })

    const { offerings = [] } = this.state
    // Logger.log({ name: 'OfferingsCardView.render()', offerings: offerings })

    const deck = this.renderDeck(offerings)

    return (
      <LinearGradient colors={[Colors.twilightBlue, Colors.tealish]} start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}} style={[{ flex: 1 }]}>
        { deck }
      </LinearGradient>
    )
  }

  renderDeck = (offerings) => {
    // Logger.log({ name: 'OfferingsCardView.renderDeck()', offerings: offerings })

    if (offerings && offerings.length > 0) {
      const view = (this.state.view !== 'All') ? this.state.view.toLowerCase() : ''
      const footerText = '' + offerings.length + ' ' + view + ' IPOs to review'

      return (
        <View style={Styles.Container}>
          <View style={[{ flex: 1 }]}>
            <DeckSwiper
              ref={this.setDeckRef}
              dataSource={offerings}
              renderItem={this.renderCard}
              onSwipeRight={this.handleSwipeRight}
              onSwipeLeft={this.handleSwipeLeft} />
          </View>

          <View style={Styles.ViewStyle}>
            <Text style={[{ fontFamily: Fonts.type.base, fontSize: 16, color: Colors.white, alignSelf: 'center' }]}>{footerText}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={Styles.ViewStyle1}>
          <AlertMessage title='No IPOs Available' titleStyle={[{ color: Colors.white }]} iconStyle={[{ color: Colors.white }]} />
        </View>
      )
    }
  }

  renderCard = (cardData) => {
    // Logger.log({ name: 'OfferingsCardView.renderCard()', cardData: cardData })

    if (cardData) {
      const id = cardData.id
      const logo = { uri: 'https:' + cardData.logoUrl }
      const name = cardData.name
      // const tickerSymbol = cardData.tickerSymbol
      const price = ((cardData.finalPrice) ? '$' + cardData.finalPrice.toFixed(2) : '$' + cardData.minPrice.toFixed(2) + '-' + cardData.maxPrice.toFixed(2))
      const shares = (numberWithCommas((cardData.finalShares) ? cardData.finalShares : cardData.anticipatedShares) + ' shares')
      const date = ((cardData.tradeDate) ? (Moment(cardData.tradeDate).format('MMMM Do')) : 'TBD');

      // const isSaved = cardData.save
      // Logger.log({ name: '.renderRow()', isSaved: isSaved })

      const isAcceptingOrders = cardData.acceptingOrders

      return (
        <Card style={Styles.CardStyle}>
          <TouchableOpacity onPress={this.handlePressOffering.bind(this, id)}>
            <View style={[{ borderBottomWidth: 0.5, borderColor: Colors.pinkishGrey }]}>
              <View style={[{ }]}>
                <Image resizeMode='contain' style={[{ height: 90 }]} source={logo} />
              </View>

              <View style={Styles.ViewStyle2}>
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 20, color: Colors.greyishBrown }]} >{name}</Text>
              </View>
            </View>

            <View style={Styles.ViewStyle3}>
              <View style={[{ alignItems: 'center' }]}>
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 32, color: Colors.black }]} >{shares}</Text>
              </View>

              <View style={Styles.ViewStyle4}>
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 24, color: Colors.greyishBrown }]} >{price} per share</Text>
              </View>

              <View style={Styles.ViewStyle5}>
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 17, color: Colors.greyishBrown }]} >Anticipated to be public the week of</Text>
              </View>

              <View style={Styles.ViewStyle6}>
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 24, color: Colors.black }]} >{date}</Text>
              </View>

              <View style={Styles.ViewStyle7}>
                <Icon name='paperclip' style={Styles.ICON} />
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 17, color: Colors.greyishBrown, marginLeft: 8 }]} >Read the prospectus</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View footer style={[{ height: 60 }]}>
            <TouchableHighlight style={[{flex: 1, backgroundColor: Colors.booger}]} underlayColor={Colors.lightGreyGreen} onPress={this.handlePressPlaceOrder.bind(this, id)}>
              <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: (isAcceptingOrders ? Colors.booger : Colors.pinkishGrey), borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                <Text style={[{ fontFamily: Fonts.type.base, fontSize: 24, color: Colors.black }]} >Place Order</Text>
              </View>
            </TouchableHighlight>
          </View>
        </Card>
      )
    } else {
      return null
    }
  }
}

OfferingsCardView.propTypes = {
  view: PropTypes.string,
  offerings: PropTypes.array,
  isLoading: PropTypes.bool
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSaved: (data) => dispatch(OfferingActions.toggleSaved(data)),
    updateViewedAt: (data) => dispatch(OfferingActions.updateViewedAt(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferingsCardView)
