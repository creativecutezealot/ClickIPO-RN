

class ShareAttributes {
  id: String
  anticipatedShares: String
  // updatedAt: Date

  // constructor () {
  // }

  static fromJson (json) {
    var retval: ShareAttributes = new ShareAttributes()
    retval.id = json.id
    retval.anticipatedShares = json.anticipated_shares
    // retval.updatedAt = new Date(json.updated_at)

    return retval
  }
}

export default ShareAttributes
