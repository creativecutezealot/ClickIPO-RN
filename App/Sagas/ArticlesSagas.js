import { call, put, select } from 'redux-saga/effects'
import ArticlesActions from '../Redux/ArticlesRedux'
// import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  // Article,
  // ClickIpoError
} from '../Models'

import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

export function * fetchArticles (api, action) {
  // Logger.log({ function: 'ArticlesSagas.fetchArticles', action: action })

  const { data } = action

  try {
    const localArticles = yield select(lArticles)
    // Logger.log({ function: 'ArticlesSagas.fetchArticles', localArticles: localArticles })

    if (!localArticles || !localArticles[0]) {
      // fetch articles
      const articles = yield call(api.getArticles, data)
      // Logger.log({ function: 'ArticlesSagas.fetchArticles', articles: articles })

      yield put(ArticlesActions.fetchArticlesSuccess(articles))
    }
  } catch (err) {
    // Logger.log({ function: 'ArticlesSagas.fetchArticles', err: err })
    yield put(ArticlesActions.fetchArticlesFailure(err))
  }
}

export function * fetchArticle (api, action) {
  // Logger.log({ function: 'ArticlesSagas.fetchArticle', action: action })

  const { data } = action

  try {
    // make the call to the api
    const article = yield call(api.getArticle, data)

    yield put(ArticlesActions.fetchArticleSuccess(article))
  } catch (err) {
    // Logger.log({ function: 'ArticlesSagas.fetchArticle', err: err })
    yield put(ArticlesActions.fetchArticleFailure(err))
  }
}

/* ------------- Selectors ------------- */

export const lArticles = (state: Object) => {
  // Logger.log({ function: 'ArticlesSagas.articles', state: state })
  return state.article.articles
}

export const lArticle = (state: Object, articleId: String) => {
  // Logger.log({ function: 'ArticlesSagas.article', state: state, articleId: articleId })

  const article = findByProp('id', articleId, state.article.articles)
  // Logger.log({ function: 'ArticlesSagas.article', article: article })

  return article
}
