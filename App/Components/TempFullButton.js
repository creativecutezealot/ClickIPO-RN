


import React from 'react'
import PropTypes from 'prop-types';

import {
  Colors
} from '../Themes/'

import { View, TouchableHighlight, Text } from 'react-native'
import styles from './Styles/TempFullButtonStyle';
import ExamplesRegistry from '../Services/ExamplesRegistry'
import LinearGradient from 'react-native-linear-gradient'


export default class FullButton extends React.Component {
  getText() {
    const buttonText = this.props.text || this.props.children || ''

    return buttonText
  }

  render() {
    const { fontStyle, buttonStyle, buttonTextStyle, disabled, onPress, underlayColor = Colors.deepBooger, buttonType = 'ipo' } = this.props
    const baseButtonStyle = disabled ? styles.buttonDisabled : styles.button
    const baseButtonTextStyle = disabled ? styles.buttonTextDisabled : styles.buttonText

    var gstart = Colors.greenYellow
    var gend = Colors.greenBlue
    if (disabled) {
      gstart = Colors.boogerWashed
      gend = Colors.boogerWashed
    }


    if (buttonType === 'secondary') {
      gstart = Colors.seaFoam
      gend = Colors.tealishLite
      if (disabled) {
        gstart = Colors.tealishWashed
        gend = Colors.tealishWashed
      }
    }

    return (
      <LinearGradient style={[baseButtonStyle, buttonStyle, { height: 40 }]} colors={[gstart, gend]} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 0.0 }} >
        <TouchableHighlight style={[baseButtonStyle, buttonStyle, { borderWidth: 0, marginRight: 0, marginLeft: 0, padding: 0, height: 40 }]} underlayColor={underlayColor} disabled={disabled} onPress={onPress}>
          <Text style={[baseButtonTextStyle, buttonTextStyle]}>{this.getText()}</Text>
        </TouchableHighlight>
      </LinearGradient>


    )
  }
}


// Example
ExamplesRegistry.addComponentExample('FullButton', () =>
  <FullButton
    text='FullButton'
    onPress={() => window.alert('FullButton Pressed!')}
  />
)
