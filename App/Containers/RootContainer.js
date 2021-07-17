import React, { Component } from 'react'
import { View, StatusBar, AppState, Dimensions, Image, Platform, Text, BackHandler, Alert } from 'react-native'

import NavigationRouter from '../Navigation/NavigationRouter'

import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import { ACTIVE, BACKGROUND, INACTIVE } from '../Redux/AppStateRedux'

import ReduxPersist from '../Config/ReduxPersist'
import Toast from '../Components/Toast'
import LinearGradient from 'react-native-linear-gradient'

import {
  Images,
  Colors,
  ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'

class RootContainer extends Component {

  statusBarColor : String
  navBarImage : Image.propTypes.source

  constructor (props) {
    // Logger.log({ name: 'RootContainer.constructor()', props: props })
    super(props)

    const { appState = ACTIVE } = props

    this.state = {
      appState: props.appState
    }

    // if (Platform.OS === 'android'){
    //   this.statusBarColor = Colors.greenBlueDarker
    // } else {
    //   this.statusBarColor = Colors.white
    // }

    // if (Platform.OS === 'android'){
    //   this.navBarImage = Images.navigationBackgroundGreen
    // } else {
    //   this.navBarImage = null
    // }

    if (Platform.OS === 'android'){
      this.statusBarColor = Colors.clear
    } else {
      this.statusBarColor = Colors.white
    }

    if (Platform.OS === 'android'){
      this.navBarImage = null
    } else {
      this.navBarImage = null
    }

  }

  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    // Logger.log({ name: 'RootContainer.componentWillMount()', state: this.state })
  }

  componentDidMount = () => {
    // Logger.log({ name: 'RootContainer.componentDidMount()', state: this.state })

    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'RootContainer.componentWillReceiveProps()', newProps: newProps })

    const { appState } = newProps

    this.setState({ appState: appState }, this.render)
  }

  changeStatusBarColor = (statusBarColor) => {
    if (Platform.OS === 'android' ){
      //this.statusBarColor = statusBarColor
      //StatusBar.setBackgroundColor(statusBarColor)
    }
  }

  changeNavBarImage = (navBarImage) => {
    if (Platform.OS === 'android' ){
      //this.navBarImage = navBarImage
      //this.setState({ navBarImage: navBarImage })
    }
  }

  render = () => {

    return (
      <View style={ApplicationStyles.applicationView}>
        <StatusBar backgroundColor='white' barStyle='dark-content' />
        <NavigationRouter navBarImage= { this.navBarImage } changeNavBarImage={(navBarColor) => {this.changeNavBarImage(navBarColor)} }  changeStatusBarColor={(statusBarColor) => {this.changeStatusBarColor(statusBarColor)} } />
        {this.renderPrivacyView()}
        <Toast />
      </View>
    )
  }

  handleOK = () => {
    BackHandler.exitApp()
  }

  handleBackButtonClick = () => {
    Alert.alert(
      'Exiting App',
      'Are sure you want to close ClickIPO?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.handleOK()},
      ],
      { cancelable: false }
    )
    return true
  }


  renderPrivacyView = () => {
    // Logger.log({ name: 'RootContainer.renderPrivacyView()', state: this.state, privacyViewActive: (this.state.appState === BACKGROUND) })

    if (this.state.appState === BACKGROUND) {
      return (
        <LinearGradient colors={[Colors.twilightBlue, Colors.tealish]} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode='contain' source={Images.logo} />
        </LinearGradient>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    appState: state.appState.appState
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
