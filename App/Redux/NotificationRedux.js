import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initNotificationsService: null,

  fetchPermissions: null,
  fetchPermissionsSuccess: ['permissions'],
  fetchPermissionsFailure: ['error'],

  requestPermissions: null,
  requestPermissionsSuccess: ['token'],
  requestPermissionsFailure: ['error'],

  pushNotificationConfig: ['pushNotificationConfig'],
  pushNotificationConfigSuccess: ['pushNotificationConfigResponse'],
  pushNotificationConfigFailure: ['error']
})

export const NotificationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isInit: false,
  permissions: null,
  pushNotificationConfigResponse: null,
  token: null,
  fetching: false,
  error: null
})

/* ------------- Reducers ------------- */

export const fetchPermissions = (state: Object) => {
  return state.merge({ fetching: true, error: null, permissions: null })
}

export const fetchPermissionsSuccess = (state: Object, action) => {
  const { permissions } = action

  return state.merge({ fetching: false, error: null, permissions: permissions })
}

export const fetchPermissionsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

export const requestPermissions = (state: Object) => {
  return state.merge({ fetching: true, error: null, token: null, permissions: null })
}

export const requestPermissionsSuccess = (state: Object, action) => {
  const { token } = action
  //Logger.log('NotificationRedux.requestPermissionsSuccess.token=> ' + token)
  
  return state.merge({ fetching: false, error: null, token: token })
}

export const requestPermissionsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

export const pushNotificationConfig = (state) => {
  state.merge({ fetching: true, error: null });
}

export const pushNotificationConfigSuccess = (state, action) => {
  state.merge({ fetching: false, error: null, pushNotificationConfigResponse: action.pushNotificationConfigResponse});
}

export const pushNotificationConfigFailure = (state, { error }) => {
  state.merge({ fetching: false, error });
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  // [Types.FETCH_PERMISSIONS]: fetchPermissions,
  // [Types.FETCH_PERMISSIONS_SUCCESS]: fetchPermissionsSuccess,
  // [Types.FETCH_PERMISSIONS_FAILURE]: fetchPermissionsFailure,

  // [Types.REQUEST_PERMISSIONS]: requestPermissions,
  // [Types.REQUEST_PERMISSIONS_SUCCESS]: requestPermissionsSuccess,
  // [Types.REQUEST_PERMISSIONS_FAILURE]: requestPermissionsFailure,

  // [Types.PUSH_NOTIFCATION_CONFIG]: pushNotificationConfig,
  // [Types.PUSH_NOTIFCATION_CONFIG_SUCCESS]: pushNotificationConfigSuccess,
  // [Types.PUSH_NOTIFCATION_CONFIG_FAILURE]: pushNotificationConfigFailure,
})
