import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchTerms: ['filter'],
  fetchTermsSuccess: ['terms'],
  fetchTermsFailure: ['error'],

})

export const TermTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  terms: [],
  fetching: null,
  error: null
})

/* ------------- Reducers ------------- */

/* FETCH_TERMS */

export const fetchTerms = (state, { data }) => {
  return state.merge({ fetching: true, data, error: null })
}

export const fetchTermsSuccess = (state, action) => {
  const { terms } = action
  if( terms !== null ) {
    return state.merge({ fetching: false, error: null, terms: terms })    
  } else {
    return state.merge({ fetching: false, error: null })
  }
}

export const fetchTermsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_TERMS]: fetchTerms,
  [Types.FETCH_TERMS_SUCCESS]: fetchTermsSuccess,
  [Types.FETCH_TERMS_FAILURE]: fetchTermsFailure,
})
