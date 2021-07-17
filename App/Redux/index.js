import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    appState: require('./AppStateRedux').reducer,

    startup: require('./StartupRedux').reducer,
    social: require('./SocialRedux').reducer,

    settings: require('./SettingsRedux').reducer,

    user: require('./UserRedux').reducer,
    notification: require('./NotificationRedux').reducer,
    offering: require('./OfferingRedux').reducer,
    order: require('./OrderRedux').reducer,
    broker: require('./BrokerRedux').reducer,
    term: require('./TermRedux').reducer,
    faq: require('./FaqRedux').reducer,
    article: require('./ArticlesRedux').reducer,
    toast: require('./ToastRedux').reducer,
    orderModifyRedux: require('./OrderModifyRedux').reducer,
  })
  return configureStore(rootReducer, rootSaga)
}
