import {
  call,
  put,
  select
} from 'redux-saga/effects'
import SettingsActions from '../Redux/SettingsRedux'
import UserActions from '../Redux/UserRedux'
// import { Actions as NavigationActions } from 'react-native-router-flux'

import { findByProp, findIndexByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

export function * initSettings (touchIdService, action) {
  // Logger.log({ function: 'SettingsSagas.initSettings', touchIdService: touchIdService, action: action })

  // notifications
  try {
    // TODO: fetch notification permissions

    // yield put(NotificationActions.fetchPermissions())
  } catch (err) {
    // Logger.log({ function: 'SettingsActions.initSettings', errNotifications: err })
  }

  // touchId
  try {
    const touchIdSupported = yield call(touchIdService.isSupported)
    // Logger.log({ function: 'SettingsSagas.initSettings', touchIdSupported: touchIdSupported })
    yield put(SettingsActions.touchIdSupported(touchIdSupported))
  } catch (err) {
    // Logger.log({ function: 'SettingsActions.initSettings', errTouchId: err })
  }
}

export function * updateNotifications (action) {
  // Logger.log({ function: 'SettingsSagas.updateNotifications', action: action })

  const { notifications } = action

  const currentFob = yield select(lFob)
  const updatedFob = { ...currentFob, ...notifications}
  // Logger.log({ function: 'SettingsSagas.updateNotifications', updatedFob: updatedFob })

  yield put(SettingsActions.updateFob(updatedFob))
}

export function * updateTouchId (action) {
  // Logger.log({ function: 'SettingsSagas.updateTouchId', action: action })

  const { touchId } = action

  const currentFob = yield select(lFob)
  const updatedFob = { ...currentFob, ...touchId}
  // Logger.log({ function: 'SettingsSagas.updateTouchId', updatedFob: updatedFob })

  yield put(SettingsActions.updateFob(updatedFob))
}

export function * showIntro (action) {
  // Logger.log({ function: 'SettingsSagas.showIntro', action: action })
}

export function * touchIdSupported (action) {
  // Logger.log({ function: 'SettingsSagas.touchIdSupported', action: action })
}

export function * toggleTouchId (action) {
  // Logger.log({ function: 'SettingsSagas.toggleTouchId', action: action })

  const touchId = {
    touchIdEnabled: false,
    touchIdPrompt: false,
    token: null
  }

  const isTouchIdEnabled = yield select(touchIdEnabled)

  if (!isTouchIdEnabled) {
    // TODO: prompt user to verify

    touchId.touchIdEnabled = true
    touchId.token = yield select(authToken)
  }

  // Logger.log({ function: 'SettingsSagas.toggleTouchId', touchId: touchId })

  yield put(SettingsActions.updateTouchId(touchId))
}

export function * toggleTouchIdSuccess (action) {
  // TODO: need to verify finger print before enabling touchid
}

export function * challengeFob (action) {
  // Logger.log({ function: 'SettingsSagas.challengeFob', action: action })

  const { email = null } = action
  const fobs = yield select(lFobs)
  // Logger.log({ function: 'SettingsSagas.challengeFob', fobs: fobs })

  var matchingFob = null
  if (fobs && fobs.length > 0 && email && email.length > 0) {
    matchingFob = findByProp('email', email, fobs)
  }
  // Logger.log({ function: 'SettingsSagas.challengeFob', matchingFob: matchingFob })

  yield put(SettingsActions.setFob(matchingFob))
}

export function * disableDeviceNotifications (action) {
  // Logger.log({ function: 'SettingsSagas.disableDeviceNotifications', action: action })

  try {
    const data = {
      user_devices_attributes: [
        {
          id: action.id,
          _destroy: true
        }
      ]
    }

    yield put(UserActions.updateProfile(data))
  } catch (err) {
    // Logger.log({ function: 'SettingsSagas.disableDeviceNotifications', err: err })
    // TODO: do something?
  }
}

export function * updateSocialIdentitiesLocal (action) {
  // Logger.log({ function: 'UserSagas.updateSocialIdentitiesLocal', action: action })

  const { data } = action

  try {
  
    yield put(SettingsActions.updateSocialIdentitiesLocalSuccess(data))
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(SettingsActions.updateSocialIdentitiesLocalFailure(err))
  }
}

/* ------------- Selectors ------------- */

export const userId = (state: Object) => {
  return state.user.user.id
}

export const touchIdEnabled = (state: Object) => {
  return state.settings.fob.touchIdEnabled
}

export const authToken = (state: Object) => {
  return state.user.token
}

export const lFobs = (state: Object) => {
  return state.settings.fobs
}

export const lFob = (state: Object) => {
  return state.settings.fob
}

export const socialIdentitiesLocal = (state: Object) => {
  // Logger.log({ function: 'UserSagas.socialIdentitiesLocal', state: state })
  return state.settings.socialIdentitiesLocal
}