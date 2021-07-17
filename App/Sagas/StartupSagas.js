import { put, call, select } from 'redux-saga/effects'
// import { is } from 'ramda'

import NotificationActions from '../Redux/NotificationRedux'
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux'

import SettingsActions from '../Redux/SettingsRedux'
import StartupActions from '../Redux/StartupRedux'

import OfferingActions from '../Redux/OfferingRedux'

import Logger from '../Lib/Logger'

// process STARTUP actions
export function * startup (action) {
  if (__DEV__ && console.tron) {
    // straight-up string logging
    // console.tron.log('Example of how to log via Reactotron.')

    // logging an object for better clarity
    // console.tron.log({
    //  message: 'pass objects for better logging',
    //  someGeneratorFunction: selectTemperature
    // })

    // fully customized log message
    // const subObject = { a: 1, b: [1, 2, 3], c: true }
    // subObject.circularDependency = subObject
    // console.tron.display({
    //  name: 'ClickIPO',
    //  preview: 'Expand this',
    //  value: {
    //    '💃': 'Example message.',
    //    subObject,
    //    someInlineFunction: () => true,
    //    someGeneratorFunction: startup,
    //    someNormalFunction: selectTemperature
    //  }
    // })
  }

  // init notification service
  yield put(NotificationActions.initNotificationsService())
  // init Settings
  yield put(SettingsActions.initSettings())

  yield put(StartupActions.startupComplete())


}

/*
export function * serverStatus (api, action) {
  try {
    const data = {
      sys_value: DeviceInfo.getVersion(),
      sys_platform: Platform.OS,
    }
    const serverStatusResponse = yield call(api.serverStatus, data);
    yield put(StartupActions.serverStatusSuccess(serverStatusResponse));
  } catch (err) {
    yield put(StartupActions.serverStatusFailure(err));
  }
}
*/

export function* appStatus(api, action) {
  try {
    const data = {
      platform: Platform.OS,
      version: DeviceInfo.getVersion()
    }
    const appStatusResponse = yield call(api.appStatus, data);
    yield put(StartupActions.appStatusSuccess(appStatusResponse));
  } catch (err) {
    yield put(StartupActions.appStatusFailure(err));
  }
}

//TODO: what is the purpose of this function
export function * startupComplete (action) {
  // Logger.log({ function: 'StartupSagas.startupComplete', action: action })
}

export function * startupWithDeeplink (action) {
  const { data } = action
  yield put(StartupActions.startupWithDeeplinkSuccess(data))
}

export const deeplink = (state: Object) => {
  // Logger.log({ function: 'OfferingSagas.offerings', state: state })
  return state.startup.deeplink
}

export const lOfferings = (state: Object) => {
  // Logger.log({ function: 'OfferingSagas.offerings', state: state })
  return state.offering.offerings
}