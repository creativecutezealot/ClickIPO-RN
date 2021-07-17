import React from 'react'
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { findByProp } from 'ramdasauce';
// import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import UserActions from '../Redux/UserRedux';
import ShareIt from '../Components/ShareIt';
import { numberWithCommas, dateFormat } from '../Lib/Utilities';
import styles from './Styles/OrderDetailsScreenStyle';
import { Colors, Fonts, ApplicationStyles, } from '../Themes';

class OrderDetailsScreen extends React.Component {
  constructor (props) {
    super(props);

    const order = findByProp('id', props.id, props.orders) || props.order;
    this.state = {
      orderId: props.id,
      order: order,
      showModal: false
    }
  }

  //TODO:// REFACTOR
  componentWillReceiveProps = (newProps) => {
    const { orders } = newProps
    console.log(orders)
    const { orderId } = this.state

    const order = findByProp('id', orderId, orders)

    if (order) {
      this.setState({
        order: order
      })
    }
  }

  handlePressModifyOrder = (orderId) => {
    if(this.props.user.brokerConnection) {
      // offer details
      NavigationActions.orderModify({ orderId: orderId })
    } else {
      //if no brokerConnection ask the user to link an account
      this.setState({showModal: true});
    }
  }

  handleSendProspectus() {
    //call the function that sends the prospectus the user 
    this.props.sendProspectus(this.state.order.offering.id);
  }

  handleProspectus = () => {
    Alert.alert(
      'Prospectus',
      'Would you like to read the prospectus or email yourself a copy?',
      [
        { text: 'Read', onPress: () => this.displayProspectus() },
        { text: 'Email', onPress: () => this.handleSendProspectus() },
        { text: 'Cancel', onPress: () => console.log('cancelled button was pressed') }
      ]
    )
  }

  displayProspectus = () => {
    NavigationActions.prospectusScreen({
      url: this.state.order.offering.prospectusUrl,
      tickerSymbol: this.state.order.offering.tickerSymbol
    });
  };

  render () {
    const { order } = this.state
    const { offering } = order

    const { id, requestedAmount } = order
    const requestedAmountFormated = numberWithCommas(requestedAmount)

    const baseCalPrice = offering.finalPrice || offering.maxPrice

    const approximateShares = numberWithCommas(Math.floor(requestedAmount / baseCalPrice))

    // const approximateShares = numberWithCommas(Math.floor(requestedAmount / offering.anticipatedPrice.maxPrice))

    // const name = offering.name
    const logo = { uri: 'https:' + offering.logoUrl }
    const tickerSymbol = offering.tickerSymbol
    const price = ('$' + ((offering.minPrice) ? offering.minPrice.toFixed(2) + '-$' + offering.maxPrice.toFixed(2) : offering.maxPrice.toFixed(2)))
    const shares = (numberWithCommas((offering.finalShares) ? offering.finalShares : offering.anticipatedShares) + ' shares')

    // const date = ((offering.tradeData) ? (Moment(offering.tradeDate).format('MMM D')) : 'TBD');
    const date = ((offering.tradeDate) ? (dateFormat(offering.tradeDate)) : 'TBD');
    const underwritersList = offering.underwritersList
    // const underwriterStyle = !underwriter.lead ? ApplicationStyles.underwriter : ApplicationStyles.underwriterLead
    // const underwriters = (offering.underwirters) ? offering.underwriters.map((underwriter) => {
    // const underwriterStyle = !underwriter.lead ? ApplicationStyles.underwriter : ApplicationStyles.underwriterLead

    // return (
    //     <Text key={underwriter.name} style={[underwriterStyle]}>{ underwriter.name }</Text>
    //   )
    // }) : null

    return (
      <View style={[ ApplicationStyles.mainContainer ]} onRequestClose={() => null}>
        {/* <ScrollView style={[{ flex: 1, marginBottom: 50 }]} onRequestClose={() => null}> */}
        <ScrollView style={styles.ScrollView}>
          <View style={ApplicationStyles.logoContainer}>
            <Image resizeMode='contain' style={ApplicationStyles.logo} source={logo} />
          </View>

          {/* <View style={[ApplicationStyles.tipContainer]}>
            <Icon name='lightbulb-o' style={[ApplicationStyles.icon, { color: Colors.white }]} />
            <Text style={[ApplicationStyles.note, {color: Colors.white}]}>Increasing your ClickIPO Investor Score can improve your chances of being allocated shares in an IPO.  Learn More ></Text>
          </View> */}

          <View style={[ ApplicationStyles.orderDetailsContainer ]}>
            <View style={styles.ViewStyle}>
              <View style={ styles.ViewStyle1}>
                <View style={styles.ViewStyle2}>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Your Conditional</Text>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Purchase Order</Text>
                </View>

                <View style={styles.ViewStyle3}>
                  <Text style={[ApplicationStyles.orderDetailsLabel]} />
                </View>

                <View style={styles.ViewStyle4}>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Approximate</Text>
                  <Text style={[ApplicationStyles.orderDetailsLabel]}>Shares</Text>
                </View>
              </View>

              <View style={ styles.ViewStyle5}>
                <View style={styles.ViewStyle6}>
                  <Text style={[ApplicationStyles.orderDetailsText, { }]}>{ requestedAmountFormated }</Text>
                </View>

                <View style={styles.ViewStyle7}>
                  <Text style={[ ApplicationStyles.orderDetailsText, { fontFamily: Fonts.type.bold, fontSize: 20 } ]}>=</Text>
                </View>

                <View style={styles.ViewStyle6}>
                  <Text style={[ApplicationStyles.orderDetailsText, { }]}>{ approximateShares }</Text>
                </View>
              </View>
            </View>
          </View>

          {/*
          <View style={[ApplicationStyles.noteContainer, ApplicationStyles.bottomBorder]}>
            <Icon name='tachometer' style={[ApplicationStyles.icon, {color: Colors.black}]} />
            <Text style={[ApplicationStyles.note, {color: Colors.black}]}>There are 100+ conditional purchase orders from other ClickIPO members.</Text>
          </View>
          */}

          <View style={[ApplicationStyles.infoContainer, ApplicationStyles.bottomBorder]}>
            <Text style={[ApplicationStyles.infoLabel]}>Symbol</Text>
            <Text style={[ApplicationStyles.info]}>{ tickerSymbol }</Text>
          </View>

          <View style={[ApplicationStyles.infoContainer, ApplicationStyles.bottomBorder]}>
            <Text style={[ApplicationStyles.infoLabel]}>Anticipated number of shares</Text>
            <Text style={[ApplicationStyles.info]}>{ shares }</Text>
          </View>

          <View style={[ApplicationStyles.infoContainer, ApplicationStyles.bottomBorder]}>
            <Text style={[ApplicationStyles.infoLabel]}>Anticipated price range</Text>
            <Text style={[ApplicationStyles.info]}>{ price }</Text>
          </View>

          <View style={[ApplicationStyles.infoContainer, ApplicationStyles.bottomBorder]}>
            <Text style={[ApplicationStyles.infoLabel]}>Anticipated date</Text>
            <Text style={[ApplicationStyles.info]}>{ date }</Text>
          </View>

          <View style={[ApplicationStyles.infoContainer, ApplicationStyles.bottomBorder]}>
            <Text style={[ApplicationStyles.infoLabel]}>Underwriting group</Text>
            <Text>{ underwritersList }</Text>

          </View>

          <View style={[ApplicationStyles.noteContainer, { marginBottom: 24 }]}>
            <Icon name='paperclip' style={[ApplicationStyles.icon, {color: Colors.black}]} />
            <Text style={[ApplicationStyles.info]} onPress={this.handleProspectus}>Read the prospectus</Text>
          </View>

          {/* <View style={[ApplicationStyles.tipContainer]}>
            <Icon name='lightbulb-o' style={[ApplicationStyles.icon, { color: Colors.white }]} />
            <Text style={[ApplicationStyles.note, {color: Colors.white}]}>Submitting purchase orders early and frequently improves your Investor Score.  Learn More ></Text>
          </View> */}

          <View style={[ApplicationStyles.shareContainer, { marginVertical: 24 }]}>
            <ShareIt />
          </View>
        </ScrollView>
{/* removed the modify button from the order details screen -- the only way the user can naviagte to order modify is from the orderList page -- also remove the handlePressModifyOrder function as well */}
        {/* <View style={styles.ViewStyle8}>
          <View style={styles.ViewStyle9}>
            <FullButton
              ref='modifyOrderButton'
              text='Modify Order'
              onPress={this.handlePressModifyOrder.bind(this, id)}
              />
          </View>
        </View> */}
      </View>
    )
  }
}

OrderDetailsScreen.propTypes = {
  orderId: PropTypes.string,
  order: PropTypes.object,
  orders: PropTypes.array,

  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    user: state.user.user,
    fetching: state.offering.fetching,
    error: state.offering.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendProspectus: data => dispatch(UserActions.sendProspectusToUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsScreen)
