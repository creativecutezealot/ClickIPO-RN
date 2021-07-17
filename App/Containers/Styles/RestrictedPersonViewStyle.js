import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors,
  Metrics,
} from '../../Themes/'

export default StyleSheet.create({
Component:{ flex: 1 },

ParentView:{
       flex: 2, 
       paddingRight: 25, 
       paddingBottom: 5, 
       paddingLeft: 25 
},
ParentView1:{
       borderWidth: 1, 
       borderColor: Colors.pinkishGrey, 
       backgroundColor: Colors.white, 
       borderRadius: 6 
},
ParentView2:{
       flex: 1, 
       flexDirection: 'column', 
       paddingTop: 10, 
       paddingBottom: 10, 
       paddingRight: 20, 
       paddingLeft: 20 
},
ParentView3:{
       flex: 1, 
       backgroundColor: Colors.clear, 
       flexDirection: 'column', 
       justifyContent: 'center' 
},
ParentView4:{
       marginTop: 5, 
       marginRight: 5, 
       marginLeft: 5
},
TextStyle:{
       marginTop: 10, 
       marginBottom: 12, 
       fontWeight: 'bold' 
},
ParentView5:{
        marginBottom: 12, 
        marginTop: 12, 
        flexDirection: 'row' 
},
ParentView6:{
        paddingTop: 5, 
        flex: 1 
},
ParentView7:{ flex: 7 },
ParentView8:{ fontSize: 12 },
ParentView9:{
       marginBottom: 12, 
       flexDirection: 'row' 
},
ParentView10:{ flex: 1 },
ParentView11:{
       height: 50, 
       paddingBottom: 5 
},

})
