

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  // ScrollView,
  View,
  Text,
  // Image,
  // AsyncStorage,
  BackHandler,
  StatusBar,
  Platform,
  Button,
  TouchableOpacity,
  Linking,
  WebView
} from 'react-native'

import { connect } from 'react-redux'
import UserActions from '../Redux/UserRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import SafariView from 'react-native-safari-view';
import {CustomTabs} from 'react-native-custom-tabs';
import DrawerButton from '../Components/DrawerButton'
import DeviceInfo from 'react-native-device-info'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import {
  Colors,
  Fonts,
  Icons,
} from '../Themes'

import stylesButton from '../Components/Styles/DrawerButtonStyles'
import Styles from './Styles/DrawerContentStyle'

import Logger from '../Lib/Logger'

class DrawerContent extends Component {

  state: {
    user: Object,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'DrawerContent.componentWillMount()', props: props })

    const { user = null, status = false } = props

    this.state = {
      user: user,
      isOfferingsActive: true,
      isEducationActive: false,
      isMyAccountActive: false,
      isInvestorScoreActive: false,
      status: status, // TODO check what this is and remove, it is not called in this file
      privacyButtonClicked: false
    }
  }

  componentDidMount () {
    // Logger.log({ name: 'DrawerContent.componentDidMount()' })
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.context.drawer.props.open) {
        this.toggleDrawer()
        return true
      }
      return false
    })
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'DrawerContent.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'DrawerContent.componentWillReceiveProps()', value: newProps })
    const { user } = newProps
    this.setState({ user: user })
  }

  toggleDrawer () {
    this.context.drawer.toggle()
  }

  handlePressOfferings = () => {
    this.toggleDrawer()
    NavigationActions.offerings()
    this.setState({
      isOfferingsActive: true,
      isEducationActive: false,
      isMyAccountActive: false,
      isInvestorScoreActive: false
    });
  }

  handlePressMyAccount = () => {
    this.toggleDrawer()
    NavigationActions.profileView()
    this.setState({
      isOfferingsActive: false,
      isEducationActive: false,
      isMyAccountActive: true,
      isInvestorScoreActive: false
    });
  }

  handlePressEducation = () => {
    this.toggleDrawer()
    NavigationActions.education()
    this.setState({
      isOfferingsActive: false,
      isEducationActive: true,
      isMyAccountActive: false,
      isInvestorScoreActive: false
    });
  }

  handlePressInvestorScore = () => {
    this.toggleDrawer()
    NavigationActions.investorScore()
    this.setState({
      isOfferingsActive: false,
      isEducationActive: false,
      isMyAccountActive: false,
      isInvestorScoreActive: true
    });
  }

  handlePressSignout = () => {
    this.toggleDrawer()
    this.props.signout()
  }

  handlePressCloseMenu = () => {
    this.toggleDrawer()
  }

  /*
    Development Views
  */

  handlePressComponents = () => {
    this.toggleDrawer()
    NavigationActions.componentExamples()
  }

  handlePressUsage = () => {
    this.toggleDrawer()
    NavigationActions.usageExamples()
  }

  handlePressAPI = () => {
    this.toggleDrawer()
    NavigationActions.apiTesting()
  }

  handlePressTheme = () => {
    this.toggleDrawer()
    NavigationActions.theme()
  }

  handlePressDevice = () => {
    this.toggleDrawer()
    NavigationActions.deviceInfo()
  }

  handlePressPending = () => {
    this.toggleDrawer()
    NavigationActions.detailViewModal({content: 'waitlist'})
  }

  helpButton = () => {
    Linking.openURL('https://help.clickipo.com')
  }

  termsButton = () => {
    if(Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({
          url: 'https://clickipo.com/terms-conditions'
        }))
        .catch(error => {
          console.error('Unable to open this link. Please try again later');
        });
    } else if (Platform.OS === 'android') {
      try {
        CustomTabs.openURL(
          'https://clickipo.com/terms-conditions'
        )
      }
      catch(error) {
        console.error('Unable to open this link. Please try again later', error)
      }
    }
  }

  privacyButton = () => {
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({
          url: 'https://clickipo.com/privacy-policy'
        }))
        .catch(error => {
          console.error('Unable to open this link. Please try again later');
        });
    } else if (Platform.OS === 'android') {
      try {
        CustomTabs.openURL(
          'https://clickipo.com/privacy-policy'
        )
      }
      catch (error) {
        console.error('Unable to open this link. Please try again later', error)
      }
    }
  }

  render () {
    const { user } = this.state

    const userGreeting = (user) ? user.firstName + ' ' + user.lastName : ''
    const headerHeight = Platform.OS === 'ios' ? 129 : 95 + StatusBar.currentHeight;

    const appVersion = 'v' + DeviceInfo.getReadableVersion()

    waitListStatus = () => {
      if(this.props.restrictedPerson === 1){
        return (
          <View style={{backgroundColor: Colors.clear, flexDirection: 'row'}}>
          {/* we used to navigate the user to the detailViewModal and that was when we were in Beta testing. Discuss and remove if needed */}
            {/* <Text style={Styles.TextStyle} onPress={this.handlePressPending}>Status: <Text style={Styles.TextStyle1}>Restricted</Text></Text> */}
            <Text style={Styles.TextStyle}> Status: <Text style={Styles.TextStyle1}> Restricted </Text></Text>
          </View>
        )
      } else {
        return null
      }

    }
    
      /*  */
      return (
        <View style={Styles.Container}>
          <View style={Styles.ViewStyle}>
            <View>
              <View style={Styles.ViewStyle2}>
              <Text style={Styles.TextStyle2} >{userGreeting}</Text>
                {waitListStatus()}
              </View>
  
              <View style={[{marginTop: 24 }]}>
                <DrawerButton text='Offerings' active={this.state.isOfferingsActive} icon={Icons.listWhite} onPress={this.handlePressOfferings} />
                <DrawerButton text='My account' active={this.state.isMyAccountActive} icon={Icons.profileWhite} onPress={this.handlePressMyAccount} />
                <DrawerButton text='Investor score' active={this.state.isInvestorScoreActive} icon={Icons.investorScoreWhite} onPress={this.handlePressInvestorScore} />
                <DrawerButton text='Education' active={this.state.isEducationActive} icon={Icons.docWhite} onPress={this.handlePressEducation} />
                <DrawerButton text='Sign out' icon={Icons.signoutWhite} onPress={this.handlePressSignout} />
              </View>
            </View>
  
            <View style={{ flexDirection: 'column'}}>
              <DrawerButton text='Terms and conditions' onPress={this.termsButton}/>
              <DrawerButton text='Privacy Policy' onPress={this.privacyButton}/>
              <DrawerButton text='Help' onPress={this.helpButton}/>
            </View>
  
          </View>
  
          <View style={Styles.ViewStyle3}>
            <View>
              <View style={Styles.ViewStyle4}>
                <ClickIcon name='icon-x'
                  size={26}
                  color={Colors.blueSteel}
                  style={{fontWeight:'bold'}}
                />
              </View>
            </View>
  
            <View>
  
              <Text style={[stylesButton.text, {fontFamily: Fonts.type.chivo, fontSize:12, color: Colors.blueSteel, fontWeight:'bold', alignSelf:'flex-end', paddingRight:6}]}>{appVersion}</Text>
  
            </View>
  
          </View>
  
        </View>

      )
    } 
}


DrawerContent.propTypes = {
  user: PropTypes.object,
  signout: PropTypes.func
}

DrawerContent.contextTypes = {
  drawer: PropTypes.object,
  routes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    restrictedPerson: state.user.restrictedPerson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signout: () => dispatch(UserActions.signout()),
    drawerToggle: (data) => dispatch(NavigationActions.drawerToggle(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent)
