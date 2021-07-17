import React from 'react'
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity } from 'react-native'

// Styles
import {
  Colors,
  Fonts,
  Images
} from '../Themes'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import styles from './Styles/SearchViewStyle'

import debounce from 'lodash/debounce'

import firebase from '../Config/FirebaseConfig'

import Logger from '../Lib/Logger'


export default class SearchView extends React.Component {
  state: {
    searchTerm: String
  }

  constructor (props) {
    super(props)
    // Logger.log({ name: 'SearchView.constructor()', props: props })

    const {searchTerm = ''} = props

    this.state = {
      searchTerm: searchTerm
    }

    this.debounceOnChange = debounce(this.props.onChange, 300)

  }

  componentWillReceiveProps = (newProps) => {
    Logger.log({ name: 'SearchView.componentWillReceiveProps()', newProps: newProps })
  }

  componentDidMount = () => {
    this.refs.searchTerm.focus(); 
  }

  searchTermChanged = (searchTerm) => {
    // Logger.log({ name: 'SearchView.searchTermChanged()', startTime: new Date(), searchTerm: searchTerm })

    this.setState({searchTerm: searchTerm}, this.props.onChange(searchTerm))
  }

  render () {
    // Logger.log({ name: 'SearchView.renderSearchView()', startTime: new Date(), props: this.props })

    const iconHeight = (this.state.searchTerm && this.state.searchTerm.length > 0) ? 0 : 40
    const iconWidth = (this.state.searchTerm && this.state.searchTerm.length > 0) ? 0 : 16
    const marginRight = (this.state.searchTerm && this.state.searchTerm.length > 0) ? 16 : 8
    const marginLeft = (this.state.searchTerm && this.state.searchTerm.length > 0) ? 0 : 16

    return (
     
        <View style={ styles.ParentView}>
          <View style={[{ marginLeft: marginLeft, marginRight: marginRight, height: iconHeight, width: iconWidth, justifyContent: 'center',  alignItems: 'center' }]}>
            <ClickIcon name='icon-search' style={[{ color: (this.state.searchTerm && this.state.searchTerm.length > 0) ? Colors.tealishLite : Colors.pinkishGrey, fontSize: 20, alignSelf: 'center' }]} />
          </View>

          <TextInput
            ref='searchTerm'
            style={ styles.TextInputStyle }
            placeholder='Search'
            placeholderTextColor={Colors.pinkishGrey}
            value={this.state.searchTerm}
            keyboardType='default'
            returnKeyType='search'
            autoCapitalize='none'
            autoCorrect={false}
            selectTextOnFocus={false}
            onChangeText={this.searchTermChanged}
            underlineColorAndroid={'transparent'} />

          { this.renderClearSearch() }
        </View>
     
    )
  }

  handlePressClear = () => {
    firebase.analytics().logEvent('search_terms', { searchTerm: this.state.searchTerm })
    firebase.analytics().setCurrentScreen('search_results_' + this.state.searchTerm)
    this.searchTermChanged('')
  }

  renderClearSearch = () => {
    // Logger.log({ name: 'SearchView.renderClearSearch()' })

    if (this.state.searchTerm && this.state.searchTerm.length > 0) {
      
      const iconHeight =  40
      const iconWidth = 16
      const marginRight =  16
      const marginLeft =  8


      return (
        <View style={[{ marginLeft: marginLeft, marginRight: marginRight, height: iconHeight, width: iconWidth, justifyContent: 'center',  alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => this.handlePressClear()}>
            <ClickIcon name='icon-x' style={[{ color: Colors.drawerBlue, fontSize: 20, alignSelf: 'center' }]} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (null)
    }
  }
}

// Prop type warnings
SearchView.propTypes = {
  onChange: PropTypes.func.isRequired,
}
