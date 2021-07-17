import Logger from '../Lib/Logger'

export default class SocialProvider {
  constructor () {
    /* TODO: commentted out due to bundler issue "Unexpected token: punc (.)"
    if (new.target === SocialProvider) {
      throw new TypeError('Cannot construct SocialProvider instances directly.');
    }

    if (this.auth === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override method 'auth()'");
    }

    if (this.share === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override method 'share()'");
    }
    */

    this.id = null
    this.name = null
    this.icon = null
    this.color = null

    this.identity = null
  }

  oauth = () => {
    // Logger.log({ name: 'SocialProvider.oauth()' })

    throw new Error('Method not implemented.')
  }

  share = () => {
    // Logger.log({ name: 'SocialProvider.share()' })

    throw new Error('Method not implemented.')
  }

  setIdentity = (identity) => {
    // Logger.log({ name: 'SocialProvider.auth()', identity: identity })

    this.identity = identity
  }

  hasIdentity = () => {
    return (this.identity && this.identity !== null)
  }
}
