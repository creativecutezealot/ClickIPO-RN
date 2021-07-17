

class DateAttributes {
  id: String
  maxDate: Date
  // updatedAt: Date

  // constructor () {
  // }

  static fromJson (json) {
    var retval: DateAttributes = new DateAttributes()

    retval.id = json.id
    retval.maxDate = json.max_date
    // retval.updatedAt = new Date(json.updated_at)

    return retval
  }
}

export default DateAttributes
