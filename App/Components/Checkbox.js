


import React from 'react'
import PropTypes from 'prop-types';
import {
  // StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight
} from 'react-native'

import {Images, Colors} from '../Themes'
import styles from './Styles/CheckboxStyle'

import Logger from '../Lib/Logger'

const CHECKBOX_IMAGE = Images.checkbox
const CHECKBOX_CHECKED_IMAGE = Images.checkboxChecked

export default class Checkbox extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.onChange = this.onChange.bind(this)

    this.state = {
      internalChecked: false
    }
  }

  onChange (e) {
    const event = e.nativeEvent
    // Logger.log({ name: 'Checkbox.onChange()', value: event })

    if (this.props.onChange && typeof this.props.checked === 'boolean') {
      this.props.onChange(this.props.checked)
    } else {
      let internalChecked = this.state.internalChecked

      if (this.props.onChange) {
        this.props.onChange(internalChecked)
      }
      this.setState({
        internalChecked: !internalChecked
      })
    }
  }

  render () {
    let container = (
      <View style={this.props.containerStyle || styles.container}>
        <Image
          style={this.props.checkboxStyle || styles.checkbox}
          source={source} />
          <View style={styles.labelContainer}>
            <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
          </View>
        </View>
      )

      let source

      if (typeof this.props.checked === 'boolean') {
        source = this.props.checked ? this.props.checkedImage : this.props.uncheckedImage
      } else {
        source = this.state.internalChecked ? this.props.checkedImage : this.props.uncheckedImage
      }

      if (this.props.labelBefore) {
        container = (
          <View style={this.props.containerStyle || [styles.container, styles.flexContainer]}>
            <View style={styles.labelContainer}>
              <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
            </View>
            <Image
              style={[styles.checkbox, this.props.checkboxStyle]}
              source={source} />
            </View>
          )
        } else {
          container = (
            <View style={[styles.container, this.props.containerStyle]}>
              <Image
                style={[styles.checkbox, this.props.checkboxStyle]}
                source={source} />
                <View style={styles.labelContainer}>
                  <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
                </View>
              </View>
            )
          }

          return (
            <TouchableHighlight onPress={this.onChange} underlayColor={this.props.underlayColor} style={styles.flexContainer}>
              {container}
            </TouchableHighlight>
          )
        }
      }

      Checkbox.propTypes = {
        label: PropTypes.string,
        labelBefore: PropTypes.bool,
        labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
        labelLines: PropTypes.number,
        checkboxStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
        containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
        checked: PropTypes.bool,
        checkedImage: PropTypes.number,
        uncheckedImage: PropTypes.number,
        underlayColor: PropTypes.string,
        onChange: PropTypes.func
      }

      Checkbox.defaultProps = {
        label: 'Label',
        labelLines: 1,
        labelBefore: false,
        checked: false,
        checkedImage: CHECKBOX_CHECKED_IMAGE,
        uncheckedImage: CHECKBOX_IMAGE,
        underlayColor: Colors.clear
      }
