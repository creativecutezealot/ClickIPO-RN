
import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default styles = {
    offeringdescription : {
        ...Fonts.style.text,
        fontSize: 15
    },
   ImageStyle:{ 
       marginTop:200,
        resizeMode: 'stretch',
         width:128,
          height:40,
           backgroundColor: Colors.clear 
        },
        TextStyle:{
            textAlign: 'center',
             fontSize: 25,
              padding: 10,
               marginTop: 40
            },
   
}