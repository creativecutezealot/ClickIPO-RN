import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors,
  Metrics,
} from '../../Themes/'

export default StyleSheet.create({
Component:{
      flex: 1, 
      height: 75, 
      backgroundColor: Colors.tealishTint, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center' 
},
 
 ViewStyle:{
      fontSize: 36, 
      color: Colors.tealish 
},
NotAllStyle:{
     marginLeft: 12, 
     color: Colors.tealish 
},
ViewStyle1:{
     flexDirection: 'row', 
     backgroundColor: Colors.greyishBrown
 },
ViewStyle2:{
     flex: 1, 
     flexDirection: 'row' 
}, 
ViewStyle3:{
     flex: 1, 
     justifyContent: 'flex-end' 
},
TouchableHighlight:{
     position: 'absolute', 
     top: 0, 
     left: 0, 
     bottom: 0, 
     right: 0, 
     backgroundColor: Colors.drawerBlue 
},
Filter:{
     color: Colors.pinkishGrey, 
     fontSize: 16 
},
buttonInnerViewstyle: {
     flex: 1,
     flexDirection: 'row'
},
cancelButtonStyle: {
     backgroundColor: Colors.orange,
     marginRight: 5
},
buttonViewStyle: {
     height: 50,
     paddingTop: 20,
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     left: 10,
     right: 10,
     bottom: 15,
     backgroundColor: Colors.pinkishGrey
},
viewButtonStyle: {
     backgroundColor: '#ffffff',
     marginRight: 5,
}
})
