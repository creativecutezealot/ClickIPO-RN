

class SocialIdentity {
  id: String
  provider: String
  token: String
  secret: String
  // createdAt: Date
  // updatedAt: Date

  // constructor () {
  // }

  static fromJson (json) {
    var retval: SocialIdentity = new SocialIdentity()
    //retval.id = json.id
    retval.provider = json.provider
    // retval.token = json.token
    // retval.secret = json.secret
    // retval.uid = json.uid
    // retval.createdAt = new Date(json.created_at)
    // retval.updatedAt = new Date(json.updated_at)

    return retval
  }
}

export default SocialIdentity
