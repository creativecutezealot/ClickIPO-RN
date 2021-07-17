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

class ContactUsWebView extends React.Component {
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
        <View style={[{ flex: 1 }]}>
          <ArticleWebView url={ 'https://help.clickipo.com/customer/portal/emails/new' } />
        </View>
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsWebView)