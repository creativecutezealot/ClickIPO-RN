import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../../Themes';
import { Dimensions } from 'react-native'

export default Styles = {

    ScrollView: {
        flex: 1,
        marginBottom: 20,
        paddingTop: 30
    },
    ImageStyle: {
        alignSelf: 'center',
        resizeMode: 'contain',
        width: 147,
        height: 147,
        paddingBottom: 30
    },
    View: {
        flex: 1,
        paddingHorizontal: 24
    },
    View2: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 16,
        backgroundColor: Colors.clear
    },
    View3: {
        flex: 1,
        flexDirection: 'row'
    },
    FullButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.booger,
        borderWidth: 1,
        marginRight: 5,
        height: 60
    },
    FullButton2: {
        marginLeft: 5,
        height: 60
    },
}