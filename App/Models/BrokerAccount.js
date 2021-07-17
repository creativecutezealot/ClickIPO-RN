import Logger from '../Lib/Logger'

class BrokerAccount {
  id: String
  connectionId: String
  accountNumber: String
  account_id: String
  accountType: String
  availableBalance: Number
  active: Boolean
  // updatedAt: Date
  
  // constructor () {
  // }

  toJson = () => {
    Logger.log({ function: 'BrokerAccount.toJson', json: json })

    var retval = {
      id: (this.id) ? this.id : null,
      broker_dealer_connection_id: (this.connectionId) ? this.connectionId : null,
      account_id: (this.account_id) ? this.account_id : null,
      account_name: (this.accountNumber) ? this.accountNumber : null,
      account_type: (this.accountType) ? this.accountType : null,
      buying_power: (this.availableBalance) ? this.availableBalance : 0.00,
      active: (this.active) ? this.active : true,
    }
    Logger.log({ function: 'BrokerAccount.toJson', retval: retval })

    return retval
  }

  static fromJson = (json) => {

    var retval = new BrokerAccount()
    retval.id = (json.id) ? json.id : null
    retval.connectionId = (json.broker_dealer_connection_id) ? json.broker_dealer_connection_id : null
    retval.accountNumber = (json.account_name) ? json.account_name : null
    retval.account_id = (json.account_id.toString()) ? json.account_id.toString() : null
    retval.accountType = (json.account_type) ? json.account_type : null
    retval.availableBalance = (json.buying_power) ? json.buying_power : 0.00
    retval.active = (json.active) ? json.active : false
    // retval.updatedAt = (json.updatedAt) ? new Date(json.updated_at) : new Date()

    return retval
  }
}

export default BrokerAccount
