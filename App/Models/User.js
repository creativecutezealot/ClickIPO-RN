import {
  BrokerConnection,
  Device,
  SocialIdentity
} from './'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

class User {
  id: String
  firstName: String
  lastName: String
  marketing_brokerage: String
  email: String
  brokerConnection: BrokerConnection
  devices: Array<Device>
  socialIdentities: Array<SocialIdentity>
  // createdAt: Date
  // updatedAt: Date
  restricted_person: Number
  default_amount: Number
  pushNotification: Number
  canEmail: Number
  // broker

  // constructor () {
  // }

  getSocialIdentity = (providerId) => {
    const retval = findByProp('provider', providerId, this.socialIdentities)

    return retval
  }

  static fromJson = (json) => {
    // Logger.log({ function: 'User.fromJson', json: json })

    /**
     * 
     */

    var retval: User = new User()
    retval.id =  '' //json.id
    retval.firstName = json.first_name
    retval.lastName = json.last_name
    retval.marketing_brokerage = json.marketing_brokerage
    retval.email = json.email
    retval.default_amount = json.default_amount
    retval.brokerConnection = (json.broker_connection) ? BrokerConnection.fromJson(json.broker_connection) : null
    retval.devices = []
    // (json.user_devices && json.user_devices[0] != null) ? json.user_devices.map((el) => {
    //   return (Device.fromJson(el))
    // }) : []
    retval.socialIdentities = (json.user_identities && json.user_identities[0] != null) ? json.user_identities.map((el) => {
      return (SocialIdentity.fromJson(el))
    }) : []
    // retval.createdAt = new Date(json.created_at)
    // retval.updatedAt = new Date(json.updated_at)
    retval.restricted_person = json.restricted
    retval.pushNotification = json.push_notification
    retval.canEmail = json.can_email

    return retval
  }
}

export default User
