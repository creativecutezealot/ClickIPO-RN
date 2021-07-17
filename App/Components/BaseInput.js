

import React from 'react'
import PropTypes from 'prop-types';

import {
  Animated,
  Text,
  View
} from 'react-native'

export default class BaseInput extends React.Component {
  state: {
    value: string,
    focusedAnim: string,
    validated: boolean,
    showValidated: boolean
  }

  constructor (props, context) {
    super(props, context)

    this._onLayout = this._onLayout.bind(this)
    this._onChange = this._onChange.bind(this)
    this._onBlur = this._onBlur.bind(this)
    this._onFocus = this._onFocus.bind(this)
    this.focus = this.focus.bind(this)

    const value = props.value || props.defaultValue
    const validated = props.validated || false
    const showValidated = props.showValidated || false

    this.state = {
      value,
      focusedAnim: new Animated.Value(value ? 1 : 0),
      validated,
      showValidated
    }
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()

    const newValue = newProps.value
    if (newProps.hasOwnProperty('value') && newValue !== this.state.value) {
      this.setState({
        value: newValue
      })

      // animate input if it's active state has changed with the new value
      // and input is not focused currently.
      const isFocused = this.refs.input.isFocused()
      if (!isFocused) {
        const isActive = Boolean(newValue)
        if (isActive !== this.isActive) {
          this._toggle(isActive)
        }
      }
    }

    const newValidated = newProps.validated
    if (newProps.hasOwnProperty('validated') && newValidated !== this.state.validated) {
      this.setState({
        validated: newValidated
      })
    }

    const newShowValidated = newProps.showValidated
    if (newProps.hasOwnProperty('showValidated') && newShowValidated !== this.state.showValidated) {
      this.setState({
        showValidated: newShowValidated
      })
    }
  }

  _onLayout (event) {
    this.setState({
      width: event.nativeEvent.layout.width
    })
  }

  _onChange (event) {
    this.setState({
      value: event.nativeEvent.text
    })

    const onChange = this.props.onChange
    if (onChange) {
      onChange(event)
    }
  }

  _onBlur (event) {
    if (!this.state.value) {
      this._toggle(false)
    }

    const onBlur = this.props.onBlur
    if (onBlur) {
      onBlur(event)
    }
  }

  _onFocus (event) {
    this._toggle(true)

    const onFocus = this.props.onFocus
    if (onFocus) {
      onFocus(event)
    }
  }

  _toggle (isActive) {
    this.isActive = isActive
    // Animated.timing(
    //   this.state.focusedAnim, {
    //     toValue: isActive ? 1 : 0,
    //     duration: this.props.animationDuration,
    //     easing: this.props.easing
    //   },
    // ).start()
  }

  // public methods

  inputRef () {
    return this.refs.input
  }

  focus () {
    this.inputRef().focus()
  }

  blur () {
    this.inputRef().blur()
  }

  isFocused () {
    return this.inputRef().isFocused()
  }

  clear () {
    this.inputRef().clear()
  }

}

BaseInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  style: PropTypes.style,
  inputStyle: PropTypes.style,
  labelStyle: PropTypes.style,
  easing: PropTypes.func,
  animationDuration: PropTypes.number,
  validated: PropTypes.bool,
  showValidated: PropTypes.bool,

  /* those are TextInput props which are overridden
  * so, i'm calling them manually
  */
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func
}
