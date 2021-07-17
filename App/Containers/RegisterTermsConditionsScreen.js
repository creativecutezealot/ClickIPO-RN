import React from 'react'
import PropTypes from 'prop-types';
import { View, Alert, WebView, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';

import UserActions from '../Redux/UserRedux';
import { ApplicationStyles, } from '../Themes';
import FullButton from '../Components/FullButton';
import LoadingView from '../Components/LoadingView';
import firebase from '../Config/FirebaseConfig';

class RegisterTermsConditionsScreen extends React.Component {
  state: {
    data: Object,
    processing: Boolean,
    isWebViewLoaded: Boolean
  }

  constructor (props) {
    super(props);
    const { data } = props;

    this.state = {
      data,
      processing: false,
      isWebViewLoaded: false
    }
  }

  componentWillReceiveProps (newProps) { 
    const { error } = newProps;

    if (this.state.processing && error) {
      this.forceUpdate();
      
      Alert.alert(
        error.displayMessage,
        null,
        [{
          text: 'OK',
          onPress: () => {
            this.setState({ processing: false });
          }
        }]
      )
    }
  }

  componentWillMount () {
    firebase.analytics().setCurrentScreen('account_terms');
  }

  handlePressRegister = () => {
    this.setState({ processing: true });

    // attempt a register - a saga is listening to pick it up from here.

    DeviceInfo.getUniqueID();

    const device_data = {  
      'device_id' : DeviceInfo.getUniqueID(),
      'platform' : Platform.OS,
      'name' : DeviceInfo.getDeviceName()  
    }

    const { email, first_name, last_name, password } = this.props;
    
    const data = {
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: password,
      user_devices_attributes: [device_data],
      source: 'mobile'
    }
    this.props.register(data);
  }

  onLoadEndWebView = () => {
    this.setState({ isWebViewLoaded: true });
 }

  render () {
    const { processing } = this.state;

    let jsCode = "document.querySelector('#footer').style.display = 'none'; document.querySelector('#header').style.display = 'none';"

    if (this.state.isWebViewLoaded) {
      var fullButtonStyle = {height:70, padding:10}
    } else {
      var fullButtonStyle = {height:0, padding:0}
    }

    return (
      <LoadingView style={{ flex: 1 }} isLoading={processing}>
        <View style={[ApplicationStyles.mainContainer],{flex:1}}>
          <View style={[ApplicationStyles.contentContainer],{flex:1}}>
            
            <View style={[ApplicationStyles.contractContainer],{flex: 1}}>

              <WebView style={{flex: 1, marginHorizontal:10}}
                  source={{uri: 'https://clickipo.com/terms-conditions'}}
                  injectedJavaScript={jsCode}
                  javaScriptEnabledAndroid={true}
                  startInLoadingState={true}
                  onLoadEnd = {this.onLoadEndWebView.bind(this)}
              />

            </View>
            <View style={fullButtonStyle}>
              <FullButton
                ref='register'
                text='Agree to Complete Registration'
                onPress={this.handlePressRegister}
                buttonStyle = {{height: 50}}
              />
            </View>
            
          </View>
        </View>
      </LoadingView>
    )
  }
}

RegisterTermsConditionsScreen.propTypes = {
  data: PropTypes.object,
  register: PropTypes.func,
  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    fetching: state.user.fetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data) => dispatch(UserActions.register(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTermsConditionsScreen);
