import { call, put, select } from 'redux-saga/effects'

import FaqActions from '../Redux/FaqRedux'

import {
  // Faq,
} from '../Models'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

export function * fetchFaqs (api, action){
  // Logger.log({ function: 'FaqSagas.fetchFaqs', action: action })

  const { data } = action

  try {
    const localFaqs = yield select(lFaqs)
    // Logger.log({ function: 'FaqSagas.fetchFaqs', localFaqs: localFaqs })

    if (!localFaqs || !localFaqs[0]) { // TODO: will need a way to 'force update' these, TTL
    // fetch faqs
      
    const faqs = yield call(api.getFaqs, data)
    // Logger.log({ function: 'FaqSagas.fetchFaqs', faqs: faqs })

    yield put(FaqActions.fetchFaqsSuccess(faqs))
  }
} catch (err) {
  // Logger.log({ function: 'FaqSagas.fetchFaqs', err: err })
  yield put(FaqActions.fetchFaqsFailure(err))
}
}

/* ------------- Selectors ------------- */

export const lFaqs = (state: Object) => {
  // Logger.log({ function: 'FaqSagas.lFaqs', state: state })
  return state.faq.faqs
}

export const lFaq = (state: Object, faqId: String) => {
  // Logger.log({ function: 'FaqSagas.lFaq', state: state, faqId: faqId })

  const faq = findByProp('id', faqId, state.faq.faqs)
  // Logger.log({ function: 'FaqSagas.faq', faq: faq })

  return faq
}
