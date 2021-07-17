import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, KeyboardAvoidingView, StyleSheet, Animated } from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux';

import { Colors, Fonts } from '../Themes';
import firebase from '../Config/FirebaseConfig';
import Styles from './Styles/SocialShareMessageViewStyle';

var {
  height: deviceHeight
} = Dimensions.get("window")

var styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
})

class SocialShareMessageView extends Component {
  constructor(props) {
    super(props);
    
    //default message to share
    let defaultMessage = `$${props.shareable.tickerSymbol} ${props.shareable.name} has an upcoming ${props.shareable.offeringTypeName} on the @ClickIPO app #IPO #invest #stockmarket #fintech`;
    this.state = {
      offset: new Animated.Value(-deviceHeight),
      message: defaultMessage,
      helpMessage: 'Join the conversation!',
      helpMessageColor: Colors.black
    }
  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start();
  }

  close = () => {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: -deviceHeight
    }).start(NavigationActions.pop);
  }

  onCancel = () => {
    this.close();
  }

  onShare = () => {
    const industry = this.props.shareable.industries[0] ? this.props.shareable.industries[0].name : 'none'
    firebase.analytics().logEvent('shared_offer', { ticker: this.props.shareable.tickerSymbol, industry: industry })
    const shareMessage = this.state.message
    const offeringLabel = 'shared ' + this.props.shareable.tickerSymbol
    const socialProviderLabel = 'social provider ' + this.props.provider.name

    this.props.handleShare(shareMessage);

    this.close();
  }

  offeringIllustration = () => {
    const splitPath = this.props.shareable.logoUrl.split('/');
    const logo = this.props.shareable.logoUrl;
    const image = splitPath[splitPath.length - 1];
    if (image === 'placeholder_company_medium.png') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[{ fontSize: 20, color: Colors.pinkishGrey }]}>${this.props.shareable.tickerSymbol}</Text>
        </View>
      );
    } else {
      return (
        <Image resizeMode='contain' style={{ flex: 1 }} source={{ uri: 'https:' + logo }} />
      );
    }
  }

  render() {

    if (this.props.provider !== null) {
      return (
        <Animated.View style={[styles.container, { backgroundColor: "rgba(52,52,52,0.5)" }, { transform: [{ translateY: this.state.offset }] }]}>
          <TouchableOpacity activeOpacity={1} style={Styles.Component} onPress={this.onCancel}>
            <KeyboardAvoidingView behavior='position' style={Styles.ViewStyle}>
              <TouchableWithoutFeedback>
                <View style={{ height: (Dimensions.get('window').width * .9), width: (Dimensions.get('window').width * .9), backgroundColor: Colors.smoke, overflow: 'hidden' }}>
                  <View style={Styles.ViewStyle1}>
                    <View style={Styles.ViewStyle2}>
                      <View style={Styles.ViewStyle3}>
                        <View style={Styles.ViewStyle4}>
                          {this.offeringIllustration()}
                        </View>
                      </View>
                      <View style={{ flex: 5 }}>
                        <View style={Styles.ViewStyle5}>
                          <Text style={{ ...Fonts.style.headline }}>${this.props.shareable.tickerSymbol}</Text>
                          <Text style={{ ...Fonts.style.subHeader }}>{this.props.shareable.name}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={Styles.ViewStyle6}>
                      <Text style={{ ...Fonts.style.tip, textAlign: 'center', color: this.state.helpMessageColor }}>{this.state.helpMessage}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        onChangeText={(message) => this.setState({ message: message })}
                        style={{ flex: 2, backgroundColor: Colors.white, paddingHorizontal: 18, paddingTop: 18, ...Fonts.style.input }}
                        // placeholder='Say Something...'
                        value={this.state.message}
                        multiline={true} />
                    </View>

                    <TouchableHighlight onPress={this.onShare} style={{ flex: 1 }}>
                      <View style={{ flex: 1, backgroundColor: (this.props.provider && this.props.provider !== null ? this.props.provider.color : '#FFFFFF'), justifyContent: 'center', alignItems: 'center' }}>
                        <View style={Styles.ShreView}>
                          <Image source={(this.props.provider && this.props.provider !== null ? this.props.provider.icon : null)} style={Styles.ShareImage} resizeMode='contain' />
                          <Text style={{ color: Colors.white, ...Fonts.style.subHeader }}>
                            Share
                        </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return (
        null
      );
    }
  }
}

export default SocialShareMessageView;