

// import Logger from '../Lib/Logger'

class Underwriter {
  name: String
  lead: Boolean

  constructor (name: String, lead: Boolean) {
    this.name = name
    this.lead = lead
  }

  static fromJson (json) {
      // Logger.log({ function: 'Underwriter.fromJson', json: json })

    var retval: Underwriter = new Underwriter(json.name, json.lead)

    return retval
  }
  }

export default Underwriter
