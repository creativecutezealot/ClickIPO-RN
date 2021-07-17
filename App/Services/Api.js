// a library to wrap and simplify api calls
import apisauce from 'apisauce';
import publicIP from './PublicIPAddress';
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage';

import {
  Token,
  User,
  Offering,
  Industry,
  Order,
  Broker,
  BrokerConnection,
  BrokerAccount,
  Term,
  Article,
  Faq,
  AppUpdate,
  ClickIpoError
} from '../Models'

import Config from 'react-native-config'
import Logger from '../Lib/Logger'

import { sha3_512 } from 'js-sha3';
import { Actions as NavigationActions } from 'react-native-router-flux'
import SettingsActions from '../Redux/SettingsRedux'
import { call, put, select } from 'redux-saga/effects'
var authtoken;
// our "constructor"
const create = (baseURL = Config.API_BASE_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //

  var client_ip = ''

  publicIP(baseURL).then(ip => {
    const x = JSON.parse(ip)
    if (!x.ip) {
      client_ip = ''
    } else {
      client_ip = x.ip
    }
  });

  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }

  // updates api token after authentication
  const setAuthToken = (token) => {
    console.log(0)
    authtoken = token;
    // Logger.log({ function: 'Api.setAuthToken', token: token })
    api.setHeader('Authorization', token)
  }

  // response transformer (can only change data)
  // api.addResponseTransform(response => {
  //
  // })

  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting it out of the
  // way at this level.
  //

  const reLogin = (response) => {
    // if (response.data.error === 'Unauthorized' && response.data.status === 401) {
    if (response.status === 401) {
      NavigationActions.login();
    }
  }

  const processResponse = (response) => {
    // Logger.log({ function: 'Api.processResponse', response: response })
    if (response.status !== 201) {
      throw new ClickIpoError(response.data.message)
    }

    return response.data.data
  }

  const processError = (err) => {
    if (err instanceof ClickIpoError) {
      throw err
    } else {
      throw new ClickIpoError(err)
    }
  }


  /* USER */


  const getUser = () => {
    console.log(1)

    return api.get('/users')
      .then((response) => {
        console.log('responser from the user: ', response)
        reLogin(response)
        processResponse(response)
        const retval = User.fromJson(response.data.data)
        return retval
      }).catch((err) => {
        console.log('error in getUser: ', err);
        processError(err)
      })
  }

  const updateUser = (data) => {
    console.log(2)
    return api.put('/users', data)
      .then((response) => {
        reLogin(response)
        processResponse(response)
        const retval = User.fromJson(response.data.data)
        return retval
      }).catch((err) => {
        processError(err)
      })
  }

  //TODO: modify this api to return 201 instead of a true. The function that calls this in sagas needs to get a 201 instead of a true
  const validateCurrentPassword = (encryptedPassword) => {
    console.log(1.5)
    return api
      .post('/users/password/verify', encryptedPassword)
      .then(response => {
        if (response.status !== 201) {
          var data = { success: false, message: "password not correct" }
          return data
        } else {
          return true
        }
      })
      .catch(err => {
        processError(err)
      });
  }


  const updateNotificationsToken = (token) => {

    console.log(3)
    // transform object
    const data = { device_id: token.token, platform: token.os.toLowerCase(), name: token.name }
    return api.post('/users/device_token', data)
      .then((response) => {
        reLogin(response)
        processResponse(response)
      })
      .catch((err) => {
        processError(err)
      })
  }

  const logNotificationOpen = (data: Object) => {
    console.log(4)
    return api.post('/push_notifications/create', data)
      .then((response) => {
        reLogin(response)
        processResponse(response)
      })
      .catch((err) => {
        processError(err)
      })
  }

  const register = (data: Object) => {
    console.log(5)
    data.client_ip = client_ip
    data.encrypted_password = sha3_512(data.password)

    delete data.password
    delete data.password_confirmation
    return api.post('/users/signup', data)
      .then((response) => {
        console.log('response from register: ', response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }
        // const retval = Token.fromJson(response.data.data)
        // return retval
        return response.status;
      }).catch((err) => {
        console.log('error from register: ', err)
        processError(err)
      })
  }

  const authenticate = (data: Object) => {
    console.log(6)
    data.client_ip = client_ip;

    return api.post('/users/login', data)
      .then((response) => {
        if (response.status === 403) {
          return response;
        } else if (response.status !== 201) {
          throw new ClickIpoError(response.data.message);
        }
        const retval = Token.fromJson(response.data.data);

        authtoken = retval.token;
        AsyncStorage.setItem('authtoken', authtoken);
        return retval
      }).catch((err) => {
        processError(err)
      })
  }

  //TODO: modify this api to return 201 instead of a true. The function that calls this in sagas needs to get a 201 instead of a true
  //this method generates the token and sends an email to the user with the reset token
  const forgotPassword = (data: Object) => {
    console.log(9)
    return api.post('/users/password', data)
      .then((response) => {
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        } else {
          return true
        }
      }).catch((err) => {
        processError(err)
      })
  }

  //this method uses the generated token to update the users password
  const resetPassword = (data: Object) => {
    console.log(10)
    data.encrypted_password = sha3_512(data.password)
    //data.password_confirmation = sha3_512(data.password_confirmation)

    delete data.password
    delete data.password_confirmation

    return api.put('/users/password', data)
      .then((response) => {
        processResponse(response)
        NavigationActions.login()
      }).catch((err) => {
        processError(err)
      })
  }

  const changePassword = (data: Object) => {
    console.log(11)
    data.encrypted_password = sha3_512(data.password)
    //data.password_confirmation = sha3_512(data.password_confirmation)

    delete data.password
    delete data.password_confirmation

    return api.put('/users/password', data)
      .then((response) => processResponse(response))
      .catch((err) => {
        processError(err)
      })
  }


  // this api is sending 201, previously it was 200
  const checkUserExists = (data: Object) => {
    console.log(12)
    return api.post('/users/user_exists', data)
      .then((response) => {
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }
        const retval = response.data.data
        retval.status = response.status
        return retval
      })
      .catch((err) => {
        processError(err)
      })
  }

  const resendPasswordResetEmail = (data: Object) => {
    console.log(13)
    return api.post('/users/password_reset_instructions', data)
      .then((response) => processResponse(response))
      .catch((err) => {
        processError(err)
      })
  }

  /* OFFERING */
  const getOfferings = (data: Object) => {
    console.log(14)
    return api.get('/offerings', data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }
        // var temp = { error: "ERROR", displayMessage: "ERROR", stack: " " }
        // //error while calling api
        // if (response.problem) {
        //   throw new ClickIpoError(temp)
        // }
        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          return (Offering.fromJson(json))
        }) : []
        return retval
      }).catch((err) => {
        processError(err)
      })
  }

  const getOffering = (data: Object) => {
    console.log(15)
    const id = data.id
    return api.get(`/offerings?ext_id=${id}`, data)
      .then((response) => {
        console.log('response from 15: ', response)
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }
        const retval = Offering.fromJson(response.data.data)
        return retval
      }).catch((err) => {
        processError(err)
      })
  }

  //TODO: need to confirm that error message is handled properly
  const updateOfferingSaved = (data: Object) => {
    // Logger.log({ function: 'Api.updateOfferingSaved', data: data })
    console.log(17)
    const id = data.id

    return api.post('/offerings/save', data)
      .then((response) => {
        // Logger.log({ function: 'Api.updateOfferingSaved', response: response })
        // TODO: disable error due to API response on duplicate key
        if (response.data) {
          reLogin(response)
          if (response.data.status !== 201) {
            // throw new ClickIpoError(response.data.error)
          }
          // TODO: workaround
          // const retval = !(response.data.status === 201) ?
            // Offering.fromJson(response.data.data) : getOffering({ id: id })
          // return retval
        }
        const retval = {}
        retval.status = response.status
        return retval
      }).catch((err) => {
        processError(err)
      })
  }

  //TODO: confirm that this api does not require a error response
  const updateOfferingRead = (data: Object) => {
    console.log(18)
    // Logger.log({ function: 'Api.updateOfferingSaved', data: data })
    const id = data
    return api.post('/offerings/mark_read')
      .then((response) => {
        // TODO: disable error due to API response on duplicate key
        reLogin(response)
        if (response.data.error) {
          // throw new ClickIpoError(response.data.error)
        }

        // TODO: workaround
        // const retval = !(response.data.error) ? true : getOffering({ id: id })

        return true
      }).catch((err) => {
        processError(err)
      })
  }

  /* ORDER */
  const getOrders = (data: Object, tempValue: string) => {
    console.log(20)
    return api.get('/orders', data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }
        // var temp = { error: "ERROR", displayMessage: "ERROR", stack: " " }
        // //error while calling api
        // if (response.problem) {
        //   throw new ClickIpoError(temp)
        // }

        // TODO: what is this? refactor it
        if (tempValue == "1") {
          NavigationActions.offerings()
        }
        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          return (Order.fromJson(json))
        }) : []
        // Logger.log({ function: 'Api.getOrders', retval: retval })

        const retvalOrderedByStatus = _.orderBy(retval, ['status'], ['asc'])
        return retvalOrderedByStatus
      })
      .catch((err) => {
        processError(err)
      });
  }

  // TODO why is there authtoken const
  const getOrder = (data: Object) => {
    console.log(21)
    const authtoken = data.authtoken

    return api.get('/orders?ext_id=' + data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = Order.fromJson(response.data.data);
        return retval;
      })
      .catch((err) => {
        processError(err)
      })
  }

  //TODO verify what is the response of this call
  // This api is checking for active order from a given offering
  const getActiveOrder = (data) => {
    console.log(22)
    const id = data;
    return api.get(`/offerings/active_order/?ext_id=${id}`)
      .then(response => {
        if (response.data.data) {
          reLogin(response)
          if (response.status !== 201) {
            throw new ClickIpoError(response.data.message);
          }
          // const retval = response.data
          const retval = Order.fromJson(response.data.data);

          retval.status = response.status
          return retval
        }
        const retval = {}
        retval.status = response.status
        return retval
      })
      .catch(err => {
        processError(err)
      });
  }

  const createOrder = (data) => {
    console.log(23)
    return api.post('/orders', data)
      .then((response) => {
        console.log(response)
        reLogin(response);
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        // const order = Order.fromJson(response.data.data)
        return true
      })
      .catch((err) => {
        processError(err)
      })
  }

  const orderReconfirmation = (data) => {
    console.log(23.1);
    return api.post('/orders/reconfirm', data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message);
        }
        return response
      })
      .catch((err) => {
        processError(err);
      })
  }

  const updateOrder = (data: Object) => {
    console.log(24)
    // have to pass the id this way because this api expects the id to be part of the body and not a query parameter
    return api.put('/orders', {}, { data })
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        // const order = Order.fromJson(response.data.data)
        return true
      })
      .catch((err) => {
        processError(err)
      })
  }

  const getIndustries = () => {
    console.log(25)
    return api.get('/offerings/industries')
      .then((response) => {
        reLogin(response.data)
        if (response.data.error) {
          throw new ClickIpoError(response.data.data.error)
        }
        //error while calling api
        if (response.problem) {
          throw new ClickIpoError(temp)
        }
        return response.data.data
      }).catch((err) => {
        processError(err)
      })
  }

  const cancelOrder = (data: Object) => {
    console.log(26)
    const id = data.id

    // have to pass the id this way because this api expects the id to be part of the body and not a query parameter
    return api.delete('/orders', {}, { data })
      .then((response) => {
        reLogin(response);
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        } else {
          return response.status
        }
      })
      .catch((err) => {
        processError(err)
      })
  }

  /* BROKER */
  const getBrokers = (data: Object) => {
    // Logger.log({ function: 'Api.getBrokers', data: data })
    console.log(27)
    return api.get('/broker_dealers', data)
      .then((response) => {
        reLogin(response)
        // Logger.log({ function: 'Api.getBrokers', response: response })

        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          // Logger.log({ function: 'Api.getBrokers', json: json })
          return (Broker.fromJson(json))
        }) : []
        return retval
      }).catch((err) => {
        console.log(err);
        processError(err)
      })
  }

  /* TERM */
  const getTerms = (data: Object) => {
    console.log(29)
    return api.get('/glossary_terms', data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          // Logger.log({ function: 'Api.getTerms', json: json })
          return (Term.fromJson(json))
        }) : []
        // Logger.log({ function: 'Api.getTerms', retval: retval })

        return retval
      })
      .catch((err) => {
        processError(err)
      })
  }

  /* FAQ */
  const getFaqs = (data: Object) => {
    console.log(31)
    return api.get('/frequent_questions', data) // ?category=general||investor_score
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          // Logger.log({ function: 'Api.getFaqs', json: json })
          return (Faq.fromJson(json))
        }) : []
        // Logger.log({ function: 'Api.getFaqs', retval: retval })

        return retval
      })
      .catch((err) => {
        processError(err)
      })
  }

  const getArticles = (data: Object) => {
    console.log(33)
    return api.get('/articles', data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          // Logger.log({ function: 'Api.getFaqs', json: json })
          return (Article.fromJson(json))
        }) : []
        // Logger.log({ function: 'Api.getArticles', retval: retval })

        return retval
      })
      .catch((err) => {
        processError(err)
      })
  }

  const getArticle = (data: Object) => {
    console.log(34)
    return api.get('/articles' + id, data)
      .then((response) => {
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }
        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          // Logger.log({ function: 'Api.getFaqs', json: json })
          return (Article.fromJson(json))
        }) : []
        // Logger.log({ function: 'Api.getArticles', retval: retval })

        return retval
      })
      .catch((err) => {
        processError(err)
      })
  }

  const createBrokerConnection = (brokerConnection: Object) => {
    console.log(36)
    Logger.log({ function: 'Api.createBrokerConnection', brokerConnection: brokerConnection })
    return api.post('/connections', brokerConnection.toJson())
      .then((response) => {
        console.log('response from post connections: ', response);
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        // const retval = BrokerConnection.fromJson(response.data)
        const retval = null // TODO: workaround to server not returning the new connection; sagas will get the user which has the new connection

        return retval
      })
      .catch((err) => {
        processError(err)
      })
  }

  // api deletes the broker connection account and deletes all the orders
  const deleteBrokerConnection = (data) => {
    console.log(38)

    // the second parameter is an empty object because we have to send "data object" as the body and no query parameters
    return api.delete('/broker_dealer_connections', {}, { data })
      .then((response) => {
        brokerConnection: null
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        } else {
          return true
        }
      })
      .catch((err) => {
        processError(err)
      })
  }

  const getBrokerConnectionAccounts = () => {
    console.log(39)
    return api.get('/accounts')
      .then((response) => {
        console.log('response from get accounts: ', response);
        reLogin(response)
        //Logger.log({ function: 'Api.getBrokerConnectionAccounts', response: response })

        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message);
        }

        console.log('response in get accounts before retval: ', response);
        const retval = (response.data.data[0] != null) ? response.data.data.map((json) => {
          return (BrokerAccount.fromJson(json))
        }) : []
        console.log('retval: ', retval)
        return retval
      })
      .catch((err) => {
        console.log('error in getBrokerConnectionAccounts: ', err)
        processError(err)
      })
  }

  const getActiveBrokerAccount = () => {
    console.log(40)
    return api.get('/accounts/active')
      .then((response) => {
        reLogin(response);
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = BrokerAccount.fromJson(response.data.data)
        return retval

      })
      .catch((err) => {
        processError(err)
      })
  }

  const createBrokerAccount = (brokerAccount: BrokerAccount) => {
    console.log(41)
    // This data needs to contain the data from post/connections
    Logger.log({ function: 'Api.createBrokerAccount', brokerAccount: brokerAccount })

    // TODO: need to pass Key when POSTing

    const data = {
      broker_dealer_connection_id: brokerAccount.connectionId,
      account_id: brokerAccount.account_id,
      account_name: brokerAccount.accountNumber,
      account_type: brokerAccount.accountType,
      active: brokerAccount.active,
      buying_power: brokerAccount.availableBalance ? brokerAccount.availableBalance.toFixed(2) : brokerAccount.availableBalance
    }
    return api.post('/accounts', data)
      .then((response) => {
        console.log('response from post accounts: ', response)
        reLogin(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        }

        const retval = BrokerAccount.fromJson(response.data.data)
        return retval
      })
      .catch((err) => {
        console.log('error from post account: ', err)
        processError(err)
      })
  }

  const getBuyingPower = () => {
    console.log(44)
    return api.get('/accounts/buying_power')
      .then(response => {
        if (response.data.data) {
          reLogin(response)
          if (response.status !== 201) {
            throw new ClickIpoError(response.data.message)
          }
          const buyingPower = response.data.data;
          buyingPower.status = response.status;
          return buyingPower
        }
      })
      .catch((err) => {
        processError(err)
      })
  }

  // TODO:// confirm what the payload is and handle the error properly
  const sendProspectusToUser = (data) => {
    console.log(48)
    // return api.get('/offerings/prospectus', ext_id)
    // data is ext_id and we are sending it as string
    // const ext_id = { ext_id: data }
    return api.get('/offerings/prospectus', data)
      .then((response) => {
        console.log('response from email prospectus: ', response)
        if (response.data) {
          processResponse(response);
        }
      })
      .catch((err) => {
        processError(err);
      });
  }

  // Note: This api is responsible for checking the server status and the client version number
  const appStatus = (data) => {
    console.log(48.5);
    return api.get('/app/server/status', data)
      .then(response => {
        console.log('response from appStatus call: ', response);
        if (response.status === 404) {
          throw new ClickIpoError(response.data.message);
        } else if (response.status === 201) {
          const retval = AppUpdate.fromJson(response.data.data)
          return retval
        } else {
          throw new ClickIpoError('Unable to connect to the server, please try again later or contact ClickIPO Support')
        }
      }).catch(err => {
        processError(err);
      })
  }


  // remove this code
  const serverStatus = (data) => {
    console.log(49);
    return api.post('/users/server_status', data)
      .then((response) => {
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.data);
        }
        return response.status;
        // if (response.status === 404) {
        //   throw new ClickIpoError(response.data.data)
        // } else {
        //   if (response.data) {
        //     if (response.data.error) {
        //       throw new ClickIpoError(response.data.message)
        //     }
        //     return response.data
        //   } else {
        //     const error = "Server maintenance in progress. ClickIPO apologizes for any inconvenience. Please try again later!"
        //     throw new ClickIpoError(error)
        //   }
        // }
      })
      .catch((err) => {
        processError(err);
      })
  }

  // TODO what is this api doing, handle the error properly
  const pushNotificationConfig = (data) => {
    console.log(50);
    return api.post('/users/pushNotification', data)
      .then((response) => {
        return response
      })
      .catch((err) => {
        processError(err)
      })
  }

  const marketingBrokerages = () => {
    console.log(51);
    return api.get('/marketing_brokerages')
      .then(response => {
        console.log('response from marketingBrokerages: ', response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message)
        } else {
          return response.data.data;
        }
      })
      .catch(err => {
        processError(err)
      })
  }

  const sendUserIdentities = (data) => {
    console.log(52);
    // console.log('data sendUserIdentities: ', data)
    return api.post('/user_identities', data)
      .then(response => {
        console.log(response)
        if (response.status !== 201) {
          throw new ClickIpoError(response.data.message);
        } else {
          return response.data.data;
        }
      })
      .catch(err => {
        processError(err);
      })
  }

  const verifyEmail = (data) => {
    console.log(53);
    console.log('data in verifyEmail: ', data);
    return api.post('/users/signup/verify_email', data)
      .then(response => {
        return response;
      })
      .catch(err => {
        processError(err);
      });
  }

  const resendVerificationEmail = (data) => {
    console.log(54);
    console.log('data sending in resendVerificationEmail: ', data);
    return api.post('/users/signup/resend_verification_email', data)
      .then(response => {
        return response;
      })
      .catch(err => {
        processError(err);
      })
  }

  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately for security reasons.
  //
  return {
    setAuthToken,

    // a list of the API functions from step 2
    getUser,
    updateUser,
    validateCurrentPassword,
    updateNotificationsToken,
    logNotificationOpen,
    register,
    authenticate,
    forgotPassword,
    changePassword,
    verifyEmail,

    getOfferings,
    getOffering,
    updateOfferingSaved,
    updateOfferingRead,

    getIndustries,

    getOrders,
    getActiveOrder,
    getOrder,
    createOrder,
    orderReconfirmation,
    updateOrder,
    cancelOrder,

    getBrokers,
    createBrokerConnection,
    deleteBrokerConnection,
    getBrokerConnectionAccounts,
    getActiveBrokerAccount,
    createBrokerAccount,
    getBuyingPower,

    getTerms,

    getFaqs,

    getArticles,
    getArticle,

    resetPassword,
    checkUserExists,
    resendPasswordResetEmail,
    sendProspectusToUser,
    serverStatus,
    pushNotificationConfig,
    marketingBrokerages,
    sendUserIdentities,
    appStatus,
    resendVerificationEmail,
  }
}

// let's return back our create method as the default.
export default {
  create
}
