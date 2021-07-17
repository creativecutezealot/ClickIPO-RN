

import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderColor: Colors.booger,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    margin: 5
  },
  textInput: {
    ...Fonts.style.input,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
    backgroundColor: Colors.clear,
    color: Colors.greyishBrown
  },
  validatedIcon: {
    fontSize: 28
  },
  validIcon: {
    color: Colors.valid
  },
  invalidIcon: {
    color: Colors.invalid
  },
  BrokerSelectorViewStyle:{
    flex: 1, 
    flexDirection:'row' ,
     borderColor: Colors.booger, 
    borderWidth: 1,
     borderRadius: 6
  },
  BrokerSelectorDropdownStyles:{
    ...Fonts.style.input,
     height:50,
      borderWidth:0,
       paddingHorizontal: 20,
        paddingVertical: 0,
        width: 350,
     backgroundColor: Colors.clear, 
    color: Colors.booger
  },
  ropdowncontainerStyle:{
    borderWidth:0
  },
  ViewStyle:{
     paddingHorizontal: 16,
     justifyContent: 'center',
   alignItems: 'center',
   height: 56,
   backgroundColor: Colors.clear 
  },
   ViewStyle2:{ 
     paddingHorizontal: 16, 
    justifyContent: 'center', 
   alignItems: 'center',
    height: 56, 
   backgroundColor: Colors.smoke2 
  },
})
