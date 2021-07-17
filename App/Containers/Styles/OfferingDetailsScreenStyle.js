
import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default styles = {
    offeringdescription : {
        ...Fonts.style.text,
        fontSize: 15
    },
    readTheProspectus:{
        color: Colors.tealish,
        textDecorationLine: "underline",
        textDecorationColor: Colors.tealish,
        ...Fonts.style.text,
        //color: Colors.smoke,
        fontWeight: 'bold',
    },
    iconDoc: {
        fontSize: 22,
        marginTop:5
    },
    flex: {
        flex: 1
    },
    subView: {
        marginTop : 6
    },
    renderIndustriesView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ConnectBrokerageAccountMainView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.clear
    },
    ConnectBrokerageAccountSubView: {
        height: 40,
        flex: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ConnectBrokerageAccountTouchableOpacity: {
        width: '100%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ConnectFollowBrokerageAccountTouchableOpacity: {
        width: '80%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    LinearGradientStyle: {
        flex: 1,
        width: '100%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: 12
        // paddingBottom: 10
    },
    LinearGradientStart: {
        x: 0.0,
        y: 0.0
    },
    LinearGradientEnd: {
        x: 1.0,
        y: 0.0
    },
    LinearGradientText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize:14,
        alignItems:'center',
        justifyContent:'center',
        // paddingBottom: 12
    },
    socialShareView: {
        paddingVertical: 0,
        paddingBottom: 18
    },
    socialShareSubView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    socialShareInnerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    followTouchableOpacity: {
        width: '100%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    followingLinearGradient: {
        flex: 1,
        width: '100%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    followingTextStyle: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 12
    },
    followTouchableOpacity: {
        width: '80%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    followText: {
        fontWeight: 'bold',
        fontSize: 12
    },
    followingLinearGradientStyle:{
        flex: 1,
        width: '80%',
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textstyle:{
        textDecorationLine: 'underline'
    },
    placeOrderText:{
        color: Colors.white,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: 12
    },
    learnMoreTextStyle:{
        textDecorationLine: 'underline'
    },
    descriptionView:{
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        paddingTop:0
    },
    LinearGradientText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize:14,
        alignItems:'center',
        justifyContent:'center',
        // paddingBottom: 12
    },
   NetWorkError:{
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    justifyContent: 'center',
    color: '#000',
    alignSelf: 'center',
    marginTop: '50%',
    fontWeight: 'bold'
  }, 
}