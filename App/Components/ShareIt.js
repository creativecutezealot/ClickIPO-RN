import React from 'react'

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import {
  Images
} from '../Themes'
import styles from './Styles/ShareItStyle'

import FeatureSetConfig from '../Config/FeatureSetConfig'

import ShareModal from './ShareModal'

import Logger from '../Lib/Logger'
import { stockTwitsPost } from '../Services/StockTwitsService'


export default class ShareIt extends React.Component {
  constructor (props) {
    // Logger.log({ name: 'OfferingDetailsScreen.constructor()', props: props })
    super(props)
    this.state = {
      modalOpen: false,
      platform: 'facebook'
    }
  }

  openModal = (platform) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      platform: platform
    })
  }

  renderModal = () => {
    if(this.state.platform === 'facebook') {
      var image = Images.facebookIcon
      var color = '#3B5998'
      var action = (data) => stockTwitsPost(data)
    } else if(this.state.platform === 'twitter') {
      var image = Images.twitterIcon
      var color = '#00aced'
      var action = (data) => stockTwitsPost(data)
    } else if(this.state.platform === 'stocktwits') {
      var image = Images.stockTwitsIcon
      var color = '#405775'
      var action = (data) => stockTwitsPost(data)
    }
    return (
      <ShareModal 
        platform={this.state.platform}
        visible={this.state.modalOpen}
        action={action}
        logo={this.props.logo} 
        buttonColor={color} 
        socialMediaIcon={image}
        name={this.props.name} 
        ticker={this.props.ticker}
        openModal={this.openModal}
        onRequestClose={() => null}
        />
    )
  }

  render () {
    /*
      <TouchableOpacity style={{backgroundColor: '#405775', padding:20, marginRight: 40, borderRadius: 50}} onPress={() => this.openModal('stocktwits')}>
        <Image resizeMode='contain' style={{height: 20, width: 20}} source={Images.stockTwitsIcon} />
      </TouchableOpacity>
    */

    if (FeatureSetConfig.social.sharingEnabled) {
      return (
        <View style={styles.container}>
          <Text style={[styles.titleText]}>Share it!</Text>

          <View style={styles.View}>
            
            <TouchableOpacity style={styles.Images} onPress={() => this.openModal('facebook')}>
              <Image resizeMode='contain' style={styles.facebookIconstyle} source={Images.facebookIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => this.openModal('twitter')}>
              <Image resizeMode='contain' style={styles.twitterIconstyle} source={Images.twitterIcon} />
            </TouchableOpacity>
  
          </View>
          {this.renderModal()}
        </View>
      )
    } else {
      return (
        <View style={styles.container}>

        </View>
      )
    }
  }
}