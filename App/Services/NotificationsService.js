

// a library to wrap and simplify notification calls
//import PushNotification from 'react-native-push-notification'
import firebase from '../Config/FirebaseConfig'
import DeviceInfo from 'react-native-device-info'

import Logger from '../Lib/Logger'

// our "constructor"
const create = () => {
  var deferredToken, deferredNotification

  const getPermissions = () => {
    //firebase.messaging().requestPermissions()
    // return new Promise((resolve, reject) => {
    //   PushNotification.checkPermissions((permissions) => {
    //     // Logger.log({ function: 'NotificationServices.getPermissions', permissions: permissions })
    //     resolve(permissions)
    //   })
    // })
  }

  const requestPermissions = () => {
    //Logger.log({ function: 'NotificationServices.requestPermissions'})

    firebase.messaging().requestPermissions();

  }

  const getFirebaseToken = () => {
    return new Promise((resolve) => {
      firebase.messaging().getToken().then((token) => {
        const token_  = { token: token, os: DeviceInfo.getSystemName() , name: DeviceInfo.getModel() }
        //Logger.log({ function: 'configureNotificationsService.getToken', token: token_ })
        resolve(token_)
      });
    })

  }

  // async CB func for native notifications api to PUSH tokens to
  const receivedToken = (token) => {
    //Logger.log({ function: 'NotificationServices.receivedToken', token: token })

    if (deferredToken) {
      // add device name to taken
      // const deviceName = DeviceInfo.getDeviceName()
      // token.name = deviceName
      // Logger.log({ function: 'NotificationServices.receivedToken', token: token })

      deferredToken.resolve(token)
      deferredToken = null
    }
  }

  // func for sagas to PULL data from
  const onReceivedToken = () => {
    // Logger.log({ function: 'NotificationServices.onReceivedToken' })

    return new Promise((resolve) => {
      firebase.messaging().onTokenRefresh((token) => {
        const token_  = { token: token, os: DeviceInfo.getSystemName() , name: DeviceInfo.getModel() }
        Logger.log({ function: 'configureNotificationsService.onTokenRefresh', token: token_ })
        resolve(token_)
      });
    })

  }

  // async CB func for native notifications api to PUSH notifications to
  const receivedNotification = (notification) => { // onMessage
    if (deferredNotification) {
      deferredNotification.resolve(notification)
      deferredNotification = null
    }
  }

  // func for sagas to PULL data from
  const onReceivedNotification = () => {  // nextMessage
    // Logger.log({ function: 'NotificationServices.onReceivedNotification' })
    // Logger.log('onReceivedNotification.notification=>')

    if (!deferredNotification) {
      deferredNotification = {}
      deferredNotification.promise = new Promise((resolve) => {
        deferredNotification.resolve = resolve
      })
    }

    return deferredNotification.promise
  }

  /**
  private helper methods
  */

  // export/return only "public" funcs
  return {
    receivedToken,
    receivedNotification,
    onReceivedToken,
    onReceivedNotification,
    getPermissions,
    requestPermissions,
    getFirebaseToken
  }
}

// let's return back our create method as the default.
export default {
  create
}
