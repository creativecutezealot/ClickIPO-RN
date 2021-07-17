// import { SocialProvider } from './SocialProvider'

class SocialShare {
  provider: Object
  shareable: Object // Offering, Article, etc.; {type: 'offering', obj: Obj}
  message: String


  constructor (provider: Object, shareable: Object, message: String) {
    this.provider = provider
    this.shareable = shareable
    this.message = message
  }

  static fromJson = (json) => {

    var retval: SocialShare = new SocialShare()
    retval.provider = json.provider
    retval.shareable = json.shareable
    retval.message = json.message

    return retval
  }
}

export default SocialShare
