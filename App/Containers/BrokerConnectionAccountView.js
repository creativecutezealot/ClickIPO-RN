import React from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import BrokerActions from '../Redux/BrokerRedux'
import { ApplicationStyles, Fonts, Colors } from '../Themes'
// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import WaitingView from '../Components/WaitingView';
import Styles from './Styles/BrokerConnectionAccountViewStyle'


// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class BrokerConnectionAccountView extends React.Component {

  constructor (props) {
    super(props)

    Logger.log({ name: 'BrokerConnectionAccountView.constructor()', props: props })

    this.state = {
      account: props.account,
      availableBalance: this.props.buyingPower
    }
  }

  componentWillReceiveProps = (newProps) => {

    const { buyingPower, brokerConnection } = newProps;

    if(buyingPower && brokerConnection) {
      this.setState({
        availableBalance: buyingPower.buying_power.toFixed(2)
      });
    }else if(buyingPower){
      this.setState({
        availableBalance: buyingPower.buying_power
      });
    }

  }

  componentWillMount = () => {

    this.props.fetchBuyingPower();

    // send the brokerConnection to the router to have the props for not deleting the account
    // NavigationActions.refresh({
    //   key: 'brokerView',
    //   brokerConnection: this.props.brokerConnection
    // });
  }

  renderAll = () => {
    const { brokerConnection } = this.props;
    const { availableBalance } = this.state;
    const localBuyingPower = '$ ' + availableBalance;
    // TODO: display the account details

    return (
      <ScrollView style={ApplicationStyles.container}>
        <KeyboardAvoidingView behavior='position' style={Styles.KeyboardAvoiding}>
          <View style={Styles.ViewStyle}>
            <Text style={[{ fontFamily: Fonts.type.base, fontSize: 24, color: Colors.greyishBrown, textAlign: 'center' }]}>{brokerConnection.brokerDealerName}</Text>
          </View>
          <View style={{marginBottom: 15}}>
            <Text style={Styles.TextStyle}>Account Number:</Text><Text>{brokerConnection.accountName}</Text>
          </View>
          <View style={{marginBottom: 15}}>
            <Text style={Styles.TextStyle}>Account Type:</Text><Text>{brokerConnection.accountType}</Text>
          </View>
          <View>
            <Text style={Styles.TextStyle}>Buying Power:</Text><Text>{localBuyingPower}</Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  isWaiting = () => {
    if (this.props.fetchingBuyingPower === false) {
      return false;
    } else {
      return true;
    }
  };
  
  render = () => {
    if (this.props.brokerError) {
      return (
        <Text style={[ApplicationStyles.networkError]}>{this.props.brokerError.displayMessage}</Text>
      )
    }
    //if we are not fetchingBuyingPower and response from the server is null then we have a timeout error
    if(this.props.buyingPower) {
      if(this.props.fetchingBuyingPower === false && this.props.buyingPower.status == null ) {
        return (
          <Text style={[ApplicationStyles.networkError]}>Due to network error, we are unable to retrieve your buying power.</Text>
        );
      } 
    }

    return (
      <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    buyingPower: state.broker.buyingPower,
    fetchingBuyingPower: state.broker.fetching,
    brokerError: state.broker.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBuyingPower: () => dispatch(BrokerActions.fetchBuyingPower())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerConnectionAccountView);
