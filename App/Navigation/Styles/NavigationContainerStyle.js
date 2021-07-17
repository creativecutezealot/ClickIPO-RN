

import {Colors} from '../../Themes/'
import {
  Platform,
} from 'react-native';

export default {
  container: {
    flex: 1
  },
  navBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: Colors.white,
    ...Platform.select({
      ios: {
        height: 82,
      },
      android: {
        height: 54,
      },
    }),
  },
  title: {
    flex: 1
  },
  leftButton: {
    tintColor: Colors.greyishBrown
  },
  rightButton: {
    color: Colors.greyishBrown
  },
  tabBarStyle: {
    borderTopWidth: 0.5,
    borderColor: '#b7b7b7',
    backgroundColor: 'white',
    opacity: 1
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd'
  }
}
