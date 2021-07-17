// a library to wrap and simplify api calls
import {Linking} from 'react-native'
import URLSearchParams from 'url-search-params'
import request from '../Lib/Request'
import {query} from '../Lib/Utilities'
import apisauce from 'apisauce'
import base64 from 'base-64'

import {
  ClickIpoError
} from '../Models'

import Config from 'react-native-config'

import Logger from '../Lib/Logger'

// our "constructor"
const create = (broker) => {
  // Logger.log({ function: 'TradierTradierApi.create' })

  var tokens = {
    consumerKey: broker.bd_id,
    consumerSecret: broker.db_secret,
  }

  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: broker.base_url,
    // default headers
    headers: {
      'Cache-Control': 'no-cache',
      'Authorization': base64.encode(tokens.consumerKey + ':' + tokens.consumerSecret)
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

  const processResponse = (response) => {
    // Logger.log({ function: 'TradierApi.processResponse', response: response })

    if (response.data.error) {
      throw new ClickIpoError(response.data.error)
    }

    return response.data
  }

  const processError = (err) => {
    // Logger.log({ function: 'TradierApi.processError', err: err })

    if (err instanceof ClickIpoError) {
      throw err
    } else {
      throw new ClickIpoError(err)
    }
  }

  const fetchAccessToken = (code) => {
    // Logger.log({ function: 'TradierApi.fetchAccessToken', code: code })
    const data = {
      code: code,
      grant_type: 'authorization_code'
    }

    return api.post('/oauth/accesstoken', data)
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
    fetchAccessToken,
  }
}

export default {
  create
}
