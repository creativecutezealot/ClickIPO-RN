import { StyleSheet } from 'react-native'
import { Metrics,Colors,Fonts,} from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.titlePadding
  },
  ParentView:{
    height: 40, 
     flexDirection: 'row',
      justifyContent: 'center', 
       alignItems: 'center' , 
       borderRadius :20,
     backgroundColor: Colors.smoke
  },

  TextInputStyle:{
    flex: 1,
     height: 40,
      ...Fonts.style.bold,
       fontSize: 16,
        color: Colors.drawerBlue,
         textShadowColor: Colors.smoke,
          textShadowRadius: 2,
           backgroundColor: Colors.clear},

})
