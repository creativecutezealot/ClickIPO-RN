


import React from 'react'
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Image, TouchableOpacity, StatusBar, Platform, Linking } from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
// import OfferingActions from '../Redux/OfferingRedux'

import {
  Colors,
  Metrics,
  Fonts,
  Images,
  ApplicationStyles
} from '../Themes'

import {
  AppUpdate
} from '../Models'

import Logger from '../Lib/Logger'

import InvestorScoreView from './InvestorScoreView'
import BrokerView from './BrokerView'
import ProfileSocialView from './ProfileSocialView'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import styles from './Styles/AppUpdateScreenStyle'

import RNExitApp from 'react-native-exit-app';
// Styles

// I18n
// import I18n from 'react-native-i18n'

class AppUpdateScreen extends React.Component {

  state: {
    size: {
      width: number,
      height: number,
    }
  }

  constructor (props) {
    super(props)

    const { appUpdate } = props
    this.state = {
      appUpdate: appUpdate,
      size: Metrics.dimensions
    }
  }

  componentWillReceiveProps (newProps) {

  }

  componentWillMount () {

  }

  componentWillUnmount () {

  }

  onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({ size: { width: layout.width, height: layout.height } })
  }



  onActionPress = () => {

    // Check to see if we were asked to gracefully terminate
    if (this.state.appUpdate.sysActionSecondaryText === 'TERMINATE') {
      RNExitApp.exitApp();
    }
    else {
      var appUrl = this.state.appUpdate.sysAppUrl
      Linking.canOpenURL(appUrl).then(supported => {
          supported && Linking.openURL(appUrl)
      }, (err) => Logger.log({ function: 'AppUpdateScreen.onActionPress', err: err }))
    }
  }

  onActionSecondaryPress = () => {
    NavigationActions.offerings()
  }

  renderSecondaryAction () {
  	if (!this.state.appUpdate.sysIsUpdateRequired){
  		return (
  			<TouchableOpacity onPress={this.onActionSecondaryPress.bind(this)} style={{ height: 40}}>
              <View  style={styles.ComponentView}>
                <Text style={styles.TextStyle1}>{this.state.appUpdate.sysActionSecondaryText}</Text>
              </View>
        </TouchableOpacity>
      )
  	} else {
  		return (null)
  	}
  }

  render () {
    // const children = this.state.navigationState.children
    const { size } = this.state
    if(Platform.OS === 'android'){
      var logoTopHeight = StatusBar.currentHeight
    } else {
      var logoTopHeight = 20
    }

    const logo = { uri: 'https:' + this.state.appUpdate.sysImage }
    return (
      <View onLayout={this.onLayoutDidChange} style={{ flex: 1 }}>
        <View  style={size} >
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              <Image source={logo} style={{ alignSelf: 'center', resizeMode: 'contain', width:128, height: 128, marginTop: (30 + logoTopHeight), marginBottom: 30 }} />


              <View style={styles.ViewStyle1}>
                <View style={{}}>
                  <Text style={{ fontFamily: Fonts.type.black, color: Colors.twilightBlue, fontSize: size.width / 11 }}>{this.state.appUpdate.sysTitle}</Text>
                </View>

                <TouchableOpacity onPress={this.onActionPress.bind(this)} style={{ height: 40, marginVertical: 20}}>
                    <LinearGradient colors={[Colors.greenYellow, Colors.greenBlue]} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}} style={[{ flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', position: 'absolute', borderRadius: 50, left: 0, right: 0}]}>
                      <Text style={{ fontFamily: Fonts.type.chivo, fontWeight:'bold', fontSize: 16, color: Colors.white, textAlign: 'center', backgroundColor: Colors.clear }}>{this.state.appUpdate.sysActionText}</Text>
                    </LinearGradient>
                </TouchableOpacity>
                { this.renderSecondaryAction() }

                <View style={{ marginVertical: 18 }}>
                  <Text style={{ fontFamily: Fonts.type.chivo, fontSize: 16, lineHeight: 24, color: Colors.twilightBlue }}>{this.state.appUpdate.sysDescription}</Text>
                </View>

              </View>


            </ScrollView>
          </View>

        </View>

      </View>
    )
  }

}


const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppUpdateScreen)
