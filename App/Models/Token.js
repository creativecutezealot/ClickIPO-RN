import JwtDecode from 'jwt-decode'
import Logger from '../Lib/Logger'

class Token {
  token: String
  isValid: Boolean = false

  // decoded
  // expiresAt: Date
  id: String
  email: String
  firstName: String
  lastName: String

  constructor (token: String) {
    this.token = token
    this.decode()
  }

  decode () {
    try {
      var decodedToken = JwtDecode(this.token)
      // Logger.log({ decodedToken: decodedToken })

      // this.expiresAt = new Date(decodedToken.exp)
      this.id = decodedToken.id
      this.email = decodedToken.email
      this.firstName = decodedToken.firstName
      this.lastName = decodedToken.lastName
      this.isValid = true
    } catch (err) {
        // TODO:
        // Logger.log({ err: err })
    }
  }

  static fromJson (json) {
    var retval: Token = new Token(json.token)

    return retval
  }
}

export default Token
