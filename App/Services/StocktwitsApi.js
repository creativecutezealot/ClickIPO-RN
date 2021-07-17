// a library to wrap and simplify api calls
import {Linking} from 'react-native'
import URLSearchParams from 'url-search-params'
import request from '../Lib/Request'
import {query} from '../Lib/Utilities'
import apisauce from 'apisauce'

import {
  Token,
  User,
  Offering,
  Industry,
  Order,
  Broker,
  Term,
  Article,
  Faq,
  ClickIpoError
} from '../Models'

import Config from 'react-native-config'

import Logger from '../Lib/Logger'

// our "constructor"
const create = () => {
  // Logger.log({ function: 'StocktwitsApi.create', baseURL: Config.STOCKTWITS_API_BASE_URL })

  var tokens = {
    consumerKey: Config.STOCKTWITS_CONSUMER_KEY,
    consumerSecret: Config.STOCKTWITS_CONSUMER_SECRET,
    accessToken: '',
  }

  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: Config.STOCKTWITS_API_BASE_URL,
    // default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }

  // updates api token after authentication
  const setIdentity = (identity) => {
    tokens = {...tokens, accessToken: identity.token}

    // Logger.log({ function: 'StocktwitsApi.setIdentity', tokens: tokens })
    api.setHeader('Authorization', 'OAuth ' + tokens.accessToken)
  }

  const isAuthorized = () => {
    // Logger.log({ function: 'StocktwitsApi.isAuthorized', tokens: tokens })

    return (tokens.accessToken && tokens.accessToken !== '')
  }

  const processResponse = (response) => {
    // Logger.log({ function: 'Api.processResponse', response: response })

    if (response.data.error) {
      throw new ClickIpoError(response.data.error)
    }

    return response.data
  }

  const processError = (err) => {
    if (err instanceof ClickIpoError) {
      throw err
    } else {
      throw new ClickIpoError(err)
    }
  }

  const share = (share: Object) => {
    const shareMessage = share.message !== null ? share.message + ' - ' + 'https://clickipo.com/offerings/?offer_id=' + share.shareable.id + '&utm_source=StockTwits&utm_campaign=StockTwits_ss_app&utm_term=%24' + share.shareable.tickerSymbol + '&ct=StockTwits_ss_app' : 'https://clickipo.com/offerings/?offer_id=' + share.shareable.id + '&utm_source=StockTwits&utm_campaign=StockTwits_ss_app&utm_term=%24' + share.shareable.tickerSymbol + '&ct=StockTwits_ss_app'
    const image = share.shareable.offeringTypeName === 'IPO' ? 'https://clickipo.com/wp-content/uploads/social-share-ipo-offering.png' : 'https://clickipo.com/wp-content/uploads/social-share-secondary-offering.png'

    const data = {
      body: shareMessage,
      chart: image
    }

    return api.post('/messages/create.json', data)
    .then((response) => {
      if (response.data.error) {
        throw new ClickIpoError(response.data.error)
      }

      const retval = response.data

      return retval
    }).catch((err) => {
      processError(err)
    })
  }

  return {
    // public API functions
    setIdentity,
    isAuthorized,
    share,
  }
}

export default {
  create
}
