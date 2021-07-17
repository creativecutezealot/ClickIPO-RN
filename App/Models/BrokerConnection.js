import {
  BrokerAccount,
} from './'

import Logger from '../Lib/Logger'

class BrokerConnection {
  id: String
  brokerDealerId: String
  brokerDealerName: String
  brokerUserId: String
  accessToken: String
  refreshToken: String
  status: String
  accounts: BrokerAccount
  // updatedAt: Date

  /*
  constructor (broker, token, status) {
    Logger.log({ function: 'BrokerConnection.constructor', broker: broker, token: token, status: status })

    this.setBroker(broker)
    this.setToken(token)
    this.status = status
  }
  */

  setBroker = (broker) => {
    this.brokerDealerId = broker.id
    this.brokerDealerName = broker.name
  }

  setToken = (token) => {
    this.accessToken = token.access_token
    this.refreshToken = token.refresh_token
  }

  setBrokerUserId = (token) => {
    this.brokerUserId = token.userid
  }

  toJson () {
    // Logger.log({ function: 'BrokerConnection.toJson', json: json })

    var retval = {
      id: this.id,
      broker_dealer_id: this.brokerDealerId,
      uid: this.brokerUserId,
      token: this.accessToken,
      refresh_token: this.refreshToken,
      status: this.status,
    }

    return retval
  }

  static fromJson (json) {

    var retval: BrokerConnection = new BrokerConnection()

    retval.accountId = json.account_id
    retval.accountName = json.account_name
    retval.accountType = json.account_type
    retval.mpid = json.broker_dealer_mpid ? json.broker_dealer_mpid : json.mpid // in one api backend is sending nroker_dealer_mpid and in another just mpid
    retval.brokerDealerName = json.broker_dealer_name
    retval.canAcceptOrder = json.can_accept_order
    retval.minBuyAmt = json.minimum_buy_order
    retval.status = json.status

    return retval
  }
}

export default BrokerConnection
