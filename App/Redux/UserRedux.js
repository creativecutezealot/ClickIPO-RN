import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  register: ['data'],
  registerSuccess: ['token'],
  registerFailure: ['error'],

  signin: ['data'],
  signinAuto: null,
  signinTouchId: null,
  signinSuccess: ['token'],
  signinFailure: ['error'],

  verifyEmail: ['verifyEmailToken'],
  verifyEmailSuccess: ['verifyEmailResponse'],
  verifyEmailFailure: ['error'],
  clearVerificationResponse: null,

  resendVerificationEmail: ['data'],
  resendVerificationEmailSuccess: ['resendVerificationEmailResponse'],
  resendVerificationEmailFailure: ['error'],

  forgotPassword: ['data'],
  forgotPasswordSuccess: ['data'],
  forgotPasswordFailure: ['error'],

  resetPassword: ['data'],
  resetPasswordSuccess: ['data'],
  resetPasswordFailure: ['error'],

  checkUserExists: ['data'],
  checkUserExistsSuccess: ['data'],
  checkUserExistsFailure: ['error'],

  resendPasswordResetEmail: ['data'],
  resendPasswordResetEmailSuccess: ['data'],
  resendPasswordResetEmailFailure: ['error'],

  sendProspectusToUser: ['data'],
  sendProspectusToUserSuccess: ['data'],
  sendProspectusToUserFailure: ['error'],

  initSession: ['token'],
  initSessionSuccess: ['user'],
  initSessionFailure: ['error'],

  updateProfile: ['data'],
  updateProfileSuccess: ['user'],
  updateProfileFailure: ['error'],

  updateProfilePassword: ['isPasswordValid'],
  updateProfilePasswordSuccess: ['isPasswordValid'],
  updateProfilePasswordFailure: ['error'],

  updatePassword: ['data'],
  updatePasswordSuccess: ['token'],
  updatePasswordFailure: ['error'],

  logNotificationOpen: ['data'],
  logNotificationOpenSuccess: null,
  logNotificationOpenFailure: ['error'],

  fetchUser: null,
  fetchUserSuccess: ['user'],
  fetchUserFailure: ['error'],

  fetchMarketingBrokerages: null,
  fetchMarketingBrokeragesSuccess: ['marketingBrokeragesList'],
  fetchMarketingBrokeragesFailure: ['error'],

  /*
  restrictedPerson: ['data'],
  restrictedPersonSuccess: ['user'],
  restrictedPersonFailure: ['error'],
  */

  /*
  waitListStatus: null,
  waitListStatusSuccess: ['data'],
  */

  signout: null
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  token: null,
  user: null,
  fetching: false,
  error: null,
  restrictedPerson: null,
  exists: null,
  password_reset: null,
  isPasswordValid: null,
  ext_id: null,
  marketingBrokeragesList: null,
  verifyEmailResponse: null,
  resendVerificationEmailResponse: null
})

/* ------------- Reducers ------------- */

/* REGISTER */

export const register = (state: Object) => {
  return state.merge({ fetching: true, error: null, token: null, user: null })
}

export const registerSuccess = (state: Object, action) => {
  const { token } = action

  return state.merge({ fetching: false, error: null, token: token })
}

export const registerFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* SIGNIN */

export const signin = (state: Object) => {
  return state.merge({ fetching: true, error: null, token: null, user: null, isPasswordValid: null, restrictedPerson: null })
}

export const signinAuto = (state: Object) => {
  return state.merge({ fetching: true, error: null, token: null, user: null })
}

export const signinTouchId = (state: Object) => {
  return state.merge({ fetching: true, error: null, token: null, user: null })
}

export const signinSuccess = (state: Object, action) => {
  const { token } = action

  return state.merge({ fetching: false, error: null, token: token ,  isPasswordValid: null })
}

export const signinFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* VERIFY_EMAIL */

export const verifyEmail = (state) => {
  return state.merge({ fetching: true, error: null });
}

export const verifyEmailSuccess = (state, action) => {
  const { verifyEmailResponse } = action;

  return state.merge({ fetching: false, error: null, verifyEmailResponse });
}

export const verifyEmailFailure = (state, { error }) => {
  return state.merge({ fetching: false, error });
}

export const clearVerificationResponse = (state) => {
  return state.merge({ fetching: false, error: null, verifyEmailResponse: null });
}

export const resendVerificationEmail = (state) => {
  return state.merge({ fetching: true, error: null });
}

export const resendVerificationEmailSuccess = (state) => {
  return state.merge({ fetching: false, error: null });
}

export const resendVerificationEmailFailure = (state, { error }) => {
  return state.merge({ fetching: false, error });
}


/* FORGOT_PASSWORD */

export const forgotPassword = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const forgotPasswordSuccess = (state: Object, action) => {
  return state.merge({ fetching: false, error: null })
}

export const forgotPasswordFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

export const resetPassword = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const resetPasswordSuccess = (state: Object, action) => {
  return state.merge({ fetching: false, error: null })
}

export const resetPasswordFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* INIT_SESSION */

export const initSession = (state: Object) => {
  return state.merge({ fetching: true, error: null, user: null })
}

export const initSessionSuccess = (state: Object, action) => {
  // Logger.log({ function: 'UserRedux.initSessionSuccess', action: action })

  const { user } = action;
  // restricted 0 means the person IS NOT restricted
  // restricted 1 means the perons IS restricted

  return state.merge({ fetching: false, error: null, user: user, restrictedPerson: user.restricted_person })
}

export const initSessionFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* END_SESSION */

export const signout = (state: Object) => {
  return INITIAL_STATE
}

/* UPDATE_PROFILE */

export const updateProfile = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const updateProfileSuccess = (state: Object, action) => {

  const { user } = action

  return state.merge({ fetching: false, error: null, user: user , isPasswordValid: null})
}

export const updateProfileFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* UPDATE_PROFILE_PASSWORD */

export const updateProfilePassword = (state) => {
  return state.merge({fetching: true, error: null, isPasswordValid: null});
}

export const updateProfilePasswordSuccess = (state, action) => {
  const { isPasswordValid } = action
  return state.merge({fetching: false, error: null, isPasswordValid: isPasswordValid});
}

export const updateProfilePasswordFailure = (state, {error}) => {
  return state.merge({fetching: false, error,})
}

/* LOG_NOTIFICATION_OPEN */

export const logNotificationOpen = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const logNotificationOpenSuccess = (state: Object, action) => {
  return state.merge({ fetching: false, error: null })
}

export const logNotificationOpenFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* UPDATE_PASSWORD */

export const updatePassword = (state: Object) => {
  return state.merge({ fetching: true, error: null , isPasswordValid: null})
}

export const updatePasswordSuccess = (state: Object, action) => {
  const { user } = action

  return state.merge({ fetching: false, error: null, user: user , isPasswordValid: null})
}

export const updatePasswordFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error , isPasswordValid: null})
}

/* FETCH_USER */

export const fetchUser = (state: Object, action) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchUserSuccess = (state: Object, action) => {
  const { user } = action

  return state.merge({ fetching: false, error: null, user: user })
}

export const fetchUserFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

export const checkUserExists = (state: Object) => {
  return state.merge({ fetching: true, error: null, exists: false, password_reset: false, userExistsStatus: null })
}

export const checkUserExistsSuccess = (state: Object, action) => {
  const { data } = action
  return state.merge({ fetching: false, error: null, exists: data.exists, password_reset: data.password_reset, userExistsStatus: data.status  })
}

export const checkUserExistsFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}



export const resendPasswordResetEmail = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const resendPasswordResetEmailSuccess = (state: Object, action) => {
  const { data } = action
  return state.merge({ fetching: false, error: null  })
}

export const resendPasswordResetEmailFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* MARKEING BROKERAGE */ 

export const fetchMarketingBrokerages = (state) => {
  return state.merge({ fetching: true, error: null });
}

export const fetchMarketingBrokeragesSuccess = (state, action) => {
  const { marketingBrokeragesList } = action;
  return state.merge({ fetching: false, error: null, marketingBrokeragesList: marketingBrokeragesList });
}

export const fetchMarketingBrokeragesFailure = (state, {error}) => {
  return state.merge({ fetching: false, error });
}

/* ----------------- Send Prospectus to User -----------*/ 

export const sendProspectusToUser = (state) => {
  return state.merge({ fetching: true, error: null});
}

export const sendProspectusToUserSuccess = (state, action) => {
  const { data } = action
  return state.merge({ fetching: false, error: null, ext_id: data });
}

export const sendProspectusToUserFailure = (state, { error }) => {
  return state.merge({ fetching: false, error});
}



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REGISTER]: register,
  [Types.REGISTER_SUCCESS]: registerSuccess,
  [Types.REGISTER_FAILURE]: registerFailure,

  [Types.SIGNIN]: signin,
  [Types.SIGNIN_AUTO]: signinAuto,
  [Types.SIGNIN_TOUCH_ID]: signinTouchId,
  [Types.SIGNIN_SUCCESS]: signinSuccess,
  [Types.SIGNIN_FAILURE]: signinFailure,

  [Types.VERIFY_EMAIL]: verifyEmail,
  [Types.VERIFY_EMAIL_SUCCESS]: verifyEmailSuccess,
  [Types.VERIFY_EMAIL_FAILURE]: verifyEmailFailure,

  [Types.RESEND_VERIFICATION_EMAIL]: resendVerificationEmail,
  [Types.RESEND_VERIFICATION_EMAIL_SUCCESS]: resendVerificationEmailSuccess,
  [Types.RESEND_VERIFICATION_EMAIL_FAILURE]: resendVerificationEmailFailure,

  [Types.FORGOT_PASSWORD]: forgotPassword,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,

  [Types.RESET_PASSWORD]: resetPassword,
  [Types.RESET_PASSWORD_SUCCESS]: resetPasswordSuccess,
  [Types.RESET_PASSWORD_FAILURE]: resetPasswordFailure,

  [Types.RESEND_PASSWORD_RESET_EMAIL]: resendPasswordResetEmail,
  [Types.RESEND_PASSWORD_RESET_EMAIL_SUCCESS]: resendPasswordResetEmailSuccess,
  [Types.RESEND_PASSWORD_RESET_EMAIL_FAILURE]: resendPasswordResetEmailFailure,

  [Types.SEND_PROSPECTUS_TO_USER]: sendProspectusToUser,
  [Types.SEND_PROSPECTUS_TO_USER_SUCCESS]: sendProspectusToUserSuccess,
  [Types.SEND_PROSPECTUS_TO_USER_FAILURE]: sendProspectusToUserFailure,

  [Types.CHECK_USER_EXISTS]: checkUserExists,
  [Types.CHECK_USER_EXISTS_SUCCESS]: checkUserExistsSuccess,
  [Types.CHECK_USER_EXISTS_FAILURE]: checkUserExistsFailure,

  [Types.INIT_SESSION]: initSession,
  [Types.INIT_SESSION_SUCCESS]: initSessionSuccess,
  [Types.INIT_SESSION_FAILURE]: initSessionFailure,

  [Types.SIGNOUT]: signout,

  [Types.UPDATE_PROFILE]: updateProfile,
  [Types.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [Types.UPDATE_PROFILE_FAILURE]: updateProfileFailure,

  [Types.UPDATE_PROFILE_PASSWORD]: updateProfilePassword,
  [Types.UPDATE_PROFILE_PASSWORD_SUCCESS]: updateProfilePasswordSuccess,
  [Types.UPDATE_PROFILE_PASSWORD_FAILURE]: updateProfilePasswordFailure,

  [Types.UPDATE_PASSWORD]: updatePassword,
  [Types.UPDATE_PASSWORD_SUCCESS]: updatePasswordSuccess,
  [Types.UPDATE_PASSWORD_FAILURE]: updatePasswordFailure,
  
  [Types.LOG_NOTIFICATION_OPEN]: logNotificationOpen,
  [Types.LOG_NOTIFICATION_OPEN_SUCCESS]: logNotificationOpenSuccess,
  [Types.LOG_NOTIFICATION_OPEN_FAILURE]: logNotificationOpenFailure,

  [Types.FETCH_USER]: fetchUser,
  [Types.FETCH_USER_SUCCESS]: fetchUserSuccess,
  [Types.FETCH_USER_FAILURE]: fetchUserFailure,

  /*
  [Types.RESTRICTED_PERSON]: restrictedPerson,
  [Types.RESTRICTED_PERSON_SUCCESS]: restrictedPersonSuccess,
  [Types.RESTRICTED_PERSON_FAILURE]: restrictedPersonFailure,
  */

  [Types.FETCH_MARKETING_BROKERAGES]: fetchMarketingBrokerages,
  [Types.FETCH_MARKETING_BROKERAGES_SUCCESS]: fetchMarketingBrokeragesSuccess,
  [Types.FETCH_MARKETING_BROKERAGES_FAILURE]: fetchMarketingBrokeragesFailure,

  /*
  [Types.WAIT_LIST_STATUS]: waitListStatus,
  [Types.WAIT_LIST_STATUS_SUCCESS]: waitListStatusSuccess,
  */
})
