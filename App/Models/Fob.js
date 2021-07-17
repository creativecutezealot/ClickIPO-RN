import { Token } from './'

class Fob {
  token: Token
  id: String
  email: String

  notificationsPrompt: Boolean
  notificationsEnabled: Boolean

  touchIdPrompt:Boolean
  touchIdEnabled:Boolean

  onboarding:Boolean

  constructor (token: Token) {
    this.token = token
    this.id = token.id
    this.email = token.email

    // defaults
    this.notificationsPrompt =  true
    this.notificationsEnabled =  false

    this.touchIdPrompt =  true
    this.touchIdEnabled =  false

    this.onboarding = true
  }

  /*
  static fromJson (json) {
    // Logger.log({ function: 'Fob.fromJson', json: json })

    var retval: Fob = new Fob(json.id)

    return retval
  }
  */
}

export default Fob
