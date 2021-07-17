import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import { ActionConst as RouterFluxActions } from 'react-native-router-flux'

export const ACTIVE = 'ACTIVE'
export const BACKGROUND = 'BACKGROUND'
export const INACTIVE = 'INACTIVE'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  appStateWillChange: ['appState'],
})

export const AppStateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  appState: 'active',

  scene: null,
  nextScene: null,

  error: null
})

/* ------------- Reducers ------------- */

export const appStateWillChange = (state, action) => {
  const { appState } = action

  return state.merge({ appState: appState, error: null })
}

export const sceneWillChange = (state, action) => {
  const { scene } = action

  // TODO: ignore drawer focus actions?

  return state.merge({ nextScene: scene })
}

export const sceneDidChange = (state, action) => {
  const { scene } = action

  return state.merge({ scene: scene, nextScene: null })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.APP_STATE_WILL_CHANGE]: appStateWillChange,
  [RouterFluxActions.PUSH]: sceneWillChange,
  [RouterFluxActions.FOCUS]: sceneDidChange,
})
