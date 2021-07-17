import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, Platform, Dimensions } from 'react-native';

import { Actions as NavigationActions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import {
  Colors,
  Metrics,
  Fonts,
  Images
} from '../Themes';

import firebase from '../Config/FirebaseConfig';
import Styles from './Styles/IntroScreenStyle';
import Carousel from 'react-native-looped-carousel';

const { width, height } = Dimensions.get('window')

const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
}

const dimensions = {
  width: metrics.screenWidth,
  height: metrics.screenHeight
}

class IntroScreen extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      size: dimensions,
      buttonText: 'Continue'
    }
  }

  componentDidMount() {
    if ( this.state.buttonText === 'Continue') {
      firebase.analytics().setCurrentScreen('onboard_carousel_general');
    }
  }

  onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  onActionPress = () => {
    this.carousel._animateNextPage();

    firebase.analytics().setCurrentScreen('onboard_carousel_investor_score');

    if (this.state.buttonText === 'Get Started') {
      NavigationActions.login();
    }
  }

  onAnimateNextPage = (p) => {
    //instead of looking at the buttonText we are going to look at the value of p
    //(p0 is the Research, follow and share screen, p1 is the offering availability screen, and p3 is the investor score screen)

    if(p == 2) {
      this.setState({
        buttonText: 'Get Started'
      });
    }
  }

  render () {
    const { size } = this.state;
    if (Platform.OS === 'android') {
      var logoTopHeight = StatusBar.currentHeight;
    } else {
      var logoTopHeight = 20;
    }
    return (
      <View onLayout={this.onLayoutDidChange} style={{ flex: 1 }}>
        <Carousel ref={(carousel) => { this.carousel = carousel }} delay={5000} style={size} autoplay={false} onAnimateNextPage={(p) => this.onAnimateNextPage(p)} isLooped={false}>
          <View style={{ flex: 1 }}>
            <Image source={Images.logoTop} style={{ alignSelf: 'center', resizeMode: 'contain', height: 55, width : 180, marginTop: (30 + logoTopHeight), marginBottom: 30 }} />

            <View style={Styles.Component}>
              <View style={{}}>
                <Text style={{ fontFamily: Fonts.type.black, color: Colors.twilightBlue, fontSize: size.width / 11 }}>Research, follow, share and invest in IPO's and secondary offerings.</Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontFamily: Fonts.type.chivo, fontSize: 16, lineHeight: 24 }}>The ClickIPO app offers individual investors access to offering information and the ability to purchase offerings through their existing brokerage account.</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Image source={Images.onboardingOffering} style={{ alignSelf: 'center', resizeMode: 'contain', height: 100, width: 300, marginTop: (10 + logoTopHeight), marginBottom: 20 }} />

            <View style={Styles.Component}>
              <View style={{}}>
                <Text style={{ fontFamily: Fonts.type.black, color: Colors.twilightBlue, fontSize: size.width / 11 }}>Offering Availability {"\n"}</Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text adjustsFontSizeToFit minimumFontScale={1.2} style={{ fontFamily: Fonts.type.chivo, lineHeight: 24 }}>Not all offerings will be available to order. Offerings that ClickIPO is participating in will be made available to purchase once the following events have occurred...{"\n"}</Text>
                <Text adjustsFontSizeToFit minimumFontScale={1.2} style={{ fontFamily: Fonts.type.chivo, lineHeight: 24 }}>1) An anticipated date is set</Text>
                <Text adjustsFontSizeToFit minimumFontScale={1.2} style={{ fontFamily: Fonts.type.chivo, lineHeight: 24 }}>2) A price range is set{"\n"}</Text>
                <Text adjustsFontSizeToFit minimumFontScale={1} style={{ fontFamily: Fonts.type.chivo, lineHeight: 24, padding: 1 }}>Click <Text style={{ color: Colors.greenBlue }}>Interested?</Text> on an offering to get notified when the price and anticipated date are updated.</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Image source={Images.investorScore} style={{ alignSelf: 'center', resizeMode: 'contain', height: 106, width : 180, marginTop: (30 + logoTopHeight), marginBottom: 30 }} />

            <View style={{ flex: 1, marginHorizontal: 20 }}>
              <View style={{}}>
                <Text style={{ fontFamily: Fonts.type.black, color: Colors.twilightBlue, fontSize: size.width / 9 }}>Build your ClickIPO investor score.</Text>
              </View>

              <View style={{ marginTop: 8 }}>
                <Text style={{ fontFamily: Fonts.type.chivo, fontSize: 16, lineHeight: 24 }}>Increase your chance of receiving allocations by buying and holding IPOs for 30 days or longer, and secondary offerings for 15 days or longer.</Text>
              </View>
            </View>
          </View>
        </Carousel>
        <TouchableOpacity onPress={this.onActionPress} style={Styles.TouchableOpacityStyle}>
          <LinearGradient colors={[Colors.greenYellow, Colors.greenBlue]} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}} style={Styles.LinearGradeant}>
            <Text style={{ fontFamily: Fonts.type.chivo, fontSize: 16, color: Colors.white, textAlign: 'center', backgroundColor: Colors.clear }}>{this.state.buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}


export default IntroScreen;