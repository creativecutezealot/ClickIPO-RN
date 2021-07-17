//this component will make an api call to one offering and construct the array the offeringDetailsScreen expects to recieve 
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';
import OfferingActions from '../Redux/OfferingRedux';
import NewFullButton from '../Components/NewFullButton'
import { Offering } from '../Models';
import WaitingView from '../Components/WaitingView';

class OfferingDetailsNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }

    // console.log('props: ', props);

  }

  componentWillMount() {
    //in here check to see if there is an offerings list then make the call
    //the offerings object should be in redux store
    //if we do not have the offerings list then call the single offering api
    if(this.props.offerings) {
      this.props.fetchOffering({id: this.props.offering_ext_id});
    }

  }

  componentWillReceiveProps(newProps) {
    const { offering } = newProps;

    if(offering) {
      // console.log('offering[0]', offering[0])
      //we have received the offering object, now construct the array to send to offeringDetailsScreen
      //pass props.offering, offering.id, offering.name, offering.offeringTypeName, offering.tickerSymbol
      NavigationActions.offeringDetails({offering: offering[0], title: offering[0].name, offeringTypeName: offering[0].offeringTypeName, tickerSymbol: offering[0].tickerSymbol, id: offering[0].id});
    }
  }

  isWaiting() {
    if ( this.props.fetchingOffering === false) {
      return false;
    } else {
      return true;
    }
  }

  handlePressSeeOfferings = () => {
    NavigationActions.pop()
    NavigationActions.offerings()
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

  render() {
    //render the waiting view if we are fetching the api, else we are rendering go to offerings button
    return (
      <View>
        {this.renderFooter()}
      </View>
    )
  }

}

const mapStateToProps = state => {
  return {
    offering: state.offering.offering,
    offerings: state.offering.offerings,
    fetchingOffering: state.offering.fetching, 
    offeringError: state.offering.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchOffering: data => dispatch(OfferingActions.fetchOffering(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferingDetailsNotification);