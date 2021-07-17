

// import Logger from '../Lib/Logger'

class Industry {
  name: String

  constructor (name: String) {
    this.name = name
  }

  static fromJson (json) {
      // Logger.log({ function: 'Industry.fromJson', json: json })

    var retval: Industry = new Industry(json.name)

    return retval
  }
  }

export default Industry
