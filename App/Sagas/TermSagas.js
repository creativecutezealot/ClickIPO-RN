import { call, put, select } from 'redux-saga/effects'

import TermActions from '../Redux/TermRedux'

import {
  // Term,
} from '../Models'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

export function * fetchTerms (api, action) {
  // Logger.log({ function: 'TermSagas.fetchTerms', action: action })

  const { data } = action

  try {
    const localTerms = yield select(lTerms)
    // Logger.log({ function: 'TermSagas.fetchTerms', localTerms: localTerms })
    if (!localTerms || !localTerms[0]) { // TODO: will need a way to 'force update' these, TTL
      // fetch terms
      const terms = yield call(api.getTerms, data)
      // Logger.log({ function: 'TermSagas.fetchTerms', terms: terms })

      yield put(TermActions.fetchTermsSuccess(terms))
    } else {
      yield put(TermActions.fetchTermsSuccess(null))
    }
  } catch (err) {
    // Logger.log({ function: 'TermSagas.fetchTerms', err: err })
    yield put(TermActions.fetchTermsFailure(err))
  }
}

/* ------------- Selectors ------------- */

export const lTerms = (state: Object) => {
  // Logger.log({ function: 'TermSagas.lTerms', state: state })
  return state.term.terms
}

export const lTerm = (state: Object, termId: String) => {
  // Logger.log({ function: 'TermSagas.lTerm', state: state, termId: termId })

  const term = findByProp('id', termId, state.term.terms)
  // Logger.log({ function: 'TermSagas.term', term: term })

  return term
}
