

class Address {
  id: String
  address: String
  address2: String
  city: String
  state: String
  zipcode: String
  country: String
  latitude: Number
  longitude: Number
  timezone: String

  // constructor () {
  // }

  static fromJson (json) {
    var retval: Address = new Address()

    retval.id = json.id
    retval.address = json.address
    retval.address2 = json.address_2
    retval.city = json.city
    retval.state = json.state
    retval.zipcode = json.zipcode
    retval.country = json.country
    retval.latitude = json.latitude
    retval.longitude = json.longitude
    retval.timezone = json.timezone

    return retval
  }
}

export default Address
