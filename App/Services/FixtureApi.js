

import {
  Token,
  // User,
  ClickIpoError
} from '../Models'

import Logger from '../Lib/Logger'

export default {
  // Functions return fixtures

  setAuthToken: (token) => {
    // Logger.log({ function: 'FixtureApi.setAuthToken', token: token })
  },

  register: (data: Object) => {
    try {
      const response = require('../Fixtures/RegisterResponse.json')
      // Logger.log({ function: 'FixtureApi.authenticate', response: response })

      // const token = Token.fromJson(response)
      // Logger.log({ function: 'FixtureApi.authenticate', token: token })

      return response
    } catch (err) {
      // Logger.log({ function: 'FixtureApi.register', err: err })

      if (err instanceof ClickIpoError) {
        throw err
      } else {
        // TODO: wrap error
        throw err
      }
    }
  },

  authenticate: (data: Object) => {
    try {
      if (data.email === 'tester@clickipo.com' && data.password === 'password') {
        const response = require('../Fixtures/AuthenticateResponse.json')
        // Logger.log({ function: 'FixtureApi.authenticate', response: response })

        // const token = Token.fromJson(response)
        // Logger.log({ function: 'FixtureApi.authenticate', token: token })

        return response
      } else {
        throw (new ClickIpoError(AuthenticationError.INVALID_CREDENTIALS))
      }
    } catch (err) {
      // Logger.log({ function: 'FixtureApi.authenticate', err: err })

      if (err instanceof ClickIpoError) {
        throw err
      } else {
        // TODO: wrap error
        throw err
      }
    }
  },

  getUser: (token: Token) => {
    try {
      const response = require('../Fixtures/GetUserResponse.json')
      // Logger.log({ function: 'FixtureApi.getUser', response: response })

      return response
    } catch (err) {
      if (err instanceof ClickIpoError) {
        throw err
      } else {
        // TODO: wrap error
        throw err
      }
    }
  },

  updateUser: (data: Object) => {
    const response = require('../Fixtures/UpdateUserResponse.json')
    // Logger.log({ function: 'FixtureApi.updateUser', response: response })

    return {
      ok: true,
      data: response
    }
  },

  getOfferings: (data: Object) => {
    try {
      const response = require('../Fixtures/GetOfferingsResponse.json')
      // Logger.log({ function: 'FixtureApi.getOfferings', response: response })

      return response
    } catch (err) {
      if (err instanceof ClickIpoError) {
        throw err
      } else {
        // TODO: wrap error
        throw err
      }
    }
  },

  getOffering: (data: Object) => {
    const response = require('../Fixtures/GetOfferingResponse.json')

    return {
      ok: true,
      data: response
    }
  },

  updateOffering: (data: Object) => {
    const response = require('../Fixtures/UpdateOfferingResponse.json')

    return {
      ok: true,
      data: response
    }
  },

  getOrders: (data: Object) => {
    const response = require('../Fixtures/GetOrdersResponse.json')

    return {
      ok: true,
      data: response
    }
  },

  getOrder: (data: Object) => {
    const response = require('../Fixtures/GetOrderResponse.json')

    return {
      ok: true,
      data: response
    }
  },

  createOrder: (data: Object) => {
    const response = require('../Fixtures/CreateOrderResponse.json')

    return {
      ok: true,
      data: response
    }
  },

  updateOrder: (data: Object) => {
    const response = require('../Fixtures/UpdateOrderResponse.json')

    return {
      ok: true,
      data: response
    }
  }
}
