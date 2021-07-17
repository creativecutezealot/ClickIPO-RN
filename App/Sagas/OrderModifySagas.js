import { call, put, select } from 'redux-saga/effects'

import OrderModifyReduxActions from '../Redux/OrderModifyRedux'

import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  // Order,
  // ClickIpoError
} from '../Models'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

export function* fetchActiveBrokerAccount(api, action) {  
  const { data } = action
  const { forceRefresh } = data 
  
  try {  
      
    // fetch ActiveBrokerAccount 
    const getActiveBrokerAccount = yield call(api.getActiveBrokerAccount, data)
    console.log(getActiveBrokerAccount, 'getActiveBrokerAccount')

    yield put(OrderModifyReduxActions.fetchActiveBrokerAccountSuccess(getActiveBrokerAccount))
    //}
  } catch (err) { 

    yield put(OrderModifyReduxActions.fetchActiveBrokerAccountFailure(err))
  }
} 
