

import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 30,
  marginVertical: 32,
  section: 12,
  baseMargin: 16,
  doubleBaseMargin: 32,
  smallMargin: 8,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  bottomBarHeight: 60,
  listItemHeight: 100,
  borderBottomWidth: 1.5,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  dimensions: {
    width: this.screenWidth,
    height: this.screenHeight
  },
  navBarHeight: (Platform.OS === 'ios') ? 80 : 56,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 60
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300
  }
}

export default metrics
