import { call, put, select } from 'redux-saga/effects'
import BrokerActions from '../Redux/BrokerRedux'
import UserActions from '../Redux/UserRedux'
import BrokerConnectionService from '../Services/BrokerConnectionService'
import { Actions as NavigationActions } from 'react-native-router-flux'
import {query} from '../Lib/Utilities'

import {
  // Broker,
  // ClickIpoError
} from '../Models'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

export function * fetchBrokers (api, action) {
  // Logger.log({ function: 'BrokerSagas.fetchBrokers', action: action })

  const { data } = action
  const { forceRefresh } = data

  try {

    //the commented code below is responsible for caching the list of broker dealers locally to avoid multiple api calls 
    //since the user does not make many calls to this api, we have decided to fetch the list of brokers everytime the user goes to the brokerListView
    // if a brokerDealer is added while the user is logged in and looking at this page they will not see the new brokerDealer unless they quit the app 
    //we made this change to avoid this situation 09/05/2018 -- Ali

    // const localBrokers = yield select(lBrokers)

    // if (!localBrokers || !localBrokers[0] || forceRefresh) { // TODO: will need a way to 'force update' these, TTL
      // fetch brokers
      const brokers = yield call(api.getBrokers, data)
      yield put(BrokerActions.fetchBrokersSuccess(brokers))
    // }
  } catch (err) {
    yield put(BrokerActions.fetchBrokersFailure(err))
  }
}

/* Ali: unwanted code
export function * fetchBroker (api, action) {
  // Logger.log({ function: 'BrokerSagas.fetchBroker', action: action })

  const { data } = action

  try {
    // make the call to the api
    const broker = yield call(api.getBroker, data)

    yield put(BrokerActions.fetchBrokerSuccess(broker))
  } catch (err) {
    // Logger.log({ function: 'BrokerSagas.fetchBroker', err: err })
    yield put(BrokerActions.fetchBrokerFailure(err))
  }
}
*/

export function * connectBroker (action) {
  try {
    const { broker } = action
    // var authorizeUrl = null;
    if(broker.name === 'Tradier'){
      var requestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      var authorizeUrl = broker.authorizedurl + '?' + query({client_id: broker.bd_id, scope: 'read', state: requestId})
    } else if(broker.name === 'Just2Trade') {
      var requestId = 'none'
      var authorizeUrl = broker.authorizedurl + '?' + query({client_id: broker.bd_id, response_type: 'code', redirect_uri: broker.callbackurl})
    } else if(broker.name === 'TradeStation') {
      var requestId = 'none'
      var authorizeUrl = broker.authorizedurl + '?' + query({client_id: broker.bd_id, response_type: 'code', redirect_uri: broker.callbackurl})
    }
    const oauthConfig = {
      authorizeUrl: authorizeUrl,
      callbackUrl: broker.callbackurl,
      title: 'Connect to ' + broker.name,
      requestId: requestId
    }
    const brokerConnectionService = new BrokerConnectionService(broker, oauthConfig)
    const code = yield call(brokerConnectionService.oauth, {})
    brokerConnection = yield call(brokerConnectionService.fetchAccessToken, code)

    // console.log('connect broker saga start brokerConnection: ', brokerConnection)

    yield put(BrokerActions.connectBrokerSuccess(brokerConnection))

  } catch (err) {
    yield put(BrokerActions.connectBrokerFailure(err))
  }
}
// connectBrokerSuccess should show the page with link account on it
export function * connectBrokerSuccess(action) {
  // Logger.log({ function: 'BrokerSagas.connectBrokerSuccess', action: action })
  try {
    const { brokerConnection } = action
    //for unified api
    // yield put(BrokerActions.setActiveBrokerAccount(brokerConnection))
    //instead of going to createBrokerConnection we have to go to link accounts 
    
    //update the redux to update the apps state store
    // yield put(BrokerActions.connnectBrokerSuccess(brokerConnection))



    yield put(BrokerActions.createBrokerConnection(brokerConnection))
  } catch (err) {
    yield put(BrokerActions.connectBrokerFailure(err))
  }
}

export function * createBrokerConnection (api, action) {
  //Logger.log({ function: 'BrokerSagas.createBrokerConnection', action: action })
  
  try {
    const { brokerConnection } = action

    // create a new connection and post to server
    const newBrokerConnection = yield call(api.createBrokerConnection, brokerConnection)

    yield put(BrokerActions.createBrokerConnectionSuccess(newBrokerConnection))
  } catch (err) {
    Logger.log({ function: 'BrokerSagas.createBrokerConnection', err: err })
    yield put(BrokerActions.createBrokerConnectionFailure(err))
  }
}

export function * createBrokerConnectionSuccess(api, action) {
  Logger.log({ function: 'BrokerSagas.createBrokerConnectionSuccess', action: action })
  
  try {
    yield put(UserActions.fetchUser())
    yield call(NavigationActions['pop'])

  } catch (err) {
    Logger.log({ function: 'BrokerSagas.createBrokerConnectionSuccess', err: err })
    yield put(BrokerActions.createBrokerConnectionFailure(err))
  }
}

export function * deleteBrokerConnection(api, action) {
  Logger.log({ function: 'BrokerSagas.deleteBrokerConnection', action: action })

  try {
    const { brokerConnection } = action
    const deletedBrokerAccount = yield call(api.deleteBrokerConnection, brokerConnection)
    yield put(BrokerActions.deleteBrokerConnectionSuccess())
  } catch (err) {
    // Logger.log({ function: 'BrokerSagas.deleteBrokerConnection', err: err })
    yield put(BrokerActions.deleteBrokerConnectionFailure(err))
  }
}

export function * deleteBrokerConnectionSuccess(action) {
  Logger.log({ function: 'BrokerSagas.deleteBrokerConnectionSuccess', action: action })

  try {
    yield put(UserActions.fetchUser())
  } catch (err) {
    Logger.log({ function: 'BrokerSagas.deleteBrokerConnectionSuccess', err: err })
    yield put(BrokerActions.deleteBrokerConnectionFailure(err))
  }
}

export function * fetchBuyingPower(api, action) {
  try {
  // make the call to the api
    const buyingPower = yield call(api.getBuyingPower)
    yield put(BrokerActions.fetchBuyingPowerSuccess(buyingPower))
  } catch (err) {
    yield put(BrokerActions.fetchBuyingPowerFailure(err))
  }
}

export function * fetchBrokerAccounts (api, action) {
  Logger.log({ function: 'BrokerSagas.fetchBrokerAccounts', action: action })

  try {
    const accounts = yield call(api.getBrokerConnectionAccounts, {})

    yield put(BrokerActions.fetchBrokerAccountsSuccess(accounts))
  } catch (err) {
    Logger.log({ function: 'BrokerSagas.fetchBrokerAccounts', err: err })
    yield put(BrokerActions.fetchBrokerAccountsFailure(err))
  }
}

export function * fetchBrokerAccountsSuccess(action) {
  Logger.log({ function: 'BrokerSagas.fetchBrokerAccountsSuccess', action: action })

  try {
    //
  } catch (err) {
    Logger.log({ function: 'BrokerSagas.fetchBrokerAccountsSuccess', err: err })
    yield put(BrokerActions.fetchBrokerAccountsFailure(err))
  }
}

export function * setActiveBrokerAccount (api, action) {

  try {
    const { account } = action
    const newBrokerAccount = yield call(api.createBrokerAccount, account)

    yield put(BrokerActions.setActiveBrokerAccountSuccess(newBrokerAccount))
  } catch (err) {
    yield put(BrokerActions.setActiveBrokerAccountFailure(err))
  }
}

export function * setActiveBrokerAccountSuccess(action) {
  Logger.log({ function: 'BrokerSagas.setActiveBrokerAccountSuccess', action: action })

  try {
    yield put(UserActions.fetchUser())
  } catch (err) {
    Logger.log({ function: 'BrokerSagas.setActiveBrokerAccountSuccess', err: err })
    yield put(BrokerActions.setActiveBrokerAccountFailure(err))
  }
}



  export function * getActiveBrokerAccount (api, action) {

    try {
      const activeBrokerAcconunt = yield call(api.getActiveBrokerAccount)
  
      yield put(BrokerActions.getActiveBrokerAccountSuccess(activeBrokerAcconunt))
    } catch (err) {
      yield put(BrokerActions.getActiveBrokerAccountFailure(err))
    }
  }
  
  export function * getActiveBrokerAccountSuccess(action) {
  
    try {
      // yield put(UserActions.fetchUser())
    } catch (err) {
      yield put(BrokerActions.getActiveBrokerAccountFailure(err))
    }


}


/* ------------- Selectors ------------- */

export const lBrokers = (state: Object) => {
  // Logger.log({ function: 'BrokerSagas.brokers', state: state })
  return state.broker.brokers
}

export const lBroker = (state: Object, brokerId: String) => {
  // Logger.log({ function: 'BrokerSagas.broker', state: state, brokerId: brokerId })

  const broker = findByProp('id', brokerId, state.broker.brokers)
  // Logger.log({ function: 'BrokerSagas.broker', broker: broker })

  return broker
}

/*
export const lConnection = (state: Object) => {
  // Logger.log({ function: 'BrokerSagas.brokers', state: state })
  return state.broker.brokers
}

export const lAccount = (state: Object) => {
  // Logger.log({ function: 'BrokerSagas.brokers', state: state })
  return state.broker.brokers
}
*/
