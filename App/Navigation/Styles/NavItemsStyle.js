

import {StyleSheet, Platform} from 'react-native'
import { Metrics, Colors } from '../../Themes/'

const navButton = {
  backgroundColor: Colors.clear,
  justifyContent: 'center',
  marginLeft:16,
  marginRight:16,
  marginTop:16,
  marginBottom:16,
  fontSize: 24
}

export default StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    maxHeight: (Metrics.navBarHeight),
  },
  logo: {
    marginTop: (Metrics.navBarHeight * 0.4),
    maxHeight: (Metrics.navBarHeight * 0.35)
  },
  menuButton: {
    ...navButton,
    marginRight:0,
    // marginTop: Metrics.baseMargin,
    // marginLeft: Metrics.baseMargin,
    // fontSize: 9
  },
  backButton: {
    ...navButton,
    // marginTop: Metrics.baseMargin,
    // marginLeft: Metrics.baseMargin
  },
  closeButton: {
    backgroundColor: Colors.clear,
    justifyContent: 'center',
    
    height: Metrics.navBarHeight * (Platform.OS === 'ios' ? 0.3  : 0.4)
    
    // marginTop: Metrics.baseMargin,
    // marginLeft: Metrics.baseMargin
  },
  searchButton: {
    ...navButton,
    marginTop: Metrics.section,
    marginRight: Metrics.baseMargin,
    alignItems: 'center'
  },

  offeringIcon : {
    justifyContent: 'center',
  }
})
