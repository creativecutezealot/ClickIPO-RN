import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default Styles = {

  Component:{ 
       width:250,
        height:250,
         justifyContent: "center",
          alignItems: "center",
           backgroundColor:"white"
 },
 TouchableOpacity:{ 
     height: 70,
      justifyContent: 'center',
       alignItems: 'center',
        backgroundColor: Colors.booger 
    },
    Close:{ 
        fontFamily: Fonts.type.base,
         fontSize: 26,
          textAlign: 'center'
     },
}