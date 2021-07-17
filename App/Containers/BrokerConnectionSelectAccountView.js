import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Alert,
  ListView,
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  KeyboardAvoidingView,
  AppState
} from 'react-native'

import { connect } from 'react-redux'
import BrokerActions from '../Redux/BrokerRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  BrokerAccount
} from '../Models'

import AlertMessage from '../Components/AlertMessage'
import BrokerAccountListItem from '../Components/BrokerAccountListItem'

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'
import Styles from './Styles/BrokerConnectionSelectAccountViewStyle'

import Logger from '../Lib/Logger'

class BrokerConnectionSelectAccountView extends React.Component {

  state: {
    accounts: Array<BrokerAccount>,
    activeAccount : Object,
    processing: Boolean,
    error: Object,
    rowStatus : String,
  }

  constructor (props) {
    super(props)


    const { accounts = [] } = props

    // DataSource configured
    const rowHasChanged = (r1, r2) => r1.id !== r2.id
    const ds = new ListView.DataSource({rowHasChanged})

    // console.log('ds: ', ds)
    this.state = {
      accounts: accounts,
      dataSource: ds.cloneWithRows(accounts),
      activeAccount : props.activeAccount,
      fetching: false,
      error: null,
      rowStatus : 'Getting Accounts'
    }
    // console.log('props in BrokerConnectionSelectAccountView: ', props)
  }

  componentWillReceiveProps = (newProps) => {

    const { accounts = [], fetching, error } = newProps

    const rowHasChanged = (r1, r2) => r1.id !== r2.id
    const ds = new ListView.DataSource({rowHasChanged})

    this.setState({
      accounts: accounts,
      dataSource: ds.cloneWithRows(accounts),
      activeAccount : newProps.activeAccount,
      fetching: false,
      error: error,
      rowStatus : 'Getting Accounts',
      appState: AppState.currentState
    })
    
    // console.log('this.props.brokerConnection: ', this.props.brokerConnection)
    NavigationActions.refresh({
      key: 'brokerView',
      brokerConnection: this.props.brokerConnection,
      inFlow: this.props.inFlow
    })
  }

  componentWillMount = () => {
    // Logger.log({ name: 'BrokerConnectionSelectAccountView.componentWillMount()' })

    //this fetch Broker account is where the brokerConnection object should be 
    this.props.fetchBrokerAccounts()
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    }
    if(this.state.appState !== 'active') {
      const data = {
        account_id: this.props.brokerConnection.account_id,
        mpid: this.props.brokerConnection.mpid
      }
      this.props.deleteBrokerConnection(data);
      NavigationActions.refresh({
        key: 'brokerView',
        brokerConnection: null
      })
    }
    this.setState({appState: nextAppState});
  }

  connectBrokerAccount = (account) => {

    const brokerAccount = new BrokerAccount()
    brokerAccount.connectionId = this.props.brokerConnection.id
    brokerAccount.accountNumber = account.accountNumber
    brokerAccount.accountType = account.accountType
    brokerAccount.active = true
    brokerAccount.availableBalance = account.availableBalance



    //this.props.setActiveBrokerAccount(brokerAccount)
    this.props.setActiveBrokerAccount(account)
  }

  noRowData = () => {
    return this.state.dataSource.getRowCount() === 0
  }

  render = () => {

    // if fetching show processing screen

    // display a list of the accounts, onClick=> set active account

    if (this.props.error) {
      return <Text style={[ApplicationStyles.networkError]}> {this.props.error.displayMessage}</Text>
    } else {
      return (
        <ScrollView style={ApplicationStyles.container}>
          <KeyboardAvoidingView behavior='position'>
            <View style={[ApplicationStyles.container, {  }]}>
  
              <Text style={ Styles.TextStyle}>Please link to one of your accounts below to place orders</Text>
  
              <View style={[ApplicationStyles.container]}>
                <AlertMessage title={this.state.rowStatus} style ={{marginVertical: 50}} show={this.noRowData()} />
              
                <ListView
                  contentContainerStyle={{  }}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow}
                  enableEmptySections
                  pageSize={15}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      );
    }
  }

  renderRow = (rowData) => {

    return (
      <BrokerAccountListItem deleteBrokerConnection = { (brokerConnection) => this.props.deleteBrokerConnection(brokerConnection) } activeAccount = { this.state.activeAccount } brokerConnection = { this.props.brokerConnection } brokerAccount={rowData} onConnectBrokerAccount={(account) => { this.connectBrokerAccount(account) }} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.broker.accounts,
    inFlow: state.broker.inFlow,
    fetching: state.broker.fetching,
    error: state.broker.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBrokerAccounts: () => dispatch(BrokerActions.fetchBrokerAccounts()),
    setActiveBrokerAccount: (account) => dispatch(BrokerActions.setActiveBrokerAccount(account)),
    deleteBrokerConnection: (brokerConnection) => dispatch(BrokerActions.deleteBrokerConnection(brokerConnection))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerConnectionSelectAccountView)
