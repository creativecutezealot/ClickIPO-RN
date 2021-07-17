

import { StyleSheet } from 'react-native'
import {
  Fonts,
  Colors
  // Metrics,
  // ApplicationStyles
} from '../../Themes/'
export default StyleSheet.create({

  listViewContainer: {
    flex: 1,
    margin: 0,
    backgroundColor: Colors.clear
  },
  listContent: {
    margin: 0,
    backgroundColor: Colors.smoke
  },
  rowContainer: {
    // marginVertical: 0,
    height: 100,
    backgroundColor: Colors.clear,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: Colors.clear
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    // marginVertical: 0,
    // justifyContent: 'center',
    backgroundColor: Colors.clear

  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 8,
    // width: (Metrics.screenWidth * 0.33),
    backgroundColor: Colors.white
    // borderRightWidth: 0.5,
    // borderColor: Colors.pinkishGrey
  },
  logo: {
    // maxWidth: (Metrics.screenWidth * 0.30),
    width: 80, // (Metrics.screenWidth * 0.30),
    height: 80, // (Metrics.screenWidth * 0.30),
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  savedContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
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
    flex: 3,
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    color: Colors.black
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
  ClickIconStyle:{
    marginRight: 10 
},
TouchableOpacityStyles:{
    width: '40%',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.booger,
    borderWidth: 1,
    backgroundColor: Colors.booger
},
TextStyles:{
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16
},

})
