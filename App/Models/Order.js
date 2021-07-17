import { Offering, BrokerConnection } from './'


class Order {

  // constructor () {
    // console.log("Order Constructor")
    id: String
    requestedAmount: Number
    allocatedShares: Number
    allocatedAmount: Number
    status: String
    createdAt: String
    updatedAt: String
    cancelledAt: String
    systemCancel: boolean
    offering: Offering
    buyingPower: Number
  // }

  static fromJson (json) {
    var retval: Order = new Order()
    // retval.id = json.id
    retval.id = json.offering_id
    retval.requestedAmount = json.requested_amount
    retval.allocatedShares = json.allocated_shares
    //TODO:// removed by ALI -- test before releasing -- part of code clean up
    // retval.allocatedAmount = json.allocated_amount
    retval.status = json.status
    // retval.createdAt = new Date(json.created_at)
    retval.createdAt = json.created_at
    //TODO:// removed by ALI -- test before releasing -- part of code clean up
    // retval.updatedAt = new Date(json.updated_at)
    retval.cancelledAt = json.cancelled_at
    // TODO:// integrate system cancel
    // retval.systemCancel = json.system_cancel
    retval.offering = Offering.fromJson(json.offering)
    retval.reconfirmationRequired = !!(json.auto_cancellation_dt)
    retval.buyingPower = json.buying_power_as_of
    // retval.reconfirm_email_dt = json.reconfirm_email_dt
    retval.broker_connection = BrokerConnection.fromJson(json.broker_connection);
    return retval
  }
}

export default Order