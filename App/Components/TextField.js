


import React from 'react'
import PropTypes from 'prop-types';
import {
  Animated,
  // Easing,
  // Text,
  TextInput,
  TouchableWithoutFeedback,
  View
  // StyleSheet
} from 'react-native'
import styles from './Styles/TextFieldStyle'

import BaseInput from './BaseInput'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import {
  Colors
} from '../Themes/'

import Logger from '../Lib/Logger'

export default class TextField extends BaseInput {

  state = {
                icEye: 'icon-eye-off',
                password: true
            }

  changePwdType = () => {

        let newState;
        if (this.state.password) {
            newState = {
                icEye: 'icon-eye',
                password: false
            }
        } else {
            newState = {
                icEye: 'icon-eye-off',
                password: true
            }
        }

        this.setState(newState)

    };

  renderShowPasswordIcon (isPassword) { 
    if(isPassword){
        return (
        
        <TouchableWithoutFeedback onPress={this.changePwdType}>
          <View  style={ styles.ViewStyle }>
            <ClickIcon
              name={this.state.icEye}
              color = {Colors.booger}
              size = {20} />
          </View>
        </TouchableWithoutFeedback>

        )
    } else {
      return (null)
    }
  }

  renderValidatedIcon () {
    const {
      showValidated,
      validated
    } = this.state

    if (showValidated) {
      const {
        height: inputHeight
      } = this.props

      const validatedIconName = validated ? 'icon-check' : 'icon-x'
      const validatedIconStyle = [styles.validatedIcon] // validated ? Colors.valid : Colors.invalid
      if (validated) {
        validatedIconStyle.push(styles.validIcon)
      } else {
        validatedIconStyle.push(styles.invalidIcon)
      }

      return (
        <TouchableWithoutFeedback onPress={this.focus} show={showValidated}>
          <View style={styles.ViewStyle2}>
            <ClickIcon
              name={validatedIconName}
              style={validatedIconStyle}
            />
          </View>
        </TouchableWithoutFeedback>
      )
    } else {
      return null
    }
  }

  renderIcon (iconClass, iconName){

  }

  render () {
    const {
      iconClass,
      iconColor,
      iconName,
      iconBackgroundColor,
      style: containerStyle,
      inputStyle,
      height: inputHeight,
      isPassword,
    } = this.props
    const {
      focusedAnim,
      value
    } = this.state    
    
    return (
      <View style={[styles.container, containerStyle]} onLayout={this._onLayout}>
        
        <TextInput
          ref='input'
          {...this.props}
          style={[styles.textInput, inputStyle]}
         
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
          placeholderTextColor= {Colors.lightGreyGreen}
          secureTextEntry={isPassword && this.state.password}
      />

        {this.renderShowPasswordIcon(isPassword)}
        {this.renderValidatedIcon()}
      </View>
    )
  }
}

// Prop type warnings
TextField.propTypes = {
  iconClass: PropTypes.func,
  iconName: PropTypes.string,
  iconColor: PropTypes.string
}

// Defaults for props
TextField.defaultProps = {
  iconColor: Colors.greyishBrown,
  height: 56,
  animationDuration: 200
}
