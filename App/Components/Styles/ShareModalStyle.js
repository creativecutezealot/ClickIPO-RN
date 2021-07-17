

import { StyleSheet } from 'react-native'
import {
  // Colors,
  Fonts,
  Metrics
  // ApplicationStyles
} from '../../Themes/'

export default StyleSheet.create({
  View1: {
    flex: 1,
     flexDirection:'row',
     justifyContent: 'center',
     alignItems: 'center'
  },
  Imagestyle:{
      height:15,
     width: 15,
     marginRight: 8
    },
    View2:{ 
        flex: 1,
         justifyContent: 'center',
     alignItems: 'center'
    },
    View3:{
        flexDirection: 'row',
         flex: 3
},
View4:{
    flex: 3, 
    borderRadius: 6
},
View5:{ 
    flex:1,
     justifyContent:'center',
      marginRight: 18
    },
ImageStyle:{ flex: 1, margin: 9 },

    TouchableOpacityStyle:{
        flex: 1,
         justifyContent: 'center',
          alignItems: 'center',
           backgroundColor:'rgba(1,1,1,.6)'
        },
  

})
