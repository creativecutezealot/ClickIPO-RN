

import { StyleSheet } from 'react-native'
import {
  Colors,
  // Metrics,
  Fonts
} from '../../Themes/'

export default StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.clear,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    flex: 1,
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
    color: Colors.black,
    fontWeight: 'bold',
    backgroundColor: Colors.clear,
  },
  buttonTextDisabled: {
    fontFamily: Fonts.type.input,
    color: Colors.black,
    fontWeight: 'bold'
  }
})
