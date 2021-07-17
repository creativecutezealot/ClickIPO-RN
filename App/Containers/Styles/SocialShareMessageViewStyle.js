import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors,
  Metrics,
} from '../../Themes/'

export default StyleSheet.create({
Component:{
      flex: 1, 
      justifyContent:'center', 
      alignItems: 'center'
},
ViewStyle:{
       justifyContent: "center", 
       alignItems: "center", 
       backgroundColor: Colors.white 
},
ViewStyle1:{ flex: 1},
ViewStyle2:{
       flexDirection: 'row', 
       flex: 3
},
ViewStyle3:{
       flex: 3, 
       borderRadius: 6
},
ViewStyle4:{
        flex: 1, 
        backgroundColor: Colors.white, 
        margin: 18, 
        borderRadius: 6
},
ViewStyle5:{
       flex:1, 
       justifyContent:'center', 
       marginRight: 18
},
ViewStyle6:{
       flex: 1, 
       justifyContent:'center', 
       alignItems: 'center', 
       paddingHorizontal: 18, 
       backgroundColor: Colors.smoke2
},
ShreView:{
      flex: 1, 
      flexDirection:'row', 
      justifyContent: 'center', 
      alignItems: 'center'
},
ShareImage:{
       height:15, 
       width: 15, 
       marginRight: 8
},

})
