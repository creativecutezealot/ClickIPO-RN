import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import BrokerActions from '../Redux/BrokerRedux';
import BrokerConnectionAccountView from './BrokerConnectionAccountView';
import { Actions as NavigationActions } from 'react-native-router-flux';
import Connectionstyles from './Styles/BrokerConnectionViewStyle';
import { ApplicationStyles } from '../Themes'


class BrokerConnectionView extends React.Component {

  componentWillUnmount = () => {
    this.props.resetBrokerError();
  }

  handlePressDisconnect = () => {
    const data = {
      account_id: this.props.brokerConnection.accountId,
      mpid: this.props.brokerConnection.mpid
    }
    Alert.alert(
      'ClickIPO',
      'Any orders placed are still valid and will not be automatically canceled if you disconnect your account.',
      [
        { text: 'Cancel' },
        {
          text: 'OK', onPress: () => {
            this.props.deleteBrokerConnection(data);
          }
        },
      ],
      { cancelable: false }
    )
  }

  handlePressGotoOfferings = () => {
    NavigationActions.offerings()
  }

  render = () => {
    if (this.props.error) {
      return <Text style={[ApplicationStyles.networkError]}> {this.props.error.displayMessage}</Text>
    } else {
      return (
        <View style={[ApplicationStyles.mainContainer]}>
          <ScrollView style={[{ flex: 1 }]}>
            <KeyboardAvoidingView>
              <BrokerConnectionAccountView brokerConnection={this.props.brokerConnection} />
              <View style={[ApplicationStyles.contentContainer, { marginVertical: 14 }]}>
                <View style={[ApplicationStyles.rowContainer, { marginTop: 20, justifyContent: 'center', alignItems: 'center' }]}>
                  <TouchableOpacity style={Connectionstyles.TouchableOpacitystyle} onPress={this.handlePressGotoOfferings}>
                    <Text adjustsFontSizeToFit minimumFontScale={.8} style={Connectionstyles.GoToOffering}>
                      Go to Offerings
                  </Text>
                  </TouchableOpacity>
                </View>
                <View style={[ApplicationStyles.rowContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                  <TouchableOpacity style={Connectionstyles.HandlePressStyle} onPress={this.handlePressDisconnect}>
                    <Text style={Connectionstyles.Disconnect}>
                      Disconnect
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.broker.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteBrokerConnection: (brokerConnection) => dispatch(BrokerActions.deleteBrokerConnection(brokerConnection)),
    deleteBrokerConnectionSuccess: (brokerConnection) => dispatch(BrokerActions.deleteBrokerConnectionSuccess(brokerConnection)),
    resetBrokerError: () => dispatch(BrokerActions.resetBrokerError()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerConnectionView);
