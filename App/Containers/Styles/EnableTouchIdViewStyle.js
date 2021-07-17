import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default Styles = {

    ScrollView: {
        flex: 1,
        marginTop: 60
    },
    View: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 10,
        backgroundColor: Colors.clear
    },
    View2:{
         flex: 1,
          flexDirection: 'row' 
},
ButtonStyle:{
    backgroundColor: Colors.lightGreyGreen,
     borderColor: Colors.lightGreyGreen,
      marginRight: 5,
       height: 60
},
FullButton:{
    marginLeft: 5,
     height: 60
},




}