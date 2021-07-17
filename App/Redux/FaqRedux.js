import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

// import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchFaqs: ['filter'],
  fetchFaqsSuccess: ['faqs'],
  fetchFaqsFailure: ['error'],
})

export const FaqTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  faqs: [],

  fetching: null,
  error: null
})

/* ------------- Reducers ------------- */

/* FETCH_FAQS */

export const fetchFaqs = (state, { data }) => {
  return state.merge({ fetching: true, data, error: null })
}

export const fetchFaqsSuccess = (state, action) => {
  const { faqs } = action

  return state.merge({ fetching: false, error: null, faqs: faqs })
}

export const fetchFaqsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_FAQS]: fetchFaqs,
  [Types.FETCH_FAQS_SUCCESS]: fetchFaqsSuccess,
  [Types.FETCH_FAQS_FAILURE]: fetchFaqsFailure,
})
