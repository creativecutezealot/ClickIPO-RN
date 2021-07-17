

import React from 'react'
import PropTypes from 'prop-types';

import {
  View,
  Platform,
  StatusBar
  // Text,
} from 'react-native'

import {
  // Images,
  Colors
  // Metrics,
  // Fonts
} from '../Themes'

// import styles from './Styles/LoadingViewStyle'

import Spinner from 'react-native-spinkit'

import LinearGradient from 'react-native-linear-gradient'

export default class LoadingView extends React.Component {


  componentWillUnmount() {
    StatusBar.setHidden(false);
  }

  render () {
    const { children, isLoading } = this.props

    // const gradientStart = Platform.OS === 'android' ? Colors.greenYellow : Colors.twilightBlue
    // const gradientEnd = Platform.OS === 'android' ? Colors.greenBlue : Colors.tealish


    StatusBar.setHidden(true);

    const gradientStart = Colors.greenYellow
    const gradientEnd = Colors.greenBlue

    if (isLoading) {
      return (
        <View style={[{ flex: 1 }]}>
          { children }

          <LinearGradient colors={[gradientStart, gradientEnd]} start={{x: 1.0, y: 0.0}} end={{x: 0.0, y: 1.0}} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner style={{ }} isVisible size={100} type='ThreeBounce' color='#FFFFFF' />
          </LinearGradient>
        </View>
      )
    } else {
      return (
        <View style={[{ flex: 1 }]}>
          { children }
        </View>
      )
    }
  }
}

// Prop type warnings
LoadingView.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

// Defaults for props
LoadingView.defaultProps = {
  isLoading: false
}
