

import { StyleSheet } from 'react-native'
import {
  // Colors,
  Fonts,
  Metrics
  // ApplicationStyles
} from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.titlePadding,
    paddingBottom: 24
  },
  titleText: {
    fontFamily: Fonts.type.light,
    fontSize: 17,
    paddingBottom: 24
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    height: 50
  },
  View:{
    flex: 1,
     flexDirection: 'row',
      alignItems: 'center',
       justifyContent: 'center',
        paddingTop: 12 
  },
  Images:{
    backgroundColor: '#3B5998',
     padding:20,
      marginRight: 40,
       borderRadius: 50
  },
  facebookIconstyle:{
    height: 20,
     width: 20
  },
  twitterIconstyle:{
    height: 20, 
    width: 20
  },
  TouchableOpacityStyle:{
    backgroundColor: '#00aced',
   padding:20,
   borderRadius: 50
  },
})
