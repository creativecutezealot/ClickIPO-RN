

import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors,
  Metrics,
} from '../../Themes/'

export default StyleSheet.create({
  listViewContainer: {
    flex: 1,
    margin: 0,
    backgroundColor: Colors.white
  },
  listContent: {
    margin: 0,
    backgroundColor: Colors.white
  },
  rowContainer: {
    // marginVertical: 0,
    backgroundColor: Colors.white,
    paddingLeft: 24,
    paddingTop: 16,
    borderTopWidth: 0,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#cccccc'
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    // marginVertical: 0,
    // justifyContent: 'center',
    backgroundColor: Colors.clear

  },
  logoContainer: {
    alignItems: 'center',
    height: 48,
    width: 48,
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    // width: (Metrics.screenWidth * 0.33),
    // borderRightWidth: 0.5,
    // borderColor: Colors.pinkishGrey
  },
  logo: {
    // maxWidth: (Metrics.screenWidth * 0.30),
    width: 48, // (Metrics.screenWidth * 0.30),
    height: 48, // (Metrics.screenWidth * 0.30),
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  savedContainer: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    left: 0,
    backgroundColor: Colors.clear
  },
  saved: {
    // backgroundColor: Colors.clear,
    padding: 8
  },
  savedIcon: {
    fontSize: 20,
    color: Colors.booger
  },
  descriptionContainer: {
    flex: 8,
    backgroundColor: Colors.clear
  },
  sharesContainer: {
    flex: 10
  },
  priceContainer: {
    flex: 7
  },
  companyLabel: {
    ...Fonts.style.label,
    fontSize: 18,
    color: Colors.drawerBlue
  },
  label: {
    color: Colors.greyishBrown
  },
  swipeableButtonContainer: {
    flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingLeft: 12
  },
  swipeableButton: {
    flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // alignSelf: 'center',
    justifyContent: 'center'
    // justifyContent: 'space-around',
    // paddingLeft: 20,
  },
  swipeableSaveButton: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  swipeablePlaceOrderButton: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  COPYButton:{
     fontFamily: Fonts.type.base, 
     fontSize: 12, 
     color: Colors.greyishBrown, 
     textAlign: 'center', 
     lineHeight: 18 
},
ViewStyle:{
  flex:1, 
  height: 40, 
  marginTop: 12
},
ViewStyle1:{ 
  flex: 1, 
  paddingVertical: 16, 
  justifyContent: 'center', 
  alignItems: 'center', 
  borderBottomWidth: 1, 
  borderBottomColor: Colors.smoke 
},
ViewStyle2:{ 
  flexDirection: 'row',
   marginBottom: 16,
    flex: 1
  },
ViewStyle3:{
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center'
},
ViewStyle4:{ 
  flexDirection: 'row', 
  flex: 1
},
TEXTStyle:{
  fontFamily: Fonts.type.base, 
  fontSize: 12,
},
ViewStyle5:{ 
  flex: 1,
   backgroundColor: Colors.white,
    alignItems: 'center', 
    justifyContent: 'center' 
},
ViewStyle6:{ 
  width: 8, 
  backgroundColor: Colors.white
 },
ViewStyle7:{
   flex: 1, 
   justifyContent: 'center' 
},
ViewStyle8: { flex: 1, flexDirection: 'row' } ,
ViewStyle9:{
   flex: 10, 
   justifyContent: 'center', 
   alignItems: 'center', 
   flexDirection: 'row', 
   borderBottomWidth: 1,
    borderBottomColor: Colors.smoke,
     height: 72 
},
ViewStyle10:{
  flex: 1,
   flexDirection: 'row',
    alignItems: 'center'
},
ViewStyle11:{
  flexDirection: 'row', 
  height: 72, 
  alignItems: 'center', 
  justifyContent: 'space-between', 
   borderBottomWidth: 1, 
   borderBottomColor: Colors.smoke
},
ViewStyle12:{
   flex: 1, 
   justifyContent: 'center' 
},
ViewStyle13:{ flex: 1, height: 40, justifyContent: 'center' },



})
