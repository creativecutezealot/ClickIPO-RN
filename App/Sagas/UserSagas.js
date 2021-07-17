import { call, put, select } from 'redux-saga/effects'
import UserActions from '../Redux/UserRedux'
import SettingsActions from '../Redux/SettingsRedux'
import OfferingActions from '../Redux/OfferingRedux'
import ToastActions from '../Redux/ToastRedux'
// import NotificationActions from '../Redux/NotificationRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Intercom from 'react-native-intercom'
import firebase from '../Config/FirebaseConfig'
import DeviceInfo from 'react-native-device-info'

import { Platform } from 'react-native'

import {
  // Token,
  // User,
  // ClickIpoError,
  Fob
} from '../Models'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'


// REFERENCE: https://medium.com/@rajaraodv/securing-react-redux-apps-with-jwt-tokens-fcfe81356ea0#.k8ngjld06

export function* forgotPassword(api, action) {
  // Logger.log({ function: 'UserSagas.forgotPassword', action: action })

  const { data } = action

  try {
    const messageInfo = { message: 'We\'ve sent you a \"Reset Password\" link. Please check your email.', icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))
    // yield call(NavigationActions['login'])
    const retval = yield call(api.forgotPassword, data)
    // Logger.log({ function: 'UserSagas.forgotPassword', retval: retval })

    yield put(UserActions.forgotPasswordSuccess(retval))

    yield call(NavigationActions['passwordResetNotice'], { email: data.email });
  } catch (err) {
    // Logger.log({ function: 'UserSagas.forgotPassword', err: err })
    yield put(UserActions.forgotPasswordFailure(err))
  }
}

export function* resetPassword(api, action) {

  const { data } = action

  try {
    const retval = yield call(api.resetPassword, data)
    // Logger.log({ function: 'UserSagas.forgotPassword', retval: retval })

    yield put(UserActions.forgotPasswordSuccess(retval))

    // TODO: pass email back to login
  } catch (err) {
    // Logger.log({ function: 'UserSagas.forgotPassword', err: err })
    yield put(UserActions.forgotPasswordFailure(err))
  }
}


export function* checkUserExists(api, action) {
  const { data } = action;

  try {
    const retval = yield call(api.checkUserExists, data);

    if (!retval.exists) {
      yield call(NavigationActions['registerTermsConditions'], data);
    }
    yield put(UserActions.checkUserExistsSuccess(retval));
  } catch (err) {
    yield put(UserActions.checkUserExistsFailure(err));
  }
}

export function* resendPasswordResetEmail(api, action) {

  const { data } = action

  try {
    const retval = yield call(api.resendPasswordResetEmail, data)

    yield put(UserActions.resendPasswordResetEmailSuccess(retval))

  } catch (err) {
    yield put(UserActions.resendPasswordResetEmailFailure(err))
  }
}

export function* register(api, action) {
  Logger.log({ function: 'UserSagas.register', action: action })

  const { data } = action

  try {
    // register
    const token = yield call(api.register, data)

    Intercom.registerIdentifiedUser({ userId: data.email });
    Intercom.updateUser({
      id: data.email,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      default_amount: data.default_amount,

    });

    yield put(UserActions.registerSuccess(token))
    yield call(NavigationActions.verifyEmailScreen);
    const messageInfo = { message: 'Signup successful! Please log in', icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))


    // yield call(NavigationActions['login'], { isLogout: true })

  } catch (err) {
    console.log('error in register: ', err)
    yield put(UserActions.registerFailure(err))
  }
}

export function* fetchMarketingBrokerages(api) {
  try {
    const marketingBrokerages = yield call(api.marketingBrokerages);

    yield put(UserActions.fetchMarketingBrokeragesSuccess(marketingBrokerages));
  } catch (err) {
    yield put(UserActions.fetchMarketingBrokeragesFailure(err));
  }
}

export function* signin(api, touchIdService, action) {

  const { data } = action

  try {
    const token = yield call(api.authenticate, data);

    if (token.status === 403) {
      yield call(NavigationActions['verifyEmailScreen'], { email: data.email });
      // calling this because the fetching variable in redux needs to be set to false
      yield put(UserActions.verifyEmailFailure(token));
    } else {

      //once the user settings page is created add the intercom.updateUser to send updated info to intercom when user changes first or last name
      Intercom.updateUser({
        id: data.email,
        user_id: data.email,
        email: data.email,
      });

      // TODO if the response from api.authenticate indicates the user is not verified then redirect the user to verifyEmailScreen

      yield put(UserActions.signinSuccess(token))

      // disable intro after first successful login
      if (select(showIntro)) { // dont showIntro after first successful login
        const showIntro = false
        yield put(SettingsActions.showIntro(showIntro))
      }

      // if "rememberMe" checked store email
      const isRememberMe = data.rememberMe
      if (isRememberMe !== select(isRememberMeEnabled)) {
        const rememberMeEmail = (isRememberMe) ? data.email : null

        yield put(SettingsActions.rememberMeEmail(rememberMeEmail))
      }

      // get/create fob for user
      var fob = null
      const fobs = yield select(lFobs)
      // Logger.log({ function: 'UserSagas.signin', fobs: fobs, tokenId: token.id })
      if (fobs && fobs.length > 0) {
        try {
          fob = findByProp('id', token.id, fobs)
        } catch (err) {
          // Logger.log({ function: 'UserSagas.signin', err: err })
        }
      }
      // Logger.log({ function: 'UserSagas.signin', fob: fob })

      if (!fob) {
        fob = new Fob(token)
        // Logger.log({ function: 'UserSagas.signin=>newFob', fob: fob })

        yield put(SettingsActions.addFob(fob))
      } else { // update token in existing fob
        fob.token = token

        yield put(SettingsActions.updateFob(fob)) // this sets the current fob AND updates fobs
      }
      // Logger.log({ function: 'UserSagas.signin', fobs: fobs, fob: fob })


      const touchId = {
        touchIdEnabled: true,
        touchIdPrompt: false,
        token: token
      }

      yield put(SettingsActions.updateTouchId(touchId))


      // init the session for this user
      yield put(UserActions.initSession())
    }
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.signinFailure(err))
  }
}

export function* verifyEmail(api, action) {
  const { verifyEmailToken } = action;
  try {
    const verifyEmailResponse = yield call(api.verifyEmail, verifyEmailToken);
    if (verifyEmailResponse.status === 201) {
      yield put(UserActions.verifyEmailSuccess(verifyEmailResponse));
    } else {
      yield put(UserActions.verifyEmailFailure(verifyEmailResponse));
    }
  } catch (err) {
    yield put(UserActions.verifyEmailFailure(err));
  }
}

export function* resendVerificationEmail(api, action) {
  const { data } = action;

  try {
    const resendVerificationResponse = yield call(api.resendVerificationEmail, data);
    if (resendVerificationResponse.status === 201) {
      const messageInfo = { message: 'Email sent successfully', icon: 'good' }
      yield put(ToastActions.toastMessage(messageInfo))
      yield put(UserActions.resendVerificationEmailSuccess(resendVerificationResponse));
    } else {

      yield put(UserActions.resendVerificationEmailFailure(resendVerificationResponse));
    }
  } catch (err) {
    yield put(UserActions.resendVerificationEmailFailure(err));
  }
}

export function* signinAuto(action) {
  Logger.log({ function: 'UserSagas.autoSignin', action: action })

  try {
    const token = yield select(touchIdToken)
    // Logger.log({ function: 'UserSagas.autoSignin', success: success })

    yield put(UserActions.signinSuccess(token))
    yield put(UserActions.initSession())
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.signinFailure(err))
  }
}

export function* signinTouchId(touchIdService, action) {
  // Logger.log({ function: 'UserSagas.signinTouchId', action: action })

  try {
    const token = yield select(touchIdToken)
    const success = yield call(touchIdService.attemptTouchId, token.email) //, {})
    // Logger.log({ function: 'UserSagas.signinTouchId', success: success })

    if (success) {
      yield put(UserActions.signinSuccess(token))
      yield put(UserActions.initSession())
    } else {
      yield put(UserActions.signinFailure(err))
    }
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.signinFailure(err))
  }
}

export function* initSession(api, action) {
  Logger.log({ function: 'UserSagas.initSession', action: action })

  const token = yield select(authToken)

  try {
    // set API auth token
    yield call(api.setAuthToken, token.token)

    const user = yield call(api.getUser, token)
    firebase.analytics().setUserId(user.id)
    firebase.analytics().setUserProperty("email", user.email)

    // Logger.log({ function: 'UserSagas.initSession', user: user })
    // update store
    yield put(UserActions.initSessionSuccess(user))
    yield call(NavigationActions['initSession']);

    // TODO: temp workaround to preload ALL offerings

    // const initAction = {initSession:true}
    // yield put(OfferingActions.loadOfferings(initAction))

    //yield put(OfferingActions.loadOfferings({}))
    // yield put(UserActions.waitListStatus())

    // const appUpdate = {
    //   sysId: 'asdf',
    //   sysValue: '1.4.36',
    //   sysReadableVersion: '1.4.35.1.4.35',
    //   sysPlatform: 'ios',
    //   sysImage: '//stagingcdn.clickipo.com/companies/logos/346/720/82-/medium/1508510157-FTSInternational.jpg?1508510157',
    //   sysTitle: 'Get the new ClickIPO app to continue using it',
    //   sysDescription: 'We have made changes to the ClickIPO app that require you to download and install a new version. You can then delete this version. We apologize for the inconvenience. All of your information is saved and intact. There are somoe behind the scenes updates that Google can not change without us swapping versions.',
    //   sysActionText: 'Get the new version',
    //   sysActionSecondaryText: 'No, Thanks',
    //   sysIsUpdateRequired: false,
    //   sysIsDisplayRequired: true,
    //   sysAppUrl: 'market://details?id=com.example.android'
    //   sysAppUrl: 'itms://itunes.apple.com/app/clickipo-get-access-to-ipos/id1236247345?mt=8',
    // }

    // const data = {
    //     sys_value : DeviceInfo.getVersion(),
    //     sys_readable_version : DeviceInfo.getReadableVersion(),
    //     sys_platform : Platform.OS
    // }


    // const appUpdate = yield call(api.appUpdateStatus, data)
    //const appUpdate = {}
    //Logger.log({ function: 'UserSagas.appUpdateStatus', appUpdate: appUpdate })

    // TODO: check for deep link; move this to InitSessionControler

    // yield call(NavigationActions['initSession'], { appUpdate })

  } catch (err) {
    // Logger.log({ function: 'UserSagas.initSession.error', error: err })
    yield put(UserActions.initSessionFailure(err))
  }
}

export function* signout(action) {
  // Logger.log({ function: 'UserSagas.signout', action: action })

  const fob = null
  yield put(SettingsActions.updateFob(fob))
  yield put(SettingsActions.rememberMeEmail(null))
  yield put(SettingsActions.updateSocialIdentitiesLocalSuccess({}))

  /*firebase.messaging().deleteInstanceId().then(() => {
    Logger.log({ function: 'UserSagas.signout', message: 'Deleted instance id successfully' })
  })
  .catch((error: any) => {
    Logger.log({ function: 'UserSagas.signout', message: 'Cannot delete instance id' })
  })*/

  yield call(NavigationActions['login'], { isLogout: true })
}

export function* updateProfile(api, action) {
  // Logger.log({ function: 'UserSagas.updateProfile', action: action })

  const { data } = action

  try {
    const user = yield call(api.updateUser, data)
    yield put(UserActions.updateProfileSuccess(user))
    const messageInfo = { message: 'Profile Updated!', icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))
    yield call(NavigationActions['login'], { isLogout: true })
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.updateProfileFailure(err))
  }
}

//this function is used when user is updte their password in profile
export function* updateProfilePassword(api, action) {
  const { isPasswordValid } = action
  try {
    const passwordValidationResponse = yield call(api.validateCurrentPassword, isPasswordValid)
    yield put(UserActions.updateProfilePasswordSuccess(passwordValidationResponse))
  } catch (err) {
    yield put(UserActions.updateProfilePasswordFailure(err))
  }
}

export function* logNotificationOpen(api, action) {
  const { data } = action
  try {
    yield call(api.logNotificationOpen, data)

    yield put(UserActions.logNotificationOpenSuccess())
  } catch (err) {
    yield put(UserActions.logNotificationOpenFailure(err))
  }
}

export function* updatePassword(api, action) { // TODO: REMOVE, not needed; using updateProfile()
  // Logger.log({ function: 'UserSagas.updatePassword', action: action })

  const { data } = action

  try {
    const token = yield call(api.changePassword, data)

    yield put(UserActions.updatePasswordSuccess(token))
    const messageInfo = { message: 'Password Updated!', icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.updatePasswordFailure(err))
  }
}

export function* fetchUser(api, action) {
  Logger.log({ function: 'UserSagas.fetchUser', action: action })

  try {
    const token = yield select(authToken)

    const user = yield call(api.getUser, token)

    yield put(UserActions.fetchUserSuccess(user))
  } catch (err) {
    // Logger.log({ function: 'UserSagas.fetchUser', err: err })
    yield put(UserActions.fetchUser(err))
  }
}

/*
export function * restrictedPerson (api, action) { // TODO: REMOVE, not needed; using updateProfile()
  // Logger.log({ function: 'UserSagas.updatePassword', action: action })
  const { data } = action
  try {
    const restricted = yield call(api.restrictedPerson, data)
    yield put(UserActions.restrictedPersonSuccess())
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.restrictedPersonFailure(err))
  }
}
*/

export function* restrictedPersonSuccess(api, action) { // TODO: REMOVE, not needed; using updateProfile()
  // Logger.log({ function: 'UserSagas.updatePassword', action: action })
  try {
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    yield put(UserActions.restrictedPersonFailure(err))
  }
}

/*
export function * waitListStatus (api, action) { // TODO: REMOVE, not needed; using updateProfile()
  // Logger.log({ function: 'UserSagas.updatePassword', action: action })
  try {
    const status = yield call(api.waitListStatus)
    yield put(UserActions.waitListStatusSuccess(status))
  } catch (err) {
    // Logger.log({ function: 'UserSagas.signin', err: err })
    Logger.log("waitListStatus failure")
  }
}
*/

export function* sendProspectusToUser(api, action) {
  try {
    const response = yield call(api.sendProspectusToUser, action.data)
    yield put(UserActions.sendProspectusToUserSuccess(response))
    const messageInfo = { message: 'Email Sent Successfully', icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))
  } catch (err) {
    const messageInfo = { message: 'Unable to email prospectus', icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))
    yield put(UserActions.sendProspectusToUserFailure(err))
  }
}



/* ------------- Selectors ------------- */

export const showIntro = (state: Object) => {
  // Logger.log({ function: 'UserSagas.showIntro', state: state })
  return state.settings.showIntro
}

export const isRememberMeEnabled = (state: Object) => {
  // Logger.log({ function: 'UserSagas.isRememberMeEnabled', state: state })
  const rememberMeEmail = state.settings.rememberMeEmail

  const retval = (rememberMeEmail && rememberMeEmail.length > 0)

  return retval
}

export const isTouchIdEnabled = (state: Object) => {
  // Logger.log({ function: 'UserSagas.isTouchIdEnabled', state: state })
  return (state.settings.fob.token && state.settings.fob.token !== null)
}

export const touchIdToken = (state: Object) => {
  // Logger.log({ function: 'UserSagas.touchIdToken', state: state })
  return state.settings.fob.token
}

export const authToken = (state: Object) => {
  // Logger.log({ function: 'UserSagas.authToken', state: state })
  return state.user.token
}

export const user = (state: Object) => {
  // Logger.log({ function: 'UserSagas.user', state: state })
  return state.user.user
}

export const lFob = (state: Object) => {
  // Logger.log({ function: 'UserSagas.fob', state: state })
  return state.settings.fob
}

export const lFobs = (state: Object) => {
  // Logger.log({ function: 'UserSagas.fobs', state: state })
  return state.settings.fobs
}

// TODO: https://github.com/AstonDiel/clickipo-server/blob/master/app/api/clickipo/errors.rb

export const RegisterError = {
  INVALID_DATA: { type: 'RegisterError', name: 'INVALID_DATA', message: 'Invalid Data' },
  EMAIL_EXISTS: { type: 'RegisterError', name: 'EMAIL_EXISTS', message: 'Email Exists' }
}

export const AuthenticationError = {
  INVALID_CREDENTIALS: { type: 'AuthenticationError', name: 'INVALID_CREDENTIALS', description: 'Invalid Credentials' }
}

export const UserError = {
  INVALID_REQUEST: { type: 'UserError', name: 'INVALID_REQUEST', description: 'Invalid Request' }
}

const getFob = (email) => {

}
