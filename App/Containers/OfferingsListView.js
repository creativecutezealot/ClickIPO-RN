import React from 'react'
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  // ScrollView,
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  // Keyboard,
  // LayoutAnimation,
  Clipboard,
  RefreshControl,
  Platform,
  InteractionManager,
  ActivityIndicator,
  Animated
} from 'react-native'

import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import OfferingActions from '../Redux/OfferingRedux'
import SettingsActions from '../Redux/SettingsRedux'
import StartupActions from '../Redux/StartupRedux'
//import Spinner from '../Components/Spinner';

// import Moment from 'moment'
// import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import {
  User,
  Offering,
  Filter,
  Sorter
} from '../Models'

import { filterOfferings, sortOfferings } from '../Lib/Utilities'
import { filter, findIndex } from 'lodash'

import AlertMessage from '../Components/AlertMessage'
import FullButton from '../Components/FullButton'
import OfferingListItem from '../Components/OfferingListItem'
import SearchView from '../Components/SearchView'
import FilterView from '../Components/FilterView'
import WaitingView from '../Components/WaitingView'

import Icon from 'react-native-vector-icons/Ionicons'
import Styles from './Styles/OfferingsListViewStyle'

import firebase from '../Config/FirebaseConfig'

// Styles
import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'

class OfferingsListView extends React.Component {

  state: {
    user: User,
    visableOfferings: Array<Offering>,
    searchTerm: String,
    filters: Array<Filter>,
    sorters: Array<Sorter>,
    dataSource: Object,
    isFilterViewEnabled: Boolean,
    isLoading: Boolean,
    isRefreshLoading: Boolean,
    showTip: Boolean,
    listOffset: Number,
    sectionField: String,
    isSearchOpen: Boolean,
    industries: [],
    selectedIndustries: [],
    filterTitle: String
  }

  constructor(props) {
    super(props)
    // this.LoaderSpinner();
    //Logger.log({ name: 'OfferingsListView.constructor()', props: props })

    const { sectionField, user, offerings = [], searchTerm = '', sorters = this.defaultSorters(), filters = this.defaultFilters(), showTip = true } = props
    const rowHasChanged = (r1, r2) => r1.id == r2.id || r1.save !== r2.save || r1.read !== r2.read

    //previously we used to check if r1 id and r2 id are not the same then we would update the list, this resulted in the list not updating if web admin modified an existing offering
    //the reason for this bug was we were checking the id and the id never changes therefore if we modify an existing offering the id remains the same but other fields may have changed
    //this bug caused the user not being able to see the updated offering info unless the logged out of the app and logged back in
    // const rowHasChanged = (r1, r2) => r1.id !== r2.id || r1.save !== r2.save || r1.read !== r2.read
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    const industries = [];

    const ds = new ListView.DataSource({ rowHasChanged, sectionHeaderHasChanged })

    const visableOfferings = sortOfferings(filterOfferings(offerings, searchTerm, filters, industries), sorters)

    if (props.isSearchOpen) {
      var visableOfferings_ = []
    } else {
      var visableOfferings_ = visableOfferings
    }

    this.state = {
      user: user,
      visableOfferings: visableOfferings,
      searchTerm: '',
      filters: filters,
      sorters: sorters,
      dataSource: ds.cloneWithRows((visableOfferings_)),
      isFilterViewEnabled: false,
      isClosedActive: false,
      isLoading: true,
      isRefreshLoading: false,
      showTip: showTip,
      listOffset: 0,
      deeplink: null,
      sectionField: sectionField,
      isSearchOpen: props.isSearchOpen,
      industries: [],
      selectedIndustries: [],
      filterTitle: 'Offering Filter'
      // showSpinner: true
    }
  }

  // LoaderSpinner() {
  //   setTimeout(() => {
  //     this.setState({ showSpinner: false })
  //   }, 4000);
  // }

  convertOfferingsToMap = (offerings) => {

    var isMyOffering = this.props.isMyOffering
    var offeringsMap = {};

    offerings.forEach(function (offeringItem) {

      if (isMyOffering) {

        if (offeringItem.save) {
          if (!offeringsMap["Following"]) {
            offeringsMap["Following"] = []
          }
          offeringsMap["Following"].push(offeringItem);
        }

      } else {

        if (!offeringsMap["Available to order"]) {
          offeringsMap["Available to order"] = []
        }
        offeringsMap["Available to order"].push(offeringItem);

      }

    })

    return offeringsMap;

  }

  componentWillMount() {
    const data = { forceRefresh: true }
    if (this.state.showTip === true) {
      this.props.showOfferingsTip(false)
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isLoading: false
      })
    })
    this.props.fetchOfferings(data);
    this.props.fetchIndustries();
  }


  componentWillReceiveProps = (newProps) => {
    var visableOfferings_ = []

    const visableOfferings = sortOfferings(filterOfferings(newProps.offerings, newProps.searchTerm, this.state.filters, this.state.selectedIndustries), this.state.sorters)

    if (newProps.isSearchOpen !== this.state.isSearchOpen && newProps.isSearchOpen) {
      var visableOfferings_ = []
    } else {
      if (newProps.isSearchOpen && newProps.searchTerm === '') {
        var visableOfferings_ = []
      } else {
        var visableOfferings_ = visableOfferings
      }
    }

    this.setState({
      isFilterViewEnabled: newProps.isFilterOpen,
      visableOfferings: visableOfferings,
      dataSource: this.state.dataSource.cloneWithRows((visableOfferings_)),
      isSearchOpen: newProps.isSearchOpen
    })

    if (this.state.isRefreshLoading === true) {
      this.setState({
        isRefreshLoading: false
      })
    }

    const { industries = [] } = newProps;

    this.setState({
      industries: industries[0]
    }, () => {
    });
  }

  defaultFilters = () => {
    return [
      new Filter('offeringTypeName', 'IPO', true, (el) => { return el.offeringTypeName === 'ipo' }),
      new Filter('offeringTypeName', 'Marketed secondary', true, (el) => { return el.offeringTypeName === 'secondary' }),
      new Filter('offeringTypeName', 'Follow-On Overnight', true, (el) => { return el.offeringTypeName === 'Follow-On Overnight' }),
      // new Filter('status', 'Cancelled', true, (el) => { return el.status === 'cancelled' }), 
      // new Filter('status', 'Closed', true, (el) => { return el.status === 'closed' }),
      // new Filter('status', 'Pending', true, (el) => { return el.offeringTypeName === 'active' })
    ]
  }

  // defaultFilters = () => {
  //   return [
  //     new Filter('Offering Type', 'IPO', true, (el) => {return el.offeringTypeName.toLowerCase() === 'ipo'})
  //     , new Filter('Offering Type', 'Marketed Secondary', true, (el) => {return el.offeringTypeName.toLowerCase() === 'secondary'})
  //     , new Filter('Offering Type', 'Spot Secondary', true, (el) => {return el.offeringTypeName.toLowerCase() === 'spot'})

  //     , new Filter('Offering Status', 'Active', true, (el) => {return el.status.toLowerCase() === 'active'})
  //     , new Filter('Offering Status', 'Upcoming', true, (el) => {return el.status.toLowerCase() === 'upcoming'})
  //     , new Filter('Offering Status', 'Closed', false, (el) => {return el.status.toLowerCase() === 'closed'})

  //     , new Filter('Availability', 'Available For Purchase', true, (el) => {return el.participate})
  //     , new Filter('Availability', 'Information Only', true, (el) => {return !el.participate})
  //   ]
  // }

  defaultSorters = () => {
    return [
      new Sorter('Sort', 'Name', false, ['name', 'sortableDate', 'sortableIndustries'])
      , new Sorter('Sort', 'Industry', false, ['sortableIndustries', 'sortableDate', 'name'])
      , new Sorter('Sort', 'Accepting Orders', true, ['acceptingOrders', 'sortableDate'])
    ]
  }

  modifiedFilters = () => {
    const modifiedFilters = filter(this.state.filters, (el) => { return el.isModified() })
    return modifiedFilters
  }

  applyFilters = (filters) => {

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
    const visableOfferings = sortOfferings(filterOfferings(this.props.offerings, this.props.searchTerm, filters, this.state.selectedIndustries), this.state.sorters)
    this.setState({
      filters: filters,
      visableOfferings: visableOfferings,
      dataSource: this.state.dataSource.cloneWithRows((visableOfferings)),
    })
  }

  applySorters = (sorters) => {
    const visableOfferings = sortOfferings(filterOfferings(this.props.offerings, this.props.searchTerm, this.state.filters, this.state.selectedIndustries), sorters);
    this.setState({
      sorters: sorters,
      visableOfferings: visableOfferings,
      dataSource: this.state.dataSource.cloneWithRows((visableOfferings)),
    });
  }

  applyIndustryFilter = (industries) => {

    const visableOfferings = sortOfferings(filterOfferings(this.props.offerings, this.props.searchTerm, this.state.filters, industries), this.state.sorters)
    this.setState({
      selectedIndustries: industries,
      visableOfferings: visableOfferings,
      dataSource: this.state.dataSource.cloneWithRows((visableOfferings)),
    })

  }


  applySearchTerm = (searchTerm) => {
    // Logger.log({ name: 'OfferingsListView.applySearch()', searchTerm: searchTerm })

    const visableOfferings = sortOfferings(filterOfferings(this.props.offerings, searchTerm, this.state.filters, this.state.selectedIndustries), this.state.sorters)

    this.setState({
      searchTerm: searchTerm,
      visableOfferings: visableOfferings,
      dataSource: this.state.dataSource.cloneWithRows((visableOfferings)),
    })

  }

  // returns true if the dataSource is empty
  noRowData = () => {
    if (this.props.isSearchOpen) {
      return false
    } else {
      return this.state.dataSource.getRowCount() === 0
    }

  }

  handleOnRefresh = () => {
    this.setState({
      isRefreshLoading: true
    })
    // Logger.log({ name: 'OfferingsListView.handleOnRefresh()' })
    firebase.analytics().logEvent('refreshed_offers')
    const data = { forceRefresh: true }
    // this.props.loadOfferings()
    this.props.fetchOfferings(data);
  }

  /*
  handleUserBeganScrollingParentView = () => {  // TODO: hock this up to the listview.onScroll
    this.recenterSwipeables()
  }
  */

  onSizeChangeAction = (w, h) => {
    this.sizeOfList = h
  }

  onLayoutAction = (event) => {
    var layout = event.nativeEvent.layout
    const { height } = layout
    this.sizeOfContainer = height
    const totalHeight = this.state.dataSource._dataBlob.s1.length * (Metrics.listItemHeight + Metrics.borderBottomWidth)
    this.deeplinkOffset = totalHeight - height
  }

  //bands.sort(compare);

  renderListView = () => {
    /*if(this.state.deeplink !== null){
      var deepLinkIndex = _.findIndex(this.state.dataSource._dataBlob.s1, { id: this.state.deeplink })
      var deepLinkOffset = deepLinkIndex * (Metrics.listItemHeight + Metrics.borderBottomWidth)
      if(deepLinkOffset <= -1){
        deepLinkOffset = 0
      }
      this.props.resetDeeplink()
    } else {
      var deepLinkOffset = 0
    }*/

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

      //console.log(this.state.dataSource._dataBlob.s1.sort((a, b) => Date.parse(new Date(a.((offering.effectiveDate) ? (Moment(offering.effectiveDate).format('MMM D')) : ((offering.anticipatedDate) ? (Moment(offering.anticipatedDate).format('MMM D')) : 'TBD')).split("/").reverse().join("-"))) - Date.parse(new Date(b.initialRegistration.split("/").reverse().join("-")))));
      //

      //console.log(this.state.dataSource._dataBlob.s1.sort((a, b) => Moment(b.effectiveDate) - Moment(a.effectiveDate)));


      // console.log(this.state.dataSource._dataBlob.s1.sort((a, b) => {
      //     // Use toUpperCase() to ignore character casing
      //     const genreA = a.name.toUpperCase();
      //     const genreB = b.name.toUpperCase();

      //     let comparison = 0;
      //     if (genreA > genreB) {
      //       comparison = 1;
      //     } else if (genreA < genreB) {
      //       comparison = -1;
      //     }
      //     return comparison;
      //   }
      //   ));

      return (
        <View>
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
            pageSize={15}
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
        </View>
      )
    }
  }

  isWaiting = () => {
    if (this.state.isLoading === false) {
      return false
    } else {
      return true
    }
  }

  render = () => {
    // Logger.log(JSON.stringify(this.state.dataSource))

    //{ this.renderHeader() }
    return (
      <WaitingView isWaiting={this.isWaiting()}>
        <View style={ApplicationStyles.listViewContainer}>
          {/* {this.state.showSpinner &&
            <Spinner />
          } */}
          {this.renderListView()}
          {this.renderFilterView()}
        </View>
      </WaitingView>
    )
  }

  renderHeader = () => {
    if (this.modifiedFilters().length === 0) {
      var filterColor = Colors.greyishBrown
    } else {
      var filterColor = Colors.tealish
    }
    return (
      <View style={Styles.Container}>
        <View style={[{ flex: 1 }]}>
          <SearchView searchTerm={this.state.searchTerm} onChange={this.applySearchTerm} />
        </View>
        <View style={[{ height: 50, width: 75, justifyContent: 'center', alignItems: 'center', backgroundColor: filterColor, borderLeftWidth: 1, borderLeftColor: Colors.pinkishGrey }]}>
          <TouchableOpacity onPress={() => this.setState({ isFilterViewEnabled: !this.state.isFilterViewEnabled })}>
            <Text style={Styles.Filter}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSectionHeaderOffering = (sectionData, rowType) => {
    return (
      <Text style={{ ...Fonts.style.label, backgroundColor: Colors.white, color: Colors.drawerBlue, fontSize: 24, lineHeight: 28, paddingHorizontal: 16, paddingTop: 48, paddingBottom: 20 }}>{rowType}</Text>
    )
  }


  renderFooter = () => {
    // Logger.log({ name: 'OfferingsListView.renderFooter()'})

    return (
      null
    )
  }

  renderTip = () => {
    if (this.state.showTip === true) {
      return (
        <View style={Styles.ViewStyle}>
          <View style={Styles.ViewStyle1}>
            <Icon name="ios-information-circle" style={Styles.Icon} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={Styles.NotAllOffering}>Not all Offerings are available to purchase.</Text>
          </View>
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  renderRow = (offering) => {
    // Logger.log({ name: 'OfferingsListView.renderRow()'})

    // const placeOrderEnabled = canPlaceOrder(this.state.user, offering)
    const placeOrderEnabled = offering.acceptingOrders;

    return (
      <OfferingListItem offering={offering} placeOrderEnabled={placeOrderEnabled} toggleSaved={() => this.props.toggleSaved(offering.id)} />
    )
  }

  renderFilterView = () => {
    if (this.state.isFilterViewEnabled) {
      return (
        <TouchableHighlight underlayColor={Colors.drawerBlue} style={Styles.TouchabelHighLight} onPress={() => this.props.handleFilterPress(this.props)} >
          <View style={Styles.ViewStyle2}>

            <View style={Styles.ViewStyle3} >
              <FilterView filters={this.state.filters} sorters={this.state.sorters} onFilterChange={this.applyFilters} industries={this.state.industries} selectedIndustry={this.state.selectedIndustries} onSorterChange={this.applySorters} handleFilterPress={() => this.props.handleFilterPress(this.props)} onIndustryChange={this.applyIndustryFilter}
              filterTitle={this.state.filterTitle} />
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

OfferingsListView.propTypes = {
  user: PropTypes.object,
  offerings: PropTypes.array,
  isLoading: PropTypes.bool,
  showTip: PropTypes.bool,
  fetchIndustries: PropTypes.func,
  industries: PropTypes.array
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    showTip: state.settings.showTip,
    deeplink: state.startup.deeplink,
    industries: state.offering.industry,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSaved: (data) => dispatch(OfferingActions.toggleSaved(data)),
    showOfferingsTip: (data) => dispatch(SettingsActions.showOfferingsTip(data)),
    loadOfferings: () => dispatch(OfferingActions.loadOfferings()),
    fetchOfferings: (data) => dispatch(OfferingActions.fetchOfferings(data)),
    fetchIndustries: (data) => dispatch(OfferingActions.fetchIndustries()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferingsListView)