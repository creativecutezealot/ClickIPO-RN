
import React from 'react'
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native'
import {
  Colors,
  Fonts,
  Images
} from '../Themes'
import Logger from '../Lib/Logger'
import LinearGradient from 'react-native-linear-gradient'
import styles from './Styles/OfferingListItemStyle'

class OfferingIllustration extends React.Component {
  render() {
    if(this.props.offeringTypeTextColor === 'rgba(76,199,63,1)'){
      var secondaryColor = 'rgba(183, 225, 67, 1)'
    } else {
      var secondaryColor = 'rgba(68, 210, 182, 1)'
    }
    const logo = { uri: 'https:' + this.props.logoUrl }
    const splitPath = this.props.logoUrl.split('/')
    const image = splitPath[splitPath.length - 1]
    const firstLetter = this.props.name.charAt(0)

    //clickipostaging.s3.amazonaws.com/assets/placeholder_company_thumb.png

    if(image === 'placeholder_company_medium.png' || image === 'placeholder_company_thumb.png' || image === 'placeholder_company_large.png' || image === 'placeholder_company_original.png' ){
      return(
        <LinearGradient colors={[secondaryColor, this.props.offeringTypeTextColor]} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}} style={[styles.logoContainer, { backgroundColor: this.props.offeringTypeTextColor, width:40, height:40, margin:4, borderRadius: 24 }]}>
          <Text style={[styles.label, {fontSize: 24, fontFamily: Fonts.type.base, fontWeight: this.props.fontWeight, color: Colors.white, backgroundColor: Colors.clear}]}>{firstLetter}</Text>
        </LinearGradient>
      )
    } else {
      return(
        <View style={[styles.logoContainer]}>
          <Image resizeMode='contain' style={styles.logo} source={logo} />
        </View>
      )
    } 
  }
}



export default OfferingIllustration