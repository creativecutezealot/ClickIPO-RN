

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/DrawerButtonStyles'

import Icon from 'react-native-vector-icons/Ionicons'

import {
  Colors,
  Fonts
} from '../Themes'

import ExamplesRegistry from '../Services/ExamplesRegistry';

class DrawerButton extends Component {
  props: DrawerButtonProps

  render () {
    const toggleButtonColor = this.props.active ? 'rgba(255,255,255,.2)' : Colors.clear
    const toggleTextColor = this.props.active ? 'rgba(255,255,255,1)' : Colors.drawerTextInactive
    const toggleOpacity = this.props.active ? 1 : 0.5
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[{ flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: toggleButtonColor, borderBottomLeftRadius: 4, borderTopLeftRadius: 4 }]}>
          <View style={[{ width: 56, justifyContent: 'center', alignItems: 'center' }]}>
            <Image resizeMode='contain' style={[{ height: 24, opacity: toggleOpacity }]} source={this.props.icon} />
          </View>

          <View style={[{ flex: 1, justifyContent: 'center' }]}>
            <Text style={[styles.text, {color: toggleTextColor, fontWeight:'bold'}]}>{this.props.text}</Text>
          </View>
        </View>

      </TouchableOpacity>
    )
  }
}

type DrawerButtonProps = {
  text: string,
  icon: string,
  onPress: () => void
}

// Example
ExamplesRegistry.addComponentExample('Drawer Button', () =>
  <DrawerButton
    text='DrawerButton (aka MenuButton)'
    onPress={() => window.alert('DrawerButton Pressed!')}
  />
)

export default DrawerButton
