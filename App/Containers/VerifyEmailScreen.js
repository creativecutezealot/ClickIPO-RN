import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';


import FullButton from '../Components/FullButton';
import { Colors } from '../Themes';
import UserActions from '../Redux/UserRedux';

const styles = {
  LoginContainer: {
    width: '100%',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: 10,
    fontSize: 18
  }
}

class VerifyEmailScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { verifyEmailToken } = this.props;

    const data = {
      email_verification_token: verifyEmailToken
    }
    // if the verifyEmailToken props exists then make the api call
    if (verifyEmailToken) {
      // make api call here
      this.props.verifyEmail(data);
    }
  }

  componentWillUnmount() {
    this.props.clearVerificationResponse();
  }

  onLoginPress = () => {
    NavigationActions.login({ isLogout: true })
  }

  resendEmail = () => {
    const data = {
      email: this.props.email
    }
    console.log('data: ', data)
    this.props.resendVerificationEmail(data);
  }

  renderAll = () => {
    const { verifyEmailResponse } = this.props;
    console.log('verifyEmailResponse before render: ', verifyEmailResponse);
    if (verifyEmailResponse && verifyEmailResponse.status === 201) {
      return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Image resizeMode='contain' style={{ width: 54, height: 54, overflow: 'hidden', backgroundColor: Colors.white}} source={{uri: "https://clickipo.com/wp-content/uploads/circle-check.png"}} />
          <Text style={{ ...styles.message, fontSize: 24 }}>Email successfully confirmed!</Text>
          <Text style={styles.message}>Thank you for confirming your email address, you can now login to ClickIPO to discover upcoming IPO and Secondary Offerings.</Text>
        </View>
      );
    } else if (this.props.error) {
      console.log('this.props.error: ', this.props.error);
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Image resizeMode='contain' style={{ width: 54, height: 54, overflow: 'hidden', backgroundColor: Colors.white }} source={{ uri: "https://clickipo.com/wp-content/uploads/sent-email.png" }} />
          <Text style={{...styles.message, color: 'red'}}>{this.props.error.data.message}</Text>
          <Text style={{ ...styles.message, fontSize: 12, marginBottom: 20, color: 'rgba(41,154,169,1)'}} onPress={this.resendEmail}>Resend verification email</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Image resizeMode='contain' style={{ width: 54, height: 54, overflow: 'hidden', backgroundColor: Colors.white }} source={{ uri: "https://clickipo.com/wp-content/uploads/sent-email.png" }} />
          <Text style={{ ...styles.message, fontSize: 24 }}>Please check your email...</Text>
          <Text style={{ ...styles.message, fontSize: 16 }}>You're just a click away from accessing upcoming IPOs.</Text>
          <Text style={{ ...styles.message, fontSize: 16 }}>Simply click the confirmation link in the message we sent you and you're all set!</Text>
          <Text style={{ ...styles.message, fontSize: 12, marginBottom: 20, color: 'rgba(41,154,169,1)' }} onPress={this.resendEmail}>Resend verification email</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', marginBottom: 40}}>
        {this.renderAll()}
        <View style={styles.LoginContainer}>
          <FullButton
            ref='login'
            text='Go to Login'
            onPress={this.onLoginPress}
            buttonStyle={{ height: 50, width: '80%' }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    verifyEmailResponse: state.user.verifyEmailResponse,
    error: state.user.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    verifyEmail: data => dispatch(UserActions.verifyEmail(data)),
    clearVerificationResponse: () => dispatch(UserActions.clearVerificationResponse()),
    resendVerificationEmail: data => dispatch(UserActions.resendVerificationEmail(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailScreen);