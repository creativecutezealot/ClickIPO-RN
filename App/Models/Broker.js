

import { Address } from './'

// import Logger from '../Lib/Logger'

class Broker {
  id: String
  name: String
  address: Address
  email: String
  address: Address
  logoSmall: String
  logoMedium: String
  bd_id: String
  db_secret: String
  authorizedurl: String
  accesstokenurl: String
  callbackurl: String
  base_url: String

  // constructor () {
  // }

  static fromJson (json) {
    // Logger.log({ function: 'Broker.fromJson', json: json })

    var retval: Broker = new Broker()

    retval.id = json.id
    retval.name = json.name
    // retval.address = Address.fromJson(json.address)
    retval.logoSmallUrl = json.logo_small
    retval.logoMediumUrl = json.logo_medium
    retval.bd_id = json.bd_id
    retval.db_secret = json.db_secret
    retval.authorizedurl = json.authorizedurl
    retval.accesstokenurl = json.accesstokenurl
    retval.callbackurl = json.callbackurl
    retval.base_url = json.base_url

    return retval
  }
}

export default Broker
