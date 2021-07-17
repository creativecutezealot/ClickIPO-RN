import { call, put, select } from 'redux-saga/effects'
import OfferingActions from '../Redux/OfferingRedux'
import { findByProp } from 'ramdasauce'
import {uniqBy, includes} from 'lodash'
// import Intercom from 'react-native-intercom'
import Logger from '../Lib/Logger'
import ToastActions from '../Redux/ToastRedux'
//import firebase from '../Services/FirebaseService'
import firebase from '../Config/FirebaseConfig'
import Config from 'react-native-config'


/******
export function * loadOfferings (api, action) {
  // Logger.log({ function: 'OfferingSagas.loadOfferings', action: action })

  try {
    // TODO: fork these API calls so they run in parellel
    // fetch activeOfferings
    const activeOfferings = yield call(api.getOfferings, {})

    // fetch closedOfferings
    const closedOfferings = yield call(api.getOfferings, { status: 'closed'})

    // fetch savedOfferings
    const savedOfferings = yield call(api.getOfferingsSaved, {})

    const offerings = activeOfferings.concat(closedOfferings)

    var newOfferings = offerings.concat(savedOfferings)
    newOfferings = _.uniqBy(newOfferings, (e) => {
      return e.id;
    });

    newOfferings = newOfferings.map((thisOffering) => {
      savedOfferings.map((thatOffering) => {
        if(thisOffering.id === thatOffering.id){
          thisOffering.save = true
          if(action.data && action.data.initSession){
            firebase.messaging().subscribeToTopic('offering_' + thatOffering.id)
          }
        }
      })
      return (
        thisOffering
      )
    })

    if(action.data && action.data.initSession){
      firebase.messaging().subscribeToTopic("all_users")
    }
    
    yield put(OfferingActions.fetchOfferingsSuccess(newOfferings))

  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.loadOfferings', err: err })
    yield put(OfferingActions.fetchOfferingsFailure(err))
  }
}
*****/

export function * loadOfferings (api, action) {
  // Logger.log({ function: 'OfferingSagas.loadOfferings', action: action })
  try {
    // TODO: fork these API calls so they run in parellel
    // fetch allOfferings
    const allOfferings = yield call(api.getOfferings, {})

    // fetch savedOfferings -- we are no longer fetching saved offerings, this info is provided in the get all offering api call 
    //// Ali: unwanted code
    // const savedOfferings = yield call(api.getOfferingsSaved, {})

    // var newOfferings = activeOfferings.concat(savedOfferings)
    // newOfferings = _.uniqBy(newOfferings, (e) => {
    //   return e.id;
    // });

    // newOfferings = newOfferings.map((thisOffering) => {
    //   savedOfferings.map((thatOffering) => {
    //     if(thisOffering.id === thatOffering.id){
    //       thisOffering.save = true
    //       if(action.data && action.data.initSession){
    //         firebase.messaging().subscribeToTopic('offering_' + thatOffering.id)
    //       }
    //     }
    //   })
    //   return (
    //     thisOffering
    //   )
    // })

    if (action.data && action.data.initSession) {
      if (Config.API_BASE_URL === 'https://api-staging.clickipo.com') {
        firebase.messaging().subscribeToTopic("all_staging_users");
      } else {
        firebase.messaging().subscribeToTopic("all_users");
      }
    }
    yield put(OfferingActions.fetchOfferingsSuccess(allOfferings))

  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.loadOfferings', err: err })
    yield put(OfferingActions.fetchOfferingsFailure(err))
  }
}


export function * fetchOfferings (api, action) {
  // Logger.log({ function: 'OfferingSagas.fetchOfferings', action: action })
  const { data } = action
  const { forceRefresh } = data

  try {
    const localOfferings = yield select(lOfferings)
    // Logger.log({ function: 'OfferingSagas.fetchOfferings', localOfferings: localOfferings })

    if (!localOfferings || !localOfferings[0] || forceRefresh) { // TODO: will need a way to 'force update' these, TTL
      // fetch offerings
      const offerings = yield call(api.getOfferings, data)

      // Ali: unwanted code
      // const savedOfferings = yield call(api.getOfferingsSaved, data)
      // var newOfferings = offerings.concat(savedOfferings)
      // newOfferings = _.uniqBy(newOfferings, (e) => {
      //   return e.id;
      // });
      // var newOfferings = newOfferings.map((thisOffering) => {
      //   savedOfferings.map((thatOffering) => {
      //     if(thisOffering.id === thatOffering.id){
      //       thisOffering.save = true
      //     }
      //   })
      //   return (
      //     thisOffering
      //   )
      // })

      yield put(OfferingActions.fetchOfferingsSuccess(offerings))
    } else {
      yield put(OfferingActions.fetchOfferingsSuccess(null))      
    }
  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.fetchOfferings', err: err })
    yield put(OfferingActions.fetchOfferingsFailure(err))
  }
}

export function * fetchIndustries (api, action) {
 
  const { data } = action

  try {
      // fetch industries
      const industries = yield call(api.getIndustries, data)

      yield put(OfferingActions.fetchIndustriesSuccess(industries))

    } catch (err) {
    yield put(OfferingActions.fetchIndustriesFailure(err))
  }
}

export function * fetchOffering (api, action) {
  // Logger.log({ function: 'OfferingSagas.fetchOffering', action: action })
  const { data } = action

  try {
    // make the call to the api
    const offering = yield call(api.getOffering, data)
    // const savedOfferings = yield call(api.getOfferingsSaved, data)
    // conosle.log('savedOfferings: ', savedOfferings)
    // savedOfferings.map((thisOffering) => {
    //   if(thisOffering.id === offering.id){
    //     offering.save = true
    //   }
    // })
    // offering.read = true
    yield put(OfferingActions.fetchOfferingSuccess(offering))
  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.fetchOffering', err: err })
    yield put(OfferingActions.fetchOfferingFailure(err))
  }
}

export function * toggleSaved (api, action) {
  // Logger.log({ function: 'OfferingSagas.toggleSaved', action: action })
  const { offeringId } = action

  // const offerings = yield select(lOfferings)
  // const offering = findByProp('id', offeringId, offerings)
  const offering = yield select(lOffering, offeringId)
  // Logger.logLogger.log({ function: 'OfferingSagas.toggleSaved', offering: offering })
  const data = { ext_id: offeringId, save: offering.save }
  const industry = offering.industries[0] ? offering.industries[0].name : 'none'
  const followLabel = 'following ' + offering.tickerSymbol
  // const intercomData = {}
  //const trackerData = {offer: offeringId, followedOfferingType: offering.offeringTypeName, industry: industry}
  try {
    if(offering.save) {
      firebase.analytics().logEvent('followed_offer', { ticker : offering.tickerSymbol , industry: industry })
      // intercomData[followLabel] = true
      // intercomData['industry ' + industry] = true
      firebase.messaging().subscribeToTopic('offering_' + offering.id)
    } else {
      firebase.analytics().logEvent('unfollowed_offer', { ticker : offering.tickerSymbol , industry: industry })
      // intercomData[followLabel] = false
      firebase.messaging().unsubscribeFromTopic('offering_' + offering.id)
    }
    // Intercom.updateUser(intercomData)
    // make the call to the api
    const updatedOffering = yield call(api.updateOfferingSaved, data)
    // Logger.log({ function: 'OfferingSagas.toggleSaved', updatedOffering: updatedOffering })
    // TODO: offering is returned but not the save flag
  if(offering.save){
    const messageInfo = { message: "You just followed " + offering.name + ". This means you will get alerts on this offering as it changes and progresses.", icon: 'good' }
    yield put(ToastActions.toastMessage(messageInfo))
  }
    // yield put(OfferingActions.toggleSavedSuccess(updatedOffering))
  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.toggleSaved', err: err })
    yield put(OfferingActions.toggleSavedFailure(err))
  }
}


export function * markRead (api, action) {
  // Logger.log({ function: 'OfferingSagas.toggleSaved', action: action })
  const { offeringId } = action
  const data = { ext_id: offeringId }
  try {
    const updatedOffering = yield call(api.updateOfferingRead, data.ext_id)
    yield put(OfferingActions.markReadSuccess(data.ext_id))
  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.toggleSaved', err: err })
    yield put(OfferingActions.toggleSavedFailure(err))
  }
}


export function * updateViewedAt (api, action) {
  // Logger.log({ function: 'OfferingSagas.updateViewedAt', action: action })

  // const { offeringId } = action

  // const offerings = yield select(lOfferings)
  // const offering = findByProp('id', offeringId, offerings)
  // const offering = yield select(lOffering, offeringId)
  // Logger.log({ function: 'OfferingSagas.toggleSaved', offering: offering })

  // const data = { id: offeringId, save: offering.viewedAt }

  try {
    // make the call to the api
    // const updatedOffering = yield call(api.updateOfferingSaved, data)
    // Logger.log({ function: 'OfferingSagas.toggleSaved', updatedOffering: updatedOffering })
    // TODO: offering is returned but not the viewedAt

    // yield put(OfferingActions.toggleSavedSuccess(updatedOffering))
  } catch (err) {
    // Logger.log({ function: 'OfferingSagas.updateViewedAt', err: err })
    yield put(OfferingActions.updateViewedAtFailure(err))
  }
}

/* ------------- Selectors ------------- */

export const lOfferings = (state: Object) => {
  // Logger.log({ function: 'OfferingSagas.offerings', state: state })
  return state.offering.offerings
}

export const lOffering = (state: Object, offeringId: String) => {
  // Logger.log({ function: 'OfferingSagas.offering', state: state, offeringId: offeringId })

  const offering = findByProp('id', offeringId, state.offering.offerings)
  // Logger.log({ function: 'OfferingSagas.offering', offering: offering })

  return offering
}
