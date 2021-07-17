


import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  // Alert,
  // TouchableHighlight,
  Image,
  // TouchableOpacity,
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  KeyboardAvoidingView,
  WebView,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native'

import { connect } from 'react-redux'
import BrokerActions from '../Redux/BrokerRedux'
import SafariView from 'react-native-safari-view';
import {CustomTabs} from 'react-native-custom-tabs'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Broker
} from '../Models'

import { findByProp } from 'ramdasauce'

// import TextField from '../Components/TextField'

import FullButton from '../Components/FullButton'

import RestrictedPersonView from './RestrictedPersonView'

// import Icon from 'react-native-vector-icons/FontAwesome'

import LinearGradient from 'react-native-linear-gradient'
import BrokerStyles from './Styles/BrokerConnectViewStyle'

import firebase from '../Config/FirebaseConfig'

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'

class BrokerConnectView extends React.Component {
  state: {
    brokerId: String,
    broker: Broker,

    userId: String,
  }

  constructor (props) {
    // Logger.log({ name: 'BrokerConnectView.constructor()', props: props })
    super(props)

    // TODO: use broker.id to get broker from redux (fetch broker) so that  we get any future updates like 'save'
    const { brokerId, brokers, userId } = props
    // Logger.log({ name: 'BrokerConnectView.constructor()', brokerId: brokerId, brokers: brokers, userId: userId })

    const broker = findByProp('id', brokerId, brokers)
    // Logger.log({ name: 'BrokerConnectView.constructor()', broker: broker })

    this.state = {
      brokerId: brokerId,
      broker: broker,
      restrictedPrompt: true,
      userId: userId,
      showWebView: false
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'BrokerConnectView.componentWillMount()' })
    firebase.analytics().setCurrentScreen('account_brokerages_' + this.state.broker.name )
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'BrokerConnectView.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'BrokerConnectView.componentWillReceiveProps()', newProps: newProps })

    const { brokers } = newProps
    const { brokerId } = this.state

    const broker = findByProp('id', brokerId, brokers)
    // Logger.log({ name: 'BrokerConnectView.componentWillReceiveProps()', broker: broker })

    this.setState({
      broker: broker
    })
  }

  handlePressConnect = () => {
    Logger.log({ name: 'BrokerConnectView.handlePressConnect()' })
    firebase.analytics().setCurrentScreen('account_brokerages_connect_' + this.state.broker.name )

    this.props.connectBroker(this.state.broker)
  }

  handlePressCreateBDAccount = (bd_name) => {



    if(Platform.OS === 'ios'){
      if (bd_name === 'TradeStation') {
        SafariView.isAvailable()
        .then(SafariView.show({
          url: "https://www.tradestation.com/promo/clickIPO/?offer=0180AESX"
        }))
        .catch(error => {
          console.error('Unable to open this link. Please try again later');
        });
      } else if (bd_name === 'Just2Trade') {
        SafariView.isAvailable()
        .then(SafariView.show({
          url: "https://open.just2trade.com"
        }))
        .catch(error => {
          console.error('Unable to open this link. Please try again later');
        });
      }
    } else if (Platform.OS === 'android') {

      if (bd_name === 'TradeStation') {
        try {
          CustomTabs.openURL(
            "https://www.tradestation.com/promo/clickIPO/?offer=0180AESX"
          )
        }
        catch(error) {
          console.error('Unable to open this link. Please try again later ', error);
        }
      } else if (bd_name === 'Just2Trade') {
        try {
          CustomTabs.openURL(
            "https://open.just2trade.com"
          )
        }
        catch(error) {
          console.error('Unable to open this link. Please try again later', error);
        }
      }
    }

  }

  handlePressRestrictedConfirm = () => {
    this.setState({
      restrictedPrompt : false
    })
    firebase.analytics().setCurrentScreen('account_brokerages_connect_restricted_persons_check')

  }

  renderContent = () => {
    const { broker } = this.state
    // Logger.log({ name: 'BrokerConnectView.render()', broker: broker })

    // const id = broker.id
    // const name = broker.name
    const logoUrl = { uri: 'https:' + broker.logoMediumUrl }
    // Logger.log({ name: 'BrokerConnectView.render()', logoUrl: logoUrl })

    const investorCount = 9000
    const avgScore = 100
    if(this.state.restrictedPrompt === true){
      return (
        <RestrictedPersonView handlePressRestrictedConfirm={this.handlePressRestrictedConfirm} />
      )
    } else if ( (broker.name === 'TradeStation') || (broker.name === 'Just2Trade')) {
      return (
        <View style={{flex: 1}}>
          <View style={[ApplicationStyles.logoContainer, { borderBottomWidth: 0.5, borderColor: Colors.pinkishGrey }]}>
            <Image resizeMode='contain' style={ApplicationStyles.logo} source={logoUrl} />
          </View>



          <View style={ApplicationStyles.contentContainer}>
            {/* <Text style={{fontSize: 24, paddingTop: 10}}>{ broker.name }</Text> */}
            <View style={[ { flex: 1, marginVertical: 12 } ]}>
              <Text style={ BrokerStyles.TextStyle}>If you already have a { broker.name } brokerage account, connect your ClickIPO app here.</Text>
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <FullButton
                ref='connectButton'
                text='Connect'
                onPress={this.handlePressConnect}
                />
            </View>
          </View>
          <View style={ApplicationStyles.contentContainer}>
            {/* <Text style={{fontSize: 24}}>{ broker.name }</Text> */}
            <View style={ BrokerStyles.ViewStyle1}>
              <Text style={ BrokerStyles.TextStyle1}>If you do not have a { broker.name } brokerage account, then use the link below to open your account.</Text>
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <FullButton
                ref='connectButton'
                text='Create Account' 

                onPress ={this.handlePressCreateBDAccount.bind(this, broker.name)}
                />
            </View>
          </View>
        </View>

      )
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={[ApplicationStyles.logoContainer, { borderBottomWidth: 0.5, borderColor: Colors.pinkishGrey }]}>
            <Image resizeMode='contain' style={ApplicationStyles.logo} source={logoUrl} />
          </View>
          <View style={ApplicationStyles.contentContainer}>
            <Text style={ BrokerStyles.TextStyle2}>
              { broker.name }
            </Text>
            <View style={ BrokerStyles.TextStyle3}>
              <Text style={BrokerStyles.TextStyle4}>If you already have a { broker.name } brokerage account, connect your ClickIPO app here.</Text>
            </View>

            <View style={ApplicationStyles.rowContainer}>
              <FullButton
                ref='connectButton'
                text='Connect'
                onPress={this.handlePressConnect}
                />
            </View>
          </View>
        </View>
          
      )
    }
  }

  //if broker.name === tradestation show both create account and connect 

  render = () => {
    // Logger.log({ name: 'BrokerConnectView.render()' })
    // console.log("broker action: ", BrokerActions);
    // console.log('this.props.deleteBrokerConnectionSuccess: ', this.props.deleteBrokerConnectionSuccess);
    return (
      <View style={[ ApplicationStyles.mainContainer ]}>
        <View style={[{ flex: 1 }]}>
            {this.renderContent()}
        </View>
      </View>
    )
  }
}

BrokerConnectView.propTypes = {
  brokerId: PropTypes.string,
  broker: PropTypes.object,
  brokers: PropTypes.array,
  userId: PropTypes.string,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    brokers: state.broker.brokers,
    userId: state.user.user.id,
    error: state.broker.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    connectBroker: (broker) => dispatch(BrokerActions.connectBroker(broker)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerConnectView)
