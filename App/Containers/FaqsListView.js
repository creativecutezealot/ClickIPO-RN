import React from 'react'
import PropTypes from 'prop-types';
import {
  View,
  ListView,
  Text,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import FaqActions from '../Redux/FaqRedux'
import {
  Faq
} from '../Models'
import AlertMessage from '../Components/AlertMessage'
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import Logger from '../Lib/Logger'
import firebase from '../Config/FirebaseConfig'


class FaqsListView extends React.Component {
  state: {
    faqs: Array<Faq>,
    dataSource: Object,
    activeFaqId: String,
  }

  constructor (props) {
    super(props)
    const { faqs = [], filters = [] } = props
    const filteredFaqs = (faqs[0]) ? this.filterFaqs(faqs, filters) : faqs
    const rowHasChanged = (r1, r2) => r1.id !== r2.id || r1.active !== r2.active
    const ds = new ListView.DataSource({rowHasChanged})

    this.state = {
      faqs: faqs,
      filters: filters,
      dataSource: ds.cloneWithRows(filteredFaqs),
      processing: false
    }
  }

  componentWillMount = () => {
    this.fetchFaqs()
    firebase.analytics().setCurrentScreen('help_investor_score_faq')
    firebase.analytics().setCurrentScreen('help_faq')
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.faqs) {
      const { faqs = [] } = newProps
      const { filters } = this.state
      const filteredFaqs = this.toggleActiveFaq(this.filterFaqs(faqs, filters), this.state.activeFaqId)
        this.setState({
          faqs: faqs,
          filters: filters,
          dataSource: this.state.dataSource.cloneWithRows(filteredFaqs),
          processing: false
        })
      }
    }

  fetchFaqs = () => {
    this.setState({ processing: true })
    const filter = {}
    this.props.fetchFaqs(filter)
  }

  filterFaqs = (faqs, filters) => {
    var retval = faqs
    const applyPropFilter = (filter) => {
      retval = retval.filter((el) => { return el[filter.prop] === filter.value })
    }
    filters.map((filter) => applyPropFilter(filter))
    return retval
  }

  toggleActiveFaq = (faqs, activeFaqId) => {
    var retval = faqs.map((el) => {
      if (el.id === activeFaqId) {
        const activeFaq = JSON.parse(JSON.stringify(el));
        activeFaq.active = !activeFaq.active
        return activeFaq
      } else {
        return el
      }
    })
    return retval
  }

  handlePressFaq = (faqId) => {
    const newActiveFaqId = (faqId === this.state.activeFaqId) ? '' : faqId
    const filteredFaqs = this.toggleActiveFaq(this.filterFaqs(this.state.faqs, this.state.filters), newActiveFaqId)
    this.setState({ 
      activeFaqId: newActiveFaqId, 
      dataSource: this.state.dataSource.cloneWithRows(filteredFaqs) 
    })
  }

  noRowData = () => {
    return this.state.dataSource.getRowCount() === 0
  }

  render = () => {
    return (
      <View style={ApplicationStyles.container}>
        <AlertMessage title='No Faqs' show={this.noRowData()} />
        <ListView
          contentContainerStyle={ApplicationStyles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderFooter={this.renderFooter}
          enableEmptySections
          pageSize={15}
        />
      </View>
    )
  }

  renderRow = (rowData) => {
    const { id, question, answer } = rowData
    const active = (rowData.active)
    const icon = (active) ? 'icon-chevron-up' : 'icon-chevron-down'
    const answerView = (!active)
    ? <View />
    : <View style={[ ApplicationStyles.faqRowContainer, ApplicationStyles.answerContainer ]}>
        <View style={ApplicationStyles.qAndAContainer}>
          <Text style={[ApplicationStyles.qAndA, ApplicationStyles.aColor]}>A</Text>
        </View>
        <View style={ApplicationStyles.textContainer}>
          <Text style={[ApplicationStyles.text, ApplicationStyles.textAnswer]}>{answer}</Text>
        </View>
      </View>

    return (
      <TouchableHighlight underlayColor={Colors.pinkishGrey} onPress={this.handlePressFaq.bind(this, id)}>
        <View style={ApplicationStyles.borderView}>
          <View style={[ApplicationStyles.faqRowContainer, ApplicationStyles.questionContainer]}>
            <View style={[ApplicationStyles.qAndAContainer, ApplicationStyles.qContainer]}>
              <Text style={[ApplicationStyles.qAndA, ApplicationStyles.qColor]}>Q</Text>
            </View>

            <View style={ApplicationStyles.textContainer}>
              <Text style={[ApplicationStyles.text, ApplicationStyles.textQuestion]}>{question}</Text>
            </View>

            <View style={ApplicationStyles.caretContainer}>
              <ClickIcon name={icon} style={ApplicationStyles.caret} />
            </View>
          </View>
          { answerView }
        </View>
      </TouchableHighlight>
    )
  }

  renderFooter = () => {
    return (
      null
    )
  }
}

const mapStateToProps = (state) => {
  return {
    faqs: state.faq.faqs,
    fetching: state.faq.fetching,
    error: state.faq.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFaqs: (data) => dispatch(FaqActions.fetchFaqs(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FaqsListView)