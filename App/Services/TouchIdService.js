import {
  // Alert
} from 'react-native'

import TouchId from 'react-native-smart-touch-id'

import {
  // ClickIpoError
} from '../Models'

import Logger from '../Lib/Logger'

// our "constructor"
const create = () => {
  // var deferredEnableTouchId

  const isSupported = async () => {
    // Logger.log({ function: 'TouchIdServices.isSupported' })

    var retval = false

    try {
      await TouchId.isSupported()

      retval = true
    } catch (err) {
      // Logger.log({ function: 'TouchIdServices.isSupported', err: err })
      // TouchId is not supported
    }

    return retval
  }

  const attemptTouchId = async (user) => {
    // Logger.log({ function: 'TouchIdServices.attemptTouchId' })

    var retval = false

    try {
      const description = 'Sign-in with ' + user
      const title = ''

      await TouchId.verify({
        description,
        title
      })

      retval = true
    } catch (err) {
      // Logger.log({ function: 'TouchIdServices.attemptTouchId', err: err })
      // TouchId is not supported
    }

    return retval
  }

  /**
  private helper methods
  */

  // export/return only "public" funcs
  return {
    isSupported,
    attemptTouchId
  }
}

// let's return back our create method as the default.
export default {
  create
}
