import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initSettings: null,

  showIntro: ['showIntro'],
  showOfferingsTip: ['showTip'],
  touchIdSupported: ['touchIdSupported'],

  rememberMeEmail: ['email'],
  challengeFob: ['email'],
  setFob: ['fob'],
  addFob: ['fob'],
  updateFob: ['fob'],

  updateNotifications: ['notifications'],
  updateTouchId: ['touchId'],
  toggleTouchId: null,

  disableDeviceNotifications: ['id'],

  updateSocialIdentitiesLocal: ['data'],
  updateSocialIdentitiesLocalSuccess: ['socialIdentitiesLocal'],
  updateSocialIdentitiesLocalFailure: ['error']
})

export const SettingsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  showIntro: true,
  showTip: true,
  touchIdSupported: false,
  rememberMeEmail: null,
  fob: null,
  fobs: [],
  socialIdentitiesLocal:{}
})

/* ------------- Reducers ------------- */

/* SHOW_INTRO */

export const showIntro = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.showIntro', action: action })

  const { showIntro } = action

  return state.merge({ showIntro: showIntro })
}

export const showOfferingsTip = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.showIntro', action: action })

  const { showTip } = action

  return state.merge({ showTip: showTip })
}

export const touchIdSupported = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.touchIdSupported', action: action })

  const { touchIdSupported } = action

  return state.merge({ touchIdSupported: touchIdSupported })
}

export const rememberMeEmail = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.rememberMeEmail', action: action })

  const { email } = action

  return state.merge({ rememberMeEmail: email })
}

export const setFob = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.setFob', action: action })

  const { fob = null } = action

  return state.merge({ fob: fob })
}

export const addFob = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.addFob', action: action })

  return state.merge({ fob:  action.fob, fobs: [...state.fobs, action.fob] })
}

export const updateFob = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.updateFob', action: action })

  const { fob } = action
  const fobs = fob ? state.fobs.map(thisFob => (action.fob.id === thisFob.id) ? action.fob : thisFob) : state.fobs

  return state.merge({ fob: fob, fobs: fobs })
}

/* UPDATE_SOCIAL_IDENTITY_LOCAL */

export const updateSocialIdentitiesLocal = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const updateSocialIdentitiesLocalSuccess = (state: Object, action) => {

  const { socialIdentitiesLocal } = action

  return state.merge({ fetching: false, error: null, socialIdentitiesLocal: socialIdentitiesLocal })
}

export const updateSocialIdentitiesLocalFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SHOW_INTRO]: showIntro,
  [Types.SHOW_OFFERINGS_TIP]: showOfferingsTip,
  [Types.TOUCH_ID_SUPPORTED]: touchIdSupported,
  [Types.SET_FOB]: setFob,
  [Types.ADD_FOB]: addFob,
  [Types.UPDATE_FOB]: updateFob,
  [Types.REMEMBER_ME_EMAIL]: rememberMeEmail,

  [Types.UPDATE_SOCIAL_IDENTITIES_LOCAL]: updateSocialIdentitiesLocal,
  [Types.UPDATE_SOCIAL_IDENTITIES_LOCAL_SUCCESS]: updateSocialIdentitiesLocalSuccess,
  [Types.UPDATE_SOCIAL_IDENTITIES_LOCAL_FAILURE]: updateSocialIdentitiesLocalFailure,
})
