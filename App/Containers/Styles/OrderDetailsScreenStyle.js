import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors,
  Metrics,
} from '../../Themes/'

export default StyleSheet.create({
  ScrollView:{
       flex: 1, 
       marginBottom: 50 
  },
  ViewStyle:{
       flex: 1, 
       justifyContent: 'center' 
},   
ViewStyle1:{
     flex: 1, 
     flexDirection: 'row'
 },
ViewStyle2:{ 
     flex: 10, 
     marginTop: 12 
},
ViewStyle3:{
      flex: 2, 
      marginTop: 12 
},
ViewStyle4:{ 
      flex: 10, 
      marginTop: 12 
},
ViewStyle5:{
     flex: 1, 
     flexDirection: 'row', 
     marginVertical: 8, 
     justifyContent: 'center' 
},
ViewStyle6:{
     flex: 10, 
     justifyContent: 'center' 
    },
ViewStyle7:{
     flex: 2, 
     justifyContent: 'center', 
     alignItems: 'center' 
},
ViewStyle8:{
     height: 50, 
     justifyContent: 'center', 
     alignItems: 'center', 
     position: 'absolute', 
     left: 10, 
     right: 10, 
     bottom: 0, 
     backgroundColor: Colors.clear 
},
ViewStyle9:{ 
     flex: 1, 
     flexDirection: 'row' 
},

})
