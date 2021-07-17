import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Text, View, Dimensions, ListView } from 'react-native'
import { connect } from 'react-redux'
import NewFullButton from '../Components/NewFullButton'
import WaitingView from '../Components/WaitingView'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { filterOfferings, sortOfferings } from '../Lib/Utilities'
import OfferingListItem from '../Components/OfferingListItem'

import StartupActions from '../Redux/StartupRedux'
import OfferingActions from '../Redux/OfferingRedux'
import firebase from '../Config/FirebaseConfig'

import {
  ApplicationStyles
} from '../Themes'
import Logger from '../Lib/Logger'


class NewOfferingsView extends Component {

  constructor (props) {
    super(props)
    Logger.log({
          NewOfferingsView: "NavigationRouter.constructor",
          props:props
        });
	    const { offerings = [] } = props
	    const rowHasChanged = (r1, r2) => r1.id !== r2.id || r1.save !== r2.save || r1.read !== r2.read
	    const ds = new ListView.DataSource({rowHasChanged})
	    this.state = {
	      dataSource: ds.cloneWithRows(offerings),
	      waiting: true
	    }
	}

  componentWillReceiveProps = (newProps) => {
   	const localOfferings = newProps.offerings
  	// const now = new Date()
	  // var newOfferings = localOfferings.filter((thatOffering) => {
	  //     const time = Date.parse(thatOffering.created_at)
	  //     const timeDiff = now.getTime() - time
	  //     const diffInHours = parseInt(timeDiff/(1000*60*60))
	  //     if(diffInHours <= 24){
	  //       return (thatOffering)
	  //     }
	  // })
		// const visableOfferings = sortOfferings(filterOfferings(newProps.offerings, this.state.searchTerm, this.state.filters))
    this.setState({
      visableOfferings: localOfferings,
      dataSource: this.state.dataSource.cloneWithRows(newOfferings),
      waiting: false
		})
  }

  componentWillMount = () => {
    // this.props.loadOfferings()
    const data = { forceRefresh: true }
    this.props.fetchOfferings(data);
  }

  componentDidMount = () => {
  	this.props.resetDeeplink()
    firebase.analytics().setCurrentScreen('offerings_new')
  }

	handlePressSeeOfferings = () => {
		NavigationActions.pop()
		NavigationActions.offerings()
	}

  renderRow = (offering) => {
    return (
      <OfferingListItem offering={offering} placeOrderEnabled={true} toggleSaved={() => this.props.toggleSaved(offering.id)} />
    )
  }

  renderFooter = () => {
  	return(
      <NewFullButton
      text='See all offerings'
      buttonStyle={{ height: 40, margin: 20, width: Dimensions.get('window').width -40 }}
      onPress={this.handlePressSeeOfferings}
      disabled={false} />
  	)
  }

  	render () {
	    return (
		    <WaitingView isWaiting={this.state.waiting}>
	          <ListView
	            contentContainerStyle={ApplicationStyles.listContent}
	            dataSource={this.state.dataSource}
	            renderRow={this.renderRow}
	            renderFooter={this.renderFooter}
	            enableEmptySections
	            pageSize={15}
	            />
		    </WaitingView>
	    )
  	}
}


const mapStateToProps = (state) => {
  return {
  	offerings: state.offering.offerings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetDeeplink: (data) => dispatch(StartupActions.resetDeeplink(data)),
    // loadOfferings: () => dispatch(OfferingActions.loadOfferings()),
    fetchOfferings: (data) => dispatch(OfferingActions.fetchOfferings(data)),
    toggleSaved: (data) => dispatch(OfferingActions.toggleSaved(data))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOfferingsView)


