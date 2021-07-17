import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default styles = {
    Container:{
         flexDirection: 'row', 
         backgroundColor: Colors.greyishBrown 
},
Filter:{ 
    color: Colors.pinkishGrey, 
    fontSize: 16 
},
ViewStyle:{
     flex: 1, 
     height: 75, 
     backgroundColor: Colors.tealishTint, 
     flexDirection: 'row', 
     alignItems: 'center', 
     justifyContent: 'center' 
},
ViewStyle1:{
     justifyContent: 'center', 
     alignItems: 'center' 
    },
ViewStyle2:{
     flex: 1, 
     flexDirection: 'row' 
},
ViewStyle3:{
     flex: 1, 
     justifyContent: 'flex-end' 
},    
Icon:{
     fontSize: 36, 
     color: Colors.tealish 
},
NotAllOffering:{
     marginLeft: 12, 
     color: Colors.tealish 
},
TouchabelHighLight:{
     position: 'absolute', 
     top: 0, 
     left: 0,
      bottom: 0,
       right: 0, 
       backgroundColor: Colors.drawerBlue
     },



}

