import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import Logger from '../Lib/Logger'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchArticles: ['data'],
  fetchArticlesSuccess: ['articles'],
  fetchArticlesFailure: ['error'],

  fetchArticle: ['data'],
  fetchArticleSuccess: ['article'],
  fetchArticleFailure: ['error']
})

export const ArticleTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  articles: [],

  error: null
})

/* ------------- Reducers ------------- */

/* FETCH_ARTICLES */

export const fetchArticles = (state: Object, action) => {
  // Logger.log({ function: 'ArticlesRedux.fetchArticles', action: action })

  return state.merge({ fetching: true, error: null })
}

export const fetchArticlesSuccess = (state: Object, action) => {
  // Logger.log({ function: 'ArticlesRedux.fetchArticlesSuccess', action: action })

  const { articles } = action

  return state.merge({ fetching: false, error: null, articles: articles })
}

export const fetchArticlesFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* FETCH_OFFERING */

export const fetchArticle = (state: Object) => {
  return state.merge({ fetching: true, error: null })
}

export const fetchArticleSuccess = (state: Object, action) => {
  // const { data } = action // TODO:

  return state.merge({ fetching: false, error: null })
}

export const fetchArticleFailure = (state: Object, { error }: Object) => {
  return state.merge({ fetching: false, error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_ARTICLES]: fetchArticles,
  [Types.FETCH_ARTICLES_SUCCESS]: fetchArticlesSuccess,
  [Types.FETCH_ARTICLES_FAILURE]: fetchArticlesFailure,

  [Types.FETCH_ARTICLE]: fetchArticle,
  [Types.FETCH_ARTICLE_SUCCESS]: fetchArticleSuccess,
  [Types.FETCH_ARTICLE_FAILURE]: fetchArticleFailure
})
