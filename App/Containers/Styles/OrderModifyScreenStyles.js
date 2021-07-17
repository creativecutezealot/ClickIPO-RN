
import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default styles = {
  scrollViewStyle: {
    flex: 1,
    marginBottom: 10
  },
  offeringDetailsContainerView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: 24
  },
  flex: {
    flex: 1
  },
  priceViewStyle: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 24
  },
  headingViewStyle: {
    flex: 1,
    marginVertical: 12
  },
  headingTextStyle: {
    fontFamily: Fonts.type.base,
    fontSize: 16,
    color: Colors.greyishBrown
  },
  InvestmestMainViewStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  InvestmestSubViewStyle: {
    flex: 1,
    flexDirection: 'row'
  },
  InvestmestInnerViewStyle: {
    flex: 10,
    marginTop: 12
  },
  ApproximateViewStyles: {
    flex: 10,
    marginTop: 12
  },
  InputTextMainViewStyle: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'center'
  },
  InputTextSubViewStyle: {
    flex: 10,
    justifyContent: 'center'
  },
  InputTextInnerViewStyle: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    height: 40
  },
  InputTextStyle: {
    fontFamily: Fonts.type.chivo,
    flex: 1,
    paddingVertical: 0,
    color: Colors.white,
    height: 40,
    textAlign: 'left',
    fontSize: 24,
    color: Colors.black,
    fontWeight: 'normal'
  },
  equalView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  equalTextStyle: {
    fontFamily: Fonts.type.light,
    fontSize: 24,
    color: Colors.black,
    fontFamily: Fonts.type.bold,
    fontSize: 20
  },
  approximateSharesViewStyles: {
    flex: 10,
    justifyContent: 'center',
    height: 40
  },
  approximateSharesTextStyles: {
    //fontFamily: Fonts.type.light,
    fontSize: 24,
    color: Colors.black,
    fontSize: 24,
    fontFamily: Fonts.type.chivo
  },
  buyingPowerViewStyle: {
    flex: 1,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buyingPowerTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.greyishBrown,
    textAlign: 'center'
  },
  InformationViewStyle: {
    flex: 1,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  InformationTextStyle: {
    fontFamily: Fonts.type.base,
    fontSize: 12,
    color: Colors.greyishBrown,
    textAlign: 'center',
    lineHeight: 18
  },
  buttonViewStyle: {
    height: 50,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 15,
    backgroundColor: Colors.clear
  },
  buttonInnerViewstyle: {
    flex: 1,
    flexDirection: 'row'
  },
  cancelButtonStyle: {
    backgroundColor: Colors.orange,
    marginRight: 10
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
  }
}