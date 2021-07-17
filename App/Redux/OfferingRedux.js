import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

// import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadOfferings: ['data'],

  fetchOfferings: ['data'],
  fetchOfferingsSuccess: ['offerings'],
  fetchOfferingsFailure: ['error'],

  fetchOffering: ['data'],
  fetchOfferingSuccess: ['offering'],
  fetchOfferingFailure: ['error'],

  fetchIndustries: ['data'],
  fetchIndustriesSuccess: ['industries'],
  fetchIndustriesFailure: ['error'],

  markRead: ['offeringId'],
  markReadSuccess: ['offering'],
  markReadFailure: ['error'],

  toggleSaved: ['offeringId'],
  toggleSavedSuccess: ['offering'],
  toggleSavedFailure: ['error'],

  updateViewedAt: ['offeringId'],
  updateViewedAtSuccess: ['offering'],
  updateViewedAtFailure: ['error'],

  toggleView: ['view']
})

export const OfferingTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  offerings: [],
  lastUpdate: null,
  offering: null,
  view: 'CARD',

  fetching: false,
  error: null
})

/* ------------- Reducers ------------- */

/* FETCH_OFFERINGS */

export const fetchOfferings = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchOfferingsSuccess = (state: Object, action) => {
  // Logger.log({ function: 'OfferingRedux.fetchOfferingsSuccess', action: action })

  const { offerings } = action
  if(offerings !== null){
    return state.merge({ fetching: false, error: null, offerings: offerings })
  } else {
    return state.merge({ fetching: false, error: null })
  }
}

export const fetchOfferingsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* FETCH_OFFERING */

export const fetchOffering = (state: Object, action) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchOfferingSuccess = (state: Object, action) => {
  // const { data } = action // TODO:
  const { offering } = action;
  // offering['detailViewLoadedAt'] = new Date()
  // const newOfferings = state.offerings.map((thisOffering) => {
  //   if(thisOffering.id === offering.id) {
  //     return offering
  //   } else {
  //     return thisOffering
  //   }
  // })
  // return state.merge({ fetching: false, error: null, offerings: newOfferings })
  return state.merge({ fetching: false, error: null, offering: [offering] })
}

export const fetchOfferingFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* FETCH_INDUSTRIES */

export const fetchIndustries = (state: Object, action) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchIndustriesSuccess = (state: Object, action) => {
 
  const { industries } = action;
  return state.merge({ fetching: false, error: null, industry: [industries] })
}

export const fetchIndustriesFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* MARK_READ */

export const markRead = (state: Object, action) => {

  // updating before api/update call so user receives immediate feedback; if api call fails the modified "save" value will be reverted
  const { offeringId } = action

  return state.merge({ fetching: false, error: null })
}

export const markReadSuccess = (state: Object, action) => {

  const { offering } = action

  return state.merge({ fetching: true, error: null, offerings: state.offerings.map((thisOffering) => thisOffering.id === offering ? { ...thisOffering, read: true } : thisOffering) })
}

export const markReadFailure = (state: Object, { error }: Object) => {
  Logger.log({ function: 'OfferingRedux.markReadFailure' })

  // TODO: revert to origional value of "save" since we were unable to persist it to the server

  return state.merge({ fetching: false, error })
}


/* TOGGLE_SAVED */

export const toggleSaved = (state: Object, action) => {
  // Logger.log({ function: 'OfferingRedux.toggleSaved', action: action })

  // updating before api/update call so user receives immediate feedback; if api call fails the modified "save" value will be reverted
  const { offeringId } = action
  // const offering = findByProp('id', offeringId, state.offering.offerings)
  // Logger.log({ function: 'OfferingRedux.toggleSaved', offering: offering })

  // offering.save = !offering.save

  return state.merge({ fetching: true, error: null, offerings: state.offerings.map((thisOffering) => thisOffering.id === offeringId ? { ...thisOffering, save: !thisOffering.save } : thisOffering) })
}

export const toggleSavedSuccess = (state: Object, action) => {
  // Logger.log({ function: 'OfferingRedux.toggleSavedSuccess', action: action })

  return state.merge({ fetching: false, error: null })
}

export const toggleSavedFailure = (state: Object, { error }: Object) => {
  // Logger.log({ function: 'OfferingRedux.toggleSavedFailure' })

  // TODO: revert to origional value of "save" since we were unable to persist it to the server

  return state.merge({ fetching: false, error })
}

/* UPDATE_VIEWED_AT */

export const updateViewedAt = (state: Object, action) => {
  // Logger.log({ function: 'OfferingRedux.updateViewedAt', action: action })

  // updating before api/update call so user receives immediate feedback; if api call fails the modified "save" value will be reverted
  const { offeringId } = action
  const viewedAt = Date()

  return state.merge({ fetching: true, error: null, offerings: state.offerings.map((thisOffering) => thisOffering.id === offeringId ? { ...thisOffering, viewedAt: viewedAt } : thisOffering) })
}

export const updateViewedAtSuccess = (state: Object, action) => {
  // Logger.log({ function: 'OfferingRedux.updateViewedAtSuccess', action: action })

  return state.merge({ fetching: false, error: null })
}

export const updateViewedAtFailure = (state: Object, { error }: Object) => {
  // Logger.log({ function: 'OfferingRedux.updateViewedAtFailure' })

  // TODO: revert to origional value of "save" since we were unable to persist it to the server

  return state.merge({ fetching: false, error })
}

/* TOGGLE_VIEW */

export const toggleView = (state: Object, action) => {
  // Logger.log({ function: 'OfferingRedux.toggleView', action: action })

  const { view } = action

  return state.merge({ view: view })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_OFFERINGS]: fetchOfferings,
  [Types.FETCH_OFFERINGS_SUCCESS]: fetchOfferingsSuccess,
  [Types.FETCH_OFFERINGS_FAILURE]: fetchOfferingsFailure,

  [Types.FETCH_OFFERING]: fetchOffering,
  [Types.FETCH_OFFERING_SUCCESS]: fetchOfferingSuccess,
  [Types.FETCH_OFFERING_FAILURE]: fetchOfferingFailure,

  [Types.FETCH_INDUSTRIES]: fetchIndustries,
  [Types.FETCH_INDUSTRIES_SUCCESS]: fetchIndustriesSuccess,
  [Types.FETCH_INDUSTRIES_FAILURE]: fetchIndustriesFailure,

  [Types.MARK_READ]: markRead,
  [Types.MARK_READ_SUCCESS]: markReadSuccess,
  [Types.MARK_READ_FAILURE]: markReadFailure,

  [Types.TOGGLE_SAVED]: toggleSaved,
  [Types.TOGGLE_SAVED_SUCCESS]: toggleSavedSuccess,
  [Types.TOGGLE_SAVED_FAILURE]: toggleSavedFailure,

  [Types.UPDATE_VIEWED_AT]: updateViewedAt,
  [Types.UPDATE_VIEWED_AT_SUCCESS]: updateViewedAtSuccess,
  [Types.UPDATE_VIEWED_AT_FAILURE]: updateViewedAtFailure,

  [Types.TOGGLE_VIEW]: toggleView
})
