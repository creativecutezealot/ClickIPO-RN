
import React from 'react'
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Modal,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableHighlight,
  KeyboardAvoidingView
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  // KeyboardAvoidingView
} from 'react-native'
import Logger from '../Lib/Logger'
import { connect } from 'react-redux'
import styles from './Styles/ShareModalStyle'

import Icon from 'react-native-vector-icons/Ionicons'

import {
  User
} from '../Models'

import {
  Colors,
  Fonts
} from '../Themes'


class ShareModal extends React.Component {
  state: {
    buttonPressed: Boolean,
    user: User
  }

  constructor (props) {
    super(props)
    const { user } = props
    this.state = {
      user: user,
      buttonPressed: false,
      text: null,
      helpMessage: 'Join the conversation by using the ticker symbol!',
      helpMessageColor: Colors.black
    }
  }

  onPressShare = () => {
    const identity = this.state.user.socialIdentities.filter((obj) => {
      return obj.provider === this.props.platform
    })
    if(this.state.text !== null) {
      this.setState({
        buttonPressed: true
      })
      this.props.action({token: identity[0].token, message: this.state.text})
    } else {
      this.setState({
        helpMessage: 'Please add a message if you would like to post!',
        helpMessageColor: Colors.orange
      })
    }
  }

  buttonContent = () => {
    if(this.state.buttonPressed === false) {
      return(
        <View style={ styles.View1}>
            <Image source={this.props.socialMediaIcon} style={styles.Imagestyle} resizeMode='contain' />
          <Text style={{color: Colors.white, ...Fonts.style.subHeader}}>
            Share
          </Text>
        </View>
      )
    } else {
      return(
        <View style={styles.View2}>
          <ActivityIndicator
          animating={this.state.animating}
          style={[{height: 80}]}
          size="small"
          color={Colors.pinkishGrey}
          />
        </View>
      )
    }
  }

  render () {
    return(
      <Modal animationType='fade' visible={this.props.visible} transparent={true} onRequestClose={() => null}>
        <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <TouchableOpacity activeOpacity={1} style={ styles.TouchableOpacityStyle } onPress={this.props.openModal}>
          <TouchableWithoutFeedback>
            <View style={{height: (Dimensions.get('window').width * .9), width: (Dimensions.get('window').width * .9), backgroundColor: Colors.smoke, borderRadius:6, overflow:'hidden'}}>
            <View style={{ flex: 1}}>
            <View style={styles.View3}>
              <View style={ styles.View4 }>
                <View style={{flex: 1, backgroundColor: Colors.white, margin: 18, borderRadius: 6}}>
                <Image resizeMode='contain' source={this.props.logo} style={styles.ImageStyle} />
                </View>
              </View>
              <View style={{flex: 5}}>
                <View style={ styles.View5 }>
                  <Text style={{...Fonts.style.headline}}>${this.props.ticker}</Text>
                  <Text style={{...Fonts.style.subHeader}}>{this.props.name}</Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, justifyContent:'center', alignItems: 'center', paddingHorizontal: 18, backgroundColor: Colors.smoke2}}>
              <Text style={{...Fonts.style.tip, textAlign:'center', color: this.state.helpMessageColor}}>{this.state.helpMessage}</Text>
            </View>
            </View>

            <View style={{flex: 1}}>
              <View style={{flex: 3}}>
                <TextInput 
                onChangeText={(text) => this.setState({text : text})}
                style={{flex: 2, backgroundColor: Colors.white, paddingHorizontal: 18, paddingTop: 18, ...Fonts.style.input}}
                placeholder='Say Something...'
                multiline={true}
                 />
              </View>

              <TouchableHighlight onPress={this.onPressShare} style={{flex:1}}>
                <View style={{flex: 1, backgroundColor: this.props.buttonColor, justifyContent:'center', alignItems: 'center'}}>
                  {this.buttonContent()}
                </View>
              </TouchableHighlight>
            </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
        </KeyboardAvoidingView>
     </Modal>
   )
  }
}

ShareModal.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}


export default connect(mapStateToProps)(ShareModal)