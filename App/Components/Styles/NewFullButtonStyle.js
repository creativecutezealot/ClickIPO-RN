

import { StyleSheet } from 'react-native'
import {
  Colors,
  // Metrics,
  Fonts
} from '../../Themes/'

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.booger,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.boogerWashed,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: Fonts.type.input,
    color: Colors.white,
    fontWeight: 'bold'
  },
  buttonTextDisabled: {
    fontFamily: Fonts.type.input,
    color: Colors.white,
    fontWeight: 'bold'
  }
})
