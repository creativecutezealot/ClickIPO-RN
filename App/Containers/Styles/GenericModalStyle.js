import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default styles = {
    Component: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 25
    },
    LinearGradentstyle: {
        flex: 1,
        width: 300
    },
    ViewStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    ViewStyle1: { margin: 25 },

    ScrollStyle: { flex: 1 },

    TouchableOpacity: {
        position: 'absolute',
        top: -10,
        right: -10,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.booger,
        borderRadius: 50
    },
    ClickIcon: {
        fontFamily: Fonts.type.light,
        fontSize: 22,
        color: Colors.white,
        padding: 6,
        backgroundColor: Colors.clear
    },


}

