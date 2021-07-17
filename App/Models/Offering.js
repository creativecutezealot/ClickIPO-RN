
import {
  // Industry,
  PriceRange,
  Industry,
  Underwriter
} from './'

// import Logger from '../Lib/Logger'

class Offering {
  id: String
  name: String
  description: String
  status: String
  tickerSymbol: String
  offeringTypeName: String
  participate: Boolean
  anticipatedPrice: PriceRange
  priceRange: String
  anticipatedDate: String
  anticipatedShares: Number
  acceptingOrders: Boolean
  updatingOrders: Boolean
  cancellingOrders: Boolean
  industries: Array<Industry>
  sortableIndustries: String
  tradeDate: String
  sortableDate: String
  finalPrice: Number
  finalShares: Number
  hasOrder: Boolean
  logoUrl: String
  prospectusUrl: String
  read: Boolean
  underwriters_list: String
  viewedAt: Date
  save: Boolean
  detailViewLoadedAt: Date
  created_at: String
  maxPrice: String
  minPrice: String
  // createdAt: Date
  // updatedAt: Date

  // constructor () {
  // }

  static fromJson (json) {
    // Logger.log({ function: 'Offering.fromJson', json: json })

    var retval: Offering = new Offering()

    retval.id = json.ext_id
    retval.name = json.name
    retval.description = json.description
    retval.status = json.status
    retval.tickerSymbol = json.ticker_symbol
    retval.offeringTypeName = json.offering_type_name
    retval.hasOrder = json.has_order
    // retval.anticipatedPrice = PriceRange.fromJson(json.min_price, json.max_price) //PriceRange.fromJson(json.anticipated_prices)
    retval.minPrice = json.min_price
    retval.maxPrice = json.max_price
    retval.priceRange = json.price_range
    // retval.anticipatedDate = json.anticipated_date ? new Date(json.anticipated_date) : null
    // retval.anticipatedDate = (json.trade_date ? new Date(json.trade_date) : null) //(json.anticipated_date ? new Date(json.anticipated_date) : null)
    retval.anticipatedDate = (json.trade_date ? (json.trade_date) : null)
    retval.anticipatedShares = json.anticipated_shares
    retval.participate = json.participate
    retval.acceptingOrders = json.available_to_order //json.accepting_orders
    // retval.updatingOrders = json.updating_orders
    // retval.cancellingOrders = json.cancelling_orders
    retval.industries = json.industry
    // (json.industries) ? json.industries.map((json) => {
    //   return (Industry.fromJson(json))
    // }) : []
    retval.sortableIndustries = json.industry //retval.industries[0] ? retval.industries[0].name : null
    // retval.tradeDate = json.trade_date ? new Date(json.trade_date) : null //json.effective_date ? new Date(json.effective_date) : null
    retval.tradeDate = json.trade_date
    retval.sortableDate = retval.tradeDate ? retval.tradeDate : null
    retval.finalPrice = json.final_price
    retval.finalShares = json.final_shares
    retval.logoUrl = json.logo_small
    retval.prospectusUrl = json.prospectus_url
    retval.brochureUrl = json.brochure_url
    retval.read = json.read
    retval.underwritersList = (json.underwriters_list) ? json.underwriters_list.map((list) => {
      return (list.executing_broker_name)
    }).join(" - ") : []
    //Array.isArray(json.underwriters_list) ? json.underwriters_list.join(' - ') : json.underwriters_list;
    // retval.createdAt = new Date(json.created_at)
    // retval.updatedAt = new Date(json.updated_at)
    retval.viewedAt = null
    retval.save = json.followed
    retval.detailViewLoadedAt = null
    retval.created_at = json.created_at

    return retval
  }
}

export default Offering