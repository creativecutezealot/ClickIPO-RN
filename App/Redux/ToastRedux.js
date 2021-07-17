import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  toastMessage: ['messageInfo'],
})

export const SettingsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  messageInfo: null,
})

/* ------------- Reducers ------------- */

/* SHOW_INTRO */

export const toastMessage = (state: Object, action) => {
  // Logger.log({ function: 'SettingsRedux.showIntro', action: action })

  const { messageInfo } = action

  return state.merge({ messageInfo: messageInfo })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TOAST_MESSAGE]: toastMessage
})