import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors,
  Metrics,
} from '../../Themes/'

export default StyleSheet.create({
Component:{
       flex: 1, 
       marginHorizontal: 24 
},
ViewStyle:{
       flex: 1, 
       paddingVertical: 24, 
       borderBottomWidth: 0.5, 
       borderColor: Colors.lightGrey 
},
ViewStyle1:{
      flex: 1, 
      paddingVertical: 12 
},
ViewStyle2:{ fontFamily: Fonts.type.light, fontSize: 16, lineHeight: 24 },


})
