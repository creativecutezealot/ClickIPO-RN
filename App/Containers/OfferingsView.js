import React from 'react'
import PropTypes from 'prop-types';
import {
  // Alert,
  View,
  // ScrollView,
  // ListView,
  Text,
  // TextInput,
  // TouchableOpacity,
  // TouchableHighlight,
  // Image,
  // Keyboard,
  // LayoutAnimation,
  // Clipboard,
  // RefreshControl,
} from 'react-native'

import { connect } from 'react-redux'
// import { Actions as NavigationActions } from 'react-native-router-flux'
import OfferingActions from '../Redux/OfferingRedux'
import WaitingView from '../Components/WaitingView';
import {
  Offering
} from '../Models'

import OfferingsListView from '../Containers/OfferingsListView'
import OfferingsCardView from '../Containers/OfferingsCardView'

// Styles
 import styles from './Styles/OfferingsViewStyle'

import Logger from '../Lib/Logger'
import firebase from '../Config/FirebaseConfig'

class OfferingsView extends React.Component {

  state: {
    filters: Array<Object>,
    offerings: Array<Offering>,
    view: String,
    isLoading: Boolean,
  }

  constructor (props) {
    super(props)

    // Logger.log({ name: 'OfferingsView.constructor()', props: props })

    const { filters = [], offerings = [], view = 'LIST' } = props
    const filteredOfferings = this.filterOfferings(offerings, filters)

    this.state = {
      filters: filters,
      view: view,
      offerings: filteredOfferings,
      isLoading: true
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'OfferingsView.componentWillMount()', state: this.state })
  
    const { tabLabel } = this.props

    if(tabLabel === "Following"){
      firebase.analytics().setCurrentScreen('offerings_mine')
    } else {
      firebase.analytics().setCurrentScreen('offerings')
    }

    this.fetchOfferings()
  }

  componentWillUnmount () {
    // Logger.log({ name: 'OfferingsView.componentWillUnmount()', state: this.state })
  }

  componentWillReceiveProps = (newProps) => {

    const { offerings = [], view = 'LIST' } = newProps

    const { filters } = this.state
    const filteredOfferings = this.filterOfferings(offerings, filters)

    this.setState({
      offerings: filteredOfferings,
      view: view,
      isLoading: false
    })
  }

  fetchOfferings = () => {
    // Logger.log({ name: 'OfferingsView.fetchOfferings()' })
    const filters = {}

    this.setState({ isLoading: true }, () => {
      this.props.fetchOfferings(filters)
      this.setState({ isLoading: false })
    })
  }

  filterOfferings = (offerings, filters) => {
    // Logger.log({ name: 'OfferingsView.filterOfferings()', offerings: offerings, filters: filters })

    var retval = offerings

    const applyPropFilter = (filter) => {
      retval = retval.filter((el) => { return el[filter.prop] === filter.value })   // findByProp(filter.prop, filter.value , retval), retval)
      // Logger.log({ name: 'OfferingsView.filterOfferings()', retvalN: retval })
    }
    filters.map((filter) => applyPropFilter(filter))

    return retval
  }

  renderListView = () => {
    //Logger.log({ name: 'OfferingsView.renderListView()', props: this.props })
    const { offerings } = this.state
    return (
      <OfferingsListView isMyOffering= {this.props.isMyOffering} handleFilterPress = {this.props.handleFilterPress} isFilterOpen = {this.props.isFilterOpen} isSearchOpen = {this.props.isSearchOpen} searchTerm = {this.props.searchTerm} offerings={offerings} isLoading={this.state.isLoading} tabLabel={this.props.tabLabel} />
    )
  }

  renderCardView = () => {
    // Logger.log({ name: 'OfferingsView.renderCardView()', state: this.state })
    const { offerings } = this.state
    const { tabLabel } = this.props
    return (
      <OfferingsCardView view={tabLabel} offerings={offerings} isLoading={this.state.isLoading} />
    )
  }

  isWaiting = () => {
    if (this.state.isLoading === false) {
      return false;
    } else {
      return true;
    }
  };

  renderAll = () => {
    // Logger.log({ name: 'OfferingsView.render()', state: this.state })

    const { view } = this.state

    const offeringsView = (view === 'CARD') ? this.renderCardView() : this.renderListView()

    return (
      <View style={[{ flex: 1 }]}>
        { offeringsView }
      </View>
    )
  }


  render () {
      // const children = this.state.navigationState.children
      // want swipping? see https://github.com/jshanson7/react-native-swipeablezz'
      // console.log(this.props.error)
      if(this.props.error) {
        //change the text to show the error, this error happens when the backend send us an error
        // console.log(this.props.error.displayMessage)
        return (
          <View style={styles.Container}>
            <Text style={styles.TextStyle}> {this.props.error.displayMessage}</Text>
          </View>
        )
      }
      // console.log('waiting: ', this.isWaiting())
    return (
        <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
      );
    }
  }
OfferingsView.propTypes = {
  filters: PropTypes.array,

  offerings: PropTypes.array,

  fetchOfferings: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    offerings: state.offering.offerings,
    error: state.offering.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOfferings: (data) => dispatch(OfferingActions.fetchOfferings(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferingsView)
