import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,
  startupComplete: null,
  startupWithDeeplink: ['data'],
  startupWithDeeplinkSuccess: ['data'],
  resetDeeplink: null,

  /*
  serverStatus: ['serverStatus'],
  serverStatusSuccess: ['serverStatus'],
  serverStatusFailure: ['error'],
  */

  appStatus: ['appStatus'],
  appStatusSuccess: ['appStatus'],
  appStatusFailure: ['appStatusError'],
})

export const StartupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  startupComplete: false,
  // serverStatus: null,
  appStatus: null,
  appStatusError: null,
  deeplink: null,
  fetching: null,
  error: null
});

/* ------------- Reducers ------------- */

/* SERVER_STATUS */
/*
export const serverStatus = (state) => {
  return state.merge({ fetching: true, error: null });
}

export const serverStatusSuccess = (state, action) => {
  return state.merge({ fetching: false, error: null, serverStatus: action.serverStatus})
}

export const serverStatusFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error });
}
 */

/* APP_STATUS */
export const appStatus = (state) => {
  return state.merge({ fetching: true, error: null });
}

export const appStatusSuccess = (state, action) => {
  const { appStatus } = action;
  return state.merge({ fetching: false, error: null, appStatus });
}

export const appStatusFailure = (state, { appStatusError }) => {
  return state.merge({ fetching: false, appStatusError });
}

/* START_UP_COMPLETE */

export const startupComplete = (state: Object, action) => {
  return state.merge({ startupComplete: true })
}

export const startupWithDeeplink = (state: Object, action) => {
  return state
}

export const startupWithDeeplinkSuccess = (state: Object, action) => {
  const { data } = action
  return state.merge({ deeplink: data })
}

export const resetDeeplink = (state: Object, action) => {
  return state.merge({ deeplink: null })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STARTUP_COMPLETE]: startupComplete,
  [Types.STARTUP_WITH_DEEPLINK]: startupWithDeeplink,
  [Types.STARTUP_WITH_DEEPLINK_SUCCESS]: startupWithDeeplinkSuccess,
  [Types.RESET_DEEPLINK]: resetDeeplink,

  /*
  [Types.SERVER_STATUS]: serverStatus,
  [Types.SERVER_STATUS_SUCCESS]: serverStatusSuccess,
  [Types.SERVER_STATUS_FAILURE]: serverStatusFailure,
   */

  [Types.APP_STATUS]: appStatus,
  [Types.APP_STATUS_SUCCESS]: appStatusSuccess,
  [Types.APP_STATUS_FAILURE]: appStatusFailure,
})
