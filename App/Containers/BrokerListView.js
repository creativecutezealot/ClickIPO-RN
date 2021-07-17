import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  View,
  // ScrollView,
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  // Keyboard,
  // LayoutAnimation,
  // Clipboard,
  RefreshControl
  // Platform
} from 'react-native'

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import BrokerActions from '../Redux/BrokerRedux'

import {
  Broker
} from '../Models'

const { width, height } = Dimensions.get('window');
//import {vw, vh} from 'react-native-viewport-units';
//var {vw, vh, vmin, vmax} = require('react-native-viewport-units');
import debounce from 'lodash/debounce'

import Swipeable from 'react-native-swipeable'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import AlertMessage from '../Components/AlertMessage'
import FullButton from '../Components/FullButton'
import Styles from './Styles/BrokerListViewStyle'

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'

import firebase from '../Config/FirebaseConfig'

class BrokerListView extends React.Component {

  state: {
    brokers: Array<Broker>,

    searchTerm: String,

    dataSource: Object,

    swipeables: Array<Object>,

    isProcessing: Boolean,
    isRefreshing: Boolean,
  }

  constructor (props) {
    super(props)
    // Logger.log({ name: 'BrokerListView.constructor()', props: props })
    const { brokers = [] } = props
    const rowHasChanged = (r1, r2) => r1.id !== r2.id
    const ds = new ListView.DataSource({rowHasChanged})
    this.state = {
      brokers: brokers,

      dataSource: ds.cloneWithRows(brokers),

      searchTerm: null,

      swipeables: [],

      isProcessing: false,
      isRefreshing: false
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'BrokerListView.componentWillMount()' })
    this.fetchBrokers()
    firebase.analytics().setCurrentScreen('account_brokerages_connect')

  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'BrokerListView.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'BrokerListView.componentWillReceiveProps()', value: newProps })

    if (newProps.brokers) {
      const { brokers = [] } = newProps

      this.setState({
        brokers: brokers,

        dataSource: this.state.dataSource.cloneWithRows(brokers),

        isProcessing: false
      })
    }
  }

  fetchBrokers = () => {
    // Logger.log({ name: 'BrokerListView.fetchBrokers()' })

    this.setState({ isProcessing: true })
    const filter = {}

    this.props.fetchBrokers(filter)
  }


  handleChangeSearchTerm = (text) => {
    // Logger.log({ name: 'BrokerListView.handleChangeSearchTerm()', text: text })

    this.setState({ searchTerm: text })

  }

  handleOnRefresh = () => {  // TODO: fix this
    // Logger.log({ name: 'BrokerListView.handleOnRefresh()' })

    // this.setState({isRefreshing: true})

    // const props = { forceRefresh: true }
    // this.props.fetchBrokers(props)
  }

  handlePressBroker = (brokerId) => {
    // Logger.log({ name: 'BrokerListView.handlePressBroker()', brokerId: brokerId })

    this.recenterSwipeables()

    // broker connection link
    NavigationActions.brokerConnect({ brokerId: brokerId })
  }

  handlePressConnectBroker = (brokerId) => {
    // Logger.log({ name: 'BrokerListView.handlePressConnectBroker()', brokerId: brokerId })

    this.recenterSwipeables()

    // offer details
    NavigationActions.brokerConnect({ brokerId: brokerId })
  }

  handleOnSwipeableRef = async (ref) => {
    // Logger.log({ name: 'BrokerListView.handleOnSwipeableRef()' })

    const swipables = this.state.swipeables
    swipables.push(ref)
    this.setState({swipeables: swipables})
  }

  handleUserBeganScrollingParentView = () => {  // TODO: hock this up to the listview.onScroll
    this.recenterSwipeables()
  }

  handleOnSwipeStart = async () => {
    this.recenterSwipeables()
  }

  recenterSwipeables = () => {
    // Logger.log({ name: 'BrokerListView.recenterSwipeables()' })

    this.state.swipeables.map((ref) => ref.recenter())
  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData = () => {
    return this.state.dataSource.getRowCount() === 0
  }

  renderSearchView = () => {
    const { searchTerm } = this.state
    // Logger.log({ name: 'BrokerListView.renderHeader()', searchTerm: searchTerm })

    const searchIconColor = (searchTerm && searchTerm.length > 0) ? Colors.booger : Colors.pinkishGrey

    return (
      <View style={ Styles.Component}>
        <View style={ Styles.ViewStyle1}>
          <View style={ Styles.ViewStyle2}>
            <ClickIcon name='icon-search' style={[{ color: searchIconColor, fontSize: 20, alignSelf: 'center' }]} />
          </View>

          <TextInput
            ref='searchTerm'
            style={[{ flex: 1, ...Fonts.style.input, fontSize: 16, color: Colors.booger, backgroundColor: Colors.clear }]}
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

        </View>
      </View>
    )
  }


  renderHeader = () => {
    return (
      <View>
        { this.renderSearchView() }
      </View>
    )
  }

  renderFooter = () => {
    return (
      null
    )
  }

  renderTradier = () => {
    const id = 'fe85b9ba-59e1-4b4f-84c9-e7f3a650a42b'
    const rightButtons = []
    const buttonText = <View style={{ }}><Text style={{ color: Colors.white }}>Connect</Text></View>
    const buttonColor = Colors.booger

      return (
        <View style={{alignItems: 'center'}}>
        <Swipeable onRef={(ref) => this.handleOnSwipeableRef(ref)} onSwipeStart={() => this.handleOnSwipeStart()}>
          <TouchableHighlight onPress={this.handlePressBroker.bind(this, 'fe85b9ba-59e1-4b4f-84c9-e7f3a650a42b')}>
            <View style={ApplicationStyles.rowContainerBroker}>

              <View style={ApplicationStyles.row}>
                <View style={[ApplicationStyles.logoContainer, {marginLeft: 10}]}>
                  <Image resizeMode='contain' style={ApplicationStyles.articleImage} source={{uri : 'https://clickipostaging.s3.amazonaws.com/assets/default_logo_small.png'}} />
                </View>

                <View style={ApplicationStyles.descriptionContainer}>
                  <View style={[ApplicationStyles.row, { marginBottom: 6 }]}>
                    <Text style={ApplicationStyles.companyLabel}>{ 'Tradier' }</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </Swipeable>
        <Swipeable onRef={(ref) => this.handleOnSwipeableRef(ref)} onSwipeStart={() => this.handleOnSwipeStart()}>
          <TouchableHighlight onPress={this.handlePressBroker.bind(this, 'ece6ae76-da9e-4f99-b159-861c1cd929cd')}>
            <View style={ApplicationStyles.rowContainerBroker}>

              <View style={ApplicationStyles.row}>
                <View style={[ApplicationStyles.logoContainer, {marginLeft: 10}]}>
                  <Image resizeMode='contain' style={ApplicationStyles.articleImage} source={{uri : 'https://clickipostaging.s3.amazonaws.com/assets/default_logo_small.png'}} />
                </View>

                <View style={ApplicationStyles.descriptionContainer}>
                  <View style={[ApplicationStyles.row, { marginBottom: 6 }]}>
                    <Text style={ApplicationStyles.companyLabel}>{ 'Just2Trade' }</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </Swipeable>
        </View>
      )
  }

  renderRow = (rowData) => {
    // Logger.log({ name: 'BrokerListView.renderRow()', rowData: rowData })

    const id = rowData.id
    const logo = { uri: 'https:' + rowData.logoSmallUrl }
    const name = rowData.name

    const rightButtons = []
    const buttonText = <View style={{ }}><Text style={{ color: Colors.white }}>Connect</Text></View>
    const buttonColor = Colors.booger
    rightButtons.push(<TouchableHighlight style={[ApplicationStyles.swipeableButtonContainer, {backgroundColor: buttonColor}]} onPress={this.handlePressConnectBroker.bind(this, id)}><View style={[ApplicationStyles.swipeableButton]}>{buttonText}</View></TouchableHighlight>)

    // Logger.log({ name: 'BrokerListView.renderRow()', rightButtons: rightButtons })

    // close on scroll: https://github.com/jshanson7/react-native-swipeable#recenter

    return (
      <Swipeable rightButtons={rightButtons} onRef={(ref) => this.handleOnSwipeableRef(ref)} onSwipeStart={() => this.handleOnSwipeStart()}>
        <TouchableHighlight onPress={this.handlePressBroker.bind(this, id)}>
          <View style={ApplicationStyles.rowContainerBroker}>

            <View style={ApplicationStyles.row}>
              <View style={[ApplicationStyles.logoContainer, {marginLeft: 10}]}>
                <Image resizeMode='contain' style={ApplicationStyles.articleImage} source={logo} />
              </View>

              <View style={ApplicationStyles.descriptionContainer}>
                <View style={[ApplicationStyles.row, { marginBottom: 6 }]}>
                  <Text style={ApplicationStyles.companyLabel}>{ name }</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeable>
    )
  }

  render = () => {
    // Logger.log({ name: 'BrokerListView.render()' })
    if (this.noRowData()) {
      return (
        <View style={ApplicationStyles.listViewContainer}>
          { this.renderSearchView() }

          <AlertMessage title='No Brokerage Firms Available' show={this.noRowData()} />
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
        <Text style={{textAlign: 'center', fontSize: responsiveFontSize(2.1),fontWeight: 'bold', margin: 10, color: '#234c62', fontFamily: Fonts.type.bold, }}>To participate in offerings, you must connect with a supported brokerage account listed below.</Text>
          <ListView
            contentContainerStyle={ApplicationStyles.listContent}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
            enableEmptySections
            pageSize={15}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleOnRefresh}
                tintColor='#000000'
                title='Loading...'
                titleColor='#000000'
                colors={['#000000', '#000000', '#000000']}
                progressBackgroundColor='#ffffff' />
              }
            />
        </View>
      )
    }
  }

}

BrokerListView.propTypes = {
  brokers: PropTypes.array,

  fetchBrokers: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    brokers: state.broker.brokers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBrokers: (data) => dispatch(BrokerActions.fetchBrokers(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerListView)
