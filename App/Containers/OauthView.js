// import React from 'react'
// import {View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Linking, Platform} from "react-native"
// // import Button from "react-native-button"
// import { Actions as NavigationActions } from 'react-native-router-flux'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import SafariView from 'react-native-safari-view'
// import {CustomTabs} from 'react-native-custom-tabs'

// import {
//   Images,
//   Colors,
//   Metrics,
//   Fonts,
//   ApplicationStyles
// } from '../Themes'

// import Logger from '../Lib/Logger'

// import branch from "react-native-branch";

// var {
//   height: deviceHeight
// } = Dimensions.get("window")

// var styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top:0,
//     bottom:0,
//     left:0,
//     right:0,
//     backgroundColor:"transparent",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// })
// var temp;
// class OauthView extends React.Component {
//   constructor(props){
//     super (props)
//   }

//   componentWillMount = () => {
//     Logger.log({ name: 'OauthView.componentWillMount()',  props:this.props })
//     if(Platform.OS === 'ios'){
//       SafariView.show({
//         url: this.props.authorizeUrl
//       })
//     } else if (Platform.OS === 'android') {
//       CustomTabs.openURL(this.props.authorizeUrl)
//     }
//     Linking.addEventListener('url', this.onNavigationStateChange)
//   }

//   componentDidMount = () => {
//   this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
//     Logger.log({
//       function: "OauthView.componentDidMount",
//       params: params
//     });

//     if (error) {
//       return;
//     }
//     if(temp != ""){
//       temp = params["+non_branch_link"]
//       params["+non_branch_link"]  = "";
//     }else{
//       temp = ""
//     }

//     if(temp) {
//       this.onNavigationStateChange({ url :temp})
//       temp = false
//     }
//     if (params["+clicked_branch_link"]) {
//       return;
//     }
//   });
//   Logger.log({ name: 'OauthView.componentDidMount()' })
// }

//   componentWillUnmount = () => {
//     Linking.removeEventListener('url', this.onNavigationStateChange)
//     if (this._unsubscribeFromBranch) {
//       this._unsubscribeFromBranch();
//       this._unsubscribeFromBranch = null;
//     }
//   }


//   onNavigationStateChange = (event) => {
//     Logger.log({ name: 'OauthView.onNavigationStateChange()', event: event })
//     if (event.url.startsWith(this.props.callbackUrl)) {
//         var callbackUrl = event.url
//         Logger.log({ name: 'OauthView.onNavigationStateChange()', callbackUrl: callbackUrl })
//         this.props.callback(callbackUrl)
//         if(Platform.OS === 'ios'){
//           SafariView.dismiss()
//         }
//         NavigationActions.pop()
//       }
//   }


//   render = () => {
//     return (
//       null
//     )
//   }
// }

// export default OauthView\

import React from 'react'
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Linking, Platform } from "react-native"
// import Button from "react-native-button"
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import SafariView from 'react-native-safari-view'
import { CustomTabs } from 'react-native-custom-tabs'

import {
  Images,
  Colors,
  Metrics,
  Fonts,
  ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'

import branch from "react-native-branch";

var {
  height: deviceHeight
} = Dimensions.get("window")

var styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
})

class OauthView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: this.props.authorizeUrl
      })
    } else if (Platform.OS === 'android') {
      CustomTabs.openURL(this.props.authorizeUrl)
    }
    Linking.addEventListener('url', this.onNavigationStateChange)
  }

  componentDidMount = () => {
    this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
      if (error) {
        return;
      }

      if (params["+non_branch_link"]) {
        this.onNavigationStateChange({ url: params["+non_branch_link"] })
      }

      if (params["+clicked_branch_link"]) {

        return;
      }
    });
  }

  componentWillUnmount = () => {
    Linking.removeEventListener('url', this.onNavigationStateChange)
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch();
      this._unsubscribeFromBranch = null;
    }
  }


  onNavigationStateChange = (event) => {
    if (event.url.startsWith(this.props.callbackUrl)) {
      var callbackUrl = event.url
      this.props.callback(callbackUrl)
      if (Platform.OS === 'ios') {
        SafariView.dismiss()
      }
      NavigationActions.pop()
    }
  }


  render = () => {
    return (
      null
    )
  }
}

export default OauthView