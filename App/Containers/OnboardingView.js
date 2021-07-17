import '../Config'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Text, View, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import Carousel from 'react-native-looped-carousel'
import SettingsActions from '../Redux/SettingsRedux'

import Icon from 'react-native-vector-icons/Ionicons'

import {
  Colors,
  Fonts,
  Images
} from '../Themes'

import FullButton from '../Components/FullButton'
import styles from './Styles/OnboardingViewStyle'

import Logger from '../Lib/Logger'

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */

class OnboardingScene extends Component {
  /*constructor() {
    super()
  }*/

  render () {
    return (
      <View style={[{ backgroundColor: this.props.color, flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
        <View style={styles.Container}>
          <View style={{flex:1,borderBottomColor: Colors.white, justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width *.85}}>
            <Text style={[Fonts.style.headline, { fontWeight: 'bold', color: Colors.white, marginBottom: 10, marginTop: 25, fontSize: 28}]}>{this.props.header}</Text>
            <Text style={[Fonts.style.disclaimer, {fontSize: 13, color: Colors.white, textAlign: 'center'}]}>{this.props.subtitle}</Text>
          </View>
          <View style={styles.View}>
            <Image style={{ height: Dimensions.get('window').width *.85, width: Dimensions.get('window').width *.85 }} source={this.props.image} resizeMode='contain' />
          </View>
          <View style={{ flex: 1, width: Dimensions.get('window').width *.85, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[Fonts.style.disclaimer, {fontSize: 13, color: Colors.white, textAlign: 'center', bottom: 5}]}>
              {this.props.copy}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}



class OnboardingView extends Component {
  currentPage:0

	constructor(props) {
		super(props)
    this.state = {
      buttonText: 'Next'
    }

    if(props.currentPage){
      this.currentPage = props.currentPage
    }
	}

  handleResponse = (enableNotifications) => {
    // Logger.log({ function: 'EnableNotificationsView.handleResponse', enableNotifications: enableNotifications })
    
    if(this.state.buttonText === 'Continue'){
      const notifications = {
        onboarding: false
      }
      this.props.updateNotifications(notifications)
    } else {
      this.carousel._animateNextPage()
    }
  }

  onAnimateNextPage = (p) => {
    if(p === 3){
      this.setState({
        buttonText: 'Continue'
      })
    } else {
      this.setState({
        buttonText: 'Next'
      })
    }
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <Carousel currentPage={this.currentPage} ref={(carousel) => { this.carousel = carousel }} delay={5000} style={{flex: 11}} autoplay={false} bullets bulletsContainerStyle={{ bottom: 0 }} bulletStyle={{ borderColor: Colors.white, height:2, width: 2 }} chosenBulletStyle={{ backgroundColor: Colors.white, height:8, width: 8 }} onAnimateNextPage={(p) => this.onAnimateNextPage(p)} >
          <OnboardingScene 
            header='Research!' 
            color={Colors.tealish} 
            image={Images.onboardingResearch}
            subtitle='ClickIPO makes it easy to browse, search, and get alerts on upcoming offerings.'
            copy='Browse active offerings that are going public soon! Tab over to see upcoming offerings, try filters to fine tune your search or view past offerings, or search by ticker or company name.'
             />
          <OnboardingScene 
            header='Follow!' 
            color={Colors.twilightBlue} 
            image={Images.onboardingFollow}
            subtitle='Easily follow your favorite offerings.'
            copy='Following an offering will generate push alerts on changes and important dates. Easily create and edit your personal IPO watchlist '
             />
          <OnboardingScene 
            header='Share!' 
            color={Colors.booger} 
            image={Images.onboardingShare}
            subtitle='Be the first to break the news.'
            copy='Easily share an offering on social media. Post directly and collaborate with thousands of investors. We integrate with StockTwits.'
             />
          <OnboardingScene 
            header='(Coming Soon) Invest!' 
            color={Colors.orange} 
            image={Images.onboardingInvest}
            subtitle='ClickIPO makes some IPOs and Secondary offerings available to individual investors like you.'
            copy='By downloading the ClickIPO app now, you are automatically enrolled in our Waitlist. This means we’ll send you a notification when you’ve been invited to participate in offerings.'
             />
        </Carousel>
        <View style={{flex: 1}}>
        <FullButton
          ref='continue'
          text={this.state.buttonText}
          buttonStyle={{ backgroundColor: Colors.lightGreyGreen, borderColor: Colors.lightGreyGreen, width: Dimensions.get('window').width, alignSelf: 'center', borderRadius: 0 }}
          onPress={this.handleResponse}
          disabled={false}
        />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fob: state.settings.fob
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNotifications: (data) => dispatch(SettingsActions.updateNotifications(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingView)