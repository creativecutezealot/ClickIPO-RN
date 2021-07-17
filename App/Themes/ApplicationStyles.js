

import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'
import { Dimensions } from 'react-native'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const padding = 25

const ApplicationStyles = {
    container: {
      flex: 1
    },
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.clear
    },
    tabsContainer: {
      flex: 1
    },
    contentContainer: {
      flex: 1,
      marginHorizontal: Metrics.marginHorizontal,
      alignItems: 'center'
    },
    formContainer: {
      flex: 1,
      marginVertical: Metrics.marginVertical
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
      marginVertical: 7
    },
    headline: {
      fontFamily: Fonts.type.bold,
      fontSize: 32,
      lineHeight: 48,
      color: Colors.drawerBlue,
      textAlign: 'center'
    },
    tagline: {
      ...Fonts.style.text,
      fontSize: 16,
      color: Colors.blueSteel,
      textAlign: 'center',
      marginTop: 16,
      lineHeight: 24
    },
    tab : {
      paddingBottom: 0,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin
      // borderTopColor: Colors.pinkishGrey,
      // borderTopWidth: 0.5,
      // borderBottomColor: Colors.pinkishGrey,
      // borderBottomWidth: 1
    },
    sectionText: {
      color: Colors.greyishBrown,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center',
      fontWeight: '300'
    },
    subtitle: {
      color: Colors.greyishBrown,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin
    },

  darkLabelContainer: {
    backgroundColor: Colors.cloud,
    padding: Metrics.smallMargin
  },
  darkLabel: {
    fontWeight: '400',
    color: Colors.greyishBrown
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.greyishBrown,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.booger,
    alignItems: 'center',
    textAlign: 'center'
  },
  listViewContainer: {
    flex: 1,
    margin: 0,
    backgroundColor: Colors.clear
  },
  listContent: {
    margin: 0,
    backgroundColor: Colors.pinkishGrey
  },
  articleRowContainer: {
    // marginVertical: 0,
    height: 100,
    backgroundColor: Colors.clear,
    borderTopWidth: 0,
    borderColor: Colors.clear
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    // marginVertical: 0,
    // justifyContent: 'center',
    backgroundColor: Colors.smoke

  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 8,
    // width: (Metrics.screenWidth * 0.33),
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
  cancelleddescriptionContainer: {
      flex: 3,
      paddingVertical: 8,
      paddingHorizontal: 8,
      backgroundColor: Colors.verylightgrey
    },
  descriptionContainer: {
    flex: 3,
    paddingVertical: 8,
    marginLeft: 4,
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
  tabsContainer: {
    backgroundColor: Colors.invalid
  },
  tabs: {
    height: 32,
    backgroundColor: Colors.clear,
    borderColor: Colors.valid,
  },
  tabText: {
    fontFamily: Fonts.type.bold,
    fontSize: 14,
    paddingBottom: 0,
  },
  tabUnderline: {
    height: 0,
    backgroundColor: Colors.booger
  },
  borderView: { 
    flex: 1, 
    borderBottomWidth: 1, 
    borderColor: Colors.pinkishGrey 
  },
  faqRowContainer: { 
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    minHeight: 62,
    paddingTop: 18, 
    paddingBottom: 18, 
    paddingLeft: 20
  },
  questionContainer: {
  paddingRight: 25 
  },
  answerContainer: { 
    paddingRight: 64, 
    backgroundColor: Colors.greyishBrown 
  },
  qAndA: { 
    fontFamily: Fonts.type.base, 
    fontSize: 20 
  },
  qAndAContainer: { 
    paddingRight: 20, 
    width: 40
  },
  qColor: {
    color: Colors.tealish
  },
  aColor: {
  color: Colors.booger
  },
  qContainer: { 
    justifyContent: 'center'
  },
  text: { 
    fontFamily: Fonts.type.base, 
    fontSize: 16 
  },
  textQuestion: { 
    color: Colors.black 
  },
  textAnswer: {
  color: Colors.white
  },
  textContainer: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  caret: { 
    fontSize: 16, 
    color: Colors.pinkishGrey 
  },
  caretContainer: { 
    paddingLeft: 20, 
    justifyContent: 'center' 
  },
  copyHeader: {
    paddingTop: padding,
    ...Fonts.style.title,
    textAlign: 'center'
  },
  paragraph: {
    paddingTop: padding,
    ...Fonts.style.text
  },
  tip: {
    ...Fonts.style.tip
  },
  copyContainer: {
    paddingHorizontal: padding,
    paddingBottom: padding
  },
  imageContainer: {
    paddingTop: 25
  },
  imageCongrats: {
    flex: 1,
    width: (Dimensions.get('window').width - (padding * 5)),
    height: (Dimensions.get('window').width - (padding * 5))* 1.08,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  imageInstitution: {
    flex: 1,
    width: (Dimensions.get('window').width - (padding * 5)),
    height: (Dimensions.get('window').width - (padding * 5))* .817,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  imageGraph: {
    flex: 1,
    width: (Dimensions.get('window').width - (padding * 5)),
    height: (Dimensions.get('window').width - (padding * 5))* .857,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  imageIcon: {
    flex: 1,
    width: (Dimensions.get('window').width - (padding * 5)),
    height: (Dimensions.get('window').width - (padding * 5))* .5,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  marqueeContainer: {
    height: (Metrics.screenHeight * 0.2),
    justifyContent: 'center',
    alignItems: 'center'
  },
  note: {
    ...Fonts.style.note,
    color: Colors.greyishBrown,
    textAlign: 'center',
    marginTop: -4
  },
  toggleLabel: {
    ...Fonts.style.toggleLabel,
    color: Colors.greyishBrown
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    // maxWidth: (Metrics.screenWidth * 0.30),
    width: (Metrics.screenWidth * 0.50),
    height: (Metrics.screenHeight * 0.22),
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  tipContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.tealish,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14
  },
  noteContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {

  },
  icon: {
    fontSize: 22,
    paddingHorizontal: 8
  },
  note: {
    ...Fonts.style.tip,
    paddingHorizontal: 8
  },
  bottomBorder: {
    borderBottomWidth: 0.5,
    borderColor: Colors.pinkishGrey
  },
  infoContainer: {
    flex: 1,
    //flexDirection:'row',
    paddingVertical: 10,
    paddingHorizontal: 24
  },
  VideoContainer: {
    flex: 1,
    flexDirection:'row',
    paddingVertical: 10,
  },
  infoLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.drawerBlue,
    fontSize: 14,
    paddingBottom: 8
  },
  info: {
    ...Fonts.style.text
  },
  spotBlockInfo: {
    fontFamily: Fonts.type.bold,
  },
  prospectus: {
    color: Colors.tealish,
    textDecorationLine: "underline",
    textDecorationColor: Colors.tealish
  },
  underwriter: {
    ...Fonts.style.text
  },
  underwriterLead: {
    ...Fonts.style.text,
    fontWeight: '600',
    color: Colors.tealish
  },
  shareContainer: {
    marginVertical: 14,
    marginHorizontal: 24
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row'
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    backgroundColor: Colors.booger,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    ...Fonts.style.button,
    color: Colors.black
  },
  noTopMarginContainer: {
    marginTop: 0
  },
  logoOrderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  logoOrder: {
    // maxWidth: (Metrics.screenWidth * 0.30),
    width: (Metrics.screenWidth * 0.90),
    height: (Metrics.screenHeight * 0.20),
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  offeringDetailsContainer: {
    flex: 1
    // backgroundColor: Colors.twilightBlue
  },
  offeringDetailsLabel: {
    ...Fonts.style.label,
    color: Colors.white
  },
  offeringDetailsText: {
    flex: 1,
    fontFamily: Fonts.type.light,
    fontSize: 18,
    color: Colors.white
  },
  orderDetailsContainer: {
    flex: 1,
    marginHorizontal: 24
  },
  orderDetailsLabel: {
    ...Fonts.style.label,
    color: Colors.black
  },
  orderDetailsText: {
    fontFamily: Fonts.type.light,
    fontSize: 24,
    color: Colors.black
  },
  buttonContainer: {
    flex: 1,
    height: 50,
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  buttonTextStyle: {
    ...Fonts.style.button,
    color: Colors.black
  },
  buttonTextDisabled: {
    ...Fonts.style.button,
    color: Colors.lightGrey
  },

  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden'
  },
  textInput: {
    fontFamily: Fonts.type.chivo,
    flex: 1,
    paddingVertical: 0,
    color: Colors.white,
    height: 40
  },
  buttonDisabled: {
    backgroundColor: Colors.lightGreyGreen
  },
  logoContainerOrderList: {
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
  cancelledlogoContainerOrderList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 8,
    // width: (Metrics.screenWidth * 0.33),
    backgroundColor: Colors.verylightgrey
    // borderRightWidth: 0.5,
    // borderColor: Colors.pinkishGrey
  },
  logoOrderList: {
    // maxWidth: (Metrics.screenWidth * 0.30),
    width: 80, // (Metrics.screenWidth * 0.30),
    height: 80, // (Metrics.screenWidth * 0.30),
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  tabContainer: {
    flexDirection: 'row', 
    minHeight: 62,
    backgroundColor: Colors.white
  },
  highlightInner: {
    flex: 1, 
    flexDirection:'row',
    marginLeft: 25, 
    marginRight: 25
  },
  border: {
    borderTopWidth: 1, 
    borderColor: Colors.pinkishGrey
  },
  borderBottom: {
    borderColor: Colors.pinkishGrey,
    borderBottomWidth: 1
  },
  leftContainer: {
    width: 30, 
    justifyContent: 'center', 
    marginRight: 25,
    alignItems: 'center'
  },
  textContainer: { 
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  rightContainer: { 
    flex: 1,
    width: 48, 
    justifyContent: 'center', 
    alignItems: 'flex-end' 
  },
  chevron: { 
    fontWeight: '300', 
    fontSize: 24, 
    color: Colors.booger 
  },
  children: { 
    flex: 4,
    justifyContent: 'flex-start',
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  text: { 
    fontFamily: Fonts.type.base, 
    fontSize: 16, 
    color: Colors.drawerBlue 
  },
  contractContainer: {
    // flex: 1,
    marginVertical: Metrics.baseMargin
  },
  contractText: {
    ...Fonts.style.text,
    textAlign: 'left',
    marginVertical: Metrics.section,
    color: Colors.greyishBrown,
    fontSize: 16,
    lineHeight: 26
  },
  applicationView: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin
  },
  myImage: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  gradient: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowContainerBroker: {
    // marginVertical: 0,
    height: 100,
    backgroundColor: Colors.clear,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.lightGrey
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
  articleImage: {
    // maxWidth: (Metrics.screenWidth * 0.30),
    width: 80, // (Metrics.screenWidth * 0.30),
    height: 80, // (Metrics.screenWidth * 0.30),
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  articleImageContainer: {
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
  networkError:{
    marginLeft:20,
    marginRight:20, 
    fontSize:18,
    justifyContent:'center',
    color:'#000',
    alignSelf:'center', 
    marginTop:'50%', 
    fontWeight:'bold'
  },
  Videostyle: {
    flex: 1,
    height: 30,
    alignItems: 'flex-end',
    marginLeft: 50,
    width: 80,
    borderRadius: 6,
    justifyContent:'center',
    //marginLeft:20,
    //paddingVertical: 10,
    //paddingHorizontal: 24
  },
}

export default ApplicationStyles
