import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  View,
  // ScrollView,
  ListView,
  Text,
  // TextInput,
  TouchableHighlight,
  InteractionManager,
  ActivityIndicator
  // Image,
  // Keyboard,
  // LayoutAnimation
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import TermActions from '../Redux/TermRedux'

import {
  Term
} from '../Models'

// For empty lists
import AlertMessage from '../Components/AlertMessage'
import WaitingView from '../Components/WaitingView'

import sortBy from 'lodash/sortBy'

import Logger from '../Lib/Logger'
import firebase from '../Config/FirebaseConfig'

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

// import Logger from '../Lib/Logger'

class TermsListView extends React.Component {

  state: {
    terms: Array<Term>,
    filters: Array<Object>,

    dataSource: Object,
    isLoading: Boolean,
    termId : String
  }

  

  constructor (props) {
    super(props)
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ

    const { terms = [], filters = [], termId } = props
    // Logger.log({ name: 'TermsListView.constructor()', terms: terms, filters: filters })
    const sortedTerms = sortBy(terms, 'term')
    const filteredTerms = (filters[0] && sortedTerms[0]) ? this.applyFilters(sortedTerms, filters) : sortedTerms

    const rowHasChanged = (r1, r2) => r1.id !== r2.id

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      terms: terms,
      filters: filters,
      dataSource: ds.cloneWithRows(filteredTerms),
      isLoading: true,
      termId: termId
    }
  }

  componentWillMount = () => {
    this.fetchTerms()
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isLoading: false        
      })
    })
    firebase.analytics().setCurrentScreen('help_glossary')

  }

  componentWillUnmount = () => {

  }

  componentDidMount = () => {
    
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'TermsListView.componentWillReceiveProps()', newProps: newProps })
    // this.forceUpdate()
    if (newProps.terms) {
      // Logger.log({ name: 'TermsListView.componentWillReceiveProps()', filters0: this.state.filters[0], terms0: newProps.terms[0] })
      const { terms, filters } = newProps
      terms = sortBy(terms, 'term')
      const filteredTerms = (filters && filters[0] && terms && terms[0]) ? this.applyFilters(terms, filters) : terms
      // Logger.log({ name: 'TermsListView.componentWillReceiveProps()', filteredTerms: filteredTerms })
      this.setState({
        terms: terms,
        filters: filters,
        dataSource: this.state.dataSource.cloneWithRows(filteredTerms)
      })
    }
  }

  fetchTerms = () => {
    const filter = {}
    this.props.fetchTerms(filter)
  }

  applyFilters = (source, filters) => { // TODO: move this to utils
    // Logger.log({ name: 'TermsListView.filterTerms()', source: source, filters: filters })

    var retval = source
    // Logger.log({ name: 'TermsListView.filterTerms()', retval0: retval })

    const applyPropFilter = (filter) => {
      retval = retval.filter((el) => { return el[filter.prop] === filter.value })   // findByProp(filter.prop, filter.value , retval), retval)
      // Logger.log({ name: 'TermsListView.filterTerms()', retvalN: retval })
    }
    filters.map((filter) => applyPropFilter(filter))
    // Logger.log({ name: 'TermsListView.filterTerms()', retval: retval })

    return retval
  }

  handlePressTerm = (termId) => {
    // Logger.log({ name: 'TermsListView.handlePressTerm()', term: term })

    // offer details
    NavigationActions.termDetails({ termId: termId })
  }

  renderRow = (rowData) => {
    const { id, term } = rowData

    return (
      <View style={[ApplicationStyles.border ]}>
        <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={this.handlePressTerm.bind(this, id)}>
          <View style={ApplicationStyles.highlightInner}>
            <View style={ApplicationStyles.textContainer}>
              <Text style={ApplicationStyles.text}>{term}</Text>
            </View>
            <View style={ApplicationStyles.rightContainer}>
              <ClickIcon name='icon-chevron-right' style={ApplicationStyles.chevron} />
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  noRowData = () => {
    return this.state.dataSource.getRowCount() === 0
  }

  // Render a footer.
  renderFooter = () => {
    return (
      <Text />
    )
  }

  isWaiting = () => {
    if(this.props.fetching === false && this.state.isLoading === false) {
      if(this.state.termId){
        this.handlePressTerm(this.state.termId)
      }
      return false
    } else {
      return true
    }
  }

  render = () => {
    return (
      <WaitingView isWaiting={this.isWaiting()}>
        <View style={ApplicationStyles.container}>
          <AlertMessage title='No Terms' show={this.noRowData()} />
          <ListView
            contentContainerStyle={ApplicationStyles.listContent}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderFooter={this.renderFooter}
            enableEmptySections
            pageSize={15}
          />
        </View>
      </WaitingView>
    )
  }
}

TermsListView.propTypes = {
  terms: PropTypes.array,
  filters: PropTypes.array,
  fetchTerms: PropTypes.func,

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
    fetchTerms: (data) => dispatch(TermActions.fetchTerms(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsListView)
