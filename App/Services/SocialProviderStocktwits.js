import SocialProvider from './SocialProvider'

import { Actions as NavigationActions } from 'react-native-router-flux'

import StocktwitsApi from './StocktwitsApi'
import {parseUrlParams, query} from '../Lib/Utilities'
import URLSearchParams from 'url-search-params'

import Config from 'react-native-config'

import {
  Images
} from '../Themes'

import Logger from '../Lib/Logger'

class SocialProviderStocktwits extends SocialProvider {
  constructor(...args) {
    // Logger.log({ name: 'SocialProviderStocktwits.constructor()' })
    super(...args)

    this.id = 'stocktwits'
    this.name = 'Stocktwits'
    this.icon = Images.stockTwitsIcon
    this.color = '#405775'

    // oauth config
    this.authorizeUrl = 'https://api.stocktwits.com/api/2/oauth/authorize'
    this.callbackUrl = 'https://clickipo.com/oauth/stocktwits'
    this.verifierDeferreds = new Map()

    this.api = StocktwitsApi.create()
  }

  setIdentity = (identity) => {
    // Logger.log({ name: 'SocialProvider.auth()', identity: identity })

    this.identity = identity
    this.api.setIdentity(identity)
  }

  oauthCallback = (response) => {
    // Logger.log({ name: 'SocialProviderStocktwits.oauthCallback()', response })

    const params = new URLSearchParams(response.split('#')[1]);
    // Logger.log({ name: 'SocialProviderTwitter.oauthCallback()', params: params.toString() })

    const token = params.get('access_token')

    const verifierDeferred = this.verifierDeferreds.get('requestToken');
    this.verifierDeferreds.delete('requestToken');
    if (true) {
      const identity = {
          provider: this.id,
          token: token,
      }

      verifierDeferred.resolve(identity);
    } else {
      verifierDeferred.reject(new Error('denied'));
    }
  }

  oauth = async () => { // TODO: this needs to be 3-leg in order to get a token that can refresh (https://stocktwits.com/developers/docs/authentication :: Client side OAuth flow :: #5)
    // Logger.log({ name: 'SocialProviderStocktwits.oauth()' })

    const oauthConfig = {
      authorizeUrl: this.authorizeUrl + '?' + query({client_id: Config.STOCKTWITS_CONSUMER_KEY, response_type: 'token', scope: 'read,watch_lists,publish_messages,publish_watch_lists,follow_users,follow_stocks', redirect_uri: this.callbackUrl}),
      callbackUrl: this.callbackUrl,
      callback: this.oauthCallback,
    }

    // open oauth view to capture identity
    window.setTimeout(() => {NavigationActions.oauth(oauthConfig)}, 300)
    //NavigationActions.oauth(oauthConfig)

    // create a deffered promise to resolve the result
    return await (
      new Promise((resolve, reject) => {
        this.verifierDeferreds.set('requestToken', {resolve, reject})
      })
    )
  }

  share = (share) => {
    // Logger.log({ name: 'SocialProviderStocktwits.share()', share: share })

    const response = this.api.share(share)

    return response
  }
}

export default SocialProviderStocktwits
