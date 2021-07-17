

import { StyleSheet } from 'react-native'
import {
  Colors,
  // Metrics,
  Fonts
} from '../../Themes/'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    ...Fonts.style.light,
    fontSize: 16,
    color: Colors.tealish
  }
})
