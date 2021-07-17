import SocialProvider from './SocialProvider';
import { Actions as NavigationActions } from 'react-native-router-flux';
import URLSearchParams from 'url-search-params';
import Config from 'react-native-config';
import twitter, { auth } from 'react-native-twitter';
import { create } from 'apisauce';

import {parseUrlParams, query} from '../Lib/Utilities';
import request from '../Lib/Request';

import {
  Images
} from '../Themes'

import Logger from '../Lib/Logger'

class SocialProviderTwitter extends SocialProvider {
  constructor(...args) {
    // Logger.log({ name: 'SocialProviderTwitter.constructor()' })
    super(...args)

    this.id = 'twitter'
    this.name = 'Twitter'
    this.icon = Images.twitterIcon
    this.color = '#00aced'

    // oauth config
    this.authorizeUrl = 'https://api.twitter.com/oauth/authorize'
    // this.callbackUrl = 'https://clickipo.com/oauth/twitter'
    //in the twitter developer portal the callbackUrl is just `clickipo://` the scheme ... 
    //... the rest is for the mobile app to navigate the user to the right screen
    this.callbackUrl = 'clickipo://deeplinks/oauth/twitter'
    this.verifierDeferreds = new Map()

    this.tokens = {
      consumerKey: Config.TWITTER_CONSUMER_KEY,
      consumerSecret: Config.TWITTER_CONSUMER_SECRET,
      accessToken: '',
      accessTokenSecret: '',
    }

    this.api = twitter(this.tokens)

    this.authorized = false
  }

  setIdentity = (identity) => {
    if (identity.token && identity.secret) {
      this.tokens.accessToken = identity.token
      this.tokens.accessTokenSecret = identity.secret
      this.api = twitter(this.tokens)
      this.authorized = true
    }
  }

  oauth = async () => {
    console.log('inside of oauth')
    let authResponse = await auth(this.tokens, this.callbackUrl)
    // example response
    // authResponse = {
    //   accessToken: '',
    //   accessTokenSecret: '',
    //   id: '',
    //   name: '' 
    // }

    //adding twitter to the response so in the sagas we can set where this token came from ( which Social Provider)
    authResponse.provider = this.id;
    //send this authResponse to the backend
    console.log('authResponse: ', authResponse);
    return authResponse
  }

  share = (share) => {
    const tweet = share.message !== null ? {
      status: share.message + ' - ' + 'https://clickipo.com/offerings/?offer_id=' + share.shareable.id + '&utm_source=Twitter&utm_campaign=Twitter_ss_app&utm_term=%24' + share.shareable.tickerSymbol + '&ct=Twitter_ss_app'
    } : {
      status: 'https://clickipo.com/offerings/?offer_id=' + share.shareable.id + '&utm_source=Twitter&utm_campaign=Twitter_ss_app&utm_term=%24' + share.shareable.tickerSymbol + '&ct=Twitter_ss_app'
    }
    console.log('this.api in twitter: ', this.api);
    return this.api.rest.post('statuses/update', tweet).then((response) => {
      return response
    })
  }

  getRequestToken = (tokens, callbackUrl, accessType) => {

    console.log('tokens: ', tokens)
    console.log('callbackUrl: ', callbackUrl);

    const method = 'POST';
    const url = 'https://api.twitter.com/oauth/request_token';
    const body = accessType ? {x_auth_access_type: accessType} : {};


    return request(tokens, url, {method, body}, {oauth_callback: callbackUrl})
    .then(response => {
      console.log('response in getRequestToken: ', response)
      response.text()
    })
    .then((text) => {
      const params = new URLSearchParams(text);
      return {
        requestToken: params.get('oauth_token'),
        requestTokenSecret: params.get('oauth_token_secret'),
      }
    })
    .catch(err => {
      console.log('error in getRequestToken: ', err)
    })
  }

  getAccessToken = ({consumerKey, consumerSecret, requestToken, requestTokenSecret}, oauthVerifier) => {
    const method = 'POST';
    const url = 'https://api.twitter.com/oauth/access_token';
    return request(
      {consumerKey, consumerSecret, oauthToken: requestToken, oauthTokenSecret: requestTokenSecret},
      url,
      {method},
      {oauth_verifier: oauthVerifier},
    )
    .then(response => response.text())
    .then((text) => {
      const params = new URLSearchParams(text);
      return {
        accessToken: params.get('oauth_token'),
        accessTokenSecret: params.get('oauth_token_secret'),
        id: params.get('user_id'),
        name: params.get('screen_name'),
      };
    });
  }

  oauthCallback = (response) => {
    // Logger.log({ name: 'SocialProviderTwitter.oauthCallback()', response: response })

    const params = new URLSearchParams(response.split('?')[1]);
    // Logger.log({ name: 'SocialProviderTwitter.oauthCallback()', params: params.toString() })

    if (params.has('oauth_token') && this.verifierDeferreds.has(/*params.get('oauth_token')*/ 'requestToken')) {
      const requestToken = params.get('oauth_token')

      const verifierDeferred = this.verifierDeferreds.get(/*params.get('oauth_token')*/ 'requestToken');
      this.verifierDeferreds.delete(/*params.get('oauth_token')*/ 'requestToken');

      const requestTokenSecret = verifierDeferred.requestTokenSecret
      // Logger.log({ name: 'SocialProviderTwitter.oauthCallback()', requestToken: requestToken, requestTokenSecret: requestTokenSecret })

      // trade the code for a access token
      this.getAccessToken({...this.tokens, requestToken, requestTokenSecret}, params.get('oauth_verifier')).then((accessTokenResponse) => {
        // Logger.log({ name: 'SocialProviderTwitter.oauthCallback()', accessTokenResponse: accessTokenResponse })

        const identity = {
            provider: this.id,
            token: accessTokenResponse.accessToken,
            secret: accessTokenResponse.accessTokenSecret,
        }

        if (true) {
          verifierDeferred.resolve(identity);
        } else {
          verifierDeferred.reject(new Error('denied'));
        }
      })
    }
  }
}

export default SocialProviderTwitter
