import Logger from '../Lib/Logger'
import { Actions as NavigationActions } from 'react-native-router-flux'
import {query} from '../Lib/Utilities'
import URLSearchParams from 'url-search-params'
import brokerageSelector from './BrokerageSelector'
import {
  Broker,
  BrokerConnection
} from '../Models'

export default class BrokerConnectionService {

  constructor (broker, oauthConfig) {
    this.broker = broker
    this.oauthConfig = oauthConfig
    this.verifierDeferreds = new Map()
  } 

  oauthCallback = (response) => {
    const params = new URLSearchParams(response.split('?')[1])
    if(this.oauthConfig.requestId !== 'none'){
      var requestId = params.get('state')
      var verifierDeferred = this.verifierDeferreds.get(requestId)
    } else {
      var verifierDeferred = this.verifierDeferreds.get('none')   
    }
    if (verifierDeferred) {
      this.verifierDeferreds.delete(requestId)
      const code = params.get('code')
      verifierDeferred.resolve(code)
    } else {     
      this.verifierDeferred.reject(new Error('denied'))
    }
  }

  oauth = async () => {
    const oauthViewProps = {
      authorizeUrl: this.oauthConfig.authorizeUrl,
      callbackUrl: this.oauthConfig.callbackUrl,
      callback: this.oauthCallback
    }
    NavigationActions.oauth(oauthViewProps)
    return await (
      new Promise((resolve, reject) => {
        this.verifierDeferreds.set(this.oauthConfig.requestId, {resolve, reject})
      })
    )
  }

  fetchAccessToken = async (code) => {
    const api = brokerageSelector(this.broker)
    const token = await (api.fetchAccessToken(code))
    const brokerConnection = new BrokerConnection()
    brokerConnection.setBroker(this.broker)
    brokerConnection.setToken(token)
    brokerConnection.setBrokerUserId(token)
    brokerConnection.status = 'active'

    return brokerConnection
  }
}