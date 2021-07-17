import {
  call,
  put,
  fork
} from 'redux-saga/effects'

import NotificationActions from '../Redux/NotificationRedux'
import SettingsActions from '../Redux/SettingsRedux'
import DeviceInfo from 'react-native-device-info'


// a library to wrap and simplify notification calls
//import PushNotification from 'react-native-push-notification'
import firebase from '../Config/FirebaseConfig'

import Logger from '../Lib/Logger'

export function * initNotificationsService (notificationsService) {
  // Logger.log({ function: 'NotificationSagas.initNotificationService', notificationsService: notificationsService })

  try {
    yield call(configureNotificationsService, notificationsService)

    yield fork(receivedTokenWatcher, notificationsService)
  } catch (err) {
    // TODO: fail to configure/init the notification service; now what?
  }
}

export function * fetchPermissions (notificationsService, action) {
  try {
    const permissions = yield call(notificationsService.requestPermissions)
    // Logger.log({ function: 'NotificationSagas.fetchPermission', permissions: permissions })

    yield put(NotificationActions.fetchPermissionsSuccess(permissions))
  } catch (err) {
    yield put(NotificationActions.fetchPermissionsFailure(err))
  }
}

export function * requestPermissions (notificationsService, action) {
  //Logger.log({ function: 'NotificationSagas.requestPermissions', action: action })

  try {
    yield call(notificationsService.requestPermissions)
    const token = yield call(notificationsService.getFirebaseToken)
    yield put(NotificationActions.requestPermissionsSuccess(token))
    
    // request permission call is async, response is caught by 'watcher'
  } catch (err) {
    yield put(NotificationActions.requestPermissionsFailure(err))
  }
}

export function * requestPermissionsSuccess (api, action) {
  //Logger.log({ function: 'NotificationSagas.requestPermissionsSuccess', action: action })

  try {
    const { token } = action

    const retval = yield call(api.updateNotificationsToken, token)
   
    const notifications = {
      notificationsPrompt: false,
      notificationsEnabled: true
    }

    yield put(SettingsActions.updateNotifications(notifications))
  } catch (err) {
    yield put(NotificationActions.requestPermissionsFailure(err))
  }
}

export function * pushNotificationConfig (api, action) {

  const data = {
    push_notification: action.pushNotificationConfig.notificationsEnabled
  }

  try {
    const pushNotificationConfigResponse = yield call(api.pushNotificationConfig, data);
    yield put(NotificationActions.pushNotificationConfigSuccess(pushNotificationConfigResponse));
  } catch (err) {
    yield put(NotificationActions.pushNotificationConfigFailure(err));
  }
}

export function * receivedTokenWatcher (notificationsService) {
  while (true) {
    const token = yield call(notificationsService.onReceivedToken)
    yield put(NotificationActions.requestPermissionsSuccess(token))
  }
}

export function * receivedNotificationWatcher (notificationsService) {
  // Logger.log('notifications watcher started')
  while (true) {
    const notification = yield call(notificationsService.onReceivedNotification) // wait until notification is received
    // Logger.log('new notification received' + notification)
  }
}

const configureNotificationsService = (notificationsService) => {
    
    //Logger.log({ function: 'NotificationSagas.configureNotificationsService', firebase : firebase.messaging })        

    firebase.messaging().getToken((token) => {
        //Logger.log({ function: 'NotificationSagas.configureNotificationsService', token: token })        
    });
    
}

