

import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  button: {
    height: 40,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.booger,
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: Colors.pinkishGrey
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 20,
    marginVertical: Metrics.baseMargin
  }
})
