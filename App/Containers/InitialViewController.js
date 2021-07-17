import React from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import StartupActions from '../Redux/StartupRedux'

import {
  ApplicationStyles
} from '../Themes'

import LoadingView from '../Components/LoadingView'

// Styles

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class InitialViewController extends React.Component {

  state: {
    startupComplete: Boolean,
    showIntro: Boolean,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'InitialViewController.constructor()', props: props })

    const { startupComplete = false, showIntro = true } = props

    this.state = {
      startupComplete: startupComplete,
      showIntro: showIntro
    }
  }

  componentWillMount = () => {
    // this.props.serverStatus();
    this.props.appStatus();

    this.navigate()
    // Logger.log({ name: 'InitialViewController.componentWillMount()' })
  }

  componentDidMount = () => {
    // Logger.log({ name: 'InitialViewController.componentDidMount()' })
  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'InitialViewController.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'InitialViewController.componentWillReceiveProps()', newProps: newProps })
    const { startupComplete, showIntro } = newProps
    this.setState({
      startupComplete: startupComplete,
      showIntro: showIntro
    }, this.navigate)
  }

  navigate = () => {
    const { startupComplete = false, showIntro = true } = this.state;
    const { startupFetching, startupError, serverStatusResponse, appStatusError, appStatusResponse } = this.props;


    //if we are not fetching any api for the startup process and there is no error for the appStatusError and we have a response for the appStatusResponse
    // TODO rewrite this if block below to make it less confusing. 
    if (!startupFetching && !appStatusError && appStatusResponse) {
      if (startupComplete) {
        if (DeviceInfo.getVersion() !== appStatusResponse.sysValue && (appStatusResponse.sysIsUpdateRequired || appStatusResponse.sysIsDisplayRequired)) {
          NavigationActions.appUpdate({ appUpdate: appStatusResponse });
        } else if (showIntro) {
          NavigationActions.intro();
        } else {
          NavigationActions.login();
        }
      }
    } else {
      if (appStatusError) {
        NavigationActions.serverMaintenance({ errorMessage: appStatusError.error });
      }
    }


    // if (!startupFetching && !startupError && serverStatusResponse == 201) {
    //   if (startupComplete) {
    //     if (showIntro) {
    //       NavigationActions.intro()
    //     } else {
    //       NavigationActions.login()
    //     }
    //   }
    // } else {
    //   if (startupError) {
    //     NavigationActions.serverMaintenance({errorMessage: startupError.error});
    //   }
    // }

  }

  render () {
    return (
      <LoadingView style={{ flex: 1 }} isLoading>
        <View style={[ApplicationStyles.mainContainer]} />
      </LoadingView>
    );
  }
}

InitialViewController.propTypes = {
  showIntro: PropTypes.bool
}

const mapStateToProps = (state) => {
  return {
    startupComplete: state.startup.startupComplete, // has the startup process been completed
    showIntro: state.settings.showIntro, // to show the intro message
    // serverStatusResponse: state.startup.serverStatus,
    appStatusResponse: state.startup.appStatus, // response from the appStatus
    appStatusError: state.startup.appStatusError, //did the appStatus api return any error
    // startupError: state.startup.error,
    startupFetching: state.startup.fetching // if any api is being called during startup
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // serverStatus: () => dispatch(StartupActions.serverStatus()),
    appStatus: () => dispatch(StartupActions.appStatus()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialViewController)