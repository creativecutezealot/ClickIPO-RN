import React from 'react'
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  // ScrollView,
  ListView,
  Text,
  // AsyncStorage,
  // TextInput,
  TouchableHighlight,
  InteractionManager,
  Image,
  // Keyboard,
  // LayoutAnimation,
  Clipboard,
  RefreshControl
} from 'react-native'

import { sortOrders, filterOrder } from '../Lib/Utilities'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import OrderActions from '../Redux/OrderRedux'
import WaitingView from '../Components/WaitingView';
import OrderListItem from '../Components/OrderListItem'
import Swipeable from 'react-native-swipeable'
import firebase from '../Config/FirebaseConfig'
import OfferingActions from '../Redux/OfferingRedux'

import {
  Order,
  Filter,
  Sorter
} from '../Models'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import { Colors, ApplicationStyles, Fonts } from '../Themes'
import FilterView from '../Components/FilterView'
import styles from './Styles/OrdersListViewStyle'
import FullButton from '../Components/FullButton'
import TempFullButton from '../Components/TempFullButton';
// import Moment from 'moment'

import OfferingListItem from '../Components/OfferingListItem'

import Logger from '../Lib/Logger'
//import Spinner from '../Components/Spinner';

class OrdersListView extends React.Component {

  state: {
    orders: Array<Order>,
    dataSource: Object,
    filters: Array<Filter>,
    searchTerm: String,
    sorters: Array<Sorter>,
    isFilterViewEnabled: Boolean,
    swipeables: Array<Object>,
    isProcessing: Boolean,
    isRefreshing: Boolean,
    isLoading: Boolean,
    isClosedActive: Boolean,
    isSearchOpen: Boolean,
    filterTitle: String
  }

  constructor(props) {
    super(props)
    //this.LoaderSpinner();
    const { orders = [], sorters = this.defaultSorters(), searchTerm = '', filters = this.defaultFilters() } = props
    // Logger.log({ name: 'OrdersListview.constructor()', orders: orders, filters: filters })

    //const filteredOrders = (filters[0] && orders[0]) ? this.applyFilters(orders, filters) : orders
    // Logger.log({ name: 'OrdersListview.constructor()', filteredOrders: filteredOrders })

    // const rowHasChanged = (r1, r2) => r1.id == r2.id || r1.status == r2.status
    const rowHasChanged = (r1, r2) => true

    const filteredOrders = sortOrders(filterOrder(orders, searchTerm, filters), sorters)

    // DataSource configured
    const ds = new ListView.DataSource({ rowHasChanged })

    // Datasource is always in state
    //order here is the order that the user taps. order is passed from orderListItem and then state is updated appropriately
    this.state = {
      order: {},
      orders: orders,
      filters: filters,
      sorters: sorters,
      isFilterViewEnabled: false,
      dataSource: ds.cloneWithRows(filteredOrders),
      swipeables: [],
      isProcessing: false,
      isRefreshing: false,
      isLoading: true,
      isClosedActive: false,
      isSearchOpen: props.isSearchOpen,
      //showSpinner: true,
      orderSelectedID: '',
      acceptingOrders: false,
      filterTitle: 'Order Filter'
    }

  }
  // LoaderSpinner() {
  //   setTimeout(() => {
  //     this.setState({ showSpinner: false })
  //   }, 4000);
  // }

  defaultFilters = () => {
    return [
      new Filter('Status', 'Cancelled', true, (el) => { return el.status === 'cancelled' }),
      new Filter('Status', 'Closed', true, (el) => { return el.status === 'closed' }),
      new Filter('Status', 'Pending', true, (el) => { return el.status === 'active' })
    ]
  }

  defaultSorters = () => {
    return [
      new Sorter('Sort', 'Date By Ascending', true, ['status', 'createdAt']),
      new Sorter('Sort', 'Date By Descending', false, ['status', 'createdAt']),
      new Sorter('Sort', 'Highest Requested Amount', false, ['status', 'requestedAmount']),
      new Sorter('Sort', 'Lowest Requested Amount', false, ['status', 'requestedAmount'])
    ]
  }

  modifiedFilters = () => {
    const modifiedFilters = filter(this.state.filters, (el) => { return el.isModified() })
    return modifiedFilters
  }

  componentWillMount() {
    this.setState({
      isLoading: true
    })
    this.fetchOrders(null);

    InteractionManager.runAfterInteractions(() => {
      // this.setState({
      //   isLoading: false
      // })
    })

  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.orders) {
      const { orders, filters } = newProps



      var visableOrders_ = []
      const filteredOrders = sortOrders(filterOrder(newProps.orders, newProps.searchTerm, this.state.filters), this.state.sorters)

      if (newProps.isSearchOpen !== this.state.isSearchOpen && newProps.isSearchOpen) {
        var visableOrders_ = []
      } else {
        if (newProps.isSearchOpen && newProps.searchTerm === '') {
          var visableOrders_ = []
        } else {
          var visableOrders_ = filteredOrders
        }
      }

      this.setState({
        isFilterViewEnabled: newProps.isFilterOpen,
        orders: orders,
        dataSource: this.state.dataSource.cloneWithRows(visableOrders_),
        isProcessing: false,
        isRefreshing: false
      })
    }
  }

  fetchOrders = () => {
    this.setState({ isProcessing: true })
    const filter = {}
    this.props.fetchOrders(filter)
  }

  applyOrderFilters = (filters) => {
    filters.map((el) => {
      if (el.label === "Closed" && el.enabled === true && this.state.isClosedActive === false) {
        this.setState({ isClosedActive: true })
        filters.map((ell) => {
          if (ell.label === 'Active' || ell.label === 'Upcoming') {
            ell.enabled = false
            return ell
          }
        })
      } else if (this.state.isClosedActive === true && (el.label === 'Active' || el.label === 'Upcoming')) {
        this.setState({ isClosedActive: false })
        el.enabled = true
        filters.map((elll) => {
          if (elll.label === 'Closed') {
            elll.enabled = false
            return elll
          }
        })
      } else {
        return el
      }

    })
    const visableOfferings = sortOrders(filterOrder(this.props.orders, this.props.searchTerm, filters), this.state.sorters)
    this.setState({
      filters: filters,
      visableOfferings: visableOfferings,
      dataSource: this.state.dataSource.cloneWithRows((visableOfferings)),
    })
  }


  applyOrderSorters = (sorters) => {
    this.setState({
      sorters: sorters
    })
  }

  handlePressOrder = (orderId) => {
    // Logger.log({ name: 'OrdersListView.handlePressOrder()', order: order })

    this.recenterSwipeables()

    // order details
    NavigationActions.offeringDetails({ id: this.props.orders.offering.id, industries: this.props.orders.industries, title: this.props.offering.name, offeringTypeName: this.props.offering.offeringTypeName, tickerSymbol: this.props.offering.tickerSymbol })
  }

  handlePressModify = (orderId) => {
    // Logger.log({ name: 'OrdersListView.handlePressModify()', order: order })

    this.recenterSwipeables()

    // order details
    NavigationActions.orderModify({ orderId: orderId })
  }


  handleUserBeganScrollingParentView = () => {  // TODO: hock this up to the listview.onScroll
    this.recenterSwipeables()
  }

  handleOnSwipeableRef = async (ref) => {
    // Logger.log({ name: 'OrdersListView.handleNewSwipeableRef()' })

    const swipables = this.state.swipeables
    swipables.push(ref)
    this.setState({ swipeables: swipables })
  }

  handleOnSwipeStart = async () => {
    this.recenterSwipeables()
  }

  recenterSwipeables = () => {
    // Logger.log({ name: 'OrdersListView.recenterSwipeables()' })

    this.state.swipeables.map((ref) => ref.recenter())
  }

  handleOnRefresh = () => {
    // Logger.log({ name: 'OrdersListView.handleOnRefresh()' })

    this.setState({ isRefreshing: true })

    const props = { forceRefresh: true }
    this.fetchOrders(props)
  }

  //this method is passed to the orderListItem and when a user taps an offering we capture the id and send it to this component
  //we also capture the order to check for orderReconfirmation
  orderSelected = (order) => {
    this.setState({
      orderSelectedID: order.offering.id,
      order: order,
      acceptingOrders: order.offering.acceptingOrders
    });
  }

  //this method is no longer being used -- removed after testing 12/14/18
  renderRow = order => {
    return (
      <OrderListItem order={order} />
    );
  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0
  }

  handleOnRefresh = () => {
    this.setState({
      isRefreshLoading: true
    })

    firebase.analytics().logEvent('refreshed_offers')
    const data = { forceRefresh: true }
    // this.props.loadOfferings()
    this.props.fetchOrders(data);
  }

  // Render a footer.
  renderFooter = () => {
    return (
      null
    )
  }


  // Render Order list
  //  renderAll = () => {
  renderListView = () => {

    if (this.state.deeplink !== null) {
      var deeplinkOffset = this.deeplinkOffset
    } else {
      var deeplinkOffset = 0
    }

    if (this.props.tabLabel === 'MY ORDERS') {
      var title = 'You Are Not Yet Following Any Upcoming Offerings'
    } else {

      if (this.state.isLoading || this.state.isRefreshLoading) {
        var title = 'Getting Offerings'
      } else {
        var title = 'Getting Offerings'
      }

    }
    if (this.noRowData()) {
      return (

        <AlertMessage title={title} show={this.noRowData()} />
      )
    } else {
      // TODO: fix refreash control below

      var dateArray = []
      var nameArray = []

      return (
        <ListView
          contentContainerStyle={ApplicationStyles.listContent}
          // onContentSizeChange={(w,h) => this.onSizeChangeAction(w,h)}
          // onLayout={(x,y,w,h) => this.onLayoutAction(x,y,w,h)}
          contentOffset={{ x: 0, y: 0 /*deepLinkOffset*/ }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderHeader={this.renderTip}
          renderFooter={this.renderFooter}
          enableEmptySections
          // renderSectionHeader={ this.renderSectionHeaderOffering }
          // stickySectionHeadersEnabled = {false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshLoading}
              onRefresh={this.handleOnRefresh}
              tintColor='#000000'
              title='Loading...'
              titleColor='#000000'
              colors={['#000000', '#000000', '#000000']}
              progressBackgroundColor='#ffffff' />

          }
        />
      )
    }
  }

  //user presses cancel button
  handlePressCancelOrder = () => {
    NavigationActions.orderCancelConfirm({ orderId: this.state.orderSelectedID, order: this.state.order });
  }

  //user presses view button
  handlePressViewOrder = () => {
    // add by burhan
    NavigationActions.orderDetails({ id: this.state.orderSelectedID, order: this.state.order });
  }

  //user presses modify button
  handlePressUpdateOrder = () => {
    //the order object has a key:value pair called reconfirmationRequired, 
    //if that is true send the user to the reconfirmation page
    //else send the user to orderDetails page
    if (this.state.order.reconfirmationRequired) {
      NavigationActions.orderReconfirmation({ order: this.state.order });
    } else {
      NavigationActions.orderModify({ orderId: this.state.orderSelectedID, order: this.state.order });
    }
  }

  //this block of code is responsible for rendering each row of orders
  //inside of the renderRow property we are checking the id of that row(which is the orderID) with the orderID of what the user has clicked
  //this is the condition that we check to show the menu with the three buttons (cancel order, view order, modify order)
  renderListViewMain() {

    return (
      <View style={ApplicationStyles.container}>
        <AlertMessage title='No Orders' show={this.noRowData()} />
        <ListView
          contentContainerStyle={ApplicationStyles.listContent}
          dataSource={this.state.dataSource}
          renderRow={(rowData, section, row) => {
            if (rowData.offering.id === this.state.orderSelectedID && rowData.status !== "cancelled" && rowData.status !== "closed") {
              return (
                <View style={{ borderWidth: 2, borderColor: '#000000', backgroundColor: '#94ACB8' }}>
                  <OrderListItem order={rowData} orderSelected={this.orderSelected} />
                  <View style={{ flexDirection: 'row', margin: 10 }}>
                    <FullButton
                      ref='cancel'
                      text='Cancel Order'
                      buttonStyle={styles.cancelButtonStyle}
                      onPress={this.handlePressCancelOrder}
                    />
                    <TempFullButton
                      ref='view'
                      text='View Order'
                      buttonStyle={styles.viewButtonStyle}
                      onPress={this.handlePressViewOrder}
                    />
                    <FullButton
                      ref='update'
                      text='Modify Order'
                      onPress={this.handlePressUpdateOrder}
                    />
                  </View>
                </View>
              );
            } else {
              return (
                <OrderListItem order={rowData} orderSelected={this.orderSelected} />
              );
            }
          }}
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

  isWaiting = () => {
    if (this.state.isLoading === false) {
      return false
    } else {
      return true
    }
  }

  render() {
    return (
      <View style={ApplicationStyles.listViewContainer}>
        {/* {this.state.showSpinner &&
            <Spinner />
          } */}
        {this.renderListViewMain()}
        {this.renderFilterView()}
      </View>
    )
  }


  renderTip = () => {
    if (this.state.showTip === true) {
      return (
        <View style={styles.Component}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="ios-information-circle" style={styles.ViewStyle} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.NotAllStyle}>Not all Offerings are available to purchase.</Text>
          </View>
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  renderHeader = () => {
    if (this.modifiedFilters().length === 0) {
      var filterColor = Colors.greyishBrown
    } else {
      var filterColor = Colors.tealish
    }
    return (
      <View style={styles.ViewStyle1}>
        <View style={[{ flex: 1 }]}>
          <SearchView searchTerm={this.state.searchTerm} onChange={this.applySearchTerm} />
        </View>

        <View style={[{ height: 50, width: 75, justifyContent: 'center', alignItems: 'center', backgroundColor: filterColor, borderLeftWidth: 1, borderLeftColor: Colors.pinkishGrey }]}>
          <TouchableOpacity onPress={() => this.setState({ isFilterViewEnabled: !this.state.isFilterViewEnabled })}>
            <Text style={styles.Filter}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  // renderRow = (Orders) => {
  //   // Logger.log({ name: 'OfferingsListView.renderRow()'})

  //   const placeOrderEnabled = canPlaceOrder(this.state.user, Orders)

  //   return (
  //     <OfferingListItem Orders={Orders} placeOrderEnabled={placeOrderEnabled} toggleSaved={() => this.props.toggleSaved(Orders.id)} />
  //   )
  // }

  renderFilterView = () => {
    if (this.state.isFilterViewEnabled) {
      return (
        <TouchableHighlight underlayColor={Colors.drawerBlue} style={styles.TouchableHighlight} onPress={() => this.props.handleFilterPress(this.props)} >
          <View style={styles.ViewStyle2}>

            <View style={styles.ViewStyle3} >
              <FilterView filters={this.state.filters} sorters={this.state.sorters} onFilterChange={this.applyOrderFilters} onSorterChange={this.applyOrderSorters} handleFilterPress={() => this.props.handleFilterPress(this.props)} filterTitle = {this.state.filterTitle} />
            </View>
          </View>

        </TouchableHighlight>
      )
    } else {
      return (
        null
      )
    }
  }
}

OrdersListView.propTypes = {
  orders: PropTypes.array,
  fetchOrders: PropTypes.func,
  fetching: PropTypes.bool,
  error: PropTypes.object,
  isLoading: PropTypes.bool,
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    fetching: state.order.fetching,
    error: state.order.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrders: (data) => dispatch(OrderActions.fetchOrders(data)),
    loadOfferings: () => dispatch(OfferingActions.loadOfferings()),
    //  toggleSaved: (data) => dispatch(OfferingActions.toggleSaved(data)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersListView)
