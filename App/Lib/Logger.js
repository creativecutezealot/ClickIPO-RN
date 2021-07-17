import DeviceInfo from 'react-native-device-info'

import Config from '../Config/'

export default {
  log: (message: Object) => {
    if (__DEV__) {
      if (console.tron) {
        console.tron.log(message)
      } else { // device
        console.log(message)
      }
    }
  }
}
