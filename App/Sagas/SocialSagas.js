import { call, put, select } from 'redux-saga/effects'

import SocialMediaConnectionService from '../Services/SocialMediaConnectionService';
import UserActions from '../Redux/UserRedux';
import SettingsActions from '../Redux/SettingsRedux';
import SocialActions from '../Redux/SocialRedux';

import { Actions as NavigationActions } from 'react-native-router-flux';


export function * linkSocialMedia(action) {
  try {
    const { provider } = action;

    const oauthConfig = {
      authorizeUrl: provider.authorizeUrl, // the api to authenticate the user -- opens in the browser
      callbackUrl: provider.backendCallback, // this is the route that our backend redirects the client to
      title: 'Link to ' + provider.name,
      callback: provider.callback // this is coming from SocialShareView.js 
    }

    const socialMediaConnectionService = new SocialMediaConnectionService(provider, oauthConfig);
    const userSM = yield call(socialMediaConnectionService.oauth, {});

    //next step call the linkSocialMediaSuccess and pass the userSM -- <<-- why??s

  } catch (err) {
    console.log('error in linking social media: ', err)
  }
}


export function * linkSocialMediaSuccess(api, action) {
  console.log('api: ', api);
  console.log('action: ', action)
}




export function * linkProvider(api, action) {
  try {
    const { provider } = action;
    const identity = yield call(provider.oauth, {})
    const userIdentitiesResponse = yield call(api.sendUserIdentities, identity)
    yield put(SocialActions.linkProviderSuccess(identity))

  } catch (err) {
    yield put(SocialActions.linkProviderFailure(err))
  }
}

export function * linkProviderSuccess(action) {
  // Logger.log({ function: 'SocialSagas.linkProviderSuccess', action: action })
  try {
    const { identity } = action;

    if (identity && identity !== null) {
        var thisSocialIdentitiesLocal = yield select(socialIdentitiesLocal)
        var socialIdentities = {}
        for(var k in thisSocialIdentitiesLocal) socialIdentities[k]=thisSocialIdentitiesLocal[k]
        socialIdentities[identity.provider] = identity
        yield put(SettingsActions.updateSocialIdentitiesLocalSuccess(socialIdentities))
    } else {
      // TODO: throw error
    }
  } catch (err) {
    yield put(SocialActions.linkProviderFailure(err))
  }
}

export function * linkProviderFailure(action) {
  // Logger.log({ function: 'SocialSagas.linkProviderFailure', action: action })


}

export function * unlinkProvider(action) {
  // Logger.log({ function: 'SocialSagas.unlinkProvider', action: action })

  try {
    const { provider } = action
    const thisUser = yield select(user)
    var thisSocialIdentitiesLocal = yield select(socialIdentitiesLocal)
    var socialIdentities = {}
    for(var k in thisSocialIdentitiesLocal) socialIdentities[k]=thisSocialIdentitiesLocal[k]

    if (thisSocialIdentitiesLocal && thisSocialIdentitiesLocal !== null) {
      delete socialIdentities[provider.id]

      yield put(SettingsActions.updateSocialIdentitiesLocal(socialIdentities))
    } else {
      // TODO: throw error
    }
  } catch (err) {
    // Logger.log({ function: 'SocialSagas.unlinkProvider', err: err })
    // TODO: ???
  }
}

export function * share(action) {

  try {
    const { provider, shareable } = action

    NavigationActions.share({ provider, shareable })
  } catch (err) {
    // Logger.log({ function: 'SocialSagas.share', err: err })
    yield put(SocialActions.shareFailure(err))
  }
}

export function * shareSuccess (action) {
  // Logger.log({ function: 'SocialSagas.shareSuccess', action: action })


}

export function * shareFailure (action) {
  // Logger.log({ function: 'SocialSagas.shareFailure', action: action })

}

export function * sharePost(action) {

  const { share } = action

  try {
    const thisUser = yield select(user)
    const thisSocialIdentitiesLocal = yield select(socialIdentitiesLocal)
    const identity = thisSocialIdentitiesLocal[share.provider.id]

    if (!identity || identity === null) { // no identity for this provider so queue share and trigger link provider
      // TODO: queue the message -> setting it to provider for now (hack) but should use a deffered promise or work queue
      // share.provider.sharePostQueue = share

      yield put(SocialActions.linkProvider(share.provider))
    } else {
      if (!share.provider.identity) {
        share.provider.setIdentity(identity);
      }
      const result = yield call(share.provider.share, share);

      yield put(SocialActions.shareSuccess(result));
    }
  } catch (err) {
    yield put(SocialActions.shareFailure(err));
  }
}

export function * sharePostSuccess(action) {
  // Logger.log({ function: 'SocialSagas.sharePostSuccess()', action: action })

  try {

  } catch (err) {
    // Logger.log({ function: 'SocialSagas.share', err: err })
    yield put(SocialActions.shareFailure(err))
  }
}

export function * sharePostFailure(action) {
  // Logger.log({ function: 'SocialSagas.sharePostFailure()', action: action })

  try {

  } catch (err) {
    // Logger.log({ function: 'SocialSagas.share', err: err })
    yield put(SocialActions.shareFailure(err))
  }
}


export function * sendLinkedProvider (api, action) {
  const { data } = action;

  try {
    const sendLinkedProviderResponse = yield call(api.sendUserIdentities, data);
    const token = yield select(authToken);
    //we are calling the user object to get the social provider info from the backend
    console.log('token: ', token)
    const user = yield call(api.getUser, token);
    console.log('user: ', user);
    yield put(UserActions.fetchUserSuccess(user))
    yield put(SocialActions.sendLinkedProviderSuccess(sendLinkedProviderResponse));
  } catch (err) {
    console.log('error in sendLinkedProvider: ', err);
    yield put(SocialActions.sendLinkedProviderFailure(err));
  }
}

/* ------------- Selectors ------------- */
/*
export const providerMethods = (state: Object) => {
  // Logger.log({ function: 'SocialSagas.providers', state: state })
  return state.social.providers
}
*/

//this is to get the token for the getUser call
export const authToken = (state) => {
  return state.user.token;
}

export const user = (state: Object) => {
  // Logger.log({ function: 'SocialSagas.providers', state: state })
  return state.user.user
}

export const socialIdentitiesLocal = (state: Object) => {
  // Logger.log({ function: 'SocialSagas.providers', state: state })
  return state.settings.socialIdentitiesLocal
}