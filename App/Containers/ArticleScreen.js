
import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Image,
  Dimensions
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import TermActions from '../Redux/TermRedux'

import ArticleWebView from './ArticleWebView'

import Config from 'react-native-config'

import {
  Term
} from '../Models'


// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class ArticleScreen extends React.Component {
  state: {
  }

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount () {
  }

  componentWillUnmount () {
  }

  componentWillReceiveProps = (newProps) => {
  }

  render () {
    return (
      <View style={ApplicationStyles.mainContainer}>
        <View style={[{ flex: 1}]}>
          <ArticleWebView url={ Config.API_BASE_URL + '/articles_html/' + this.props.article.id } />
        </View>
      </View>
    )
  }
}

ArticleScreen.propTypes = {
  termId: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    terms: state.term.terms
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSaved: (data) => dispatch(TermActions.toggleSaved(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleScreen)