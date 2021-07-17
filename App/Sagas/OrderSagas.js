import { call, put, select } from 'redux-saga/effects';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { findByProp } from 'ramdasauce'
import ToastActions from '../Redux/ToastRedux';
import OrderActions from '../Redux/OrderRedux';
import UserActions from '../Redux/UserRedux';

export function * fetchOrders (api, action) {

  const { data } = action
  const { forceRefresh } = data

  try {
    const localOrders = yield select(lOrders)

    // fetch orders
    const orders = yield call(api.getOrders, data)
    yield put(OrderActions.fetchOrdersSuccess(orders))

  } catch (err) {
    console.log('error in fetchOrder: ', err)
    yield put(OrderActions.fetchOrdersFailure(err))
}
}

export function * fetchOrder (api, action) {
  const { data } = action

  try {
    // make the call to the api
    const order = yield call(api.getOrder, data)

    yield put(OrderActions.fetchOrderSuccess(order))
  } catch (err) {
    // Logger.log({ function: 'OrderSagas.fetchOrders', err: err })
    yield put(OrderActions.fetchOrderFailure(err))
  }
}

export function * fetchActiveOrder (api, action) {
  const { data } = action

  try {
    const order = yield call(api.getActiveOrder, data)

    yield put(OrderActions.fetchActiveOrderSuccess(order))
  } catch (err) {
    yield put(OrderActions.fetchActiveOrderFailure(err))
  }
}

export function * submitOrder (api, action) {
  // Logger.log({ function: 'OrderSagas.submitOrder', action: action })

  const { data } = action;
  console.log('data in orderSagas: ', data);

  try {
    // make the call to the api
    yield call(api.createOrder, data.request);

    /*
      if the user has checked the `set new default amount box` in the order
      create screen then make the update user call with the requested amount
    */
    if (data.request.setDefaultAmount) {
      let user;
      const payload = {
        default_amount: data.request.requested_amount
      }
      user = yield call(api.updateUser, payload)
      //TODO: handle error if the update user api fails
      const updateUserMessage = { message: "Default Amount updated successfully", icon: 'good' }
      yield put(ToastActions.toastMessage(updateUserMessage));
      yield put(UserActions.updateProfileSuccess(user));

    }
    // the order object that we have in the front end is used to update the order list state in redux and display the data in the confirmation screen
    yield put(OrderActions.submitOrderSuccess(data.orderSubmit));
    NavigationActions.orderAccepted({ orderId: data.request.ext_id, offeringData: data.offering, orderPlaceAmount: data.request });

  } catch (err) {
    yield put(OrderActions.submitOrderFailure(err))
  }
}

export function * submitOrderReconfirmation (api, action) {
  const { data } = action;

  try {
    const orderReconfirmationResponse = yield call(api.orderReconfirmation, data);
    const messageInfo = { message: "Order reconfirmation was successful", icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo));
    yield put(OrderActions.submitOrderReconfirmationSuccess(orderReconfirmationResponse));
  } catch (err) {
    yield put(OrderActions.submitOrderReconfirmationFailure(err));
  }
}

export function * updateOrder (api, action) {
  const { data } = action;

  try {
    // make the call to the api
    const order = yield call(api.updateOrder, data.request)
    
    if(order){
      yield put(OrderActions.updateOrderSuccess(data.order))
      /*
        if the user has checked the `set new default amount box` in the order
        create screen then make the update user call with the requested amount
      */
      if (data.request.setDefaultAmount) {
        let user;
        const payload = {
          default_amount: data.request.requested_amount
        }
        user = yield call(api.updateUser, payload)
        //TODO: handle error if the update user api fails
        const updateUserMessage = { message: "Default Amount updated successfully", icon: 'good' }
        yield put(ToastActions.toastMessage(updateUserMessage));
        yield put(UserActions.updateProfileSuccess(user));

      }
      /*
        TODO: the get all orders api below needs to be fixed 
          instead of calling the api, change the status of the old order in the redux state 
          and then add the new order (the order with the new modified amount) to the redux state
      */
      const orders = yield call(api.getOrders)
      yield put(OrderActions.fetchOrdersSuccess(orders))

      //pass the order object to the orderModificationSuccess screen
      yield call(NavigationActions['orderModifySuccessScreen'], {order: data.order, orderFinalAmount: data.request});
    }else{
      // yield put(OrderActions.updateOrderFailure(err))
    }

  } catch (err) {
    // Logger.log({ function: 'OrderSagas.updateOrder', err: err })
    yield put(OrderActions.updateOrderFailure(err))
  }
}

export function * getActiveBrokerAccount (api, action) {
  // Logger.log({ function: 'OrderSagas.updateOrder', action: action })

  const { data } = action
   const data1 = {};
   var tempvalue = "1"
  try {
    // make the call to the api
   const order = yield call(api.getActiveBrokerAccount, data)

    yield put(OrderActions.getActiveBrokerAccountSuccess(order))
    //after updating first order.... fetching all orders
    //NavigationActions.offerings()
    const orders = yield call(api.getOrders, data1, tempvalue)

    yield put(OrderActions.fetchOrdersSuccess(orders))

    // display updated order
    // NavigationActions.orderAccepted(order)
  } catch (err) {
    // Logger.log({ function: 'OrderSagas.updateOrder', err: err })
    yield put(OrderActions.getActiveBrokerAccountFailure(err))
  }
}


export function * cancelOrder (api, action) {
  
  const { data } = action

  try {
    const order = yield select(lOrder, data.id) // var order before it is deleted
    
    // make the call to the api
    const cancelOrderResponse = yield call(api.cancelOrder, data)

    yield put(OrderActions.cancelOrderSuccess(cancelOrderResponse))

    const messageInfo = { message: "Order was cancelled successfully, you can place an order again while the offering is available to order!", icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo));
    yield call(NavigationActions['offerings'], { tabId: "1" });
    // yield put(NavigationActions.offerings())

    // NavigationActions.orderCanceled({ order: order })
  } catch (err) {
    yield put(OrderActions.cancelOrderFailure(err))
  }
}

/* ------------- Selectors ------------- */

export const lOrders = (state: Object) => {
  // Logger.log({ function: 'OrderSagas.lOrders', state: state })
  return state.order.orders
}

export const lOrder = (state: Object, orderId: String) => {
  // Logger.log({ function: 'OrderSagas.lOrder', state: state, orderId: orderId })

  const order = findByProp('id', orderId, state.order.orders)
  // Logger.log({ function: 'OrderSagas.order', order: order })

  return order
}
