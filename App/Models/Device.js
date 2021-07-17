

class Device {
  id: String
  platform: String
  name: String

  constructor (id: String, platform: String, name: String) {
    this.id = id
    this.platform = platform
    this.name = name
  }

  static fromJson (json) {
    // Logger.log({ function: 'Device.fromJson', json: json })

    var retval: Device = new Device(json.id, json.platform, json.name)

    return retval
  }
}

export default Device
