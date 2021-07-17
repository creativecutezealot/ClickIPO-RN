import { takeLatest } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import SocialProviders from '../Services/SocialProviders'
import NotificationsService from '../Services/NotificationsService'
import TouchIdService from '../Services/TouchIdService'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { FOREGROUND, BACKGROUND, INACTIVE } from '../Redux/AppStateEnhancer'
import { ActionConst as SceneTypes } from 'react-native-router-flux'
import { AppStateTypes } from '../Redux/AppStateRedux'

import { StartupTypes } from '../Redux/StartupRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'
import { SocialTypes } from '../Redux/SocialRedux'

import { SettingsTypes } from '../Redux/SettingsRedux'

import { UserTypes } from '../Redux/UserRedux'
import { NotificationTypes } from '../Redux/NotificationRedux'
import { OfferingTypes } from '../Redux/OfferingRedux'
import { OrderTypes } from '../Redux/OrderRedux'
import { BrokerTypes } from '../Redux/BrokerRedux'
import { TermTypes } from '../Redux/TermRedux'
import { FaqTypes } from '../Redux/FaqRedux'
import { ArticleTypes } from '../Redux/ArticlesRedux'

import { OrderModifyReduxTypes } from '../Redux/OrderModifyRedux'

/* ------------- Sagas ------------- */

import { appHasComeBackToForeground, appWillMoveToBackground, appHasMovedToInactive, appStateWillChange, sceneWillChange, sceneDidChange } from './AppStateSagas'

import { appStatus, startup, startupComplete, startupWithDeeplink } from './StartupSagas'
import { openScreen } from './OpenScreenSagas'
import { linkProvider, linkProviderSuccess, linkProviderFailure, unlinkProvider, share, shareSuccess, shareFailure, sharePost, sharePostSuccess, sharePostFailure, sendLinkedProvider, linkSocialMedia, linkSocialMediaSuccess } from './SocialSagas'

import { initSettings, showIntro, touchIdSupported, challengeFob, toggleTouchId, updateNotifications, updateTouchId, disableDeviceNotifications } from './SettingsSagas'

import { register, checkUserExists, resendPasswordResetEmail, signin, signinAuto, signinTouchId, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail, initSession, signout, updateProfile, updateProfilePassword, updatePassword, fetchUser, logNotificationOpen, sendProspectusToUser, fetchMarketingBrokerages } from './UserSagas'
import { initNotificationsService, fetchPermissions, requestPermissions, requestPermissionsSuccess, pushNotificationConfig } from './NotificationSagas'
import { loadOfferings, fetchOfferings,fetchIndustries, fetchOffering, toggleSaved, markRead, updateViewedAt } from './OfferingSagas'
import { fetchOrders, fetchActiveOrder, fetchOrder, submitOrder, updateOrder, cancelOrder, submitOrderReconfirmation, resetOrderError } from './OrderSagas'
import { fetchBrokers, fetchBuyingPower, connectBroker, connectBrokerSuccess, createBrokerConnection, createBrokerConnectionSuccess, deleteBrokerConnection, deleteBrokerConnectionSuccess, fetchBrokerAccounts, fetchBrokerAccountsSuccess, setActiveBrokerAccount, setActiveBrokerAccountSuccess } from './BrokerSagas'
import { fetchTerms } from './TermSagas'
import { fetchFaqs } from './FaqSagas'
import { fetchArticles, fetchArticle } from './ArticlesSagas'

import { fetchActiveBrokerAccount} from './OrderModifySagas' //TODO: remove

/* ------------- API ------------- */

// DebugConfig.useFixtures ? FixtureAPI :  The APIs are only used from Sagas, so we create them here and pass along to the sagas that need them.
const api = API.create()
const notificationsService = NotificationsService.create()
const touchIdService = TouchIdService.create()

//const socialProviders = SocialProviders.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {

    yield takeLatest(FOREGROUND, appHasComeBackToForeground),
    yield takeLatest(BACKGROUND, appWillMoveToBackground),
    yield takeLatest(INACTIVE, appHasMovedToInactive),
    yield takeLatest(AppStateTypes.APP_STATE_WILL_CHANGE, appStateWillChange),

    yield takeLatest(SceneTypes.PUSH, sceneWillChange),
    yield takeLatest(SceneTypes.FOCUS, sceneDidChange),

    // takeLatest(StartupTypes.SERVER_STATUS, serverStatus, api),
    yield takeLatest(StartupTypes.APP_STATUS, appStatus, api),
    yield takeLatest(StartupTypes.STARTUP, startup),
    yield takeLatest(StartupTypes.STARTUP_WITH_DEEPLINK, startupWithDeeplink),
    yield takeLatest(StartupTypes.STARTUP_COMPLETE, startupComplete),
    yield takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),

    yield takeLatest(SocialTypes.LINK_PROVIDER, linkProvider, api),
    yield takeLatest(SocialTypes.LINK_PROVIDER_SUCCESS, linkProviderSuccess),
    yield takeLatest(SocialTypes.LINK_PROVIDER_FAILURE, linkProviderFailure),
    yield takeLatest(SocialTypes.UNLINK_PROVIDER, unlinkProvider),
    yield takeLatest(SocialTypes.SHARE, share),
    yield takeLatest(SocialTypes.SHARE_SUCCESS, shareSuccess),
    yield takeLatest(SocialTypes.SHARE_FAILURE, shareFailure),
    yield takeLatest(SocialTypes.SHARE_POST, sharePost),
    yield takeLatest(SocialTypes.SHARE_POST_SUCCESS, sharePostSuccess),
    yield takeLatest(SocialTypes.SHARE_POST_FAILURE, sharePostFailure),
    yield takeLatest(SocialTypes.SEND_LINKED_PROVIDER, sendLinkedProvider, api),
    yield takeLatest(SocialTypes.LINK_SOCIAL_MEDIA, linkSocialMedia),
    yield takeLatest(SocialTypes.LINK_SOCIAL_MEDIA_SUCCESS, linkSocialMediaSuccess, api),

    yield takeLatest(SettingsTypes.INIT_SETTINGS, initSettings, touchIdService),
    yield takeLatest(SettingsTypes.SHOW_INTRO, showIntro),
    yield takeLatest(SettingsTypes.TOUCH_ID_SUPPORTED, touchIdSupported),
    yield takeLatest(SettingsTypes.CHALLENGE_FOB, challengeFob),
    yield takeLatest(SettingsTypes.TOGGLE_TOUCH_ID, toggleTouchId),
    yield takeLatest(SettingsTypes.UPDATE_NOTIFICATIONS, updateNotifications),
    yield takeLatest(SettingsTypes.UPDATE_TOUCH_ID, updateTouchId),
    yield takeLatest(SettingsTypes.DISABLE_DEVICE_NOTIFICATIONS, disableDeviceNotifications),

    yield takeLatest(UserTypes.REGISTER, register, api),
    yield takeLatest(UserTypes.SIGNIN, signin, api, touchIdService),
    yield takeLatest(UserTypes.SIGNIN_AUTO, signinAuto),
    yield takeLatest(UserTypes.SIGNIN_TOUCH_ID, signinTouchId, touchIdService),
    yield takeLatest(UserTypes.FORGOT_PASSWORD, forgotPassword, api),
    yield takeLatest(UserTypes.RESET_PASSWORD, resetPassword, api),
    yield takeLatest(UserTypes.VERIFY_EMAIL, verifyEmail, api),
    yield takeLatest(UserTypes.RESEND_VERIFICATION_EMAIL, resendVerificationEmail, api),
    yield takeLatest(UserTypes.INIT_SESSION, initSession, api),
    yield takeLatest(UserTypes.SIGNOUT, signout),
    yield takeLatest(UserTypes.UPDATE_PROFILE, updateProfile, api),
    yield takeLatest(UserTypes.UPDATE_PROFILE_PASSWORD, updateProfilePassword, api),
    yield takeLatest(UserTypes.UPDATE_PASSWORD, updatePassword, api),
    yield takeLatest(UserTypes.FETCH_USER, fetchUser, api),
    // takeLatest(UserTypes.RESTRICTED_PERSON, restrictedPerson, api),
    // takeLatest(UserTypes.RESTRICTED_PERSON_SUCCESS, restrictedPersonSuccess, api),
    // takeLatest(UserTypes.WAIT_LIST_STATUS, waitListStatus, api),
    yield takeLatest(UserTypes.FETCH_MARKETING_BROKERAGES, fetchMarketingBrokerages, api),

    yield takeLatest(UserTypes.CHECK_USER_EXISTS, checkUserExists, api),

    yield takeLatest(UserTypes.RESEND_PASSWORD_RESET_EMAIL, resendPasswordResetEmail, api),
    yield takeLatest(UserTypes.SEND_PROSPECTUS_TO_USER, sendProspectusToUser, api),

    yield takeLatest(UserTypes.LOG_NOTIFICATION_OPEN, logNotificationOpen, api),

    yield takeLatest(NotificationTypes.INIT_NOTIFICATIONS_SERVICE, initNotificationsService, notificationsService),
    yield takeLatest(NotificationTypes.FETCH_PERMISSIONS, fetchPermissions, notificationsService),
    yield takeLatest(NotificationTypes.REQUEST_PERMISSIONS, requestPermissions, notificationsService),
    yield takeLatest(NotificationTypes.REQUEST_PERMISSIONS_SUCCESS, requestPermissionsSuccess, api),
    yield takeLatest(NotificationTypes.PUSH_NOTIFICATION_CONFIG, pushNotificationConfig, api),

    yield takeLatest(OfferingTypes.LOAD_OFFERINGS, loadOfferings, api),
    yield takeLatest(OfferingTypes.FETCH_OFFERINGS, fetchOfferings, api),
    yield takeLatest(OfferingTypes.FETCH_OFFERING, fetchOffering, api),
    yield takeLatest(OfferingTypes.FETCH_INDUSTRIES, fetchIndustries, api),
    yield takeLatest(OfferingTypes.TOGGLE_SAVED, toggleSaved, api),
    yield takeLatest(OfferingTypes.MARK_READ, markRead, api),
    yield takeLatest(OfferingTypes.UPDATE_VIEWED_AT, updateViewedAt, api),

    yield takeLatest(OrderTypes.FETCH_ORDERS, fetchOrders, api),
    yield takeLatest(OrderTypes.FETCH_ACTIVE_ORDER, fetchActiveOrder, api),
    yield takeLatest(OrderTypes.FETCH_ORDER, fetchOrder, api),
    yield takeLatest(OrderTypes.SUBMIT_ORDER, submitOrder, api),
    yield takeLatest(OrderTypes.SUBMIT_ORDER_RECONFIRMATION, submitOrderReconfirmation, api),
    yield takeLatest(OrderTypes.UPDATE_ORDER, updateOrder, api),
    // takeLatest(OrderTypes.RESET_ORDER_ERROR, resetOrderError, api),
    yield takeLatest(OrderTypes.CANCEL_ORDER, cancelOrder, api),

    yield takeLatest(BrokerTypes.FETCH_BROKERS, fetchBrokers, api),
    yield takeLatest(BrokerTypes.FETCH_BUYING_POWER, fetchBuyingPower, api),
    yield takeLatest(BrokerTypes.CONNECT_BROKER, connectBroker),
    yield takeLatest(BrokerTypes.CONNECT_BROKER_SUCCESS, connectBrokerSuccess),
    yield takeLatest(BrokerTypes.CREATE_BROKER_CONNECTION, createBrokerConnection, api),
    yield takeLatest(BrokerTypes.CREATE_BROKER_CONNECTION_SUCCESS, createBrokerConnectionSuccess, api),
    yield takeLatest(BrokerTypes.DELETE_BROKER_CONNECTION, deleteBrokerConnection, api),
    yield takeLatest(BrokerTypes.DELETE_BROKER_CONNECTION_SUCCESS, deleteBrokerConnectionSuccess, api),
    yield takeLatest(BrokerTypes.FETCH_BROKER_ACCOUNTS, fetchBrokerAccounts, api),
    yield takeLatest(BrokerTypes.FETCH_BROKER_ACCOUNTS_SUCCESS, fetchBrokerAccountsSuccess),
    yield takeLatest(BrokerTypes.SET_ACTIVE_BROKER_ACCOUNT, setActiveBrokerAccount, api),
    yield takeLatest(BrokerTypes.SET_ACTIVE_BROKER_ACCOUNT_SUCCESS, setActiveBrokerAccountSuccess, api),

    yield takeLatest(TermTypes.FETCH_TERMS, fetchTerms, api),

    yield takeLatest(FaqTypes.FETCH_FAQS, fetchFaqs, api),

    yield takeLatest(ArticleTypes.FETCH_ARTICLES, fetchArticles, api),
    yield takeLatest(ArticleTypes.FETCH_ARTICLE, fetchArticle, api),

    yield takeLatest(OrderModifyReduxTypes.FETCH_ACTIVE_BROKER_ACCOUNT, fetchActiveBrokerAccount, api) //TODO: Remove

}
