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

const create = (broker) => {
  var tokens = {
    consumerKey: broker.bd_id,
    consumerSecret: broker.db_secret,
  }

  // const api = apisauce.create({
  //   baseURL: broker.base_url,
  //   headers: {
  //     'Cache-Control': 'no-cache',
  //   //  'Authorization': base64.encode(tokens.consumerKey + ':' + tokens.consumerSecret)
  //   },
  //   timeout: 10000
  // })

  const api = apisauce.create({
    baseURL: broker.base_url,
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 10000
  })


  if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }

  const processResponse = (response) => {
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

  const fetchAccessToken = (code) => {
    const data = {
      grant_type: 'authorization_code',
      code : code,
      client_id : broker.bd_id,
      client_secret : broker.db_secret,
      redirect_uri : broker.callbackurl,
    }

    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    return api.post('/security/authorize', formBody)
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
    fetchAccessToken
  }
}

export default {
  create
}