import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import SocialProviders from '../Services/SocialProviders'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  linkProvider: ['provider'], // { provider: 'facebook' }
  linkProviderSuccess: ['identity'],
  linkProviderFailure: ['error'],

  unlinkProvider: ['provider'],

  share: ['provider', 'shareable'], // { provider: {name: '' auth: (), share: ()}, shareable: {type: 'offering', id: ''}}
  shareSuccess: ['response'],
  shareFailure: ['error'],

  sharePost: ['share'],
  sharePostSuccess: ['response'],
  sharePostFailure: ['error'],

  /////// new changes jan 8 2019
  sendLinkedProvider: ['data'], // the provider object that contains name, token, expirationDate and other key value pairs
  sendLinkedProviderSuccess: ['sendResponse'], //success 201, or a 400 of some sort,
  sendLinkedProviderFailure: ['error'], //if there is an error

  linkSocialMedia: ['provider'],
  linkSocialMediaSuccess: ['userSM'],
  linkSocialMediaFailure: ['error'],
})

export const SocialTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  providers: SocialProviders.create(),
  error: null,
  fetching: false,
  sendResponse: null,

  provider: null,
  userSM: {},

})

/* ------------- Reducers ------------- */



export const linkProvider = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const linkProviderSuccess = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const linkProviderFailure = (state: Object, action: Object) => {
  const { error } = action

  return state.merge({ error: error })
}

export const unlinkProvider = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const share = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const shareSuccess = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const shareFailure = (state: Object, action: Object) => {
  const { error } = action

  return state.merge({ error: error })
}

export const sharePost = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const sharePostSuccess = (state: Object, action: Object) => {
  return state.merge({ error: null })
}

export const sharePostFailure = (state: Object, action: Object) => {
  const { error } = action

  return state.merge({ error: error })
}

export const sendLinkedProvider = (state) => {
  return state.merge({ fetching: true, error: null});
}

export const sendLinkedProviderSuccess = (state, action) => {
  return state.merge({ fetching: false, sendResponse: action.sendResponse});
}

export const sendLinkedProviderFailure = (state, { error }) => {
  return state.merge({ fetching: false, error})
}

export const linkSocialMedia = (state) => {
  return state.merge({ fetching: true, error: null });
}

export const linkSocialMediaSuccess = ( state, action ) => {
  //userSM is the user obj from the social media provider 
  return state.merge({ fetching: false, userSM: action.userSM});
}

export const linkSocialMediaFailure = (state, { error }) => {
  return state.merge({ fetching: false, error });
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LINK_PROVIDER]: linkProvider,
  [Types.LINK_PROVIDER_SUCCESS]: linkProviderSuccess,
  [Types.LINK_PROVIDER_FAILURE]: linkProviderFailure,

  [Types.UNLINK_PROVIDER]: unlinkProvider,

  [Types.SHARE]: share,
  [Types.SHARE_SUCCESS]: shareSuccess,
  [Types.SHARE_FAILURE]: shareFailure,

  [Types.SHARE_POST]: sharePost,
  [Types.SHARE_POST_SUCCESS]: sharePostSuccess,
  [Types.SHARE_POST_FAILURE]: sharePostFailure,

  [Types.SEND_LINKED_PROVIDER]: sendLinkedProvider,
  [Types.SEND_LINKED_PROVIDER_SUCCESS]: sendLinkedProviderSuccess,
  [Types.SEND_LINKED_PROVIDER_FAILURE]: sendLinkedProviderFailure,

  [Types.LINK_SOCIAL_MEDIA]: linkSocialMedia,
  [Types.LINK_SOCIAL_MEDIA_SUCCESS]: linkSocialMediaSuccess,
  [Types.LINK_SOCIAL_MEDIA_FAILURE]: linkSocialMediaFailure,
})
