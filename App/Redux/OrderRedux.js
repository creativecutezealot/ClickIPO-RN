import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

// import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchOrders: ['data'],
  fetchOrdersSuccess: ['orders'],
  fetchOrdersFailure: ['error'],

  fetchOrder: ['data'],
  fetchOrderSuccess: ['oneOrder'],
  fetchOrderFailure: ['error'],

  fetchActiveOrder: ['data'],
  fetchActiveOrderSuccess: ['order'],
  fetchActiveOrderFailure: ['error'],

  submitOrderReconfirmation: ['data'],
  submitOrderReconfirmationSuccess: ['orderConfirmationResponse'],
  submitOrderReconfirmationFailure: ['error'],

  submitOrder: ['data'],
  submitOrderSuccess: ['order'],
  submitOrderFailure: ['error'],

  updateOrder: ['data'],
  updateOrderSuccess: ['order'],
  updateOrderFailure: ['error'],
  resetOrderError: ['error'],

  cancelOrder: ['data'],
  cancelOrderSuccess: ['orderId'],
  cancelOrderFailure: ['error'],

  clearOrderReconfirmationResponse: null
})

export const OrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  orders: [],
  order: [],
  oneOrder: '',
  orderReconfirmationResponse: null,
  fetching: false,
  error: null
})

/* ------------- Reducers ------------- */

/* FETCH_ORDERS */

export const fetchOrders = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchOrdersSuccess = (state: Object, action) => {
  const { orders } = action

  return state.merge({ fetching: false, error: null, orders: orders })
}

export const fetchOrdersFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}


/* FETCH ACTIVE_ORDER */

export const fetchActiveOrder = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchActiveOrderSuccess = (state: Object, action) => {
  const { order } = action

  return state.merge({ fetching: false, error: null, order: order })
}

export const fetchActiveOrderFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}


/* FETCH_ORDER */

export const fetchOrder = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchOrderSuccess = (state: Object, action) => {
  // const { order } = action  // TODO:
  return state.merge({ fetching: false, error: null, oneOrder: action.oneOrder })
}

export const fetchOrderFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}


/* ORDER_RECONFIRMATION */

export const submitOrderReconfirmation = (state) => {
  return state.merge({ fetching: true, error: null});
}

export const submitOrderReconfirmationSuccess = (state, action) => {
  return state.merge({ fetching: false, error: null, orderReconfirmationResponse: action.orderConfirmationResponse});
}

export const submitOrderReconfirmationFailure = (state, { error }) => {
  return state.merge({ fetching: false, error});
}

export const clearOrderReconfirmationResponse = (state) => {
  return state.merge({ fetching: false, error: null, orderReconfirmationResponse: null})
}

/* SUBMIT_ORDER */

export const submitOrder = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const submitOrderSuccess = (state: Object, action) => {
  const { order } = action

  return state.merge({ fetching: false, error: null, orders: [...state.orders, order] })
}

export const submitOrderFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* UPDATE_ORDER */

export const updateOrder = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const updateOrderSuccess = (state: Object, action) => {
  const { order } = action
  
  return state.merge({ fetching: false, error: null, orders: state.orders.map((thisOrder) => thisOrder.id === order.id ? order : thisOrder) })
}

export const updateOrderFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

export const resetOrderError = (state) => {
  return state.merge({ error: null });
}

/* CANCEL_ORDER */

export const cancelOrder = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const cancelOrderSuccess = (state: Object, action) => {

  // this is where we have to change the status of the order that was cancelled

  const { orderId } = action
  const orders = []
  state.orders.map((thisOrder) => thisOrder.id === orderId ? null : orders.push(thisOrder))

  return state.merge({ fetching: false, error: null, orders: orders })
}

export const cancelOrderFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_ORDERS]: fetchOrders,
  [Types.FETCH_ORDERS_SUCCESS]: fetchOrdersSuccess,
  [Types.FETCH_ORDERS_FAILURE]: fetchOrdersFailure,

  [Types.FETCH_ORDER]: fetchOrder,
  [Types.FETCH_ORDER_SUCCESS]: fetchOrderSuccess,
  [Types.FETCH_ORDER_FAILURE]: fetchOrderFailure,

  [Types.FETCH_ACTIVE_ORDER]: fetchActiveOrder,
  [Types.FETCH_ACTIVE_ORDER_SUCCESS]: fetchActiveOrderSuccess,
  [Types.FETCH_ACTIVE_ORDER_FAILURE]: fetchActiveOrderFailure,

  [Types.SUBMIT_ORDER_RECONFIRMATION]: submitOrderReconfirmation,
  [Types.SUBMIT_ORDER_RECONFIRMATION_SUCCESS]: submitOrderReconfirmationSuccess,
  [Types.SUBMIT_ORDER_RECONFIRMATION_FAILURE]: submitOrderReconfirmationFailure,

  [Types.SUBMIT_ORDER]: submitOrder,
  [Types.SUBMIT_ORDER_SUCCESS]: submitOrderSuccess,
  [Types.SUBMIT_ORDER_FAILURE]: submitOrderFailure,

  [Types.UPDATE_ORDER]: updateOrder,
  [Types.UPDATE_ORDER_SUCCESS]: updateOrderSuccess,
  [Types.UPDATE_ORDER_FAILURE]: updateOrderFailure,
  [Types.RESET_ORDER_ERROR]: resetOrderError,

  [Types.CANCEL_ORDER]: cancelOrder,
  [Types.CANCEL_ORDER_SUCCESS]: cancelOrderSuccess,
  [Types.CANCEL_ORDER_FAILURE]: cancelOrderFailure,

  [Types.CLEAR_ORDER_RECONFIRMATION_RESPONSE]: clearOrderReconfirmationResponse,
})
