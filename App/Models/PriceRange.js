

class PriceRange {
  minPrice: Number
  maxPrice: Number

  constructor (minPrice: Number, maxPrice: Number) {
    this.minPrice = minPrice
    this.maxPrice = maxPrice
  }

  static fromJson (json) {
    var retval: PriceRange = new PriceRange(json.min_price, json.max_price)

    return retval
  }
}

export default PriceRange
