import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text
  // Alert,
  // TouchableHighlight,
  // Image,
  // TouchableOpacity
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  // KeyboardAvoidingView
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import TermActions from '../Redux/TermRedux'

import {
  Term
} from '../Models'

import { findByProp } from 'ramdasauce'

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'
import Styles from './Styles/TermDetailsScreenStyle'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class TermDetailsScreen extends React.Component {
  state: {
    termId: String,
    term: Term
  }

  constructor (props) {
    // Logger.log({ name: 'TermDetailsScreen.constructor()', props: props })
    super(props)

    // TODO: use term.id to get term from redux (fetch term) so that  we get any future updates like 'save'
    const { termId, terms } = props
    // Logger.log({ name: 'TermDetailsScreen.constructor()', termId: termId, terms: terms })

    const term = findByProp('id', termId, terms) || props.term
    // Logger.log({ name: 'TermDetailsScreen.constructor()', term: term })

    this.state = {
      termId: termId,
      term: term
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'TermDetailsScreen.handlePressSave()', term: term })
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'TermDetailsScreen.componentWillReceiveProps()', newProps: newProps })

    const { terms } = newProps
    const { termId } = this.state

    const term = findByProp('id', termId, terms)
    // Logger.log({ name: 'TermDetailsScreen.componentWillReceiveProps()', term: term })

    this.setState({
      term: term
    })
  }

  render () {
    const { term } = this.state

    const { definition } = term

    return (
      <ScrollView style={ApplicationStyles.mainContainer}>
        <View style={Styles.Component}>
          <View style={Styles.ViewStyle}>
            <Text style={[ApplicationStyles.headline]}>{ term.term }</Text>
          </View>

          <View style={Styles.ViewStyle1}>
            <Text style={Styles.ViewStyle2}>{definition}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

TermDetailsScreen.propTypes = {
  termId: PropTypes.string,
  term: PropTypes.object,

  terms: PropTypes.array,

  fetching: PropTypes.bool,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    terms: state.term.terms,

    fetching: state.term.fetching,
    error: state.term.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermDetailsScreen)
