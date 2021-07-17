import Colors from './Colors'

const type = {
  base: 'SourceSansPro-Regular',
  light: 'SourceSansPro-Light',
  bold: 'SourceSansPro-Bold',
  emphasis: 'SourceSansPro-It',
  input: 'HelveticaNeue',
  black: 'SourceSansPro-Black',
  chivo: 'Chivo-Regular',
}

const size = { // 11.7, 10, 8.3, 6.7, 6.3, 6, 5.7, 5.3, 4.7, 4
  xlarge: 38, // 11.7
  large: 30, // 10
  medium: 26, // 8.3
  note: 20, // 7.3
  regular: 20, // 6.7, 6.3, 6
  small: 16, // 5.7, 5.3
  tiny: 14 // 4.7, 4.3
}

const style = {
  headline: {
    fontFamily: type.light,
    fontSize: 35 // 11.7
    // black
  },
  title: {
    fontFamily: type.base,
    fontSize: 32 // 10
  },
  subTitle: {
    fontFamily: type.base,
    fontSize: 30 // 8.3
  },
  message: {
    fontFamily: type.light,
    fontSize: 30 // 8.3
  },
  heading: {
    fontFamily: type.bold,
    fontSize: 24 // 6.7
  },
  button: {
    fontFamily: type.base,
    fontSize: 17 // 6.7
  },
  input: {
    fontFamily: type.chivo,
    fontSize: 17 // 6.7,
  },
  important: {
    fontFamily: type.emphasis,
    fontSize: 20 // 6.3
  },
  subHeadline: {
    fontFamily: type.light,
    fontSize: 19 // 6
    // greyishBrown
  },
  header: {
    fontFamily: type.bold,
    fontSize: 18 // 5.7
    // greyishBrown
  },
  label: {
    fontFamily: type.bold,
    fontSize: 17 // 5.3
  },
  text: {
    fontFamily: type.chivo,
    fontSize: 14,
    color: Colors.blueSteel,
    lineHeight: 24
     // 5.3
    // greyishBrown
  },
  subHeader: {
    fontFamily: type.light,
    fontSize: 17 // 5.3
    // greyishBrown
  },
  navButton: {
    fontFamily: type.light,
    fontSize: 17 // 5.3
  },
  note: {
    fontFamily: type.light,
    fontSize: 14 // 4.7
  },
  disclaimer: {
    fontFamily: type.base,
    fontSize: 14 // 4.7
  },
  toggleLabel: {
    fontFamily: type.base,
    fontSize: 13 // 4.7
  },
  tip: {
    fontFamily: type.light,
    fontSize: 13 // 4
  },
  bold: {
    fontFamily: type.bold
  }
}

export default {
  type,
  size,
  style
}
