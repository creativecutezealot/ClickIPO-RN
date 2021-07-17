


import React from 'react'
import PropTypes from 'prop-types';
import { View, Text, ListView, Image, TouchableHighlight, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
// import { Actions as NavigationActions } from 'react-native-router-flux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'
import ArticlesActions from '../Redux/ArticlesRedux'
import Moment from 'moment'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);
import styles from './Styles/ArticlesViewStyle'

import debounce from 'lodash/debounce'
import sortBy from 'lodash/sortBy'


// Styles
import {
  Colors,
  Fonts,
  Images,
  ApplicationStyles
} from '../Themes'

import firebase from '../Config/FirebaseConfig'

class ArticlesView extends React.Component {

  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)

    const { articles = [] } = props

    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      searchTerm: null,
      articles: articles
    }
    const filteredArticles = this.applyFilters(articles)
    this.state.dataSource = ds.cloneWithRows(filteredArticles)
    this.debounceApplySearchTermFilter = debounce(this.search, 300)
  }

  componentWillMount() {
    this.props.fetchArticles()
    firebase.analytics().setCurrentScreen('help_articles')
  }

  componentWillReceiveProps = (newProps) => {

    if (newProps.articles) {
      const { articles = [] } = newProps

      this.setState({
        articles: articles,
        dataSource: this.state.dataSource.cloneWithRows(articles),
      })
    }
  }

  search = () => {
    const { articles, dataSource } = this.state
    const filteredArticles = this.applyFilters(articles)
    this.setState({ dataSource: dataSource.cloneWithRows(filteredArticles) })
  }

  applyFilters = (articles) => {
    var retval = []
    if (articles && articles.length > 0) {
      const { searchTerm = null } = this.state
      var filteredArticles = articles
      if (searchTerm && searchTerm.length > 0) {
        const applySearchFilter = (searchString) => {
          filteredArticles = filteredArticles.filter((el) => { return (el['title'].toLowerCase().includes(searchString)) })
        }
        applySearchFilter(searchTerm.toLowerCase())
      }
      retval = this.sortArticles(filteredArticles)
    }
    return retval
  }

  sortArticles = (articles) => {
    const sortedArticles = sortBy(articles, 'sortableDate')
    return sortedArticles
  }

  handlePressClearSearch = () => {
    this.setState({ searchTerm: null })
    this.debounceApplySearchTermFilter()
  }

  handleChangeSearchTerm = (text) => {
    this.setState({ searchTerm: text })
    this.debounceApplySearchTermFilter()
  }

  handlePressArticle(article) {
    firebase.analytics().setCurrentScreen('help_articles_' + article.title)
    NavigationActions.articleDetails({ article: article })
  }

  renderHeader = () => {
    return (
      <View>
        { this.renderSearchView() }
      </View>
    )
  }

  renderSearchView = () => {
    const { searchTerm, isFiltersEnabled } = this.state
    const searchIconColor = (searchTerm && searchTerm.length > 0) ? Colors.tealishLite : Colors.pinkishGrey
    const filterIconColor = (isFiltersEnabled) ? Colors.tealishLite : Colors.pinkishGrey

    return (
      <View style={[{ height: 50, backgroundColor: Colors.greyishBrown }]}>
        <View style={styles.ViewStyle1}>
          <View style={styles.ViewStyle2}>
            <ClickIcon name='icon-search' style={[{ color: searchIconColor, fontSize: 20, alignSelf: 'center' }]} />
          </View>

          <TextInput
            ref='searchTerm'
            style={[{ flex: 1, ...Fonts.style.input, fontSize: 16, color: Colors.tealishLite, textShadowColor: Colors.smoke, textShadowRadius: 2, backgroundColor: Colors.clear }]}
            placeholder='Search'
            placeholderTextColor={Colors.pinkishGrey}
            value={searchTerm}
            keyboardType='default'
            returnKeyType='search'
            autoCapitalize='none'
            autoCorrect
            selectTextOnFocus
            onChangeText={this.handleChangeSearchTerm}
            onSubmitEditing={this.handleOnSearch}
            underlineColorAndroid={'transparent'} />

          { this.renderClearSearch() }
        </View>
      </View>
    )
  }

  renderClearSearch = () => {
    const { searchTerm } = this.state

    if (searchTerm && searchTerm.length > 0) {
      return (
        <View style={styles.ViewStyle3}>
          <TouchableOpacity onPress={this.handlePressClearSearch}>
            <ClickIcon name='icon-x' style={[{ color: Colors.tealishLite, fontSize: 18, alignSelf: 'center', padding: 6 }]} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (null)
    }
  }

  renderRow = (rowData) => {
    const logo = { uri: 'https:' + rowData.image_thumb }
    return (
      <TouchableHighlight style={[{borderBottomWidth: 1.5, borderColor: Colors.pinkishGrey }]} underlayColor={Colors.pinkishGrey} onPress={() => this.handlePressArticle(rowData)}>
        <View style={[ApplicationStyles.articleRowContainer]}>

          <View style={ApplicationStyles.row}>
            <View style={ApplicationStyles.articleImageContainer}>
              <Image style={ApplicationStyles.articleImage} source={logo} />
            </View>

            <View style={[ApplicationStyles.descriptionContainer]}>
              <View style={[ApplicationStyles.row, { marginBottom: 6 }]}>
                <Text style={ApplicationStyles.companyLabel}>{ rowData.title }</Text>
              </View>

              <View style={ApplicationStyles.row}>
                <View style={ApplicationStyles.priceContainer}>
                  <Text style={ApplicationStyles.label}>{ rowData.article_category_name }</Text>
                </View>
              </View>

              <View style={ApplicationStyles.row}>
                <Text style={ApplicationStyles.label}>{ Moment(rowData.created_at).format('MM/DD/YYYY') }</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  // Render a footer.
  renderFooter = () => {
    return (
      <View></View>
    )
  }

  render () {
    if (this.noRowData()) {
      return (
        <View style={ApplicationStyles.listViewContainer}>
          { this.renderSearchView() }
          <AlertMessage title='No Articles' show={this.noRowData()} />
        </View>
      )
    } else {
      return (
        <View style={ApplicationStyles.listViewContainer}>
          <ListView
            contentContainerStyle={ApplicationStyles.listContent}
            dataSource={this.state.dataSource}
            renderHeader={this.renderHeader}
            renderRow={this.renderRow}
            renderFooter={this.renderFooter}
            enableEmptySections
            pageSize={15} />
        </View>
      )
    }
  }
}

ArticlesView.propTypes = {
  articles: PropTypes.array,
  fetchArticles: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    articles: state.article.articles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticles: (data) => dispatch(ArticlesActions.fetchArticles(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesView)
