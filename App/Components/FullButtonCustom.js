


import React from 'react'
import PropTypes from 'prop-types';

import {
  Colors
} from '../Themes/'

import { View, TouchableHighlight, Text } from 'react-native'
import styles from './Styles/FullButtonStyle'
import ExamplesRegistry from '../Services/ExamplesRegistry'

export default class FullButtonCustom extends React.Component {
  getText () {
    const buttonText = this.props.text || this.props.children || ''

    return buttonText
  }

  render () {
    const { buttonStyle, buttonTextStyle, disabled, onPress } = this.props
    const baseButtonStyle = disabled ? styles.buttonDisabled : styles.button
    const baseButtonTextStyle = disabled ? styles.buttonTextDisabled : styles.buttonText

    return (
      <TouchableHighlight style={[baseButtonStyle, buttonStyle]} underlayColor={Colors.deepBooger} onPress={onPress}>
          <Text style={[baseButtonTextStyle, buttonTextStyle]}>{this.getText()}</Text>
      </TouchableHighlight>
    )
  }
}

FullButtonCustom.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  buttonStyle: PropTypes.object,
  buttonTextStyle: PropTypes.object,

  children: PropTypes.string,
  navigator: PropTypes.object,
  disabled: PropTypes.bool
}

FullButtonCustom.defaultProps = {
  text: 'Submit',
  disabled: false,
  buttonStyle: {},
  buttonTextStyle: {}
}

// Example
ExamplesRegistry.addComponentExample('FullButton', () =>
  <FullButtonCustom
    text='FullButton'
    onPress={() => window.alert('FullButton Pressed!')}
  />
)