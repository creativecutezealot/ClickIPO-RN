import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import Logger from '../Lib/Logger'



import { getBrokers } from '../Services/Api';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchBrokers: ['data'],
  fetchBrokersSuccess: ['brokers'],
  fetchBrokersFailure: ['error'],

  /* Ali: unwanted code
  fetchBroker: ['data'],
  fetchBrokerSuccess: ['broker'],
  fetchBrokerFailure: ['error'],
  */

  connectBroker: ['broker'],
  connectBrokerSuccess: ['brokerConnection'],
  connectBrokerFailure: ['error'],

  fetchBuyingPower: ['buyingPower'],
  fetchBuyingPowerSuccess: ['buyingPower'],
  fetchBuyingPowerFailure: ['error'],
  

  createBrokerConnection: ['brokerConnection'],
  createBrokerConnectionSuccess: ['brokerConnection'],
  createBrokerConnectionFailure: ['error'],

  deleteBrokerConnection: ['brokerConnection'],
  deleteBrokerConnectionSuccess: null,
  deleteBrokerConnectionFailure: ['error'],

  fetchBrokerAccounts: null,
  fetchBrokerAccountsSuccess: ['accounts'],
  fetchBrokerAccountsFailure: ['error'],

  setActiveBrokerAccount: ['account'],
  setActiveBrokerAccountSuccess: ['account'],
  setActiveBrokerAccountFailure: ['error'],

  resetBrokerError: ['error'],
})

export const BrokerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  brokers: [],
  buyingPower: null,
  accounts: [],
  inFlow: false,
  fetching: false,
  error: null
})

/* ------------- Reducers ------------- */

/* FETCH_BROKERS */

export const fetchBrokers = (state: Object, action) => {
  // Logger.log({ function: 'BrokerRedux.fetchBrokers', action: action })

  return state.merge({ fetching: true, error: null })
}

export const fetchBrokersSuccess = (state: Object, action) => {
  // Logger.log({ function: 'BrokerRedux.fetchBrokersSuccess', action: action })

  const { brokers } = action
  return state.merge({ fetching: false, error: null, brokers: brokers })
}

export const fetchBrokersFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* FETCH_OFFERING */

/* Ali: unwanted code
export const fetchBroker = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}


export const fetchBrokerSuccess = (state: Object, action) => {
  // const { data } = action // TODO:

  return state.merge({ fetching: false, error: null })
}

export const fetchBrokerFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}
*/

/* CONNECT_BROKER */

export const connectBroker = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const connectBrokerSuccess = (state: Object, action) => {
  // const { data } = action // TODO:

  return state.merge({ fetching: false, error: null })
}

export const connectBrokerFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* GET_BUYING_POWER */

export const fetchBuyingPower = (state) => {
  return state.merge({fetching: true, error: null});
}

export const fetchBuyingPowerSuccess = (state, action) => {
  return state.merge({fetching: false, error: null, buyingPower: action.buyingPower});
}

export const fetchBuyingPowerFailure = (state, { error }) => {
  return state.merge({fetching: false, error});
}

/* CREATE_BROKER_CONNECTION */

export const createBrokerConnection = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const createBrokerConnectionSuccess = (state: Object, action) => {
  // const { data } = action // TODO:
  //add a variable here responsible for checking to see if we are in the flow of the broker dealer connection
  //if this variable is true then show the link button, else show the sign in list
  // console.log('this is where inFlow is set to True')
  return state.merge({ fetching: false, error: null,  inFlow: true});
}

export const createBrokerConnectionFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* DELETE_BROKER_CONNECTION */

export const deleteBrokerConnection = (state: Object) => {
  // console.log('state in broker redux: ', state);
  return state.merge({ fetching: true, error: null })
}

export const deleteBrokerConnectionSuccess = (state: Object, action) => {
  // const { data } = action // TODO:
  // console.log('action in broker redux: ', action);

  return state.merge({ fetching: false, error: null, accounts: [] })
}

export const deleteBrokerConnectionFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* FETCH_BROKER_ACCOUNTS */

export const fetchBrokerAccounts = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchBrokerAccountsSuccess = (state: Object, action) => {
  const { accounts } = action

  return state.merge({ fetching: false, error: null, accounts: accounts })
}

export const fetchBrokerAccountsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* SET_ACTIVE_BROKER_ACCOUNT */

export const setActiveBrokerAccount = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const setActiveBrokerAccountSuccess = (state: Object, action) => {
  // const { data } = action // TODO:

  return state.merge({ fetching: false, error: null })
}

export const setActiveBrokerAccountFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

export const resetBrokerError = (state) => {
  return state.merge({ error: null });
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_BROKERS]: fetchBrokers,
  [Types.FETCH_BROKERS_SUCCESS]: fetchBrokersSuccess,
  [Types.FETCH_BROKERS_FAILURE]: fetchBrokersFailure,

  /* Ali: unwanted code
  [Types.FETCH_BROKER]: fetchBroker,
  [Types.FETCH_BROKER_SUCCESS]: fetchBrokerSuccess,
  [Types.FETCH_BROKER_FAILURE]: fetchBrokerFailure,
  */

  [Types.CONNECT_BROKER]: connectBroker,
  [Types.CONNECT_BROKER_SUCCESS]: connectBrokerSuccess,
  [Types.CONNECT_BROKER_FAILURE]: connectBrokerFailure,

  [Types.FETCH_BUYING_POWER]: fetchBuyingPower,
  [Types.FETCH_BUYING_POWER_SUCCESS]: fetchBuyingPowerSuccess,
  [Types.FETCH_BUYING_POWER_FAILURE]: fetchBuyingPowerFailure,

  [Types.CREATE_BROKER_CONNECTION]: createBrokerConnection,
  [Types.CREATE_BROKER_CONNECTION_SUCCESS]: createBrokerConnectionSuccess,
  [Types.CREATE_BROKER_CONNECTION_FAILURE]: createBrokerConnectionFailure,

  [Types.DELETE_BROKER_CONNECTION]: deleteBrokerConnection,
  [Types.DELETE_BROKER_CONNECTION_SUCCESS]: deleteBrokerConnectionSuccess,
  [Types.DELETE_BROKER_CONNECTION_FAILURE]: deleteBrokerConnectionFailure,

  [Types.FETCH_BROKER_ACCOUNTS]: fetchBrokerAccounts,
  [Types.FETCH_BROKER_ACCOUNTS_SUCCESS]: fetchBrokerAccountsSuccess,
  [Types.FETCH_BROKER_ACCOUNTS_FAILURE]: fetchBrokerAccountsFailure,

  [Types.SET_ACTIVE_BROKER_ACCOUNT]: setActiveBrokerAccount,
  [Types.SET_ACTIVE_BROKER_ACCOUNT_SUCCESS]: setActiveBrokerAccountSuccess,
  [Types.SET_ACTIVE_BROKER_ACCOUNT_FAILURE]: setActiveBrokerAccountFailure,

  [Types.RESET_BROKER_ERROR]: resetBrokerError,
})
