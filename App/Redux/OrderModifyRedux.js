import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

// import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    fetchActiveBrokerAccount: ['data'],
    fetchActiveBrokerAccountSuccess: ['getActiveBrokerAccount'],
    fetchActiveBrokerAccountFailure: ['error']
})
 
export const OrderModifyReduxTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    getActiveBrokerAccount: [], 
    singelOrder: [],
    fetching: false,
    error: null
})

/* ------------- Reducers ------------- */

/* FETCH_getActiveBrokerAccount */

export const fetchActiveBrokerAccount = (state: Object) => {
    return state.merge({ fetching: true, error: null })
}

export const fetchActiveBrokerAccountSuccess = (state: Object, action) => {
    // const { getActiveBrokerAccount } = action ////
    console.log(action)
    return state.merge({ fetching: false, error: null,fetchActiveBrokerAccountSuccess :action})
}

export const fetchActiveBrokerAccountFailure = (state: Object, { error }: Object) => {
    return state.merge({ fetching: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.FETCH_ACTIVE_BROKER_ACCOUNT]: fetchActiveBrokerAccount,
    [Types.FETCH_ACTIVE_BROKER_ACCOUNT_SUCCESS]: fetchActiveBrokerAccountSuccess,
    [Types.FETCH_ACTIVE_BROKER_ACCOUNT_FAILURE]: fetchActiveBrokerAccountFailure
})
