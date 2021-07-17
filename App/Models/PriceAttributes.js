

// import Logger from '../Lib/Logger'

class PriceAttributes {
  id: String
  minPrice: Number
  maxPrice: Number
  // updatedAt: Date

  // constructor () {
  // }

  static fromJson (json) {
    var retval: PriceAttributes = new PriceAttributes()

    retval.id = json.id
    retval.minPrice = json.min_price
    retval.maxPrice = json.max_price
    // retval.updatedAt = new Date(json.updated_at)

    return retval
  }
}

export default PriceAttributes
