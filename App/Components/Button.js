

import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ButtonStyle'
import ExamplesRegistry from '../Services/ExamplesRegistry'

export default class Button extends React.Component {
  props: ButtonProps

  getText () {
    const buttonText = this.props.text || this.props.children || ''

    return buttonText
  }

  render () {
    return (
      <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.getText()}</Text>
      </TouchableOpacity>
    )
  }
}

type ButtonProps = {
  onPress: () => void,
  text?: string,
  children?: string,
  navigator?: Object
}

Button.defaultProps = {
  text: 'Submit'
}

// Example
ExamplesRegistry.addComponentExample('Button', () =>
  <Button
    text='Button'
    onPress={() => window.alert('Button Pressed!')}
  />
)
