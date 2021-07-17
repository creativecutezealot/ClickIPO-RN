import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default styles = {
    ScrollView:{
         flex: 1, 
         marginBottom: 50 
    },
    Component:{
         flex: 1, 
         marginVertical: 12, 
         justifyContent: 'center', 
         alignItems: 'center' 
},
  ViewStyle:{
       justifyContent: 'center', 
       alignItems: 'center' 
},
ViewStyle1:{
     height: 50, 
     justifyContent: 'center', 
     alignItems: 'center', 
     position: 'absolute', 
     left: 0, 
     right: 0, 
     bottom: 0, 
     backgroundColor: Colors.clear 
},
ViewStyle2:{ 
    flex: 1,
     flexDirection: 'row'
 },

}

