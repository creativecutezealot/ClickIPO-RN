import React from 'react'
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native'
import { connect } from 'react-redux'
import {
  ApplicationStyles
} from '../Themes'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import SettingsActions from '../Redux/SettingsRedux'
import StartupActions from '../Redux/StartupRedux'
import NotificationActions from '../Redux/NotificationRedux'


import {
  // Token,
  // User,
  // ClickIpoError,
  Fob
} from '../Models'

import LoadingView from '../Components/LoadingView'
import EnableTouchIdView from '../Containers/EnableTouchIdView'
import EnableNotificationsView from '../Containers/EnableNotificationsView'
import DeviceInfo from 'react-native-device-info'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class InitSessionController extends React.Component {

  state: {
    fob: Fob,
    touchIdSupported: Boolean,

    notificationsEnabled: Boolean,
    notificationsPrompt: Boolean,

    touchIdEnabled: Boolean,
    touchIdPrompt: Boolean,
  }

  currentPage :0;

  constructor (props) {
    super(props)

    Logger.log({ name: 'InitSessionController.constructor()', props: props })

    const { fob, touchIdSupported = false } = this.props
    // Logger.log({ name: 'InitSessionController.constructor()', fob: fob, touchIdSupported: touchIdSupported })

    this.state = {
      fob: fob,
      touchIdSupported: false,

      notificationsEnabled: fob.notificationsEnabled,
      notificationsPrompt: fob.notificationsPrompt,

      touchIdEnabled: true,
      touchIdPrompt: false
    }

    // touchIdEnabled: fob.touchIdEnabled,
    // touchIdPrompt: (touchIdSupported && fob.touchIdPrompt)

    if (props.notificationsPrompt){
      this.state.notificationsPrompt = props.notificationsPrompt
    }

    // if (props.touchIdPrompt){
    //   this.state.touchIdPrompt = props.touchIdPrompt
    // }

    if (props.id){
      this.currentPage = props.id
    }

  }

  componentWillMount = () => {
    // Logger.log({ name: 'InitSessionController.componentWillMount()' })

      if(Platform.OS == 'android' && this.state.notificationsPrompt == true) {
        const notifications = {
          notificationsPrompt: false,
          notificationsEnabled: true
        }
        this.props.requestPermissions()
        this.props.updateNotifications(notifications)
      }
      this.navigate()

  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'InitSessionController.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    Logger.log({ name: 'InitSessionController.componentWillReceiveProps()', newProps: newProps, props:this.props })

    const { fob, touchIdSupported } = newProps

    // touchIdEnabled: fob.touchIdEnabled,
    // touchIdPrompt: (touchIdSupported && fob.touchIdPrompt),

    this.setState({
      fob: fob,

      touchIdSupported: false,
      touchIdEnabled: true,
      touchIdPrompt: false,

      notificationsEnabled: fob.notificationsEnabled,
      notificationsPrompt: fob.notificationsPrompt
    })

    this.navigate()

    // Logger.log({ name: 'InitSessionController.componentWillReceiveProps()', state: this.state })
  }

  navigate = () => {
    const { notificationsPrompt, touchIdPrompt } = this.state

    // const appUpdate = this.props.appUpdate

    // if( DeviceInfo.getVersion() !== appUpdate.sysValue && (appUpdate.sysIsUpdateRequired || appUpdate.sysIsDisplayRequired)){
    //   NavigationActions.appUpdate({appUpdate})
    // } else 
    
    if (!notificationsPrompt && !touchIdPrompt) {
      this.props.requestPermissions()

      // TODO: check for deeplinks
      //Logger.log({ name: 'Inside InitSessionController.navigate() method ' })


      //after a successful login this is the call that takes us to the offerings page
      NavigationActions.offerings()


      if ( this.props.deeplink && this.props.deeplink.linkType ) {
        // console.warn('1 in ISC')
        const url = this.props.deeplink.linkType
        const urlArray = url.split('/')
        const route = urlArray[0]
        const urlArraySize = urlArray.length
            if (route === 'login'){
              NavigationActions.login()
            } else if (route === 'register'){
              NavigationActions.register()
            } else if (route === 'brokerages'){
              NavigationActions.account({brokerages: true})
            } else if (route === 'social'){
              NavigationActions.account({social: true})
            } else if (route === 'nav') {
            } else if (route === 'search') {
            } else if (route === "order_reconfirmation") {
              NavigationActions.orderReconfirmation({ orderId: urlArray[1] });
            } else if (route === 'update-offerings') {
              //TODO: change to pass the entire array to the newOfferingView once the api for multiple offerings is completed.
              const arrOfExtIDs = JSON.parse(this.props.deeplink.notification.offering_ext_id)
              NavigationActions.newOfferingView({offeringExtID: arrOfExtIDs[0]});
            } else if (route === 'new-offerings') {
              NavigationActions.newOfferingsView()
            } else if (route == 'offerings') {
              if (urlArraySize === 2) {
           
                if(urlArray[1].includes('offer_id')) {
                  const subRouteArray = urlArray[1].split('=')
                  // if subRouteArray has the ampersand sign split by that and only send the ext_id to the offeringDetailsNotification component
                  if(subRouteArray[1].includes('&')) {
                    const extIDSeparated = subRouteArray[1].split('&');
                    NavigationActions.offeringDetailsNotification({ offering_ext_id: extIDSeparated[0] });  
                  } else {
                    NavigationActions.offeringDetailsNotification({ offering_ext_id: subRouteArray[1] });
                  }

                } else {
                  NavigationActions.offeringDetailsNotification({offering_ext_id: urlArray[1]});
                }
              }
            } else if (route === 'offering'){

              if (urlArraySize === 1){
                NavigationActions.offerings()
              } else if (urlArraySize === 2){

                const subRoute = urlArray[1]

                if (subRoute === 'following'){
                  NavigationActions.offerings({following:true})
                } else if (subRoute === 'orders'){

                } else {
                  NavigationActions.offerings({id: urlArray[1]})
                }

              } else if (urlArraySize === 3){

                const subRoute = urlArray[1]

                if (subRoute === 'following'){

                } else if (subRoute === 'orders'){

                } else {
                  const subRoute2 = urlArray[2]
                  if (subRoute2 === 'prospectus'){
                    NavigationActions.offeringDetails({id: urlArray[1], prospectus: true})
                  } else if (subRoute2 === 'share-st'){
                    NavigationActions.offeringDetails({id: urlArray[1],startShare:'st'})
                  } else if (subRoute2 === 'share-fb'){
                    NavigationActions.offeringDetails({id: urlArray[1],startShare:'fb'})
                  } else if (subRoute2 === 'share-tw'){
                    NavigationActions.offeringDetails({id: urlArray[1],startShare:'tw'})
                  } else if (subRoute2 === 'order'){
                    NavigationActions.orderCreate({ id: urlArray[1], placeOrder: true})
                  } else {

                  }
                }
              } else {

              }

            } else if (route === 'support'){

              if (urlArraySize === 2){

                const subRoute = urlArray[1]

                if (subRoute === 'waitlist'){
                  NavigationActions.detailViewModal({content: 'waitlist'})
                } else {

                }

              } else if (urlArraySize === 3){

                const subRoute = urlArray[1]

                if (subRoute === 'investor-score'){
                  const subRoute2 = urlArray[2]

                  if (subRoute2 === 'how-it-works'){
                    NavigationActions.investorScore()
                  } else if (subRoute2 === 'faq'){
                    NavigationActions.investorScore({'faq':true})
                  } else {

                  }

                } else if (subRoute === 'edu'){

                  const subRoute2 = urlArray[2]
                  if (subRoute2 === 'glossary'){
                    NavigationActions.education()
                  } else if (subRoute2 === 'article'){
                    NavigationActions.education({'article':true})
                  } else if (subRoute2 === 'faq'){
                    NavigationActions.education({'faq':true})
                  } else {

                  }

                }
              } else if (urlArraySize === 4){
                const subRoute = urlArray[1]

                if (subRoute === 'edu'){
                  const subRoute2 = urlArray[2]

                  if (subRoute2 === 'article'){
                    NavigationActions.articleDetails({article:{id:urlArray[3]}})
                  } else if (subRoute2 === 'glossary'){

                  } else {

                  }

                }  else {

                }
              } else {

              }
            } else {

            }

      } else {

      }

      /***
      if(this.props.deeplink){
        NavigationActions.newOfferingsView()
      }
      ***/

    }

  }

  render () {
    // Logger.log({ name: 'InitSessionController.render()', state: this.state })

    const { touchIdSupported, touchIdPrompt, notificationsPrompt } = this.state

    // <EnableNotificationsView />

    if (touchIdSupported && touchIdPrompt) {
      return (
        <EnableTouchIdView />
      )
    } else if (notificationsPrompt) {
      return (
        <EnableNotificationsView title='Stay Updated' hideTabBar />
      )
    } else {
      return (
        <LoadingView style={{ flex: 1 }} isLoading>
          <View style={[ApplicationStyles.mainContainer]} />
        </LoadingView>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    fob: state.settings.fob,
    touchIdSupported: state.settings.touchIdSupported,
    deeplink: state.startup.deeplink,
    offerings: state.offering.offerings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNotifications: (data) => dispatch(SettingsActions.updateNotifications(data)),
    requestPermissions: (data) => dispatch(NotificationActions.requestPermissions(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitSessionController)
