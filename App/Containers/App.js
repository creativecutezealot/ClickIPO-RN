import '../Config'
import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Text, NetInfo, View, Image } from 'react-native'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import AppConfig from '../Config/AppConfig'

import Logger from '../Lib/Logger'
import styles from './Styles/AppStyle'

import {Images, Colors, Metrics, Fonts, ApplicationStyles} from '../Themes'

// create our store
const store = createStore()

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * Added the network check here to not create redux if the user does not have
 * an active network connection
 *
 * We separate like this to play nice with React Native's hot reloading.
 */

class App extends Component {
	constructor() {
		super()
    //Text.defaultProps.allowFontScaling = AppConfig.allowTextFontScaling
    this.state={
      status: true
    }
  }

//   componentDidMount() {
//   NetInfo.isConnected.addEventListener('change', this.handleConnectionChange);

//   NetInfo.isConnected.fetch().done(
//     (isConnected) => { this.setState({ status: isConnected }); }
//   );
// }

// //event listener should not be removed because we need to listen in the entire app if the user is connected to a network
// componentWillUnmount() {
//   NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
// }

//   handleConnectionChange = (isConnected) => {
//     this.setState({ status: isConnected });
//     console.log(`is connected: ${this.state.status}`);
//   }

  render () {
    if (this.state.status) {
      return (
        <Provider store={store}>
          <RootContainer />
        </Provider>
      );
    } else {
      return (
        <View style={{backgroundColor: Colors.boogerWashed, flex: 1}}>
          <View style={[ApplicationStyles.marqueeContainer]}>
            <Image source={Images.logoTop} style={styles.ImageStyle} />
            <Text style={styles.TextStyle}>No network detected. Please connect to WiFi or Cellular Network to continue.</Text>
          </View>
        </View>
      );
    }
  }
}


export default App
