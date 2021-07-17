import { call, put, select } from 'redux-saga/effects'

import { Actions as NavigationActions } from 'react-native-router-flux'
import AppStateActions from '../Redux/AppStateRedux'
import { ACTIVE, BACKGROUND, INACTIVE } from '../Redux/AppStateRedux'

import Logger from '../Lib/Logger'

export function * appStateWillChange (action) {
  // Logger.log({ function: 'AppStateSagas.appStateWillChange', action: action })

}

/* ------------- AppState Sagas ------------- */

export function * appHasComeBackToForeground (action) {
  // Logger.log({ function: 'AppStateSagas.appHasComeBackToForeground', action: action })

  yield put(AppStateActions.appStateWillChange(ACTIVE))
}

export function * appWillMoveToBackground (action) {
  // Logger.log({ function: 'AppStateSagas.appWillMoveToBackground', action: action })

  yield call(NavigationActions['privacy'])

  yield put(AppStateActions.appStateWillChange(BACKGROUND))
}

export function * appHasMovedToInactive (action) {
  // Logger.log({ function: 'AppStateSagas.appHasMovedToInactive', action: action })
  const deeplinkInfo = yield select(deeplink)
  if(deeplinkInfo){
    NavigationActions.offerings()
  }
  yield put(AppStateActions.appStateWillChange(INACTIVE))
}


/* ------------- Scene Sagas ------------- */

export function * sceneWillChange (action) {
  // Logger.log({ function: 'AppStateSagas.sceneWillChange', action: action })

}

export function * sceneDidChange (action) {
  // Logger.log({ function: 'AppStateSagas.sceneDidChange', action: action })

}

export const deeplink = (state: Object) => {
  // Logger.log({ function: 'OfferingSagas.offerings', state: state })
  return state.startup.deeplink
}

