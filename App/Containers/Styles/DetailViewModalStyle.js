import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default Styles = {

    Component: {
        borderBottomWidth: 1,
         borderBottomColor: Colors.black,
          marginBottom: 20,
           paddingBottom: 20
        },
     ParentView:{
         marginHorizontal: 20
        },
      ViewStyle:{
           marginTop: 48,
            marginBottom: 24,
             paddingBottom: 24,
              borderBottomColor: Colors.pinkishGrey,
         borderBottomWidth: 1
        },
    TextStyle1:{
        fontFamily: Fonts.type.base,
         marginBottom: 20, 
         fontSize: 16
        },
     TextStyle2:{
         fontFamily: Fonts.type.light,
          marginBottom: 20,
           fontSize: 14
        },
}