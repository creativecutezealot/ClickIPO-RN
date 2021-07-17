import React from 'react'
import {View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity} from "react-native"
// import Button from "react-native-button"
import {Actions} from "react-native-router-flux"

import {
  Images,
  Colors,
  Metrics,
  Fonts,
  ApplicationStyles
} from '../Themes'
import Styles from './Styles/ErrorViewStyle'

import Logger from '../Lib/Logger'

var {
  height: deviceHeight
} = Dimensions.get("window")

var styles = StyleSheet.create({
  container: {
    position: "absolute",
    top:0,
    bottom:0,
    left:0,
    right:0,
    backgroundColor:"transparent",
    justifyContent: "center",
    alignItems: "center",
  },
})

class ErrorView extends React.Component {
  constructor(props){
    super (props)

    this.state = {
      offset: new Animated.Value(-deviceHeight)
    }
  }

  componentWillMount(){

  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start()
  }

  closeModal() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: -deviceHeight
    }).start(Actions.pop)
  }

  render(){
    return (
      <Animated.View style={[styles.container, {backgroundColor:"rgba(52,52,52,0.5)"}, {transform: [{translateY: this.state.offset}]}]}>
        <View style={Styles.Component}>
          <Text>{this.props.data}</Text>
          <TouchableOpacity onPress={this.closeModal.bind(this)} style={Styles.TouchableOpacity}>
            <Text style={Styles.Close}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
}

export default ErrorView
