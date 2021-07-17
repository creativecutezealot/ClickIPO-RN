import React from 'react'
import {View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions, Modal} from "react-native"
import { Actions as NavigationActions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient';
import Styles from './Styles/GenericModalStyle'

import {
  //Images,
  Colors,
  //Metrics,
  Fonts,
  //ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);


class GenericModal extends React.Component {

  constructor(props){
    super (props)
    this.state = {
    }
  }

  componentDidMount = () => {
    Logger.log({ name: 'OauthView.componentDidMount()' })
  }


  closeModal = () => {
    NavigationActions.pop()
  }


  render = () => {
    return (
      <Modal transparent={true} animationType='slide'>
      <View style={[styles.container, {backgroundColor:"rgba(52,52,52,0.5)", flex: 1}]}>
        <View style={Styles.Component}>
      <LinearGradient colors={[Colors.white, Colors.greenYellow]} style={Styles.LinearGradentstyle} >
          <View style={Styles.ViewStyle}>
                <ScrollView style={Styles.ScrollStyle}>
                  <View style={Styles.ViewStyle1}>
                        { this.props.children }
                  </View>
                </ScrollView>
          </View>
          <TouchableOpacity onPress={this.closeModal.bind(this)} style={Styles.TouchableOpacity}>
            <ClickIcon name='icon-x' style={Styles.ClickIcon} />
          </TouchableOpacity>
      </LinearGradient>
        </View>
      </View>
      </Modal>
    )
   }
}

var {
  height: deviceHeight
} = Dimensions.get("window")


var styles = StyleSheet.create({
  row : {
    marginBottom: 12
  },
  header: {
    fontSize : 20,
    marginBottom: 12
  },
  subHeader: {
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12
  },
  container: {
    position: "absolute",
    top:0,
    bottom:0,
    left:0,
    right:0,
    backgroundColor: Colors.greenYellow,
    justifyContent: "center",
    alignItems: "center",
  }
})

export default GenericModal