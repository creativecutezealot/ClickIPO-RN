import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default Styles = {

    TextStyle: {
        fontFamily: Fonts.type.chivo,
        lineHeight: 24,
        color: Colors.drawerTextInactive,
        backgroundColor: Colors.clear,
        fontSize: 14
    },
    TextStyle1: {
        fontWeight: 'bold'
    },
    Container: {
        flex: 1,
        flexDirection: 'row'
    },
    ViewStyle: {
        flex: 2,
        backgroundColor: Colors.drawerBlue,
        paddingTop: 32,
        paddingLeft: 8,
        justifyContent: 'space-between'
    },
    ViewStyle2:{
        marginLeft: 16
    },
TextStyle2:{ 
    fontFamily: Fonts.type.bold, 
    lineHeight: 24,
     fontSize: 16, 
     color: Colors.drawerTextInactive,
      textAlign: 'left', 
      backgroundColor: Colors.clear 
},
ViewStyle3:{
     flex: 1,
      backgroundColor: Colors.white,
       paddingTop: 32,
        justifyContent: 'space-between' 
},
ViewStyle4:{
    alignSelf: 'flex-end',
    paddingRight:21
},


}